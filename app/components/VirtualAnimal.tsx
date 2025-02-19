import {useMemo} from 'react'
import { Group, Object3DEventMap } from 'three'

type Props = {
    position: [number, number, number];
    scene: Group<Object3DEventMap>;
}

export default function VirtualAnimal({ position, scene }: Props) {
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    // useEffect(() => {
    //     clonedScene.traverse((node: THREE.Object3D) => {
    //         if ((node as THREE.Mesh).isMesh) {
    //             const mesh = node as THREE.Mesh;
    //             if (mesh.material) {
    //                 if (Array.isArray(mesh.material)) {
    //                     mesh.material.forEach((mat) => {
    //                         mat.transparent = true;
    //                         mat.opacity = 0.5; 
    //                     });
    //                 } else {
    //                     mesh.material.transparent = true;
    //                     mesh.material.opacity = 0.5;
    //                 }
    //             }
    //         }
    //     });
    // }, [clonedScene]);

    return (
        <group position={position} scale={0.2}>
            <primitive object={clonedScene} />
        </group>
    );
}
