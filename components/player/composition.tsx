import useStore from "@/store/store";
import { Audio, Sequence } from "remotion";

const calculateFrames = (
  display: { from: number; to: number },
  fps: number
) => {
  const from = (display.from / 1000) * fps;
  const durationInFrames = (display.to / 1000) * fps - from;
  return { from, durationInFrames };
};

const Composition = () => {
  const { trackItemIds, trackItemsMap, fps } = useStore();
  
  return (
    <>
      {trackItemIds.map((id) => {
        const item = trackItemsMap[id];
        const { from, durationInFrames } = calculateFrames(item.display, fps);
        const trim = item.trim!;

        return (
          <Sequence
            premountFor={30 * 5}
            key={item.id}
            from={from}
            durationInFrames={durationInFrames}
          >
            <Audio
              startFrom={(trim.from / 1000) * fps}
              endAt={(trim.to / 1000) * fps}
              src={item.details.src}
              volume={item.details.volume! / 100}
            />
          </Sequence>
        );
      })}
    </>
  );
};

export default Composition;