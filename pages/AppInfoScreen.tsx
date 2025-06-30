import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import Card from '../components/Card';
import { APP_NAME } from '../constants';
import { AppContext } from '../App';
import { View as ViewType } from '../types';
import Button from '../components/Button';
// Import icons (you'll need to use equivalent icons from a React Native library)

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';


const AppInfoScreen: React.FC = () => {
  const context = useContext(AppContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://picsum.photos/seed/brightfoxinfologo/100/100' }}
            style={styles.logo}
          />
          <Text style={styles.appName}>{APP_NAME}</Text>
          <Text style={styles.version}>Version 1.0.0 (Alpha)</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.welcomeText}>
            Welcome to <Text style={styles.welcomeHighlight}>{APP_NAME}</Text> – where learning is a joyful adventure!
          </Text>
          <Text style={styles.paragraph}>
            Our mission is to provide a safe, engaging, and ad-free environment for children to explore their creativity, learn new skills, and develop a love for knowledge.
          </Text>

          <Text style={styles.sectionTitle}>Our Core Values:</Text>
          
          <View style={styles.list}>
            <View style={styles.listItem}>
              <Icon name="shield-check" size={24} color="#10b981" style={styles.icon} />
              <Text style={styles.listText}>
                <Text style={styles.listTextBold}>Safe & Ad-Free:</Text> No ads, no manipulative tactics. Just pure fun and learning.
              </Text>
            </View>
            
            <View style={styles.listItem}>
              <MaterialIcons name="stars" size={24} color="#f59e0b" style={styles.icon} />
              <Text style={styles.listText}>
                <Text style={styles.listTextBold}>Creativity First:</Text> We encourage kids to create, not just consume.
              </Text>
            </View>
            
            <View style={styles.listItem}>
              <FontAwesome name="heart" size={24} color="#ec4899" style={styles.icon} />
              <Text style={styles.listText}>
                <Text style={styles.listTextBold}>Parental Partnership:</Text> Full transparency and control for parents.
              </Text>
            </View>
            
            <View style={styles.listItem}>
              <Feather name="box" size={24} color="#8b5cf6" style={styles.icon} />
              <Text style={styles.listText}>
                <Text style={styles.listTextBold}>AI-Enhanced Learning:</Text> Personalized experiences powered by helpful AI (like Gemini!).
              </Text>
            </View>
          </View>
          
          <Text style={[styles.paragraph, { paddingTop: 8 }]}>
            This app is a demonstration and uses placeholder content and mock data in some areas. The Gemini API integration provides dynamic story generation and Q&A capabilities.
          </Text>

          {context && (
            <Button
              onPress={() => context.setViewWithPath(ViewType.ParentDashboard, '/parentdashboard')}
              style={styles.button}
              textStyle={styles.buttonText}
            >
              Go to Parent Dashboard
            </Button>
          )}
        </View>
        
        <Text style={styles.footer}>
          © {new Date().getFullYear()} {APP_NAME} Team. All imaginary rights reserved.
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc', // slate-50
    padding: 16,
    paddingVertical: 24,
  },
  card: {
    maxWidth: 448, // max-w-md
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    borderWidth: 4,
    borderColor: '#7dd3fc', // skyBlue (assuming this is your color)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7dd3fc', // skyBlue
    // fontFamily: 'YourDisplayFont',
  },
  version: {
    color: '#6b7280', // gray-500
  },
  content: {
    paddingHorizontal: 8,
  },
  welcomeText: {
    fontSize: 18,
    color: '#374151', // gray-700
    marginBottom: 16,
  },
  welcomeHighlight: {
    fontWeight: '600',
    color: '#7dd3fc', // skyBlue
  },
  paragraph: {
    color: '#374151', // gray-700
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#7dd3fc', // skyBlue
    // fontFamily: 'YourDisplayFont',
    paddingTop: 8,
    marginBottom: 12,
  },
  list: {
    gap: 12,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 8,
    marginTop: 2,
  },
  listText: {
    flex: 1,
    color: '#374151', // gray-700
  },
  listTextBold: {
    fontWeight: '600',
  },
  button: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0', // ghost variant
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#334155', // ghost variant text color
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af', // gray-400
    marginTop: 32,
  },
});

export default AppInfoScreen;