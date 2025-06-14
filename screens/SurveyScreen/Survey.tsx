import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker from the correct package
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
//import { RootStackParamList } from '@/screens/SurveyScreen/App';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
 
  Home:undefined;
  Survey:undefined;
  HomeSurvey:undefined
  
};


type SurveyProps = NativeStackScreenProps<RootStackParamList, 'Survey'>;

const Survey = ({ navigation }: SurveyProps): React.JSX.Element => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
         <View style={styles.header}>
        <Ionicons name="arrow-back-outline" size={28} color="white" 
        
        onPress={() => navigation.navigate('Home')}
        
        />
        <Text style={styles.title}>Raigam</Text>
        <Ionicons name="notifications-outline" size={28} color="white" />
      </View>

      {/* Survey Title */}
      <View style={styles.titleCard}>
        <Text style={styles.title}>Market Survey on Competitor Other Soya Availability</Text>
        <Text style={styles.description}>
          I would appreciate if you could take a few minutes and support this survey by responding to this questionnaire.
          Kindly note that your response will be treated as strictly confidential.
        </Text>
      </View>

      {/* Section A */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Section A</Text>
        <Picker style={styles.picker}>
          <Picker.Item label="Select Area" value="" />
        </Picker>
        <Picker style={styles.picker}>
          <Picker.Item label="Select Route" value="" />
        </Picker>
        <Picker style={styles.picker}>
          <Picker.Item label="Select Outlet" value="" />
        </Picker>
      </View>

      {/* Section B (Placeholder) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Section B</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    width: 24,
    height: 24,
    backgroundColor: 'black',
    borderRadius: 12,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  titleCard: {
    backgroundColor: '#FFCCCC',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#FFC0CB',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#00BFFF',
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
    marginBottom: 16,
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 8,
  },
});

export default Survey;
