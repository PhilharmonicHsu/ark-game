import { Group, Object3DEventMap } from "three";
import { ModelConfig } from '@constants/animalConfig';

export type Animal = { 
    id: number;
    position: [number, number, number];
    config: ModelConfig,
    scene: Group<Object3DEventMap>,
}