'use client'

import Konva from "konva";
import { Stage, Layer, Line } from "react-konva";
import { useEffect, useState, useCallback } from "react"; 
import ResistanceComponent from "./ResistanceComponent";
import DCPowerSupplyComponent from "./DCPowerSupplyComponent";
import CapacitorComponent from "./CapacitorComponent";
import InductorComponent from "./InductorComponent";
import LineComponent from "./LineComponent";

export default function StageComponent() {
  const [resistanceCounter, setResistanceCounter] = useState(0);
  const [dcPowerSupplyCounter, setDcPowerSupplyCounter] = useState(0);
  const [capacitorCounter, setCapacitorCounter] = useState(0);
  const [inductorCounter, setInductorCounter] = useState(0);
  const [resistances, setResistances] = useState<Konva.Rect[]>([]);
  const [dcPowerSupplies, setDcPowerSupplies] = useState<Konva.Group[]>([]);
  const [capacitors, setCapacitors] = useState<Konva.Group[]>([]);
  const [inductors, setInductors] = useState<Konva.Group[]>([]);
  const [lines, setLines] = useState<Konva.Line[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [pointerPosition, setPointerPosition] = useState<{x: number, y: number}>({x: 0, y: 0});

  // キーを押した時の処理
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    console.log(e.key);
    if (e.key === "Backspace") {
      // 選択された要素を各配列から削除
      setResistances(prevResistances => prevResistances.filter((resistance) => !selectedIds.includes(resistance.id())));
      setDcPowerSupplies(prevDcPowerSupplies => prevDcPowerSupplies.filter((dcPowerSupply) => !selectedIds.includes(dcPowerSupply.id())));
      setCapacitors(prevCapacitors => prevCapacitors.filter((capacitor) => !selectedIds.includes(capacitor.id())));
      setInductors(prevInductors => prevInductors.filter((inductor) => !selectedIds.includes(inductor.id())));
      setLines(prevLines => prevLines.filter((line) => !selectedIds.includes(line.id())));
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

  const addResistance = () => {
    const resistance = new Konva.Rect({
      x: 100 + resistanceCounter * 10, // 重ならないように少しずらす
      y: 100 + resistanceCounter * 10, // 中心座標に調整（y + height/2）
      width: 70,
      height: 25,  
      id: `resistance${resistanceCounter + 1}`,
      rotation: 0, // 回転角度を初期化
    });
    setResistances([...resistances, resistance]);
    setResistanceCounter(resistanceCounter + 1);
  }

  const addLine = () => {
    const startPointX = 0 + lines.length * 100;
    const startPointY = 100 + lines.length * 100;
    const endPointX = startPointX + 100;
    const endPointY = startPointY;
    
    const line = new Konva.Line({
      points: [startPointX, startPointY, endPointX, endPointY],
      id: `line${lines.length + 1}`,
      rotation: 0,
    });
    setLines([...lines, line]);
  }

  const addDCPowerSupply = () => {
    const dcPowerSupply = new Konva.Group({
      x: 150 + dcPowerSupplyCounter * 10, // 重ならないように少しずらす
      y: 150 + dcPowerSupplyCounter * 10,
      width: 60,
      height: 60,
      rotation: 0,
      id: `dcPowerSupply${dcPowerSupplyCounter + 1}`,
    });
    setDcPowerSupplies([...dcPowerSupplies, dcPowerSupply]);
    setDcPowerSupplyCounter(dcPowerSupplyCounter + 1);
  }

  const addCapacitor = () => {
    const capacitor = new Konva.Group({
      x: 200 + capacitorCounter * 10, // 重ならないように少しずらす
      y: 200 + capacitorCounter * 10,
      width: 60,
      height: 60,
      rotation: 0,
      id: `capacitor${capacitorCounter + 1}`,
    });
    setCapacitors([...capacitors, capacitor]);
    setCapacitorCounter(capacitorCounter + 1);
  }

  const addInductor = () => {
    const inductor = new Konva.Group({
      x: 250 + inductorCounter * 10, // 重ならないように少しずらす
      y: 250 + inductorCounter * 10,
      width: 86.4, // 20%拡大: 72 * 1.2
      height: 72,  // 20%拡大: 60 * 1.2
      rotation: 0,
      id: `inductor${inductorCounter + 1}`,
    });
    setInductors([...inductors, inductor]);
    setInductorCounter(inductorCounter + 1);
  }

  const handleClick = (id: string, event: Konva.KonvaEventObject<MouseEvent>) => {

    console.log("x: " + event.target.x())
    console.log("y: " + event.target.y())
    console.log("width: " + event.target.width())
    console.log("height: " + event.target.height())
    console.log("rotation: " + event.target.rotation())
    console.log("id: " + event.target.id())
    console.log("points: " + (event.target instanceof Konva.Line ? event.target.points() : "Not Line"))

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

  const rotateSelectedElement = () => {
    if (selectedIds.length === 1) {
      const allElements = [...resistances, ...dcPowerSupplies, ...capacitors, ...inductors, ...lines];
      const selectedElement = allElements.find((element) => element.id() === selectedIds[0]);
      if (selectedElement) {
        selectedElement.rotation(selectedElement.rotation() + 45);
        // 各要素タイプの状態を更新
        setResistances([...resistances]);
        setDcPowerSupplies([...dcPowerSupplies]);
        setCapacitors([...capacitors]);
        setInductors([...inductors]);
        setLines([...lines]);
      }
    }
  }

  const handleDragStart = (id: string, event: Konva.KonvaEventObject<MouseEvent>) => {
    if (selectedIds.length === 0 || selectedIds.length === 1) {
      setSelectedIds([id]);
    }
  }

  const handleElementDragMove = (id: string, event: Konva.KonvaEventObject<MouseEvent>) => {
    const draggedElement = event.target;
    
    // 全ての要素配列を統合して、ドラッグされた要素を見つける
    const allElements = [...resistances, ...dcPowerSupplies, ...capacitors, ...inductors, ...lines];
    const draggedElementData = allElements.find((element) => element.id() === id);
    
    if (!draggedElementData) return;

    // ドラッグした要素の移動量を計算
    const deltaX = draggedElement.x() - draggedElementData.x();
    const deltaY = draggedElement.y() - draggedElementData.y();

    // 選択されている要素（ドラッグした要素を含まない）をすべて同じ量だけ移動
    const elementsToMove = selectedIds.includes(id) ? 
      allElements.filter((element) => selectedIds.includes(element.id()) && element.id() !== id) :
      [];

    // ドラッグした要素のデータを更新
    draggedElementData.x(draggedElement.x());
    draggedElementData.y(draggedElement.y());

    // 他の選択された要素も同じ量だけ移動
    elementsToMove.forEach((element) => {
      element.x(element.x() + deltaX);
      element.y(element.y() + deltaY);
    });

    // 各要素タイプの状態を更新
    setResistances([...resistances]);
    setDcPowerSupplies([...dcPowerSupplies]);
    setCapacitors([...capacitors]);
    setInductors([...inductors]);
    setLines([...lines]);
  }

  const handleLineResize = (event: Konva.KonvaEventObject<MouseEvent>, id: string, newPoints?: number[]) => {
    const line = lines.find((line) => line.id() === id);
    setPointerPosition(event.target.getStage()?.getPointerPosition() || {x: 0, y: 0})
    if (line) {
      line.points(newPoints)
      setLines([...lines]);
    }
  }

  return (
    <div>
      <div className="flex flex-col bg-gray-200 p-2 w-[10%]">
        <button onClick={addResistance}>Add Resistance</button>
        <button onClick={addLine}>Add Line</button>
        <button onClick={addDCPowerSupply}>Add DC Power Supply</button>
        <button onClick={addCapacitor}>Add Capacitor</button>
        <button onClick={addInductor}>Add Inductor</button>
        <button onClick={rotateSelectedElement}>Rotate Selected</button>
        <p>lines.x:{lines[0]?.x()}</p>
        <p>lines.y:{lines[0]?.y()}</p>
        <p>lines[0]?.points()[0]:{lines[0]?.points()[0]}</p>
        <p>lines[0]?.points()[1]:{lines[0]?.points()[1]}</p>
        <p>lines[0]?.points()[2]:{lines[0]?.points()[2]}</p>
        <p>lines[0]?.points()[3]:{lines[0]?.points()[3]}</p>
        <p>pointerPosition.x:{pointerPosition.x}</p>
        <p>pointerPosition.y:{pointerPosition.y}</p>
      </div>
      <div style={{ position: 'relative' }}>
        <Stage width={window.innerWidth} height={window.innerHeight} onClick={handleStageClick}>
          <Layer>
            {resistances.map((resistance, index) => (
              <ResistanceComponent 
                key={resistance.id()} 
                rect={resistance} 
                isSelected={selectedIds.includes(resistance.id())} 
                onResistanceClick={handleClick} 
                onDragStart={handleDragStart}
                onDragMove={handleElementDragMove}
              />
            ))}
            {lines.map((line) => (
              <LineComponent
                key={line.id()}
                line={line}
                isSelected={selectedIds.includes(line.id())}
                onLineClick={handleClick}
                onDragStart={handleDragStart}
                onDragMove={handleElementDragMove}
                onLineResize={handleLineResize}
              />
            ))}
            {dcPowerSupplies.map((dcPowerSupply) => (
              <DCPowerSupplyComponent 
                key={dcPowerSupply.id()}
                group={dcPowerSupply}
                isSelected={selectedIds.includes(dcPowerSupply.id())}
                onDragStart={handleDragStart}
                onDragMove={handleElementDragMove}
                onDCPowerSupplyClick={handleClick}
              />
            ))}
            {capacitors.map((capacitor) => (
              <CapacitorComponent
                key={capacitor.id()}
                group={capacitor}
                isSelected={selectedIds.includes(capacitor.id())}
                onDragStart={handleDragStart}
                onDragMove={handleElementDragMove}
                onCapacitorClick={handleClick}
              />
            ))}
            {inductors.map((inductor) => (
              <InductorComponent
                key={inductor.id()}
                group={inductor}
                isSelected={selectedIds.includes(inductor.id())}
                onDragStart={handleDragStart}
                onDragMove={handleElementDragMove}
                onInductorClick={handleClick}
              />
            ))}
          </Layer>
        </Stage>
        
        {/* 選択された要素が1つの場合に回転ボタンを表示 */}
        {selectedIds.length === 1 && (() => {
          const allElements = [...resistances, ...dcPowerSupplies, ...capacitors, ...inductors, ...lines];
          const selectedElement = allElements.find((element) => element.id() === selectedIds[0]);
          if (selectedElement) {
            // 要素のサイズを取得（Rect用のwidth/heightまたはGroup用のgetClientRect、Line用の特別処理）
            let elementWidth, elementHeight, elementX, elementY;
            
            if (selectedElement.width) {
              // Rect要素の場合
              elementWidth = selectedElement.width();
              elementHeight = selectedElement.height();
              elementX = selectedElement.x();
              elementY = selectedElement.y();
            } else if (selectedElement.getClientRect) {
              // Group要素の場合
              const rect = selectedElement.getClientRect();
              elementWidth = rect.width;
              elementHeight = rect.height;
              elementX = selectedElement.x();
              elementY = selectedElement.y();
            } else {
              // Line要素の場合は中心座標を使用
              const lineElement = selectedElement as Konva.Line;
              const points = lineElement.points();
              elementWidth = Math.abs(points[2] - points[0]);
              elementHeight = Math.abs(points[3] - points[1]);
              elementX = selectedElement.x(); // 既に中心座標
              elementY = selectedElement.y(); // 既に中心座標
            }
            
              return (
                <button
                  onClick={rotateSelectedElement}
                  style={{
                    position: 'absolute',
                    left: elementX + elementWidth / 2 + 10, // 中心基準での右端に調整
                    top: elementY - elementHeight / 2 - 10, // 中心基準での上端に調整
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