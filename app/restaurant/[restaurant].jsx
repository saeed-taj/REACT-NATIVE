import { useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform , StyleSheet , ScrollView ,Text , View , FlatList, Dimensions , Image, Animated, Linking, TouchableOpacity } from 'react-native';
import {useState , useEffect , useRef} from "react";
import { collection , where , query , getDocs } from 'firebase/firestore';
import { db } from "../../config/firebaseConfig";
import Ionicons from '@expo/vector-icons/Ionicons';
import DatePickerComponent from '../../components/restaurant/DatePickerComponent';
import GuestPickerComponent from '../../components/restaurant/GuestPickerComponent';
import FindSlots from '../../components/restaurant/FindSlots';


export default function Restaurant () {

    const flatListRef = useRef(null);
    const {restaurant} = useLocalSearchParams();
    const [restaurantsData , setRestaurantsData] = useState([]);
    const [carouselImages , setCarouselImages] = useState([]);
    const [slotsData , setSlotsData] = useState([]);
    const windowWidth = Dimensions.get("window").width;
    const [currentIndex , setCurrentIndex] = useState(0);

    const [date , setDate] = useState(new Date());
    const [selectNumber , setSelectNumber] = useState(1);
    const [selectedSlots , setSelectedSlots] = useState(null);


    const handlePrevImage =() => {

      const imagesLength = carouselImages[0]?.images.length;

      if(currentIndex > 0 ){
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex)
      flatListRef.current?.scrollToIndex({index: prevIndex, animated: true});
      } 
      else {
        // Go to last image
        const prevIndex = imagesLength - 1;
        setCurrentIndex(prevIndex);
        flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
      }
    };

    const handleNextImage = () => {
      if (!carouselImages[0]?.images || carouselImages[0].images.length === 0){
    return; // nothing to scroll
  }
      const imagesLength = carouselImages[0]?.images.length;
      
      if(currentIndex < imagesLength - 1){
        const nextIndex = currentIndex + 1;
        
        setCurrentIndex(nextIndex);

        flatListRef.current?.scrollToIndex({index:nextIndex,animated:true})
      }
      else {
    // reset to first image
    const nextIndex = 0;
    setCurrentIndex(nextIndex);
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  }

    };

    const handleScroll = (event) => {
      const contentOffset = event.nativeEvent.contentOffset;
      const viewSize = event.nativeEvent.layoutMeasurement;
      
      const newIndex = Math.floor(contentOffset.x / viewSize.width);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    };


    const carouselItem = ({item}) => {
      return(
        
        <View style={{width: windowWidth - 2, marginRight : 15}} className="h-78 relative">
          <View style = {{
            position: "absolute",
            top: "45%", 
            backgroundColor : "rgba(0,0,0,0.5)",
            borderRadius: 50, 
            padding: 5, 
            zIndex: 10, 
            right: "4%" }}>
              
              <Ionicons 
              onPress={handleNextImage} 
              name="arrow-forward-circle" 
              size={28} 
              color="white" />
              </View>
             
             {currentIndex >= 1 && (<View style = {{
              position: "absolute",
              top: "45%", 
              backgroundColor : "rgba(0,0,0,0.5)",
              borderRadius: 50, 
              padding: 5, 
              zIndex: 10, 
              left: "8%" }}>
             
             <Ionicons 
             onPress={handlePrevImage}
             name="arrow-back-circle" 
             size={28} 
             color="white" />
             
             </View>)}

             <Image
            source = {{uri:item}}
            style = {{opacity: 0.4,width:"100%",height:250,borderRadius:15,backgroundColor:"black",marginRight:20,marginLeft:5}}
          />
         <View style={{
              position:'absolute',
              display:'flex',
              justifyContent:'center',
              alignItems:'center',
              flexDirection:'row',
              left:"50%",
              transform:[{translateX:-50}],
              zIndex:10,
              bottom:15}}>
                {
                  carouselImages[0].images?.map((_,i) => (
                    <View key={i}  style={[{
                                    backgroundColor: '#ffffff',
                                    height: 8,
                                    width: 8,
                                    padding: 4,
                                    marginHorizontal: 4,
                                    borderRadius: 9999,
                                    },
                                    i == currentIndex && {
                                     width: 12,
                                     height: 12,
                                      
                                    }
                                      ]}/>
                  ))
                }
                
          </View>
 
          
        </View>

        
      )
    }


    const getrestaurantsData = async () => {
      try {
        const restaurantQuery = query(
          collection(db , "restaurants"),
          where("name","==",restaurant))
        
          const restaurantSnapShot = await getDocs(restaurantQuery);
      
        if(restaurantSnapShot.empty){
          console.log("No matching restaurant found!");
          return;
       }

       for(const doc of restaurantSnapShot.docs){
        const restaurantData = doc.data();
        setRestaurantsData(restaurantData);
        
        // for carousel images
        const carouselQuery = query(
          collection(db , "carousel"), 
          where("res_id","==",doc.ref));

          const carouselSnapShot = await getDocs(carouselQuery);
          
          if(carouselSnapShot.empty){
          console.log("No matching carousel found!");
          return;
       }
          const carouselImages = [];

          carouselSnapShot.forEach((carouselDoc)=>{
            carouselImages.push(carouselDoc.data())
          });
          setCarouselImages(carouselImages);


          
        // for slots
        const slotsQuery = query(
          collection(db , "slot"),
          where("ref_id","==",doc.ref)
        );

        const slotsSnapShot = await getDocs(slotsQuery);

        if(slotsSnapShot.empty){
          console.log("No matching slots found!");
          return;
       }

        const slotsDataArr = [];

        slotsSnapShot.forEach((slotDoc)=>{
          slotsDataArr.push(slotDoc.data());
        });

        setSlotsData(slotsDataArr[0]?.slot);
        
        } 
         }
      catch (error) {
        console.log("Error fetching data",error);
        
      }
      
    }

