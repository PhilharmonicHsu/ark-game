export const modelConfigs = {
    cow: {
        filePath: 'cow',
        mass: 8
    },
    deer: {
        filePath: 'deer',
        mass: 8
    },
    ele: {
        filePath: 'ele',
        mass: 8
    },
    goat: {
        filePath: 'goat',
        mass: 8
    },
    lion: {
        filePath: 'lion',
        mass: 8
    },
    wolf: {
        filePath: 'wolf',
        mass: 8
    },
}

export type ModelTypes = 'cow' | 'deer' | 'ele' | 'goat' | 'lion' | 'wolf' ; 

export type ModelConfig = {
    filePath: string;
    mass: number;
}

export const getRandomAnimalConfig = (): ModelConfig => {
    const animals: ModelTypes[] = ['cow', 'deer', 'ele', 'goat', 'lion', 'wolf']

    const animalType = animals[Math.floor(Math.random() * animals.length)];

    return modelConfigs[animalType]
}

