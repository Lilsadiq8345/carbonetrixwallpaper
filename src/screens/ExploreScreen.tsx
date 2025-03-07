import React, { useState } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { WallpaperCard } from '../components/WallpaperCard';
import { SearchBar } from '../components/SearchBar';
import { useFavorites } from '../hooks/useFavorites';

const { width } = Dimensions.get('window');
const numColumns = 2;
const itemWidth = (width - theme.spacing.md * 3) / numColumns;

const ExploreScreen = ({ navigation }: any) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    const wallpapers = Array.from({ length: 20 }, (_, i) => ({
        id: i.toString(),
        title: `Wallpaper ${i + 1}`,
        imageUrl: `https://picsum.photos/400/600?random=${i}`,
        category: ['Nature', 'Abstract', 'Minimal', 'Patterns'][Math.floor(Math.random() * 4)],
    }));

    const filteredWallpapers = wallpapers.filter(wallpaper =>
        wallpaper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallpaper.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleWallpaperPress = (wallpaper: typeof wallpapers[0]) => {
        navigation.navigate('WallpaperPreview', {
            wallpaper: {
                ...wallpaper,
                isFavorite: isFavorite(wallpaper.id),
            },
        });
    };

    const renderItem = ({ item }: { item: typeof wallpapers[0] }) => (
        <WallpaperCard
            title={item.title}
            imageUrl={item.imageUrl}
            category={item.category}
            isFavorite={isFavorite(item.id)}
            onPress={() => handleWallpaperPress(item)}
            onFavoritePress={() => toggleFavorite(item.id)}
            style={{ width: itemWidth, margin: theme.spacing.sm }}
        />
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={{ padding: theme.spacing.md }}>
                <Text style={[theme.typography.h1, { color: theme.colors.text }]}>
                    Explore
                </Text>
                <Text style={[theme.typography.body, { color: theme.colors.textSecondary }]}>
                    Discover sustainable wallpapers
                </Text>
            </View>

            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onClear={() => setSearchQuery('')}
            />

            <FlatList
                data={filteredWallpapers}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={numColumns}
                contentContainerStyle={{ padding: theme.spacing.sm }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default ExploreScreen;