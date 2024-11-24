import { ADD_AUDIO, dispatch } from "@designcombo/events";
import { Button } from "@/components/ui/button";
import { generateId } from "@designcombo/timeline";
import { Player } from "@/components/player";
import Timeline from "@/components/timeline";
import useStore from "@/store/store";
import useTimelineEvents from "@/hooks/use-timeline-events";
import { useRef, useState } from "react";
import { Download, Loader2, Plus } from "lucide-react";

const AudioEditorPro = () => {
  const { playerRef } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  useTimelineEvents();

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file');
      return;
    }

    const newFile = new File([file], `${Date.now()}-${file.name}`, {
      type: file.type
    });
    
    const objectUrl = URL.createObjectURL(newFile);
    
    dispatch(ADD_AUDIO, {
      payload: {
        id: generateId(),
        display: {
          from: 0,
          to: 5000
        },
        trim: {
          from: 0,
          to: 5000
        },
        details: {
          src: objectUrl,
          name: file.name,
          volume: 50
        }
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddAudioClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadMix = async () => {
    try {
      setIsGenerating(true);
      const { trackItemIds, trackItemsMap } = useStore.getState();
      
      const audioContext = new AudioContext();
      const trackInfos = trackItemIds.map(id => {
        const item = trackItemsMap[id];
        return {
          id,
          src: item.details.src,
          volume: item.details.volume! / 100,
          startTime: item.display.from / 1000,
          duration: (item.display.to - item.display.from) / 1000
        };
      });

      const totalDuration = Math.max(...trackInfos.map(info => info.startTime + info.duration));
      const offlineContext = new OfflineAudioContext(2, Math.ceil(totalDuration * 44100), 44100);

      await Promise.all(trackInfos.map(async (info) => {
        const response = await fetch(info.src);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        const source = offlineContext.createBufferSource();
        const gainNode = offlineContext.createGain();
        
        source.buffer = audioBuffer;
        source.connect(gainNode);
        gainNode.connect(offlineContext.destination);
        
        gainNode.gain.value = info.volume;
        source.start(info.startTime);
      }));

      const renderedBuffer = await offlineContext.startRendering();
      const wav = audioBufferToWav(renderedBuffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audio-mix.wav';
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating mix:', error);
      alert('An error occurred while generating the mix');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col mt-8 h-screen max-w-full overflow-hidden">
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="audio/*"
        onChange={(e) => handleFileUpload(e.target.files)}
      />
      <h1 className="text-xl font-bold mb-4">Post Prod Mix</h1>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex gap-2">
          <Button size={"sm"} onClick={handleAddAudioClick} variant={"secondary"}>
            <Plus className="mr-2 size-4" />
            Add Audio Track
          </Button>
          <Button 
            size={"sm"} 
            onClick={handleDownloadMix} 
            variant={"secondary"}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Generating Mix...
              </>
            ) : (
              <>
                <Download className="mr-2 size-4" />
                Download Mix
              </>
            )}
          </Button>
        </div>
        <Player />
      </div>

      <div className="flex-1 relative overflow-hidden">
        {playerRef && <Timeline />}
      </div>
    </div>
  );
};

// Helper functions for audio processing
function audioBufferToWav(buffer: AudioBuffer) {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2;
  const buffer32 = new Float32Array(buffer.length * numOfChan);
  const view = new DataView(new ArrayBuffer(44 + length));
  let offset = 0;
  let pos = 0;

  writeString(view, offset, 'RIFF'); offset += 4;
  view.setUint32(offset, 36 + length, true); offset += 4;
  writeString(view, offset, 'WAVE'); offset += 4;
  writeString(view, offset, 'fmt '); offset += 4;
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2;
  view.setUint16(offset, numOfChan, true); offset += 2;
  view.setUint32(offset, buffer.sampleRate, true); offset += 4;
  view.setUint32(offset, buffer.sampleRate * 2 * numOfChan, true); offset += 4;
  view.setUint16(offset, numOfChan * 2, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2;
  writeString(view, offset, 'data'); offset += 4;
  view.setUint32(offset, length, true); offset += 4;

  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numOfChan; channel++) {
      buffer32[pos] = buffer.getChannelData(channel)[i];
      pos++;
    }
  }

  floatTo16BitPCM(view, offset, buffer32);

  return view.buffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(view: DataView, offset: number, input: Float32Array) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

export default AudioEditorPro;