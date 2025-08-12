import Konva from "konva";
import { Rect } from "react-konva";

interface RectComponentProps {
  rect: Konva.Rect;
  isSelected: boolean;
  onRectClick: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragStart: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
  onDragMove: (id: string, event: Konva.KonvaEventObject<MouseEvent>) => void;
}

export default function RectComponent({ rect, isSelected, onRectClick, onDragStart, onDragMove }: RectComponentProps) {
  return (
    <Rect 
      x={Number(rect.x())} 
      y={Number(rect.y())} 
      width={Number(rect.width())} 
      height={Number(rect.height())} 
      rotation={Number(rect.rotation())} 
      offsetX={Number(rect.width()) / 2}
      offsetY={Number(rect.height()) / 2}
      stroke={isSelected ? "red" : "black"} 
      strokeWidth={2} 
      draggable={true} 
      fill={"white"} 
      id={rect.id()} 
      onClick={(event) => onRectClick(rect.id(), event)} 
      onDragStart={(event) => onDragStart(rect.id(), event)}
      onDragMove={(event) => onDragMove(rect.id(), event)}
    />
  );
} 