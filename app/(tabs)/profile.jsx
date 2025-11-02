
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { Alert, Text, View , TouchableOpacity , StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from "../../config/firebaseConfig"
import  getAuth  from 'firebase/auth';


export default function profile(){
    
  const [userEmail , setUserEmail] = useState(null);

  useEffect(() => {

    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
    }

    fetchUserEmail();
  },[])

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("userEmail");
      setUserEmail(null);

      Alert.alert("Logged Out","You have been logged out successfully.");
      router.push("/signin");
    } 
    
    catch (error) {
      Alert.alert("Logged Error" , "Error while logging out" )
    }
  }

  const handleSignUp = () => {
    router.push("/signup")
  }

  
   return (
  <View style={styles.container}>
    <Text style={styles.header}>User Profile</Text>

    {
      userEmail ? (
        <>
          <View style={styles.userInfo}>
            <Text style={styles.userEmail}>Email: {userEmail}</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity 
            onPress={handleSignUp}
            style={styles.signUpButton}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </>
      )
    }
  </View>
);
  
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2b2b2b",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    color: "#f49b33",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  userInfo: {
    marginBottom: 24,
  },
  userEmail: {
    color: "#ffffff",
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#f49b33",
    borderRadius: 8,
    marginTop: 32,
    minWidth: 120,
  },
  signUpButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#f49b33",
    borderRadius: 8,
    marginTop: 32,
    minWidth: 120,
  },
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
    fontSize: 16,
  },
});