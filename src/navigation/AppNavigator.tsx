import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { WallpaperPreviewScreen } from '../screens/WallpaperPreviewScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ExploreStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ExploreMain"
                component={ExploreScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="WallpaperPreview"
                component={WallpaperPreviewScreen}
                options={{
                    title: 'Wallpaper Preview',
                    headerStyle: {
                        backgroundColor: theme.colors.surface,
                    },
                    headerTintColor: theme.colors.text,
                }}
            />
        </Stack.Navigator>
    );
};

const ProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ProfileMain"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{
                    title: 'Favorites',
                    headerStyle: {
                        backgroundColor: theme.colors.surface,
                    },
                    headerTintColor: theme.colors.text,
                }}
            />
        </Stack.Navigator>
    );
};

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Explore') {
                            iconName = focused ? 'compass' : 'compass-outline';
                        } else if (route.name === 'Profile') {
                            iconName = focused ? 'person' : 'person-outline';
                        }

                        return <Ionicons name={iconName as any} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.textSecondary,
                    tabBarStyle: {
                        backgroundColor: theme.colors.surface,
                        borderTopWidth: 1,
                        borderTopColor: '#E0E0E0',
                    },
                    headerStyle: {
                        backgroundColor: theme.colors.surface,
                    },
                    headerTintColor: theme.colors.text,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Explore" component={ExploreStack} />
                <Tab.Screen name="Profile" component={ProfileStack} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};
