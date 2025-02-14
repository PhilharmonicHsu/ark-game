
type Arrow = 'up' | 'down' | 'left' | 'right';
type PositionCallback = [number, number, number] | null

type Props = {
    arrow: Arrow,
    setVirtualAnimalPosition: React.Dispatch<React.SetStateAction<PositionCallback>>;
}

type DirectionMap = Record<
    Arrow, 
    { 
        icon: string; 
        move: (prev: PositionCallback) => PositionCallback 
    }
>

export default function ArrayKey({arrow, setVirtualAnimalPosition}: Props) {
    const classes = "w-12 h-12 flex justify-center items-center text-2xl bg-gray-800 text-white rounded-lg p-2 active:bg-gray-600";
    const directionMap: DirectionMap = {
        up: { icon: '▲', move: (prev) => prev ? [prev[0], prev[1], prev[2] - 0.2] : prev },
        down: { icon: '▼', move: (prev) => prev ? [prev[0], prev[1], prev[2] + 0.2] : prev },
        left: { icon: '◀', move: (prev) => prev ? [prev[0] - 0.2, prev[1], prev[2]] : prev },
        right: { icon: '▶', move: (prev) => prev ? [prev[0] + 0.2, prev[1], prev[2]] : prev },
    };

    return <button 
        onClick={() => setVirtualAnimalPosition(directionMap[arrow].move)} 
        className={classes}
    >
        {directionMap[arrow].icon}
    </button>
}