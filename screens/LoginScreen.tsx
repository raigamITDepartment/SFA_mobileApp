import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import titles from "../Titles";
import { useAppDispatch, useAppSelector } from "../store/Hooks";
import UDColors from "../constants/UDColors";
import UDImages from "../UDImages";
import Checkbox from "expo-checkbox";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { loginUser } from "../actions/UserAction";
import {
  setUserName as setAsyncUserName,
  setPassword as setAsyncPassword,
  setRememberMe as setAsyncRememberMe,
  getRememberMe as getAsyncRememberMe,
  getUserName as getAsyncUserName,
  getPassword as getAsyncPassword,
  setToken as setAsyncToken,
} from "../services/AsyncStoreService";

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [userName, setUserName] = useState(""); // 👈 Hardcoded
  const [password, setPassword] = useState(""); // 👈 Hardcoded
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState({ field: "", message: "" });
  const { user: userLoginResponse, loading: isLoggingIn } = useAppSelector((state) => state.login);
  const dispatch = useAppDispatch();
  const [loginButtonPressed, setLoginButtonPressed] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState("eye");
  const [verifiedByUserNameAndPassword, setVerifiedByUserNameAndPassword] = useState(false);

  useEffect(() => {
    fillCredentials();
  }, []);

  const handlePasswordVisibility = () => {
    setRightIcon((prev) => (prev === "eye" ? "eye-off" : "eye"));
    setPasswordVisibility((prev) => !prev);
  };

  const fillCredentials = async () => {
    const rm = await getAsyncRememberMe();
    const un = await getAsyncUserName();
    const ps = await getAsyncPassword();
    if (rm === "Y") {
    setUserName(un ?? ""); // ✅ fallback to empty string if null
    setPassword(ps ?? "");
  };
  };

  const verifyUserNameAndPassword = React.useCallback(async () => {
    setVerifiedByUserNameAndPassword(true);
    const un = await getAsyncUserName();
    const ps = await getAsyncPassword();
    dispatch(loginUser({ userName: un, password: ps }));
  }, [dispatch]);

  useEffect(() => {
    if (userLoginResponse?.data) {
      if (loginButtonPressed) {
        setAsyncUserName(userName);
        setAsyncPassword(password);
        setAsyncRememberMe(rememberMe ? "Y" : "N");
        console.log('errr user ',userLoginResponse.error)
      }

      if (userLoginResponse.data.token) {
        setAsyncToken(userLoginResponse.data.token);
        // The API sometimes returns gpsStatus as a string ("false") instead of a boolean.
        const isDayStarted = userLoginResponse.data.gpsStatus === true;

        // Check server time. The format is assumed to be "HH.mm".
        const serverTime = userLoginResponse.data.serverTime; // e.g., "17.30"
        let isAfterCutoff = false;
        if (typeof serverTime === 'string') {
            const [hours, minutes] = serverTime.split('.').map(Number);
            if (!isNaN(hours) && !isNaN(minutes)) {
                // 17.30 is 5:30 PM
                isAfterCutoff = hours > 17 || (hours === 17 && minutes >= 30);
            }
        }
   console.log('server time',isAfterCutoff, 'day started',isDayStarted)

        if (isDayStarted && !isAfterCutoff) {
          navigation.navigate("start");
        } else {
          // This covers:
          // 1. isDayStarted = false and isAfterCutoff = false
          // 2. isDayStarted = false and isAfterCutoff = true
          // 3. isDayStarted = true and isAfterCutoff = true
          navigation.navigate("Home");
        }
      }
    }


    if (userLoginResponse?.error) {
      if (loginButtonPressed) {
        let errorMessage = titles.loginError; // Default fallback message
        const apiError = userLoginResponse.error as { message?: string };

        if (apiError && typeof apiError.message === 'string') {
          // The API message might be "Validation Error: {error=Invalid username: Test}"
          // We try to extract the specific part inside {error=...}
          const specificErrorMatch = apiError.message.match(/error=([^}]+)/);
          errorMessage = specificErrorMatch ? specificErrorMatch[1] : apiError.message;
        }
        setError({ field: "fieldValidation", message: errorMessage });
      } else if (!verifiedByUserNameAndPassword) {
        verifyUserNameAndPassword();
      }
    }

    setLoginButtonPressed(false);
  }, [
    userLoginResponse,
    loginButtonPressed,
    userName,
    password,
    rememberMe,
    navigation,
    verifiedByUserNameAndPassword,
    verifyUserNameAndPassword,
  ]);

  const onLoginPress = () => {
    let loginError = { field: "", message: "" };
    if (!userName && !password) {
      loginError = {
        field: "fieldValidation",
        message: titles.userNameAndPasswordRequired,
      };
    } else if (!userName) {
      loginError = {
        field: "fieldValidation",
        message: titles.requiredUserName,
      };
    } else if (!password) {
      loginError = {
        field: "fieldValidation",
        message: titles.requiredPassword,
      };
    } else {
      setLoginButtonPressed(true);
      setError({ field: "", message: "" });
      dispatch(loginUser({ userName, password }));
      return;
    }

    setError(loginError);
  };

  return (
    <View style={styles.mainBody}>
      <LinearGradient colors={["#ff6666", "#ff0000"]} style={styles.gradient}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
          <KeyboardAvoidingView enabled>
            <View style={{ alignItems: "center" }}>
              <Image
                source={UDImages.splashLogo}
                style={{ width: "50%", height: 100, resizeMode: "contain", margin: 30 }}
              />
            </View>

            <View style={styles.SectionStyle}>
              <TextInput
                value={userName}
                style={styles.inputStyle}
                onChangeText={setUserName}
                placeholderTextColor="#0C056D"
                placeholder={titles.userName}
                maxLength={30}
              />
            </View>

            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#0C056D"
                secureTextEntry={passwordVisibility}
                placeholder={titles.password}
                maxLength={30}
              />
              <Pressable style={styles.eyeIcon} onPress={handlePasswordVisibility}>
                <MaterialCommunityIcons   name={rightIcon as any} size={22} color="#0C056D" />
              </Pressable>
            </View>

            {error.field === "fieldValidation" ? (
              <Text style={styles.errorTextStyle}>{error.message}</Text>
            ) : null}

            <View style={styles.leftAlign}>
              <Checkbox style={styles.checkbox} value={rememberMe} onValueChange={setRememberMe} />
              <Text style={styles.rememberMe}>{titles.rememberMe}</Text>
            </View>

            <TouchableOpacity style={styles.buttonStyle} activeOpacity={2} onPress={onLoginPress} disabled={isLoggingIn}>
              {isLoggingIn ? (
                <ActivityIndicator color="#080018" />
              ) : (
                <Text style={styles.buttonTextStyle}>LOGIN</Text>
              )}
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default LoginScreen;


const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: UDColors.primary,
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  



  },
  buttonStyle: {
    backgroundColor: "#7DE24E",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "white",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
  },
  registerTextStyle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    textAlign: "center",
    fontSize: 14,
  },

  section: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
  },

  leftAlign: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "50%",
    marginLeft: 35,
    marginTop: 10,
  },
  rememberMe: {
    fontFamily: "Montserrat",
    fontSize: 10,
    color: "white",
  },
  checkbox: {
    marginRight: 8,
    color: "#570ecc",
    backgroundColor: "#FFFFFF",
  },
  rightLine: {
    flex: 1,
    height: 1,
    backgroundColor: "white",
  },
  forgetPassword: {
    fontFamily: "Montserrat",
    fontSize: 10,
    color: "#DBA80E",
  },
  eyeIcon: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    marginLeft: "85%",
    marginTop: 10,
  },

  rightAlign: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "50%",
    
  },
});
