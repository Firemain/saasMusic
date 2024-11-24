import { useEffect, useRef, useState } from "react";
import Composition from "./composition";
import { Player as RemotionPlayer, PlayerRef } from "@remotion/player";
import useStore from "@/store/store";
import { PlayCircle, PauseCircle } from "lucide-react";
import { Button } from "../ui/button";

const Player = () => {
  const playerRef = useRef<PlayerRef>(null);
  const { setPlayerRef, duration, fps } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setPlayerRef(playerRef);
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current?.pause();
    } else {
      playerRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-2">
      <RemotionPlayer
        ref={playerRef}
        component={Composition}
        durationInFrames={Math.round((duration / 1000) * fps) || 5 * 30}
        compositionWidth={1920}
        compositionHeight={1080}
        style={{ width: 0, height: 0, position: 'absolute', visibility: 'hidden' }}
        inputProps={{}}
        fps={fps}
      />
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={togglePlay}
        className="hover:bg-white/10"
      >
        {isPlaying ? (
          <PauseCircle className="h-6 w-6" />
        ) : (
          <PlayCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}

export default Player;