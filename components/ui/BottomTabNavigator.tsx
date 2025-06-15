import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    ViewStyle,
    Platform,
    Text,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

interface Screen {
    name: string;
    component: React.ComponentType<any>;
    icon: any;
    isHomeScreen?: boolean;
    tabLabel?: string;
    hideTabBar?: boolean;
}

interface BottomTabNavigatorProps {
    tabBarStyle?: ViewStyle;
    screens: Screen[];
    homeButtonStyle?: ViewStyle;
    initialRouteName?: string;
    outerCircleOtherStyle?: ViewStyle;
    homeButtonIconStyle?: ViewStyle;
    otherButtonImageStyle?: ViewStyle;
}

function BottomTabNavigator({
    tabBarStyle,
    screens,
    homeButtonStyle,
    initialRouteName,
    outerCircleOtherStyle,
    homeButtonIconStyle,
    otherButtonImageStyle,
}: BottomTabNavigatorProps) {
    const screenHeight = Dimensions.get('window').height;
    const tabHeight = screenHeight * 0.09;

    function renderTabIcon(screen: Screen, tabLabel?: string) {
        if (screen.isHomeScreen) {
            return (
                <View style={[styles.iconContainer]}>
                    <View style={[styles.outerCircle, styles.shadow]}>
                        <View style={[styles.innerCircle, homeButtonStyle]}>
                            <Image
                                source={screen.icon}
                                style={[styles.homeButtonIcon, ]}
                            />
                        </View>
                    </View>
                    {tabLabel && <Text style={styles.tabLabel}>{tabLabel}</Text>}
                </View>
            );
        } else {
            return (
                <View style={[styles.iconContainer]}>
                    <View style={[styles.outerCircleOther, outerCircleOtherStyle]}>
                        <Image
                            source={screen.icon}
                            resizeMode="contain"
                            style={[styles.otherButtonImage, ]}
                        />
                    </View>
                    {tabLabel && <Text style={styles.tabLabel}>{tabLabel}</Text>}
                </View>
            );
        }
    }

    return (
        <Tab.Navigator
            initialRouteName={initialRouteName ? initialRouteName : screens[0].name}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false, // Custom labels below icons
                tabBarStyle: {
                    height: tabHeight,
                    ...tabBarStyle,
                },
            }}
        >
            {screens.map((screen) => (
                <Tab.Screen
                    key={screen.name}
                    name={screen.name}
                    component={screen.component}
                    options={{
                        tabBarIcon: () => renderTabIcon(screen, screen.tabLabel),
                        ...(screen.hideTabBar && { tabBarStyle: { display: 'none' } }),
                    }}
                />
            ))}
        </Tab.Navigator>
    );
}

export default BottomTabNavigator;
const styles = StyleSheet.create({
    innerCircle: {
        width: 62,
        height: 62,
        borderRadius: 100,
        backgroundColor: '#ff0000',
        justifyContent: 'center',
        alignItems: 'center',
       
    },
    outerCircle: {
        backgroundColor: '#FAFEFF',
        width: 70,
        height: 70,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 55,
        elevation: 4,
    },
    homeButtonIcon: {
        width: 26,
        height: 22
    },
    shadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.4,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    outerCircleOther: {
        width: 54,
        height: 54,
        borderRadius: 30,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        marginTop: 29,
        backgroundColor: '#ff0000',
        padding: 16
    },
        iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:10
    },
        tabLabel: {
        marginTop: 5,
        width: 40,
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
    },

       otherButtonImage: {
        width: 30,
        height: 30,
        
    },
});