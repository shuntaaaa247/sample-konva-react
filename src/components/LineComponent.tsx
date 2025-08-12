'use client'

import Konva from "konva";
import { Line } from "react-konva";

interface LineComponentProps {
  line: Konva.Line;
  isSelected: boolean;
  onLineClick: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragStart: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragMove: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
}

export default function LineComponent({ 
  line, 
  isSelected, 
  onLineClick, 
  onDragStart,
  onDragMove 
}: LineComponentProps) {

  const handleMouseEnter = () => {
    document.body.style.cursor = 'pointer';
  };

  const handleMouseLeave = () => {
    document.body.style.cursor = 'default';
  };

  // Lineの中心座標を計算
  const points = line.points();
  const centerX = (points[0] + points[2]) / 2;
  const centerY = (points[1] + points[3]) / 2;

  return (
    <Line
      points={line.points()}
      stroke={isSelected ? "red" : "black"}
      strokeWidth={isSelected ? 3 : 2}
      hitStrokeWidth={15} // クリック領域を15pxに拡張
      draggable={true}
      onClick={(event) => onLineClick(line.id(), event)}
      onDragStart={(event) => onDragStart(line.id(), event)}
      onDragMove={(event) => onDragMove(line.id(), event)}
      x={line.x()}
      y={line.y()}
      rotation={line.rotation()}
      offsetX={centerX}
      offsetY={centerY}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
} 