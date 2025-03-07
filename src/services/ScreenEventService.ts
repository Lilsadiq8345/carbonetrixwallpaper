import { AppState, AppStateStatus } from 'react-native';

type ScreenEventCallback = () => void;

class ScreenEventService {
    private static instance: ScreenEventService;
    private onScreenOnCallbacks: ScreenEventCallback[] = [];
    private onScreenOffCallbacks: ScreenEventCallback[] = [];
    private lastAppState: AppStateStatus = AppState.currentState;

    private constructor() {
        this.setupAppStateListener();
    }

    public static getInstance(): ScreenEventService {
        if (!ScreenEventService.instance) {
            ScreenEventService.instance = new ScreenEventService();
        }
        return ScreenEventService.instance;
    }

    private setupAppStateListener() {
        AppState.addEventListener('change', (nextAppState) => {
            if (
                this.lastAppState.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // Screen turned on
                this.onScreenOnCallbacks.forEach(callback => callback());
            } else if (
                this.lastAppState === 'active' &&
                nextAppState.match(/inactive|background/)
            ) {
                // Screen turned off
                this.onScreenOffCallbacks.forEach(callback => callback());
            }
            this.lastAppState = nextAppState;
        });
    }

    public onScreenOn(callback: ScreenEventCallback): () => void {
        this.onScreenOnCallbacks.push(callback);
        return () => {
            this.onScreenOnCallbacks = this.onScreenOnCallbacks.filter(cb => cb !== callback);
        };
    }

    public onScreenOff(callback: ScreenEventCallback): () => void {
        this.onScreenOffCallbacks.push(callback);
        return () => {
            this.onScreenOffCallbacks = this.onScreenOffCallbacks.filter(cb => cb !== callback);
        };
    }
}

export default ScreenEventService; 