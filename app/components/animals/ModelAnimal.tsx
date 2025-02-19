import {useEffect, useRef, useMemo} from 'react'
import { useBox } from "@react-three/cannon";
import * as THREE from "three";
import { Animal } from '@/app/types/common';

type Props = {
    animal: Animal; 
    setAnimals: React.Dispatch<React.SetStateAction<Animal[]>>;
}

export default function ModelAnimal (
    {animal, setAnimals}: Props
) {
    const scene = animal.scene;
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const modelRef = useRef(null);

    const [ref, api] = useBox<THREE.Group>(() => {
        return {
            mass: animal.config.mass,
            position: animal.position,
            args: [0.3, 0.9, 0.5],  // animal size
            material: "animalMaterial", // friction material
            angularDamping: 0.9, // reduce scrolling
            linearDamping: 0.99, // make it harder for animals to slide
            allowSleep: false, // Prevent objects from getting stuck
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

    return <group ref={modelRef} position={[0, -0.45, 0]}>
        <primitive ref={ref}  object={clonedScene} scale={0.2} />
    </group>
}
