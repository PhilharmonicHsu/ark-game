import {useMemo} from 'react'
import { Group, Object3DEventMap } from 'three'

type Props = {
    position: [number, number, number];
    scene: Group<Object3DEventMap>;
}

export default function VirtualAnimal({ position, scene }: Props) {
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    return (
        <group position={position} scale={0.2}>
            <primitive object={clonedScene} />
        </group>
    );
}
