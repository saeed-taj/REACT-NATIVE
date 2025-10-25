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
const entryImg = require("../../assets/images/Frame.png");
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

// Define colors as constants (same as signin.jsx)
const COLORS = {
  background: "#2b2b2b",
  primary: "#f49b33",
  white: "#ffffff",
  black: "#000000",
  error: "#ef4444",
  inputBorder: "#cccccc",
};

const Signup = () => {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (values) => {
    setIsLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth, 
        values.email, 
        values.password
      );
      const user = userCredentials.user;
      
      await setDoc(doc(db, "users", user.uid), {
        email: values.email,
        username: values.username,
        createdAt: new Date()
      });
      
      await AsyncStorage.setItem("userEmail", values.email);
      await AsyncStorage.setItem("isGuest", "false");
      router.push("/home");
    } catch (error) {
      console.log(error);

      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Signup Error",
          "This email already exists! Please go to Sign in.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Signup Error",
          "An unexpected error occurred. Please try again later.",
          [{ text: "OK" }]
        );
      }
    } finally {
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Logo */}
          <Image 
            source={logo} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.heading}>Let's get started</Text>
        
          <View style={styles.formContainer}>
            <Formik 
              initialValues={{ email: "", password: "", username: "" }} 
              validationSchema={validationSchema} 
              onSubmit={handleSignup}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.form}>
                  {/* Username Input */}
                  <Text style={styles.label}>Username</Text>
                  <TextInput 
                    style={[
                      styles.input,
                      touched.username && errors.username && styles.inputError
                    ]}
                    onChangeText={handleChange("username")} 
                    value={values.username} 
                    onBlur={handleBlur("username")}
                    placeholderTextColor="#999"
                    placeholder="Enter your username"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                  {touched.username && errors.username && (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  )}

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

                  {/* Sign Up Button */}
                  <TouchableOpacity 
                    onPress={handleSubmit}
                    style={[styles.signUpBtn, isLoading && styles.btnDisabled]}
                    activeOpacity={0.8}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={COLORS.black} />
                    ) : (
                      <Text style={styles.signUpBtnText}>Sign up</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <TouchableOpacity 
                style={styles.signInRow} 
                onPress={() => router.push("/signin")}
                activeOpacity={0.7}
              >
                <Text style={styles.signInPrompt}>Already a user? </Text>
                <Text style={styles.signInLink}>sign in</Text>
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

export default Signup;

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
  signUpBtn: {
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
  signUpBtnText: {
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    color: COLORS.black,
  },
  signInContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  signInRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  signInPrompt: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 15,
  },
  signInLink: {
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