const handleLocation = async () => {
  try {
    const address = restaurantsData?.address;
    
    if (!address) {
      Alert.alert('Error', 'No address available');
      return;
    }

    // Try multiple URL formats
    const urlOptions = [
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      `https://maps.google.com/?q=${encodeURIComponent(address)}`,
      `geo:0,0?q=${encodeURIComponent(address)}`, // For native maps
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    ];

    let opened = false;
    
    for (const url of urlOptions) {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
          opened = true;
          break;
        }
      } catch (error) {
        console.log(`Failed to open ${url}:`, error);
        continue;
      }
    }

    if (!opened) {
      // Fallback: Open in browser
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      await Linking.openURL(webUrl);
    }
    
  } catch (error) {
    console.error('Error opening location:', error);
    Alert.alert(
      'Error', 
      'Could not open maps. Please make sure you have a maps app installed.',
      [{ text: 'OK' }]
    );
  }
};

    useEffect(()=>{
      getrestaurantsData();
      
    }, []);

   // console.log(restaurantsData , carouselImages , slotsData);



return (
    <SafeAreaView style={[
      styles.safeArea, 
      Platform.OS == "android" && styles.androidPadding
    ]}>

      <ScrollView style={styles.scrollView}> 
        <View style={styles.headerContainer}>
          <Text style={styles.restaurantName}>
            {restaurant}
          </Text>
          <View style={styles.divider} />
        </View>     
      
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={carouselImages[0]?.images || []}
            renderItem={carouselItem}
            horizontal
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            style={styles.flatList}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            getItemLayout={(data, index) => ({
              length: windowWidth + 18, 
              offset: (windowWidth + 18) * index, 
              index 
            })}
            onScrollToIndexFailed = {(info) => {
              const wait = new Promise(resolve => setTimeout(resolve, 100));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({ 
                  index: info.index, 
                  animated: true 
                });
              });
            }}
          />
        </View>

        <View style = {styles.locationContainer}>
          <Ionicons
            name = 'location-sharp'
            size = {28}
            color = "#f49b33"
            style = {styles.locationIcon}
          />

          <View style={styles.singleLineContainer}>
            <Text style={styles.addressText} numberOfLines={2}>
              {restaurantsData?.address}  |
            </Text>
            <TouchableOpacity onPress={handleLocation}>
              <View style={styles.locationLink}>
                <Text style={styles.locationLinkText}>See Location</Text>
                <Ionicons
                  name='location-sharp'
                  size={18}
                  color="#007AFF"
                  style={styles.locationLinkIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <Ionicons
            name='time'
            size={22}
            color="#f49b33"
            style={styles.timeIcon}
          />
          <Text style={styles.timeText}>
            {restaurantsData?.opening} - {restaurantsData?.closing}
          </Text>
        </View>

        <View style={styles.bookingContainer}>
          <View style={styles.bookingRow}>
            <View style={styles.bookingLabel}>
              <Ionicons name='calendar' size={20} color="#f49b33"/>
              <Text style={styles.bookingText}>
                Select booking date
              </Text>
            </View>
            <DatePickerComponent date={date} setDate={setDate}/>
          </View>

          <View style={styles.guestContainer}>
            <View style={styles.guestLabel}>
              <Ionicons name='people' size={20} color="#f49b33"/>
              <Text style={styles.guestText}>
                Select number of guests
              </Text>
            </View>
            <GuestPickerComponent selectNumber={selectNumber} setSelectNumber={setSelectNumber}/>
          </View>
        </View>

        <View style={styles.slotsContainer}>
          <FindSlots 
            date={date}
            selectNumber={selectNumber}
            slots={slotsData} 
            selectedSlots={selectedSlots} 
            setSelectedSlots={setSelectedSlots}
            restaurant={restaurant} 
          />
        </View>
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
    paddingBottom: 10,
  },
  scrollView: {
    height: '100%',
  },
  headerContainer: {
    marginVertical: 16,
    flex: 1,
    padding: 16,
  },
  restaurantName: {
    fontSize: 20,
    color: "#f49b33",
    marginRight: 8,
    fontWeight: "600",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#f49b33",
    marginTop: 8,
  },
  carouselContainer: {
    height: 312, // approx h-78 (78 * 4 = 312)
    maxWidth: '98%',
    marginHorizontal: 4,
    borderRadius: 25,
    overflow: 'hidden',
  },
  flatList: {
    borderRadius: 25,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 16,
    padding: 8,
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 16,
  },
  singleLineContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  addressText: {
    color: '#ffffff',
    flexShrink: 1,
    lineHeight: 20,
    marginRight: 4,
  },
  locationLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationLinkText: {
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    color: '#007AFF',
    fontWeight: '600',
    lineHeight: 20,
    marginRight: 4,
  },
  locationLinkIcon: {
    // Additional icon styles if needed
  },
  timeContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 4,
    padding: 8,
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 24,
  },
  timeText: {
    maxWidth: '75%',
    color: '#ffffff',
  },
  bookingContainer: {
    flex: 1,
    margin: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f49b33",
  },
  bookingRow: {
    flex: 1,
    flexDirection: 'row',
    margin: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 16,
  },
  guestContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#221f1f",
    borderRadius: 8,
  },
  guestLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 16,
  },
  slotsContainer: {
    flex: 1,
  },
});