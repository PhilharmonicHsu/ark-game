import {AnimalConfig} from 'app/constants/animalConfig'

type Props = {
    position: [number, number, number];
    animalConfig: AnimalConfig
}

export default function VirtualAnimal({ position, animalConfig }: Props) {
    return (
        <mesh position={position}>
            <boxGeometry args={animalConfig.size} />
            <meshStandardMaterial color="gray" opacity={0.5} transparent /> {/* ✅ 半透明，代表虛擬動物 */}
        </mesh>
    );
}
