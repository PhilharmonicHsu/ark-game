"use client";

import {useState, useRef, useEffect, Suspense} from 'react';
import { Canvas } from "@react-three/fiber";
import { Physics, useContactMaterial } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";
import Ark from '@components/Ark'
import Animal from '@components/Animal'
import VirtualAnimal from "@components/VirtualAnimal"; 
import ArrayKey from '@components/elements/ArrowKey';
import GameOver from './Gameover';
import Zebra from './animals/Zebra';
import {AnimalConfig, getRandomAnimalConfig } from 'app/constants/animalConfig'

type Animal = { 
  id: number;
  position: [number, number, number];
  config: AnimalConfig
}

let animalConfig: AnimalConfig = getRandomAnimalConfig();

export default function Game() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const animalsRef = useRef(animals); // ✅ 使用 ref 來追蹤最新的 animals 陣列
    const orbitControlsRef = useRef(null);
    const [isGameOver, setIsGameOver] = useState<boolean>(false)
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

      const newAnimal: Animal = { id: animals.length, position: virtualAnimalPosition, config: animalConfig};

      setAnimals([...animals, newAnimal]);
      setShowVirtualAnimal(false);
      setVirtualAnimalPosition(null);
      animalConfig = getRandomAnimalConfig();
    }

    const onRestart = () => {
      setAnimals([]);
      setIsGameOver(false);
      setShowVirtualAnimal(false);
    }

    useEffect(() => {
      animalsRef.current = animals; // ✅ 每當 animals 變化時，更新 ref
  }, [animals]); // ✅ 這個 useEffect 只更新 ref，不會重新觸發 interval

    // ✅ 定期檢查動物是否掉出方舟
    useEffect(() => {
      const interval = setInterval(() => {
          for (const animal of animalsRef.current) {
              const [x, y, z] = animal.position;
              console.log([x, y, z])
              // ✅ 判斷是否超出方舟範圍
              if (x < -2 || x > 2 || z < -1 || z > 1 || y < -1) {
                  setIsGameOver(true);
                  clearInterval(interval);
                  break;
              }
          }
      }, 500); // 每 0.5 秒檢查一次

      return () => clearInterval(interval);
  }, [animals.length]);

    return (
        <>
            <Canvas shadows 
              camera={{ position: [0, 5, 5], fov: 50 }}
              style={{ background: "linear-gradient(to bottom, #87CEEB, #4682B4)" }} 
            >
              <ambientLight intensity={1.2} />
              <directionalLight 
                position={[5, 10, 5]} 
                intensity={1.5} 
                castShadow 
                color={"#ffddaa"} // ✅ 帶一點黃橙色，營造日落海面感
              />
              <spotLight position={[5, 5, 5]} angle={0.3} />
              <OrbitControls ref={orbitControlsRef} />
              <Physics gravity={[0, -9.81, 0]} stepSize={1 / 400} iterations={40}>
                <ContactMaterials />
                  <Ark 
                    setIsGameOver={setIsGameOver} 
                    isGameOver={isGameOver} 
                  />
                  {animals.map((animal, index) => (
                    <Suspense key={index}>
                      <Zebra
                        key={index}
                        animal={animal}
                        setAnimals={setAnimals}
                      />
                    </Suspense>
                  ))}
                  {/* ✅ 只在 `showVirtualAnimal` 為 true 時顯示虛擬動物 */}
                
              </Physics>
              {showVirtualAnimal && virtualAnimalPosition && (
                <VirtualAnimal 
                  position={virtualAnimalPosition}
                  animalConfig={animalConfig}  
                />
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
                className="font-pixel text-2xl px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold 
                hover:bg-blue-500 active:bg-blue-700 
                disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed 
                transition-all"
                onClick={spawnVirtualAnimal} 
              >
                Generate Animal
              </button>
              <button 
                className="font-pixel text-2xl px-4 py-2 rounded-lg bg-green-600 text-white font-semibold 
                hover:bg-green-500 active:bg-green-700 
                disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed 
                transition-all"
                onClick={placeAnimal}
              >
                Place Animal
              </button>
            </div>
            {/* <GameOver onRestart={onRestart} /> */}
            {isGameOver && <GameOver onRestart={onRestart} />}
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
