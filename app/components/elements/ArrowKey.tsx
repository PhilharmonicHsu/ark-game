
type Arrow = 'up' | 'down' | 'left' | 'right';
type PositionCallback = [number, number, number] | null

type Props = {
    arrow: Arrow,
    setVirtualAnimalPosition: React.Dispatch<React.SetStateAction<PositionCallback>>;
}

type DirectionMap = Record<
    Arrow, 
    { 
        icon: React.ReactNode; 
        move: (prev: PositionCallback) => PositionCallback 
    }
>

const upIcon: React.ReactNode = <svg width="40" height="40" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.32953 14.0835H17.6705L10 3.9165L2.32953 14.0835Z" fill="white"/>
</svg>

const downIcon: React.ReactNode = <svg width="40" height="40" className="rotate-180" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.32953 14.0835H17.6705L10 3.9165L2.32953 14.0835Z" fill="white"/>
</svg>

const leftIcon: React.ReactNode = <svg width="40" height="40" className="-rotate-90" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.32953 14.0835H17.6705L10 3.9165L2.32953 14.0835Z" fill="white"/>
</svg>

const rightIcon: React.ReactNode = <svg width="40" height="40" className="rotate-90" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.32953 14.0835H17.6705L10 3.9165L2.32953 14.0835Z" fill="white"/>
</svg>


export default function ArrayKey({arrow, setVirtualAnimalPosition}: Props) {
    const classes = "w-12 h-12 flex justify-center items-center text-2xl bg-gray-800 text-white rounded-lg p-2 active:bg-gray-600";
    const directionMap: DirectionMap = {
        up: { icon: upIcon, move: (prev) => prev ? [prev[0], prev[1], prev[2] - 0.2] : prev },
        down: { icon: downIcon, move: (prev) => prev ? [prev[0], prev[1], prev[2] + 0.2] : prev },
        left: { icon: leftIcon, move: (prev) => prev ? [prev[0] - 0.2, prev[1], prev[2]] : prev },
        right: { icon: rightIcon, move: (prev) => prev ? [prev[0] + 0.2, prev[1], prev[2]] : prev },
    };

    return <button 
        onClick={() => setVirtualAnimalPosition(directionMap[arrow].move)} 
        className={classes}
    >
        {directionMap[arrow].icon}
    </button>
}