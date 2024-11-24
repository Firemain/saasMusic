import React, { useState, useRef, useEffect } from 'react';
import WaveSurfer from "wavesurfer.js";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";

const VideoEditorTimeline = ({
  videoURL,
  audioURL
}) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "violet",
        progressColor: "purple",
        cursorColor: "navy",
        height: 60,
        barWidth: 2,
        normalize: true,
        backend: 'MediaElement'
      });

      wavesurfer.current.load(audioURL);

      wavesurfer.current.on('ready', () => {
        console.log("WaveSurfer is ready");
      });

      wavesurfer.current.on('play', () => setIsPlaying(true));
      wavesurfer.current.on('pause', () => setIsPlaying(false));
    }
  }, [audioURL]);

  const handlePlayPause = () => {
    const action = isPlaying ? 'pause' : 'play';
    wavesurfer.current[action]();
    videoRef.current[action]();
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    wavesurfer.current.setVolume(newVolume);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <video
          ref={videoRef}
          src={videoURL}
          className="rounded shadow-lg w-full"
          controls
        />
        <div className="controls mt-4 space-x-2">
          <button
            onClick={handlePlayPause}
            className={`p-2 rounded-full ${isPlaying ? 'bg-red-500' : 'bg-green-500'} text-white shadow-lg`}
          >
            {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="range range-primary"
          />
        </div>
      </div>
      <div ref={waveformRef} className="waveform-container bg-gray-800 rounded p-2 shadow-inner"></div>
    </div>
  );
};

export default VideoEditorTimeline;
