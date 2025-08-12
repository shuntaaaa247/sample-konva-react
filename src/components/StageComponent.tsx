'use client'

import Konva from "konva";
import { Stage, Layer, Rect, Line } from "react-konva";
import { useEffect, useState, useCallback } from "react";

export default function StageComponent() {
  const [rectCounter, setRectCounter] = useState(0);
  const [rects, setRects] = useState<Konva.Rect[]>([]);
  const [lines, setLines] = useState<Konva.Line[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // キーを押した時の処理
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    console.log(e.key);
    if (e.key === "Backspace") {
      setRects(prevRects => prevRects.filter((rect) => !selectedIds.includes(rect.id())));
      setSelectedIds([]);
    }
  }, [selectedIds]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // クリーンアップ関数でイベントリスナーを削除
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // 初期データの設定は別のuseEffectに分離
  useEffect(() => {
    const rect = new Konva.Rect({
      x: 100 + 35, // 中心座標に調整（x + width/2）
      y: 100 + 15, // 中心座標に調整（y + height/2）
      width: 70,
      height: 30,
      fill: "red",
      id: `rect${rectCounter}`,
      rotation: 0, // 回転角度を初期化
    });
    setRects([rect]);

    const line = new Konva.Line({
      points: [100, 100, 200, 100],
      stroke: "black",
      strokeWidth: 2,
      id: "line1",
    });
    setLines([line]);
  }, []);

  const addRect = () => {
    const rect = new Konva.Rect({
      x: 100 + 35, // 中心座標に調整（x + width/2）
      y: 100 + rectCounter + 15, // 中心座標に調整（y + height/2）
      width: 70,
      height: 30,  
      id: `rect${rectCounter + 1}`,
      rotation: 0, // 回転角度を初期化
    });
    setRects([...rects, rect]);
    setRectCounter(rectCounter + 1);
  }

  const addLine = () => {
    const line = new Konva.Line({
      points: [100, 100, 200, 200],
      stroke: "black",
      strokeWidth: 2,
      id: `line${lines.length + 1}`,
    });
    setLines([...lines, line]);
  }

  const handleRectClick = (id: string, event: Konva.KonvaEventObject<MouseEvent>) => {
    // ただクリックした場合は選択状態の要素をクリックされた要素のみにする
    setSelectedIds([id]);

    // シフトキーを押している場合は、選択状態の要素にシフトクリックされた要素を追加する
    if (event.evt.shiftKey) {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } 
  }

  const handleStageClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    // Stageの背景をクリックした場合（targetがStageの場合）、選択状態をクリア
    if (event.target === event.target.getStage()) {
      setSelectedIds([]);
    }
  }

  const rotateSelectedRect = () => {
    if (selectedIds.length === 1) {
      const selectedRect = rects.find((rect) => rect.id() === selectedIds[0]);
      if (selectedRect) {
        selectedRect.rotation(selectedRect.rotation() + 45);
        setRects([...rects]);
      }
    }
  }

  const handleDragStart = (id: string, event: Konva.KonvaEventObject<MouseEvent>) => {
    if (selectedIds.length === 0 || selectedIds.length === 1) {
      setSelectedIds([id]);
    }
  }

  const handleRectDragMove = (id: string, event: Konva.KonvaEventObject<MouseEvent>) => {
    const draggedRect = event.target;
    const draggedRectData = rects.find((rect) => rect.id() === id);
    
    if (!draggedRectData) return;

    // ドラッグした矩形の移動量を計算
    const deltaX = draggedRect.x() - draggedRectData.x();
    const deltaY = draggedRect.y() - draggedRectData.y();

    // 選択されている矩形（ドラッグした矩形を含まない）をすべて同じ量だけ移動
    const rectsToMove = selectedIds.includes(id) ? 
      rects.filter((rect) => selectedIds.includes(rect.id()) && rect.id() !== id) :
      [];

    // ドラッグした矩形のデータを更新
    draggedRectData.x(draggedRect.x());
    draggedRectData.y(draggedRect.y());

    // 他の選択された矩形も同じ量だけ移動
    rectsToMove.forEach((rect) => {
      rect.x(rect.x() + deltaX);
      rect.y(rect.y() + deltaY);
    });

    // 状態を更新
    setRects([...rects]);
  }

  return (
    <div>
      <div className="flex flex-col bg-gray-200 p-2 w-[10%]">
        <button onClick={addRect}>Add Rect</button>
        <button onClick={addLine}>Add Line</button>
        <button onClick={rotateSelectedRect}>Rotate Selected</button>
        {rects.map((rect) => (
          <div key={rect.id()}>
            {rect.id()}
          </div>
        ))}

        <p>selectedIds: {selectedIds.length}</p>
        {selectedIds.map((id) => (
          <div key={id}>{id}</div>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        <Stage width={window.innerWidth} height={window.innerHeight} onClick={handleStageClick}>
          <Layer>
            {rects.map((rect, index) => (
              // <RectComponent key={index} />
              <Rect 
                key={rect.id()} 
                x={Number(rect.x())} 
                y={Number(rect.y())} 
                width={Number(rect.width())} 
                height={Number(rect.height())} 
                rotation={Number(rect.rotation())} 
                offsetX={Number(rect.width()) / 2}
                offsetY={Number(rect.height()) / 2}
                stroke={selectedIds.includes(rect.id()) ? "red" : "black"} 
                strokeWidth={2} 
                draggable={true} fill={"white"} 
                id={rect.id()} 
                onClick={(event) => handleRectClick(rect.id(), event)} 
                onDragStart={(event) => handleDragStart(rect.id(), event)}
                onDragMove={(event) => handleRectDragMove(rect.id(), event)}
              />
            ))}
            {lines.map((line, index) => (
              <Line key={index} points={line.points()} stroke="black" strokeWidth={2} draggable={true} zIndex={1} className="cursor-pointer" /> 
            ))}
          </Layer>
        </Stage>
        
        {/* 選択されたRectが1つの場合に回転ボタンを表示 */}
        {selectedIds.length === 1 && (() => {
          const selectedRect = rects.find((rect) => rect.id() === selectedIds[0]);
          if (selectedRect) {
            return (
              <button
                onClick={rotateSelectedRect}
                style={{
                  position: 'absolute',
                  left: selectedRect.x() + selectedRect.width() / 2 + 10, // 中心基準での右端に調整
                  top: selectedRect.y() - selectedRect.height() / 2 - 10, // 中心基準での上端に調整
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  zIndex: 1000,
                }}
              >
                ↻ 45°
              </button>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
}