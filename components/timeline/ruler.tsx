import { useEffect, useRef, useState, useCallback } from "react";

import {
  PREVIEW_FRAME_WIDTH,
  SECONDARY_FONT,
  SMALL_FONT_SIZE,
  TIMELINE_OFFSET_X
} from "@/constants/constants";
import { formatTimelineUnit } from "@/utils/format";
import useStore from "@/store/store";

interface RulerProps {
  height?: number;
  longLineSize?: number;
  shortLineSize?: number;
  offsetX?: number;
  textOffsetY?: number;
  scrollPos?: number;
  textFormat?: (scale: number) => string;
  scrollLeft?: number;
  onClick?: (units: number) => void;
}

const Ruler = (props: RulerProps) => {
  const {
    height = 40, // Increased height to give space for the text
    longLineSize = 8,
    shortLineSize = 6,
    offsetX = TIMELINE_OFFSET_X,
    textOffsetY = 12, // Place the text above the lines but inside the canvas
    textFormat = formatTimelineUnit,
    scrollLeft: scrollPos = 0,
    onClick
  } = props;
  const { scale } = useStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: height // Increased height for text space
  });

  const draw = useCallback(
    (context: CanvasRenderingContext2D, scrollPos: number, width: number, height: number) => {
      const zoom = scale.zoom;
      const unit = scale.unit;
      const segments = scale.segments;
      context.clearRect(0, 0, width, height);
      context.save();
      context.strokeStyle = "#71717a";
      context.fillStyle = "#71717a";
      context.lineWidth = 1;
      context.font = `${SMALL_FONT_SIZE}px ${SECONDARY_FONT}`;
      context.textBaseline = "top";
  
      context.translate(0.5, 0);
      context.beginPath();
  
      const zoomUnit = unit * zoom * PREVIEW_FRAME_WIDTH;
      const minRange = Math.floor(scrollPos / zoomUnit);
      const maxRange = Math.ceil((scrollPos + width) / zoomUnit);
      const length = maxRange - minRange;
  
      for (let i = 0; i <= length; ++i) {
        const value = i + minRange;
        if (value < 0) continue;
        const startValue = (value * zoomUnit) / zoom;
        const startPos = (startValue - scrollPos / zoom) * zoom;
        if (startPos < -zoomUnit || startPos >= width + zoomUnit) continue;
        const text = textFormat(startValue);
        const textWidth = context.measureText(text).width;
        const textOffsetX = -textWidth / 2;
        context.fillText(text, startPos + textOffsetX + offsetX, textOffsetY);
      }
  
      for (let i = 0; i <= length; ++i) {
        const value = i + minRange;
        if (value < 0) continue;
        const startValue = value * zoomUnit;
        const startPos = startValue - scrollPos + offsetX;
        for (let j = 0; j < segments; ++j) {
          const pos = startPos + (j / segments) * zoomUnit;
          if (pos < 0 || pos >= width) continue;
          const lineSize = j % segments ? shortLineSize : longLineSize;
          context.strokeStyle = lineSize === shortLineSize ? "#a1a1aa" : "#d4d4d8";
          const origin = 32;
          const [x1, y1] = [pos, origin];
          const [x2, y2] = [x1, y1 + lineSize];
          context.beginPath();
          context.moveTo(x1, y1);
          context.lineTo(x2, y2);
          context.stroke();
        }
      }
  
      context.restore();
    },
    [scale.zoom, scale.unit, scale.segments, offsetX, textFormat, shortLineSize, longLineSize, textOffsetY]  // Dépendances de la fonction draw
  );

  const resize = useCallback(
    (canvas: HTMLCanvasElement | null, context: CanvasRenderingContext2D | null, scrollPos: number) => {
      if (!canvas || !context) return;
  
      const offsetParent = canvas.offsetParent as HTMLDivElement;
      const width = offsetParent?.offsetWidth ?? canvas.offsetWidth;
      const height = canvasSize.height;
  
      canvas.width = width;
      canvas.height = height;
  
      draw(context, scrollPos, width, height);
      setCanvasSize({ width, height });
    },
    [canvasSize.height, draw] // inclure toutes les dépendances externes utilisées dans la fonction
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      setCanvasContext(context);
      resize(canvas, context, scrollPos);
    }
  }, []);

  useEffect(() => {
    if (canvasContext) {
      resize(canvasRef.current, canvasContext, scrollPos);
    }
  }, [canvasContext, scrollPos, scale, resize]);
  

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the bounding box of the canvas to calculate the relative click position
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    // Calculate total x position, including scrollPos
    const totalX = clickX + scrollPos - TIMELINE_OFFSET_X;

    onClick?.(totalX);
    // Here you can handle the result as needed
  };

  return (
    <div
      className="border-t border-border overflow-hidden"
      style={{
        position: "relative",
        width: "100%",
        height: `${canvasSize.height}px`,
        backgroundColor: "transparent"
      }}
    >
      <canvas
        onClick={handleClick}
        ref={canvasRef}
        height={canvasSize.height}
        className="overflow-hidden"
      />
    </div>
  );
};

export default Ruler;
