import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../navigation/AuthNavigator';
import UDColors from '../constants/UDColors';
import UDImages from '../UDImages';
import Constants from "expo-constants";

type AuthLoadingProps = {
    navigation: StackNavigationProp<RootStackParamList, 'AuthLoading'>;
};

const AuthLoading: React.FC<AuthLoadingProps> = ({ navigation }) => {
    const appVersion = Constants.manifest?.version || "1.0.0";

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 2000); // 2 seconds
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={UDImages.splashLogo}
                    style={{ height: 150 }}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>{`Version ${appVersion}`}</Text>
            </View>
        </View>
    );
};

export default AuthLoading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: UDColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        flex: 2,
        justifyContent: 'flex-end',
    },
    versionText: {
        fontSize: 14,
        color: UDColors.secondry,
    },
    versionContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 20,
        alignItems: 'center',
        padding: 30,
    },
});