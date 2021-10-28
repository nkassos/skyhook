import { Skyhook } from '../Skyhook';

export interface LoadingDock {
    load(skyhook?: Skyhook): Skyhook;
}