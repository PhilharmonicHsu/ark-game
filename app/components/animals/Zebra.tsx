import {useEffect} from 'react'
import { useBox } from "@react-three/cannon";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { AnimalConfig } from '@/app/constants/animalConfig';

type Animal = { 
    id: number;
    position: [number, number, number];
    config: AnimalConfig
}

export default function Zebra(
    {animal, setAnimals}: 
    {   
        animal: Animal; 
        setAnimals: React.Dispatch<React.SetStateAction<Animal[]>>;
    }
) {
    const texture = useLoader(TextureLoader, `/textures/${animal.config.textureFile}`)

    const [ref, api] = useBox<THREE.Mesh>(() => {
        return {
            mass: animal.config.mass,
            position: animal.position,
            args: animal.config.size, // 動物大小
            material: "animalMaterial", // ✅ 設定動物的摩擦材質
            angularDamping: 0.9, // ✅ 降低滾動
            linearDamping: 0.99, // ✅ 讓動物更不容易滑動
            allowSleep: false, // 防止物體卡住
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

        return () => unsubscribe(); // ✅ 移除訂閱，避免 memory leak
    }, [api.position, animal.id, setAnimals]);

    return (
        <mesh ref={ref} castShadow receiveShadow>
            <boxGeometry args={animal.config.size} />
            <meshStandardMaterial 
                map={texture} 
                // color="oranger"
            />
        </mesh>
    );
}
