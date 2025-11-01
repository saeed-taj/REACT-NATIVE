import { BlurView } from 'expo-blur';
import { ActivityIndicator, StyleSheet, FlatList, Image,SafeImage, ImageBackground, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from "../../assets/images/dinetimelogo.png";
import banner from "../../assets/images/homeBanner.png";
import { useEffect , useState } from 'react';
import { db } from "../../config/firebaseConfig";
import { query, collection , getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

 
export default function Home(){

  // useEffect(()=>{
  //   uploadData();
  // },[]);

  // uploadData();

    const router = useRouter();
    const [restaurants , setRestaurants] = useState([]);


    const temp = async () => {

    const value = await AsyncStorage.getItem("userEmail");
    console.log(value);
  }

  useEffect(() => {

      const getrestaurants = async () => {
    const q = query(collection(db , "restaurants"));
    const response = await getDocs(q);

    const data = response.docs.map(doc => ({id : doc.id , ...doc.data() }))
    setRestaurants(data)
  };

  getrestaurants();
  temp();
  },[]);
  
  const renderItem = ({item}) => {
    return(
    <TouchableOpacity onPress={ () => (router.push(`/restaurant/${item.name}`))} 
    style={{
    backgroundColor: "#5f5f5f",
    borderRadius: 8,
    marginRight: 40,
    width: 384
    }}>
      
      {<Image 
  resizeMode='cover'
  source={{uri:item.image}}
  style={{
    height: 240,        // h-60 (60 * 4 = 240)
    width: '100%',      // w-full
    marginBottom: 8,    // mb-2 (2 * 4 = 8)
    borderRadius: 8     // rounded-lg
  }}
/>}
      <Text style={{ color: '#ffffff', textAlign: 'center', marginTop: 8, fontWeight: 'bold' }}>{item.name}</Text>
      <Text style={{ color: '#ffffff', textAlign: 'center', marginTop: 8, fontWeight: 'bold' }}>{item.address}</Text>
      <Text style={{ color: '#ffffff', textAlign: 'center', marginTop: 8, marginBottom: 40, fontWeight: 'bold' }}>Open : {item.opening} - Close {item.closing}</Text>
    </TouchableOpacity>
    
  )}
    
  
  

 return (
  <SafeAreaView style={[
    styles.safeArea, 
    Platform.OS == "android" && styles.androidPadding
  ]}>
    <View style={styles.headerContainer}>
      <View style={styles.welcomeBox}>
        <View style={styles.welcomeRow}>
          <Text style={[
            styles.welcomeText,
            Platform.OS == "ios" ? styles.iosPadding : styles.androidTextPadding
          ]}>
            {" "}Welcome to{" "}
          </Text>
          <Image 
            resizeMode="cover" 
            style={styles.logo} 
            source={logo}
          />
        </View>
      </View>
    </View>
    <ScrollView>
      <ImageBackground 
        resizeMode="cover" 
        style={styles.banner} 
        source={banner}
      >
        <BlurView 
          intensity={Platform.OS === "android" ? 120 : 35} 
          tint='dark' 
          style={styles.blurView}
        >
          <Text style={styles.bannerText}>
            Dine with your loved ones
          </Text>
        </BlurView>
      </ImageBackground>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}> Our Restaurants </Text>
      </View>


      {restaurants.length > 0 ? 
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          horizontal
          contentContainerStyle={{padding: 18}}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
        /> : (
          <ActivityIndicator animating color={"#fb9b33"}/>
        )
      }

      <View style={styles.discountHeader}>
        <Text style={styles.discountTitle}>Special Discount % </Text>
      </View>

      {restaurants.length > 0 ? 
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          horizontal
          contentContainerStyle={{padding: 20}}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
        /> : (
          <ActivityIndicator color={"#fb9b33"}/>
        )
      }
    </ScrollView>
  </SafeAreaView>
);
}


const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#2b2b2b",
    flex: 1,
  },
  androidPadding: {
    paddingBottom: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  welcomeBox: {
    backgroundColor: "#5f5f5f",
    width: '91.666%', // w-11/12
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#ffffff',
    height: 40,
    textAlignVertical: 'center',
    fontSize: 16,
  },
  iosPadding: {
    paddingTop: 8,
  },
  androidTextPadding: {
    paddingTop: 6,
  },
  logo: {
    width: 80,
    height: 15,
    marginTop : 10
  },
  banner: {
    width: '100%',
    height: 190, // h-52 (52 * 4 = 208)
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurView: {
    width: '100%',
  },
  bannerText: {
    textAlign: 'center',
    fontSize: 30, // text-3xl
    fontWeight: 'bold',
    color: '#ffffff',
    paddingVertical: 16,
  },
  sectionHeader: {
    padding: 10,
    backgroundColor: "#2b2b2b",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 36, // text-4xl
    color: "#f49b33",
  },
  discountHeader: {
    padding: 16,
    backgroundColor: "#2b2b2b",
  },
  discountTitle: {
    fontSize: 36, // text-4xl
    color: "#ffffff",
  },
});

