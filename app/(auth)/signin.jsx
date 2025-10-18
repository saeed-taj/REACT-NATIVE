import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View , Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import logo from "../../assets/images/dinetimelogo.png";
import validationSchema from '../../utils/authSchema';
const entryImg = require("../../assets/images/Frame.png");
import { signInWithEmailAndPassword , getAuth } from 'firebase/auth';
import {doc , getDoc , getFirestore} from "firebase/firestore";
import AsyncStorage  from "@react-native-async-storage/async-storage";

const Signin = () => {
    const router = useRouter();
    const auth = getAuth();
    const db = getFirestore();

 const handleSignin = async (values) => {

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,values.email,values.password
      )
      const user = userCredentials.user //userCredentials has got an object of user so userCredentials.user accesses the returned objects user property
      
     const userDoc =  await getDoc(doc(db,"users",user.uid));
     
     if(userDoc.exists()){
      console.log("User data", userDoc.data());
      await AsyncStorage.setItem("userEmail",values.email);
      await AsyncStorage.setItem("isGuest" , "false");
      router.push("/home");
     }
     else {
      console.log("No any document!")
     }
      
      

    } 
    catch (error) {
      console.log(error)

      if(error.code === "auth/invalid-credential"){
        Alert.alert(
          "Sign in Failed!",
          "Incorrect password. Please Try again",
          [{ text: "OK" }]
              );
          } 
    
  else {
    Alert.alert(
      "Sign in Error",
      "An unexpected error occured.Please try again later!",
      [{text : "OK"}]

        )
      }  
    }
  
  };

  const handleUserGuest = async () => {
    AsyncStorage.setItem("isGuest", "true")
    router.push("/home")
  }


  return (
    <SafeAreaView className={`bg-[#2b2b2b]`}>
      <StatusBar barStyle={"light-content"} backgroundColor={"#2b2b2b"}/>
       <ScrollView contentContainerStyle={{height: "100%"}}> 
        <View className=" flex justify-center items-center">
          <Image source={logo} style={{width:250 , height: 200}}/> 
          <Text className="text-white text-lg text-center font-bold mb-10">Let's get started</Text>
        
          <View className="w-5/6">
            <Formik initialValues={{email : "" , password : "" , username : ""}} 
                    validationSchema={validationSchema} 
                    onSubmit={handleSignin}>
          
              {({handleChange , handleBlur , handleSubmit , values , errors , touched}) => (

             <View className = "w-full">
              <Text className="text-[#f49b33] font-semibold mt-4 mb-2">Email</Text>
             
              <TextInput 
                className=" h-11 border border-white text-white rounded px-3 mb-2"
                keyboardType="email-address" 
                onChangeText={handleChange("email")} 
                value={values.email} 
                onBlur = {handleBlur("email")}/>
            
                {touched.email && errors.email && (
                <Text className = "text-red-500 text-xs mb-2">
                  {errors.email}
                </Text>
                   )}

             
                 <Text className="text-[#f49b33] font-semibold mt-4 mb-2">Password</Text>
             
             <TextInput 
             className=" h-11 border border-white text-white rounded px-3 mb-2"
             secureTextEntry
             onChangeText={handleChange("password")} 
             value={values.password} 
             onBlur = {handleBlur("password")}/>
            
              {touched.password && errors.password && (
              <Text className = "text-red-500 text-xs mb-2">
                 {errors.password}
              </Text>
                )}

              <TouchableOpacity onPress={handleSubmit}
                className="p-2 my-2 bg-[#f49b33] text-black rounded-lg mt-8">
                <Text className="font-semibold text-center"> Sign in </Text>
              </TouchableOpacity>
             
               </View>

            
               )}
            </Formik>

            <View className="items-center mt-8">
              <TouchableOpacity className="flex flex-row items-center" onPress={() => router.push("/signup")}>
              <Text className="text-white font-semibold ">New user?  </Text>
              <Text className="text-[#f49b33] font-semibold underline text-base">sign up</Text>
            </TouchableOpacity>
            </View>
            <Text className="text-center text-base font-semibold my-6 text-white">
              <View className="border-b-2 border-[#f49b33] p-1 mb-1 w-24"/> 
              or {" "}             
              <View className="border-b-2 border-[#f49b33] p-1 mb-1 w-24"/>
            </Text>
            <TouchableOpacity className="flex flex-row items-center justify-center" onPress={handleUserGuest}>
              <Text className="text-white font-semibold ">Be a </Text>
              <Text className="text-[#f49b33] font-semibold underline text-base">Guest user</Text>
            </TouchableOpacity>
          </View>   
        </View>
           <View className="flex-1">
          <Image source={entryImg} className="w-full h-full" resizeMode="contain"></Image>
        </View>
      </ScrollView>      
    </SafeAreaView>
  )
}


export default Signin



//handleChange(fieldName): updates the value of that field.

// handleBlur(fieldName): marks the field as “touched.”

// handleSubmit(): calls your onSubmit with current values.

// values: current field values.

// errors: current validation errors.

// touched: which fields have been blurred/touched.



// value={values.email}
// Binds the current value from Formik state to the TextInput



// onChangeText updates the state.

// value reads the state back into the input.