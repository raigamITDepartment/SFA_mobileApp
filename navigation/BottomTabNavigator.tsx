import React from "react";
import { StyleSheet } from "react-native";
import BottomTabNavigationBar from "../components/ui/BottomTabNavigator";
import InvoiceStack from "../screens/InvoiceScreen/HomeInvoice";
import SurveyStack from "../screens/SurveyScreen/HomeSurvey";
import OutletStack from "../screens/OutletScreen/HomeOutlet";
import ReportStack from "../screens/ReportScreen/HomeReport";
import HomeStack from "../screens/HomeScreen";
import UDImages from "../UDImages";
import UDColors from "../constants/UDColors";

function AppBottomTabNavigator() {
  const screens = [
    {
      name: "HomeSurvey",
      component: SurveyStack,
      icon: UDImages.survey,
      hideTabBar: true,
      tabLabel: "Survey",
    },
    {
      name: "HomeInvoice",
      component: InvoiceStack,
      icon: UDImages.bill,
      hideTabBar: true,
      tabLabel: "Invoice",
    },
    {
      name: "HomeScreen",
      component: HomeStack,
      icon: UDImages.dashboard,
      isHomeScreen: true,
      tabLabel: "",
    },
    {
      name: "Report",
      component: ReportStack,
      icon: UDImages.report,
      hideTabBar: true,
      tabLabel: "Report",
    },
    {
      name: "OutletAddScreen",
      component: OutletStack,
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
    backgroundColor: UDColors.bottomNavBar || "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 90,
    marginBottom: 10,
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
    backgroundColor: UDColors.bottomNavBar || "#ffffff",
  },
  homeButtonIconStyle: {
    height: 26,
    width: 26,
  },
});
