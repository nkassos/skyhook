import Skyhook from './Skyhook';

export default interface LoadingDock {
    load(skyhook?: Skyhook): Skyhook;
}