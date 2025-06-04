import { StyleSheet } from "react-native";
import BottomTabNavigationBar from "../components/ui/BottomTabNavigator";
 import CreateInvoice from "../screens/CreateInvoice";
// import QRScreen from "../screens/QRScreen";
import HomeScreen from "../screens/HomeScreen";
// import DealScreen from "../screens/DealScreen";
// import MenuScreen from "../screens/MenuScreen";
import UDImages from "../UDImages";
import UDColors from "../constants/UDColors";
import React from 'react';
function BottomTabNavigator() {
  const screens = [
    // {
    //   name: "DashboardScreen",
    //   component: DashboardScreen,
    //   icon: UDImages.dashboard,
    //   hideTabBar: true,
    // },
    {
      name: "CreateInvoice",
      component: CreateInvoice,
      icon: UDImages.qr,
      hideTabBar: true,
    },
    {
      name: "HomeScreen",
      component: HomeScreen,
      icon: UDImages.home,
      isHomeScreen: true,
    },
//     {
//       name: "DealScreen",
//       component: DealScreen,
//       icon: UDImages.deal,
//       hideTabBar: true,
//     },
//     {
//       name: "MenuScreen",
//       component: MenuScreen,
//       icon: UDImages.menu,
//       hideTabBar: false,
//     },
 ];

  return (
    <BottomTabNavigationBar
      tabBarStyle={styles.tabBarStyle}
      screens={screens}
      initialRouteName={"HomeScreen"}
      outerCircleOtherStyle={styles.outerCircleOtherStyle}
      otherButtonImageStyle={styles.otherButtonImageStyle}
      homeButtonStyle={styles.homeButtonStyle}
      homeButtonIconStyle={styles.homeButtonIconStyle}
    />
  );
}

export default BottomTabNavigator;

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: UDColors.bottomNavBar,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 80,
  },
  outerCircleOtherStyle: {
    backgroundColor: "transparent",
    justifyContent: "center",
    paddingHorizontal: 11,
    // borderWidth:0
  },
  otherButtonImageStyle: {
    alignSelf: "center",
    width:25,
    height:25,
  },
  homeButtonStyle:{
    backgroundColor:UDColors.bottomNavBar,

  },
  homeButtonIconStyle:{
        height:26
  }
});
