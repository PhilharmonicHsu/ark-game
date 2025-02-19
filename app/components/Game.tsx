"use client";

import {useState, useRef, useEffect, Suspense} from 'react';
import { Canvas } from "@react-three/fiber";
import { Physics, useContactMaterial } from "@react-three/cannon";
import { OrbitControls, useGLTF } from "@react-three/drei";
import Ark from '@components/Ark'
import VirtualAnimal from "@components/VirtualAnimal"; 
import ArrayKey from '@components/elements/ArrowKey';
import GameOver from '@components/Gameover';
import ModelAnimal from '@components/animals/ModelAnimal';
import {ModelConfig, getRandomAnimalConfig } from '@constants/animalConfig'
import useOrientationWarning from "@hooks/useOrientationWarning";
import { Group, Object3DEventMap } from 'three'
import { Animal } from '@/app/types/common'

const animalConfig: ModelConfig = getRandomAnimalConfig();

const getSceneByConfig = ({
  animalConfig,
  cowScene, 
  deerScene,
  eleScene,
  goatScene,
  lionScene,
  wolfScene
}: {
  animalConfig: ModelConfig
  cowScene: Group<Object3DEventMap>
  deerScene: Group<Object3DEventMap>
  eleScene: Group<Object3DEventMap>
  goatScene: Group<Object3DEventMap>
  lionScene: Group<Object3DEventMap>
  wolfScene: Group<Object3DEventMap>
}): Group<Object3DEventMap> => {
  switch (animalConfig.filePath) {
    case 'cow': return cowScene;
    case 'deer': return deerScene;
    case 'ele': return eleScene;
    case 'goat': return goatScene;
    case 'lion': return lionScene;
    default: return wolfScene;
  }
}

export default function Game() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const animalsRef = useRef(animals);
    const orbitControlsRef = useRef(null);
    const animalConfigRef = useRef(animalConfig); 
    const [isGameOver, setIsGameOver] = useState<boolean>(false)
    const [virtualAnimalPosition, setVirtualAnimalPosition] = useState<[number, number, number] | null>(null);
    const [showVirtualAnimal, setShowVirtualAnimal] = useState(false);
    const { showWarning, setShowWarning } = useOrientationWarning();

    const { scene: virtualAnimalScene } = useGLTF(`/models/${animalConfigRef.current.filePath}.glb`);

    const { scene: cowScene } = useGLTF(`/models/cow.glb`);
    const { scene: deerScene } = useGLTF(`/models/deer.glb`);
    const { scene: eleScene } = useGLTF(`/models/ele.glb`);
    const { scene: goatScene } = useGLTF(`/models/goat.glb`);
    const { scene: lionScene } = useGLTF(`/models/lion.glb`);
    const { scene: wolfScene } = useGLTF(`/models/wolf.glb`);

    // show virtual animal
    const awakeVirtualAnimal = () => {
        const x = (Math.random() - 0.5) * 3;
        const z = (Math.random() - 0.5) * 3;
        setVirtualAnimalPosition([x, 2, z]);
        setShowVirtualAnimal(true);
    };

    const placeAnimal = () => {
      if (!virtualAnimalPosition) return;
  
      let scene: Group<Object3DEventMap> = getSceneByConfig({
        animalConfig: animalConfigRef.current,
        cowScene,
        deerScene,
        eleScene,
        goatScene,
        lionScene,
        wolfScene
      })
      
      const newAnimal: Animal = { id: animals.length, position: virtualAnimalPosition, config: animalConfigRef.current, scene};

      setAnimals([...animals, newAnimal]);
      setShowVirtualAnimal(false);
      setVirtualAnimalPosition(null);
      animalConfigRef.current = getRandomAnimalConfig();
    }

    const onRestart = () => {
      setAnimals([]);
      setIsGameOver(false);
      setShowVirtualAnimal(false);
    }

    useEffect(() => {
      animalsRef.current = animals; 
    }, [animals]);

    // check regularly to see if animals have fallen out of the ark
    useEffect(() => {
      const interval = setInterval(() => {
          for (const animal of animalsRef.current) {
              const [x, y, z] = animal.position;

              // determine whether it is beyond the scope of the Ark
              if (x < -2 || x > 2 || z < -1 || z > 1 || y < -1) {
                  setIsGameOver(true);
                  clearInterval(interval);
                  break;
              }
          }
      }, 500);

      return () => clearInterval(interval);
  }, [animals.length]);

    return (
        <>
          {showWarning && (
              <div className="font-pixel fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-xl font-bold text-red-500">Please rotate your device</h2>
                    <p className="text-gray-600">Please use landscape mode to play the game!</p>
                    <button 
                      onClick={() => setShowWarning(false)} 
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Got it
                    </button>
                </div>
              </div>
            )}
            <Canvas shadows 
              camera={{ position: [0, 5, 5], fov: 50 }}
              style={{ background: "linear-gradient(to bottom, #87CEEB, #4682B4)" }} 
            >
              <ambientLight intensity={1.2} />
              <directionalLight 
                position={[5, 10, 5]} 
                intensity={1.5} 
                castShadow 
                color={"#ffddaa"}
              />
              <spotLight position={[5, 5, 5]} angle={0.3} />
              <OrbitControls ref={orbitControlsRef} />
              <Physics gravity={[0, -9.81, 0]} stepSize={1 / 400} iterations={40}>
                <ContactMaterials />
                  <Ark />
                  {animals.map((animal, index) => (
                    <Suspense key={index}>
                      <ModelAnimal
                        key={index}
                        // scene={scene}
                        animal={animal}
                        setAnimals={setAnimals}
                      />
                    </Suspense>
                  ))}
              </Physics>
              {showVirtualAnimal && virtualAnimalPosition && (
                <VirtualAnimal 
                  position={virtualAnimalPosition}
                  scene={virtualAnimalScene}
                />
              )}
            </Canvas>
            <div className="absolute bottom-10 right-10 transform flex flex-col gap-2">
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
                onClick={awakeVirtualAnimal} 
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
            {isGameOver && <GameOver onRestart={onRestart} />}
        </>
    );
}

function ContactMaterials() {
  useContactMaterial("arkMaterial", "animalMaterial", {
    friction: 10, // Keep friction high
    restitution: 0, // Avoid animals bouncing
    contactEquationStiffness: 1e9, // Improve contact stiffness
    contactEquationRelaxation: 2, // Reduce elastic sliding
    frictionEquationStiffness: 1e8, // Enhanced friction calculations
    frictionEquationRelaxation: 5, // further reduce slippage
  });

  return null;
}
