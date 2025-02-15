import {useEffect, useRef, useMemo} from 'react'
import { useBox } from "@react-three/cannon";
import * as THREE from "three";
import { AnimalConfig } from '@/app/constants/animalConfig';
import { useGLTF } from "@react-three/drei";

type Animal = { 
    id: number;
    position: [number, number, number];
    config: AnimalConfig
}

type Props = {
    animal: Animal; 
    setAnimals: React.Dispatch<React.SetStateAction<Animal[]>>;
}

export default function ModelAnimal (
    {animal, setAnimals}: Props
) {
    const { scene } = useGLTF("/models/animal2.glb");
    const clonedScene = useMemo(() => scene.clone(), [scene]); // ✅ 確保每個 ModelAnimal 都有獨立的模型
    const modelRef = useRef(null);

    const [ref, api] = useBox<THREE.Group>(() => {
        return {
            mass: animal.config.mass,
            position: animal.position,
            args: [0.3, 0.9, 0.5],
            material: "animalMaterial", // ✅ 設定動物的摩擦材質
            angularDamping: 0.9, // ✅ 降低滾動
            linearDamping: 0.99, // ✅ 讓動物更不容易滑動
            allowSleep: false, // 防止物體卡住
            rotation: [- Math.PI /2, 0, 0],
        }
    });

    useEffect(() => {
        const unsubscribe = api.position.subscribe((pov) => {
            setAnimals((perv: Animal[]) => {
                return perv.map(oldAnimal => {
                    if (oldAnimal.id !== animal.id) return oldAnimal;
                    
                    oldAnimal.position[0] = pov[0]
                    oldAnimal.position[1] = pov[1]
                    oldAnimal.position[2] = pov[2]
                    
                    return oldAnimal
                })
            })
        });

        return () => unsubscribe();
    }, [api.position, animal.id, setAnimals]);

    return <group ref={modelRef} position={[0, -0.25, 0]}>
        <primitive ref={ref}  object={clonedScene} scale={0.003} />
    </group>
}
