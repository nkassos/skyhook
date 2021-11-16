import { Skyhook } from '../Skyhook';

export interface LoadingDock<T> {
    load(skyhook?: Skyhook<T>): Skyhook<T>;
}