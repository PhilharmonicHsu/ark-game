export type ModelTypes = 'cow' | 'deer' | 'ele' | 'goat' | 'lion' | 'wolf' ; 

export type ModelConfig = {
    filePath: string;
    mass: number;
}

export const modelConfigs = {
    cow: {
        filePath: 'cow',
        mass: 30
    },
    deer: {
        filePath: 'deer',
        mass: 15
    },
    ele: {
        filePath: 'ele',
        mass: 110
    },
    goat: {
        filePath: 'goat',
        mass: 3
    },
    lion: {
        filePath: 'lion',
        mass: 10
    },
    wolf: {
        filePath: 'wolf',
        mass: 3
    },
}

export const getRandomAnimalConfig = (): ModelConfig => {
    const animals: ModelTypes[] = ['cow', 'deer', 'ele', 'goat', 'lion', 'wolf']

    const animalType = animals[Math.floor(Math.random() * animals.length)];

    return modelConfigs[animalType]
}

