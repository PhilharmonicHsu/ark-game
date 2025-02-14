"use client";

import {useState, useRef, useEffect} from 'react';
import { Canvas } from "@react-three/fiber";
import { Physics, usePlane, useContactMaterial } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Ark from '@components/Ark'
import Animal from '@components/Animal'
import VirtualAnimal from "@components/VirtualAnimal"; 
import ArrayKey from '@components/elements/ArrowKey';

function Floor() {
  const [ref] = usePlane<THREE.Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -1, 0],
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  );
}

type Animal = { 
    id: number;
    position: [number, number, number];
}

export default function Game() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const orbitControlsRef = useRef(null);
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [virtualAnimalPosition, setVirtualAnimalPosition] = useState<[number, number, number] | null>(null);
    const [showVirtualAnimal, setShowVirtualAnimal] = useState(false);


    // 產生虛擬動物
    const spawnVirtualAnimal = () => {
        const x = (Math.random() - 0.5) * 3;
        const z = (Math.random() - 0.5) * 3;
        setVirtualAnimalPosition([x, 2, z]); // ✅ 產生在初始高度
        setShowVirtualAnimal(true); // ✅ 顯示虛擬動物
    };

    const placeAnimal = () => {
      if (!virtualAnimalPosition) return;

      const newAnimal: Animal = { id: animals.length, position: virtualAnimalPosition};

      setAnimals([...animals, newAnimal]);

      setShowVirtualAnimal(false); // ✅ 隱藏虛擬動物
      setVirtualAnimalPosition(null); // ✅ 清除位置
    }

    // ✅ 定期檢查動物是否掉出方舟
    useEffect(() => {
      const interval = setInterval(() => {
          for (const animal of animals) {
              const [x, y, z] = animal.position;

              // ✅ 判斷是否超出方舟範圍
              if (x < -2 || x > 2 || z < -1 || z > 1 || y < -1) {
                  setGameOver(true);
                  clearInterval(interval);
                  break;
              }
          }
      }, 500); // 每 0.5 秒檢查一次

      return () => clearInterval(interval);
  }, [animals]);

    return (
        <>
            <Canvas shadows camera={{ position: [0, 5, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <spotLight position={[5, 5, 5]} angle={0.3} />
              <OrbitControls ref={orbitControlsRef} />
              <Physics gravity={[0, -9.81, 0]} stepSize={1 / 400} iterations={40}>
                <ContactMaterials />
                  <Floor />
                  <Ark 
                    setGameOver={setGameOver} 
                    gameOver={gameOver} 
                  />
                  {animals.map((animal) => (
                    <Animal
                      key={animal.id}
                      animal={animal}
                    />
                  ))}
                  {/* ✅ 只在 `showVirtualAnimal` 為 true 時顯示虛擬動物 */}
                
              </Physics>
              {showVirtualAnimal && virtualAnimalPosition && (
                <VirtualAnimal position={virtualAnimalPosition}/>
              )}
            </Canvas>
            <div className="absolute bottom-10 right-10 transform -translate-x-1/2 flex flex-col gap-2">
              <div className="flex justify-center items-center">
                <ArrayKey arrow="up" setVirtualAnimalPosition={setVirtualAnimalPosition} />
              </div>
              <div className="flex flex-row">
                <ArrayKey arrow="left" setVirtualAnimalPosition={setVirtualAnimalPosition} />
                <div className="text-2xl text-white rounded-lg p-2 active:bg-gray-600 w-12"></div>
                <ArrayKey arrow="right" setVirtualAnimalPosition={setVirtualAnimalPosition} />
              </div>
              <div className="flex justify-center items-center">
              <ArrayKey arrow="down" setVirtualAnimalPosition={setVirtualAnimalPosition} />
              </div>
            </div>
            <div className="absolute bottom-10 left-10 flex flex-col gap-4" >
              <button 
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold 
                hover:bg-blue-500 active:bg-blue-700 
                disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed 
                transition-all"
                onClick={spawnVirtualAnimal} >
                產生動物
              </button>
              <button 
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold 
                hover:bg-green-500 active:bg-green-700 
                disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed 
                transition-all"
                onClick={placeAnimal}
              >
                放置動物
              </button>
            </div>
            {gameOver && (
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg">
                  ❌ 遊戲結束！有動物掉出方舟！
              </div>
            )}
        </>
    );
}

function ContactMaterials() {
  useContactMaterial("arkMaterial", "animalMaterial", {
    friction: 10, // ✅ 保持高摩擦力
    restitution: 0, // ✅ 避免動物彈跳
    contactEquationStiffness: 1e9, // ✅ 提高接觸剛度
    contactEquationRelaxation: 2, // ✅ 減少彈性滑動
    frictionEquationStiffness: 1e8, // ✅ 增強摩擦計算
    frictionEquationRelaxation: 5, // ✅ 進一步減少滑動
  });

  return null;
}
