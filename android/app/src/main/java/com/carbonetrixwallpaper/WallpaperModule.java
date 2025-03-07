package com.carbonetrixwallpaper;

import android.app.WallpaperManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.IOException;

public class WallpaperModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public WallpaperModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "WallpaperModule";
    }

    @ReactMethod
    public void setWallpaper(String imagePath, int which, Promise promise) {
        try {
            File imageFile = new File(imagePath);
            Bitmap bitmap = BitmapFactory.decodeFile(imageFile.getAbsolutePath());
            WallpaperManager wallpaperManager = WallpaperManager.getInstance(reactContext);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                // For Android 7.0 and above, we can set different wallpapers
                switch (which) {
                    case 1: // Home screen
                        wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_SYSTEM);
                        break;
                    case 2: // Lock screen
                        wallpaperManager.setBitmap(bitmap, null, true, WallpaperManager.FLAG_LOCK);
                        break;
                    default: // Both
                        wallpaperManager.setBitmap(bitmap);
                        break;
                }
            } else {
                // For older versions, we can only set one wallpaper
                wallpaperManager.setBitmap(bitmap);
            }
            promise.resolve(true);
        } catch (IOException e) {
            promise.reject("ERROR", e.getMessage());
        }
    }
} 