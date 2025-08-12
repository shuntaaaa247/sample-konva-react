'use client'

import Konva from "konva";
import { Stage, Layer, Line } from "react-konva";
import { useEffect, useState, useCallback } from "react"; 
import ResistanceComponent from "./ResistanceComponent";
import DCPowerSupplyComponent from "./DCPowerSupplyComponent";
import CapacitorComponent from "./CapacitorComponent";
import InductorComponent from "./InductorComponent";

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

  // キーを押した時の処理
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    console.log(e.key);
    if (e.key === "Backspace") {
      // 選択された要素を各配列から削除
      setResistances(prevResistances => prevResistances.filter((resistance) => !selectedIds.includes(resistance.id())));
      setDcPowerSupplies(prevDcPowerSupplies => prevDcPowerSupplies.filter((dcPowerSupply) => !selectedIds.includes(dcPowerSupply.id())));
      setCapacitors(prevCapacitors => prevCapacitors.filter((capacitor) => !selectedIds.includes(capacitor.id())));
      setInductors(prevInductors => prevInductors.filter((inductor) => !selectedIds.includes(inductor.id())));
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
    const resistance = new Konva.Rect({
      x: 100 + 35, // 中心座標に調整（x + width/2）
      y: 100 + 15, // 中心座標に調整（y + height/2）
      width: 70,
      height: 25,
      fill: "red",
      id: `resistance${resistanceCounter}`,
      rotation: 0, // 回転角度を初期化
    });
    setResistances([resistance]);

    const line = new Konva.Line({
      points: [100, 100, 200, 100],
      stroke: "black",
      strokeWidth: 2,
      id: "line1",
    });
    setLines([line]);

    const dcPowerSupply = new Konva.Group({
      x: 100,
      y: 100,
      width: 60,
      height: 60,
      rotation: 0,
      id: `dcPowerSupply${dcPowerSupplyCounter}`,
    });
    setDcPowerSupplies([...dcPowerSupplies, dcPowerSupply]);
    setDcPowerSupplyCounter(dcPowerSupplyCounter + 1);
  }, []);

  const addResistance = () => {
    const resistance = new Konva.Rect({
      x: 100 + 35, // 中心座標に調整（x + width/2）
      y: 100 + resistanceCounter + 15, // 中心座標に調整（y + height/2）
      width: 70,
      height: 25,  
      id: `resistance${resistanceCounter + 1}`,
      rotation: 0, // 回転角度を初期化
    });
    setResistances([...resistances, resistance]);
    setResistanceCounter(resistanceCounter + 1);
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
      const allElements = [...resistances, ...dcPowerSupplies, ...capacitors, ...inductors];
      const selectedElement = allElements.find((element) => element.id() === selectedIds[0]);
      if (selectedElement) {
        selectedElement.rotation(selectedElement.rotation() + 45);
        // 各要素タイプの状態を更新
        setResistances([...resistances]);
        setDcPowerSupplies([...dcPowerSupplies]);
        setCapacitors([...capacitors]);
        setInductors([...inductors]);
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
    const allElements = [...resistances, ...dcPowerSupplies, ...capacitors, ...inductors];
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
        {resistances.map((resistance) => (
          <div key={resistance.id()}>
            {resistance.id()}
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
            {lines.map((line, index) => (
              <Line key={index} points={line.points()} stroke="black" strokeWidth={2} draggable={true} zIndex={1} className="cursor-pointer" /> 
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
          const allElements = [...resistances, ...dcPowerSupplies, ...capacitors, ...inductors];
          const selectedElement = allElements.find((element) => element.id() === selectedIds[0]);
          if (selectedElement) {
            // 要素のサイズを取得（Rect用のwidth/heightまたはGroup用のgetClientRect）
            const elementWidth = selectedElement.width ? selectedElement.width() : selectedElement.getClientRect().width;
            const elementHeight = selectedElement.height ? selectedElement.height() : selectedElement.getClientRect().height;
            
            return (
              <button
                onClick={rotateSelectedElement}
                style={{
                  position: 'absolute',
                  left: selectedElement.x() + elementWidth / 2 + 10, // 中心基準での右端に調整
                  top: selectedElement.y() - elementHeight / 2 - 10, // 中心基準での上端に調整
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