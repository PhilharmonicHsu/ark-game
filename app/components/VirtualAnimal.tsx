
export default function VirtualAnimal({ position }: { position: [number, number, number];}) {
    return (
        <mesh position={position}>
            <boxGeometry args={[0.25, 0.25, 0.25]} />
            <meshStandardMaterial color="gray" opacity={0.5} transparent /> {/* ✅ 半透明，代表虛擬動物 */}
        </mesh>
    );
}
