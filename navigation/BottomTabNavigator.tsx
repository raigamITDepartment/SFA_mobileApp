import React from "react";
import { StyleSheet } from "react-native";
import BottomTabNavigationBar from "../components/ui/BottomTabNavigator";
import CreateInvoice from "@/screens/InvoiceScreen/CreateInvoice";
import HomeScreen from "../screens/HomeScreen";
import HomeReport from "@/screens/ReportScreen/HomeReport";
import HomeOutlet from "@/screens/OutletScreen/HomeOutlet";
import HomeSurvey from "@/screens/SurveyScreen/HomeSurvey";
import UDImages from "../UDImages";
import UDColors from "../constants/UDColors";

function AppBottomTabNavigator() {
  const screens = [
    {
      name: "HomeSurvey",
      component: HomeSurvey,
      icon: UDImages.survey,
      hideTabBar: true,
      tabLabel: "Survey",
    },
    {
      name: "CreateInvoice",
      component: CreateInvoice,
      icon: UDImages.bill,
      hideTabBar: true,
      tabLabel: "Invoice",
    },
    {
      name: "HomeScreen",
      component: HomeScreen,
      icon: UDImages.dashboard,
      isHomeScreen: true,
      tabLabel: "",
    },
    {
      name: "Report",
      component: HomeReport,
      icon: UDImages.report,
      hideTabBar: true,
      tabLabel: "Report",
    },
    {
      name: "OutletAddScreen",
      component: HomeOutlet,
      icon: UDImages.outlet,
      hideTabBar: true,
      tabLabel: "Outlet",
    },
  ];

  return (
    <BottomTabNavigationBar
      tabBarStyle={styles.tabBarStyle}
      screens={screens}
      initialRouteName="HomeScreen"
      outerCircleOtherStyle={styles.outerCircleOtherStyle}
      otherButtonImageStyle={styles.otherButtonImageStyle}
      homeButtonStyle={styles.homeButtonStyle}
      homeButtonIconStyle={styles.homeButtonIconStyle}
    />
  );
}

export default AppBottomTabNavigator;

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: UDColors.bottomNavBar || "#ffffff", // Fallback color if undefined
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 80,
  },
  outerCircleOtherStyle: {
    backgroundColor: "transparent",
    justifyContent: "center",
    paddingHorizontal: 11,
  },
  otherButtonImageStyle: {
    alignSelf: "center",
    width: 25,
    height: 25,
  },
  homeButtonStyle: {
    backgroundColor: UDColors.bottomNavBar || "#ffffff", // Fallback color if undefined
  },
  homeButtonIconStyle: {
    height: 26,
    width: 26, // Ensure consistent width and height
  },
});
