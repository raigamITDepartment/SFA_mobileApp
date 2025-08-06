import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Updates from 'expo-updates';
import { RootStackParamList } from '../navigation/AuthNavigator';
import UDColors from '../constants/UDColors';
import UDImages from '../UDImages';
import Constants from "expo-constants";

type AuthLoadingProps = {
    navigation: StackNavigationProp<RootStackParamList, 'AuthLoading'>;
};

const AuthLoading: React.FC<AuthLoadingProps> = ({ navigation }) => {
    const [status, setStatus] = useState('Checking for updates...');
    // Use expoConfig instead of the deprecated manifest
    const appVersion = Constants.expoConfig?.version ?? "1.0.0";

    useEffect(() => {
        const onFetchUpdate = async () => {
            try {
                // Check for updates
                const update = await Updates.checkForUpdateAsync();

                if (update.isAvailable) {
                    setStatus('Downloading update...');
                    // Download the update
                    await Updates.fetchUpdateAsync();
                    // Reload the app to apply the update
                    await Updates.reloadAsync();
                } else {
                    // No update available, navigate to Login
                    navigation.replace('Login');
                }
            } catch (error) {
                // Handle errors, e.g., no network connection
                Alert.alert('Update Error', `Error fetching latest update: ${error instanceof Error ? error.message : String(error)}`);
                // Proceed to login even if update check fails
                navigation.replace('Login');
            }
        };

        // In development, updates are disabled.
        // To test updates, you need to create a development build or a production build.
        if (!__DEV__) {
            onFetchUpdate();
        } else {
            // In dev mode, just navigate to Login after a delay
            setStatus('No updates are available. Skipping update');
            const timer = setTimeout(() => {
                navigation.replace('Login');
            }, 2000);
            return () => clearTimeout(timer);
        }
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
                <Text style={styles.statusText}>{status}</Text>
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
    statusText: {
        fontSize: 16,
        color: UDColors.secondry,
        marginBottom: 10,
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