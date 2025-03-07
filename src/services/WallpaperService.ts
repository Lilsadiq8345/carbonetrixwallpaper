import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, NativeModules } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { MOTIVATIONAL_TEXTS } from '../constants/texts';
import { generateWallpaperSVG } from '../utils/generateWallpaper';
import ScreenEventService from './ScreenEventService';

const { WallpaperModule } = NativeModules;

const STORAGE_KEYS = {
    AUTO_CHANGE: 'wallpaper_auto_change',
    CURRENT_INDEX: 'wallpaper_current_index',
};

export interface Wallpaper {
    id: string;
    imageUrl: string;
    motivationalText: string;
    category: string;
}

export class WallpaperService {
    private static instance: WallpaperService;
    private currentWallpaperIndex: number = 0;
    private wallpapers: Wallpaper[] = [];
    private isAutoChangeEnabled: boolean = false;

    private constructor() {
        this.initializeWallpapers();
        this.setupScreenEventListeners();
    }

    public static getInstance(): WallpaperService {
        if (!WallpaperService.instance) {
            WallpaperService.instance = new WallpaperService();
        }
        return WallpaperService.instance;
    }

    private setupScreenEventListeners() {
        const screenEventService = ScreenEventService.getInstance();

        screenEventService.onScreenOn(async () => {
            if (this.isAutoChangeEnabled) {
                const nextWallpaper = await this.getNextWallpaper();
                if (nextWallpaper) {
                    await this.setWallpaper(nextWallpaper);
                }
            }
        });
    }

    private async initializeWallpapers() {
        try {
            // Initialize with generated wallpapers
            this.wallpapers = MOTIVATIONAL_TEXTS.map((text, index) => ({
                id: `wallpaper_${index + 1}`,
                imageUrl: generateWallpaperSVG(index, text),
                motivationalText: text,
                category: 'nature',
            }));

            // Load saved settings
            const savedIndex = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_INDEX);
            if (savedIndex !== null) {
                this.currentWallpaperIndex = parseInt(savedIndex, 10);
            }

            const autoChange = await AsyncStorage.getItem(STORAGE_KEYS.AUTO_CHANGE);
            this.isAutoChangeEnabled = autoChange === 'true';
        } catch (error) {
            console.error('Error initializing wallpapers:', error);
        }
    }

    public async getNextWallpaper(): Promise<Wallpaper | null> {
        if (this.wallpapers.length === 0) return null;

        this.currentWallpaperIndex = (this.currentWallpaperIndex + 1) % this.wallpapers.length;
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_INDEX, this.currentWallpaperIndex.toString());
        return this.wallpapers[this.currentWallpaperIndex];
    }

    public async getCurrentWallpaper(): Promise<Wallpaper | null> {
        if (this.wallpapers.length === 0) return null;
        return this.wallpapers[this.currentWallpaperIndex];
    }

    public async setWallpaper(wallpaper: Wallpaper): Promise<boolean> {
        try {
            if (Platform.OS === 'android' && WallpaperModule) {
                // Set both home screen and lock screen wallpapers
                await WallpaperModule.setWallpaper(wallpaper.imageUrl, 0);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting wallpaper:', error);
            return false;
        }
    }

    public async downloadWallpapers(): Promise<void> {
        // Implementation for downloading wallpapers
        // This would typically fetch from a server
    }

    public async setAutoChangeEnabled(enabled: boolean): Promise<void> {
        this.isAutoChangeEnabled = enabled;
        await AsyncStorage.setItem(STORAGE_KEYS.AUTO_CHANGE, enabled.toString());
    }

    public isAutoChangeActive(): boolean {
        return this.isAutoChangeEnabled;
    }

    static async setAutoChange(enabled: boolean) {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.AUTO_CHANGE, JSON.stringify(enabled));
        } catch (error) {
            console.error('Error saving auto-change setting:', error);
        }
    }

    static async getAutoChange(): Promise<boolean> {
        try {
            const value = await AsyncStorage.getItem(STORAGE_KEYS.AUTO_CHANGE);
            return value !== null ? JSON.parse(value) : true;
        } catch (error) {
            console.error('Error loading auto-change setting:', error);
            return true;
        }
    }

    static async setCurrentIndex(index: number) {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_INDEX, index.toString());
        } catch (error) {
            console.error('Error saving current wallpaper index:', error);
        }
    }

    static async getCurrentIndex(): Promise<number> {
        try {
            const value = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_INDEX);
            return value !== null ? parseInt(value, 10) : 0;
        } catch (error) {
            console.error('Error loading current wallpaper index:', error);
            return 0;
        }
    }
}

export default WallpaperService; 