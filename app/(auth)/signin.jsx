import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { 
  Image, 
  ScrollView, 
  StatusBar, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import logo from "../../assets/images/dinetimelogo.png";
import validationSchema from '../../utils/authSchema';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const entryImg = require("../../assets/images/Frame.png");

// Define colors as constants
const COLORS = {
  background: "#2b2b2b",
  primary: "#f49b33",
  white: "#ffffff",
  black: "#000000",
  error: "#ef4444",
  inputBorder: "#cccccc",
};

const Signin = () => {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignin = async (values) => {
    setIsLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth, 
        values.email, 
        values.password
      );
      const user = userCredentials.user;
      
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        //console.log("User data", userDoc.data());
        await AsyncStorage.setItem("userEmail", values.email);
        await AsyncStorage.setItem("isGuest", "false");
        router.push("/home");
      } else {
        Alert.alert(
          "Error",
          "User data not found. Please contact support.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.log(error);

      if (error.code === "auth/invalid-credential") {
        Alert.alert(
          "Sign in Failed",
          "Incorrect email or password. Please try again.",
          [{ text: "OK" }]
        );
      } 
      else if (error.code === "auth/user-not-found") {
        Alert.alert(
          "Sign in Failed",
          "No account found with this email.",
          [{ text: "OK" }]
        );
      } 
      else if (error.code === "auth/wrong-password") {
        Alert.alert(
          "Sign in Failed",
          "Incorrect password. Please try again.",
          [{ text: "OK" }]
        );
      } 
      else {
        Alert.alert(
          "Sign in Error",
          "An unexpected error occurred. Please try again later.",
          [{ text: "OK" }]
        );
      }
    } 
    finally {
      setIsLoading(false);
    }
  };

  const handleUserGuest = async () => {
    try {
      await AsyncStorage.setItem("isGuest", "true");
      router.push("/home");
    } catch (error) {
      console.error("Error setting guest mode:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor = {COLORS.background} />
      <ScrollView 
        contentContainerStyle = {styles.scrollContainer}
        showsVerticalScrollIndicator = {false}
      >
        <View style = {styles.contentWrapper}>
          {/* Logo */}
          <Image 
            source = {logo} 
            style = {styles.logo}
            resizeMode = "contain"
          />
          
          <Text style={styles.heading}>Let's get started</Text>
        
          <View style={styles.formContainer}>
            <Formik 
              initialValues={{ email: "", password: "" }} 
              validationSchema={validationSchema} 
              onSubmit={handleSignin}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.form}>
                  {/* Email Input */}
                  <Text style={styles.label}>Email</Text>
                  <TextInput 
                    style={[
                      styles.input,
                      touched.email && errors.email && styles.inputError
                    ]}
                    keyboardType="email-address" 
                    onChangeText={handleChange("email")} 
                    value={values.email} 
                    onBlur={handleBlur("email")}
                    placeholderTextColor="#999"
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  {/* Password Input */}
                  <Text style={styles.label}>Password</Text>
                  <TextInput 
                    style={[
                      styles.input,
                      touched.password && errors.password && styles.inputError
                    ]}
                    secureTextEntry
                    onChangeText={handleChange("password")} 
                    value={values.password} 
                    onBlur={handleBlur("password")}
                    placeholderTextColor="#999"
                    placeholder="Enter your password"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  {/* Sign In Button */}
                  <TouchableOpacity 
                    onPress={handleSubmit}
                    style={[styles.signInBtn, isLoading && styles.btnDisabled]}
                    activeOpacity={0.8}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={COLORS.black} />
                    ) : (
                      <Text style={styles.signInBtnText}>Sign in</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <TouchableOpacity 
                style={styles.signUpRow} 
                onPress={() => router.push("/signup")}
                activeOpacity={0.7}
              >
                <Text style={styles.signUpPrompt}>New user? </Text>
                <Text style={styles.signUpLink}>sign up</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerLabel}>or</Text>
              <View style={styles.divider} />
            </View>

            {/* Guest User Link */}
            <TouchableOpacity 
              style={styles.guestRow} 
              onPress={handleUserGuest}
              activeOpacity={0.7}
            >
              <Text style={styles.guestPrompt}>Be a </Text>
              <Text style={styles.guestLink}>Guest user</Text>
            </TouchableOpacity>
          </View>   
        </View>

        {/* Illustration */}
        <View style={styles.illustrationWrapper}>
          <Image 
            source={entryImg} 
            style={styles.illustration} 
            resizeMode="contain"
          />
        </View>
      </ScrollView>      
    </SafeAreaView>
  );
};

export default Signin;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: COLORS.background,
  },
  contentWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 250,
    height: 200,
    marginBottom: 10,
  },
  heading: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    width: "90%",
    maxWidth: 400,
  },
  form: {
    width: "100%",
  },
  label: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 15,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    color: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    fontSize: 15,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginBottom: 8,
    marginTop: -4,
  },
  signInBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginTop: 24,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.6,
  },
  signInBtnText: {
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    color: COLORS.black,
  },
  signUpContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  signUpRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  signUpPrompt: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 15,
  },
  signUpLink: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.primary,
    opacity: 0.6,
  },
  dividerLabel: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
    paddingHorizontal: 12,
  },
  guestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  guestPrompt: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 15,
  },
  guestLink: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  illustrationWrapper: {
    flex: 1,
    width: "100%",
    minHeight: 200,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: "100%",
    height: 200,
  },
});