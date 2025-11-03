

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { Alert,StyleSheet, FlatList, Text, View , ActivityIndicator , TouchableOpacity } from 'react-native'
import { db } from '../../config/firebaseConfig';
import { collection , Firestore, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';


const History = () => {

  const [userEmail , setUserEmail] = useState(null);
  const [booking , setBooking] = useState([]);
  const [loading , setLoading] = useState(true);
  //const db = getFirestore();


 

  useEffect(()=>{
   const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
    }
    fetchUserEmail();
  },[])

  const fetchBookings = async () => {
      if(userEmail){
        try {
          const bookingCollection = collection(db,"bookings");
          const bookingQuery = query(bookingCollection,where("email","==", userEmail));
          const bookingSnapShot = await getDocs(bookingQuery);
          const bookingList = bookingSnapShot.docs.map((doc)=>({
            id:doc.id,
            ...doc.data(),
          }))

          setBooking(bookingList);
        } 
        
        catch (error) {
          Alert.alert("Error", "could not fetch bookings.")
        }
        finally {
          setLoading(false);
        }

      }
      else {
        setLoading(false);
      }
    }
    
  useEffect(() => {
    
    fetchBookings(); 
  },[userEmail])

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#2b2b2b]">
        <ActivityIndicator size="large" color="#fb9b33" />
      </SafeAreaView>
    );
  }



    return (
  <SafeAreaView style={styles.safeArea}> 
    <Text style={styles.header}>History</Text>
    {
      userEmail ? (
        <FlatList
          data={booking}
          onRefresh={fetchBookings}
          refreshing={loading}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View style={styles.bookingItem}>
              <Text style={styles.bookingText}>Date: {item.date}</Text>
              <Text style={styles.bookingText}>Slot: {item.slot}</Text>
              <Text style={styles.bookingText}>Number of Guests: {item.guests}</Text>
              <Text style={styles.bookingText}>Restaurant: {item.restaurant}</Text>
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <View style={styles.guestContainer}>
          <Text style={styles.guestMessage}>
            You are a Guest User! Please Sign up if you are a new user, if you are already using this app then you can Sign In to see your History.
          </Text>
          
          <TouchableOpacity 
            onPress={() => router.push("/signin")}
            style={styles.signInButton}
          >
            <Text style={styles.signInButtonText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      )
    }
  </SafeAreaView>
);
}

export default History

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#2b2b2b",
  },
  header: {
    color: "#f49b33",
    fontWeight: "600",
    textAlign: "center",
    padding: 16,
    fontSize: 24,
  },
  bookingItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#fb9b33",
  },
  bookingText: {
    color: "#ffffff",
    fontWeight: "600",
    marginBottom: 4,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  guestContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  guestMessage: {
    color: "#ffffff",
    padding: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
  signInButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f49b33",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 16,
  },
  signInButtonText: {
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
    fontSize: 16,
  },
});