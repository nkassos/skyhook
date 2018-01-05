import Skyhook from './SkyHook';

export default interface LoadingDock {
    load(skyhook?: Skyhook): Skyhook;
}