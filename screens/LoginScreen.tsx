import React, { useState, createRef, useEffect } from "react";
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
} from "react-native";
import titles from "../Titles";
import { useAppDispatch, useAppSelector } from "../store/Hooks";
import UDColors from "../constants/UDColors";
import UDImages from "../UDImages";
import Checkbox from "expo-checkbox";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { loginUser } from "../actions/UserAction"; // Correct import
import {
  setUserName as setAsyncUserName,
  setPassword as setAsyncPassword,
  setRememberMe as setAsyncRememberMe,
  getRememberMe as getAsyncRememberMe,
  getUserName as getAsyncUserName,
  getPassword as getAsyncPassword,
  setToken as setAsyncToken,
  getToken as getAsyncToken,
} from "../services/AsyncStoreService";
type Props = object;

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const LoginScreen = ({ navigation }: LoginScreenProps, props: Props) => {
  const [userName, setUserName] = useState<any>("");
  const [password, setPassword] = useState<any>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState({ field: "", message: "" });
  const userLoginResponse = useAppSelector((state) => state.login.user);
  const [loginButtonPressed, setLoginButtonPressed] = useState(false);
  //const passwordInputRef = createRef<TextInput>();
  const dispatch = useAppDispatch();
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState<any>("eye");
  const [verifiedByUserNameAndPassword, setVerifiedByUserNameAndPassword] =
    useState(false);

  useEffect(() => {
    console.log("LoginScreen useEffect called");
    // Check if token exists
    fillCredentials();
  }, []);

  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const fillCredentials = async () => {
    const rm = await getAsyncRememberMe();
    const un = await getAsyncUserName();
    const ps = await getAsyncPassword();
    if (rm === "Y") {
      setUserName(un);
      setPassword(ps);
    }
  };

  // const verifyToken = async () => {
  //   const tkn = await getAsyncToken();
  //  // dispatch(loginByToken({ token: tkn, userTypeId: 2 }));
  // };

  const verifyUserNameAndPassword = React.useCallback(async () => {
    setVerifiedByUserNameAndPassword(true);
    const un = await getAsyncUserName();
    const ps = await getAsyncPassword();
    // const bioEnabled = (await getBioEnabled()) === "Y" ? true : false;
    // if (bioEnabled && un && ps) {

    // }

    dispatch(loginUser({ userName: un, password: ps }));
  }, [dispatch]);

  useEffect(() => {
       if (userLoginResponse && userLoginResponse) {

      console.log("User Login Response by screnn: ");
      console.log(userLoginResponse);

      if (userLoginResponse.data && userLoginResponse.data.token) {
        if (loginButtonPressed) {
          setAsyncUserName(userName);
          setAsyncPassword(password);
          setAsyncRememberMe(rememberMe ? "Y" : "N");
        }
        setAsyncToken(userLoginResponse.data.token);
        if (userLoginResponse.data.gpsStatus === "false") {
          navigation.navigate("DayStart");
        } else {
          if (userLoginResponse.data.gpsStatus === "true") {
            navigation.navigate("Home");
          } else {
            navigation.navigate("Home");
          }
        }
      } else {
        navigation.navigate("Login");
      }
    }
    if (
      userLoginResponse &&
      userLoginResponse.error &&
      userLoginResponse.error.length > 0
    ) {
      if (loginButtonPressed) {
        let loginError = {
          field: "fieldValidation",
          message: titles.loginError,
        };
        setError(loginError);
      } else {
        if (!verifiedByUserNameAndPassword) {
          verifyUserNameAndPassword();
        }
      }
    }
    setLoginButtonPressed(false);
  }, [
    userLoginResponse,
    loginButtonPressed,
    navigation,
    password,
    rememberMe,
    userName,
    verifiedByUserNameAndPassword,
    verifyUserNameAndPassword,
  ]);

  const onLoginPress = () => {
    console.log("LOGIN button clicked ✅ 1");
    let loginError = { field: "", message: "" };
    if (userName === "" && password === "") {
      console.log("LOGIN button clicked ✅2", loginError);
      loginError.field = "fieldValidation";
      loginError.message = titles.userNameAndPasswordRequired;
      setError(loginError);
    } else if (userName === "") {
      loginError.field = "fieldValidation";
      loginError.message = titles.requiredUserName;
      setError(loginError);
    } else if (password === "") {
      loginError.field = "fieldValidation";
      loginError.message = titles.requiredPassword;
      setError(loginError);
    } else {
      setLoginButtonPressed(true);
      setError({ field: "", message: "" });
      dispatch(loginUser({ userName: userName, password: password }));
          console.log("name: ", userName);
      console.log("password: ", password);
    }
  };

  return (
    <View style={styles.mainBody}>
      {/* <Loader loading={loading} /> */}

      <LinearGradient colors={["#ff6666", "#ff0000"]} style={styles.gradient}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <View>
            <KeyboardAvoidingView enabled>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={UDImages.splashLogo}
                  style={{
                    width: "50%",
                    height: 100,
                    resizeMode: "contain",
                    margin: 30,
                  }}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  value={userName}
                  style={styles.inputStyle}
                  onChangeText={(newText) => setUserName(newText)}
                  placeholderTextColor="#0C056D"
                  //  style={styles.inputText}
                  placeholder={titles.userName}
                  maxLength={30}
                />
              </View>
              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  value={password}
                  onChangeText={(newText) => setPassword(newText)}
                  placeholderTextColor="#0C056D"
                  secureTextEntry={passwordVisibility}
                  placeholder={titles.password}
                  maxLength={30}
                />

                {/* <View style={styles.rightAlign}> */}
                  <Pressable
                    style={styles.eyeIcon}
                    onPress={handlePasswordVisibility}
                  >
                    <MaterialCommunityIcons
                      name={rightIcon}
                      size={22}
                      color="#0C056D"
                    />
                  </Pressable>
                {/* </View> */}
              </View>

              {error.field === "fieldValidation" ? (
                <Text style={styles.errorTextStyle}>{error.message}</Text>
              ) : null}

              <View style={styles.leftAlign}>
                <Checkbox
                  style={styles.checkbox}
                  value={rememberMe}
                  onValueChange={setRememberMe}
                />
                <Text style={styles.rememberMe}>{titles.rememberMe}</Text>
              </View>
              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={() => {
                  console.log("LOGIN button clicked ✅");
                  onLoginPress();
                }}
              >
                <Text style={styles.buttonTextStyle}>LOGIN</Text>
              </TouchableOpacity>
              <Text
                style={styles.registerTextStyle}
                onPress={() => navigation.navigate("start")}
              >
                New Here ? Register
              </Text>
            </KeyboardAvoidingView>
          </View>
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
  },

  rightAlign: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "50%",
  },
});
