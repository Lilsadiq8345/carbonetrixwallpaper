import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
    ActivityIndicator,
    Switch,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SvgFromUri } from 'react-native-svg';
import WallpaperService, { Wallpaper } from '../services/WallpaperService';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { MOTIVATIONAL_TEXTS } from '@/constants/motivationalTexts';

const { width, height } = Dimensions.get('window');

const WALLPAPERS = [
    require('@/assets/wallpapers/sustainability1.jpg'),
    require('@/assets/wallpapers/green-building1.jpg'),
    require('@/assets/wallpapers/renewable-energy1.jpg'),
    require('@/assets/wallpapers/nature-conservation1.jpg'),
    require('@/assets/wallpapers/smart-city1.jpg'),
    // Add more wallpapers here
];

export default function WallpaperScreen() {
    const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isAutoChangeEnabled, setIsAutoChangeEnabled] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        if (isAutoChangeEnabled) {
            const interval = setInterval(() => {
                changeWallpaper();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isAutoChangeEnabled, currentWallpaperIndex]);

    const loadSettings = async () => {
        const autoChange = await WallpaperService.getAutoChange();
        const currentIndex = await WallpaperService.getCurrentIndex();
        setIsAutoChangeEnabled(autoChange);
        setCurrentWallpaperIndex(currentIndex);
        setCurrentTextIndex(currentIndex % MOTIVATIONAL_TEXTS.length);
    };

    const triggerHaptic = async () => {
        if (Platform.OS !== 'web') {
            try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch (error) {
                console.log('Haptics not available');
            }
        }
    };

    const changeWallpaper = async () => {
        const nextWallpaperIndex = (currentWallpaperIndex + 1) % WALLPAPERS.length;
        const nextTextIndex = (currentTextIndex + 1) % MOTIVATIONAL_TEXTS.length;

        setCurrentWallpaperIndex(nextWallpaperIndex);
        setCurrentTextIndex(nextTextIndex);
        await WallpaperService.setCurrentIndex(nextWallpaperIndex);

        triggerHaptic();
    };

    const toggleAutoChange = async () => {
        const newValue = !isAutoChangeEnabled;
        setIsAutoChangeEnabled(newValue);
        await WallpaperService.setAutoChange(newValue);

        if (Platform.OS !== 'web') {
            try {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
                console.log('Haptics not available');
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Image
                source={WALLPAPERS[currentWallpaperIndex]}
                style={styles.wallpaper}
            />
            <BlurView intensity={50} style={styles.overlay}>
                <Image
                    source={require('@/assets/carbonetrix-logo.png')}
                    style={styles.logo}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.motivationalText}>
                        {MOTIVATIONAL_TEXTS[currentTextIndex]}
                    </Text>
                </View>
                <View style={styles.controls}>
                    <Text style={styles.controlText}>Auto-change on wake</Text>
                    <Switch
                        value={isAutoChangeEnabled}
                        onValueChange={toggleAutoChange}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isAutoChangeEnabled ? '#f5dd4b' : '#f4f3f4'}
                    />
                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    wallpaper: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    logo: {
        width: 200,
        height: 50,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: 600,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 20,
        padding: 20,
        marginVertical: 20,
    },
    motivationalText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        letterSpacing: 0.5,
        lineHeight: 36,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 15,
        borderRadius: 20,
        width: '100%',
        maxWidth: 300,
        justifyContent: 'space-between',
    },
    controlText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 