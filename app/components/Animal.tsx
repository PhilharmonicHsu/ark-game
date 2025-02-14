import {useEffect} from 'react'
import { useBox } from "@react-three/cannon";
import * as THREE from "three";

type Animal = { 
    id: number;
    position: [number, number, number];
}

export default function Animal({animal}: {animal: Animal}) {
    const [ref, api] = useBox<THREE.Mesh>(() => {
        return {
            mass: 2,
            position: animal.position,
            args: [0.25, 0.25, 0.25], // 動物大小
            material: "animalMaterial", // ✅ 設定動物的摩擦材質
            angularDamping: 0.9, // ✅ 降低滾動
            linearDamping: 0.99, // ✅ 讓動物更不容易滑動
            allowSleep: false, // 防止物體卡住
            applyImpulse: [[0, -0.2, 0], [0, 0, 0]],
        }
    });

    useEffect(() => {
        const unsubscribe = api.position.subscribe((pos) => {});

        return () => unsubscribe(); // ✅ 移除訂閱，避免 memory leak
    }, []);

    return (
        <mesh ref={ref} castShadow receiveShadow>
            <boxGeometry args={[0.25, 0.25, 0.25]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}
