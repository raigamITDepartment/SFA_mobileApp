import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';


import { StackScreenProps } from '@react-navigation/stack';
//import { RootStackParamList } from '../../navigation/AuthNavigator';

type RootStackParamList = {
 
  HomeScreen:undefined;
  HomeSurvey: undefined;
  Survey: undefined;

};



type HomeSurveyProps = StackScreenProps<RootStackParamList, 'HomeSurvey'>;

const HomeSurvey = ({ navigation }: HomeSurveyProps): React.JSX.Element => {

  const reports = [
    { title: 'Survey 1', route: 'Survey' },
    { title: 'Survey 2', route: 'Survey' },
  ] as const;

  return (
    <LinearGradient colors={['#ff6666', '#ff0000']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
         <Ionicons name="arrow-back-outline" size={28} color="white" 
               onPress={() => navigation.navigate('HomeScreen')}
              />
        <Text style={styles.title}>Raigam</Text>
        <Ionicons name="notifications-outline" size={28} color="white" />
      </View>
      <View style={styles.content}>
        {reports.map((report, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => navigation.navigate(report.route)}
          >
            <Text style={styles.buttonText}>{report.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#cc0000',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },


  
});

export default HomeSurvey;
