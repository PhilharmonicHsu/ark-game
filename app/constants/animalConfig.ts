export const AnimalConfigs: Record<AnimalTypes, AnimalConfig> = {
    elephant: {
        textureFile: 'elephant.jpg',
        size: [0.75, 0.75, 0.75],
        mass: 100
    },
    giraffe: {
        textureFile: 'giraffe.jpg',
        size: [0.5, 0.5, 0.5],
        mass: 30
    },
    horse: {
        textureFile: 'horse.jpg',
        size: [0.25, 0.25, 0.25],
        mass: 20
    },
    tiger: {
        textureFile: 'tiger.jpg',
        size: [0.25, 0.25, 0.25],
        mass: 8
    },
    zebra: {
        textureFile: 'zebra.jpg',
        size: [0.25, 0.25, 0.25],
        mass: 10
    },
}

export type AnimalConfig = {
    textureFile: string,
    size: [x: number, y: number, z: number],
    mass: number
}

export type AnimalTypes = 'elephant' | 'giraffe' | 'horse' | 'tiger' | 'zebra';

export const getRandomAnimalConfig = (): AnimalConfig => {
    const animals: AnimalTypes[] = ['elephant', 'giraffe', 'horse', 'tiger', 'zebra']

    const animalType = animals[Math.floor(Math.random() * animals.length)];

    return AnimalConfigs[animalType]
}

