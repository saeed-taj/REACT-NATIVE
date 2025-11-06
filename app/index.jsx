import { useRouter } from "expo-router";
import { useEffect } from "react";
import { 
  Image, 
  ScrollView, 
  StatusBar, 
  Text, 
  TouchableOpacity, 
  View, 
  StyleSheet,
  Platform 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../assets/images/dinetimelogo.png";

const entryImg = require("../assets/images/Frame.png");

// Define colors as constants
const COLORS = {
  background: "#2b2b2b",
  primary: "#f49b33",
  white: "#ffffff",
  black: "#000000",
  textSecondary: "#cccccc",
};

export default function Index() {
  const router = useRouter();

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
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={COLORS.background}
        translucent={false}
      />
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

          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              onPress={() => router.push("/signup")} 
              style={styles.primaryBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleUserGuest} 
              style={styles.secondaryBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryBtnText}>Guest user</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerLabel}>or</Text>
            <View style={styles.divider} />
          </View>

          {/* Sign In Link */}
          <TouchableOpacity 
            style={styles.signInRow} 
            onPress={() => router.push("/signin")}
            activeOpacity={0.7}
          >
            <Text style={styles.signInPrompt}>already a user? </Text>
            <Text style={styles.signInLink}>sign in</Text>
          </TouchableOpacity>
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
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: COLORS.background,
  },
  contentWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  logo: {
    width: 280,
    height: 280,
    marginBottom: 20,
  },
  buttonsContainer: {
    width: "85%",
    maxWidth: 400,
    marginTop: 10,
  },
  primaryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  primaryBtnText: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.black,
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginVertical: 8,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 10,
  },
  secondaryBtnText: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    maxWidth: 400,
    marginVertical: 30,
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
    opacity: 0.8,
  },
  signInRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  signInPrompt: {
    color: COLORS.textSecondary,
    fontWeight: "500",
    fontSize: 15,
  },
  signInLink: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  illustrationWrapper: {
    flex: 1,
    width: "100%",
    minHeight: 200,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: "100%",
    height: 250,
  },
});