declare module 'react-native' {
    interface NativeModulesStatic {
        WallpaperModule: {
            setWallpaper(imagePath: string, which: number): Promise<boolean>;
        };
    }
}

export { }; 