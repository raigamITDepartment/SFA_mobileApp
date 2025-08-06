// import { useEffect } from 'react';
// import { BackHandler } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import type { AppBottomTabNavigatorParamList  } from '../navigation/BottomTabNavigator'; // Adjust the import path as necessary


// import type { NavigationProp } from '@react-navigation/native';

// const useBackToHome = () => {
//   const navigation = useNavigation<NavigationProp<AppBottomTabNavigatorParamList>>();

//   useEffect(() => {
//     const backAction = () => {
//       navigation.navigate('HomeScreen');
//       return true;
//     };

//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction
//     );

//     return () => backHandler.remove();
//   }, [navigation]);
// };

// export default useBackToHome;
