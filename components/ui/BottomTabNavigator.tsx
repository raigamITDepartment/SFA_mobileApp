import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    ViewStyle,
    Platform
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


function BottomTabNavigator({ tabBarStyle, screens, homeButtonStyle, initialRouteName, outerCircleOtherStyle, homeButtonIconStyle, otherButtonImageStyle }: BottomTabNavigatorProps) {

    const screenHeight = Dimensions.get('window').height;
    const tabHeight = screenHeight * 0.09;

    function renderTabIcon(screen: Screen) {
        if (screen.isHomeScreen) {
            return (
                <View style={[styles.outerCircle, styles.shadow]}>
                    <View style={[styles.innerCircle, homeButtonStyle]}>
                        <Image source={screen.icon} style={[styles.homeButtonIcon]} />
                    </View>
                </View>
            )
        } else {
            return (
                <View style={[styles.outerCircleOther, outerCircleOtherStyle]}>
                    <Image
                        source={screen.icon}
                        resizeMode='contain'
                        style={[{ width: 30, height: 30}]}
                    />
                </View>
            )
        }
    }

    return (
        <Tab.Navigator
            initialRouteName={initialRouteName? initialRouteName: screens[0].name}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    height: tabHeight,
                    ...tabBarStyle,
                }
            }}
        >
            {screens.map((screen) => (
                screen.hideTabBar ?
                <Tab.Screen
                    key={screen.name}
                    name={screen.name}
                    component={screen.component}
                    options={{
                        tabBarLabel: screen.tabLabel ? screen.tabLabel : '',
                        tabBarIcon: ({ color, size }) => (
                            renderTabIcon(screen)
                        ),
                        tabBarStyle:{display: 'none'}
                    }}
                />:
                <Tab.Screen
                    key={screen.name}
                    name={screen.name}
                    component={screen.component}
                    options={{
                        tabBarLabel: screen.tabLabel ? screen.tabLabel : '',
                        tabBarIcon: ({ color, size }) => (
                            renderTabIcon(screen)
                        )
                    }}
                />
            ))}

        </Tab.Navigator>
    )
}

export default BottomTabNavigator;


const styles = StyleSheet.create({
    innerCircle: {
        width: 62,
        height: 62,
        borderRadius: 100,
        backgroundColor: '#052108',
        justifyContent: 'center',
        alignItems: 'center'
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
        marginTop: 10,
        backgroundColor: '#160946',
        padding: 16
    }
});