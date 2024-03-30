import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { colors } from "@/constants/Colors";
import ReactNativePhoneInput from "react-native-phone-input";
import OTPInputView from "react-native-expo-opt-input";
import { StatusBar } from "expo-status-bar";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useUserStore } from "@/store/userStore";
import { getUserDataThroughFirebaseUid, isUserExist } from "@/gql/user_queries";
import { router } from "expo-router";

const register = () => {
  const [phone, setPhone] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [OTP, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const setPhoneNumber = useUserStore((state) => state.setPhoneNumber);
  const setFirebaseUID = useUserStore((state) => state.setFirebaseUID);
  const setUserId = useUserStore((state) => state.setUserId);
  const setUserName = useUserStore((state) => state.setUserName);
  const setUserEmail = useUserStore((state) => state.setUserEmail);
  const setUserAge = useUserStore((state) => state.setUserAge);
  const setUserGender = useUserStore((state) => state.setUserGender);
  const setUserBloodType = useUserStore((state) => state.setUserBloodType);
  const setUserCity = useUserStore((state) => state.setUserCity);
  const setUserPinCode = useUserStore((state) => state.setUserPinCode);
  const setActiveForDonation = useUserStore(
    (state) => state.setActiveForDonation
  );
  const userData = useUserStore((state) => state.user);

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user) {
      console.log("User: ", user.uid);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const sendCode = async () => {
    setLoading(true);
    const confirmation = await auth().signInWithPhoneNumber(phone);
    setConfirmationResult(confirmation);
    console.log("Confirmation: ", confirmation.verificationId);
    setLoading(false);
    setShowOTP(true);
  };

  const confirmCode = async () => {
    try {
      setLoading(true);
      const userCredentials = await confirmationResult.confirm(OTP);
      const user = userCredentials?.user;
      if (!user?.uid) {
        setLoading(false);
        console.log("User not created");
        return;
      }
      setFirebaseUID(user.uid);
      setPhoneNumber(phone);

      const userExist = await isUserExist(user.uid);
      if (userExist) {
        const response = await getUserDataThroughFirebaseUid(user.uid);
        setUserId(response.id);
        setUserName(response.fullName);
        setUserEmail(response.email);
        setUserAge(response.age);
        setUserGender(response.gender);
        setUserBloodType(response.bloodType);
        setUserCity(response.address.city);
        setUserPinCode(response.address.pincode);
        setActiveForDonation(response.activeForDonation);
        console.log("UserData: ", userData);
        router.navigate("(tabs)/");
        setLoading(false);
        return;
      }
      setLoading(false);
      router.push("/auth/new-user/newUser");
    } catch (error) {
      console.log("Invalid code.", error);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="auto" />
      {showOTP ? (
        <View style={styles.optEnterContainer}>
          <Text style={styles.subHeadingText}>Enter OTP</Text>
          <Text style={{ fontSize: 20 }}>
            Code Just sent to{" "}
            <Text style={{ color: colors.linkBlue }}>{phone}</Text>
            {""}{" "}
            <Text
              onPress={() => setShowOTP(false)}
              style={{
                fontSize: 15,
                textDecorationLine: "underline",
                color: colors.linkBlue,
              }}
            >
              edit
            </Text>
          </Text>
          <Text>Enter the OTP sent to your phone</Text>
          <View>
            <OTPInputView
              placeholderCharacter="0"
              codeInputFieldStyle={styles.otpInput}
              codeInputHighlightStyle={{ borderColor: colors.green }}
              onCodeFilled={(code) => {
                setOTP(code);
              }}
              // returnKeyType="done"
              pinCount={6}
            />
          </View>
          <Pressable style={styles.buttonStyle} onPress={() => confirmCode()}>
            <Text style={styles.btnText}>Verify</Text>
            {loading && <ActivityIndicator size="small" color="white" />}
          </Pressable>
        </View>
      ) : (
        <View style={styles.subContainer}>
          <View>
            <Image
              style={styles.imageStyle}
              source={require("@/assets/images/yoga.png")}
            />
          </View>
          <View style={styles.form}>
            <View style={styles.headingContainer}>
              <Text style={styles.subHeading}>Welcome !</Text>
              <Text style={styles.heading}>Login to continue</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <ReactNativePhoneInput
                initialValue="91"
                style={styles.phoneInput}
                onChangePhoneNumber={(number) => setPhone(number)}
                textProps={{ placeholder: "Enter your phone number" }}
              />
            </View>
            <Pressable style={styles.buttonStyle} onPress={() => sendCode()}>
              <Text style={styles.btnText}>Continue</Text>
              {loading && <ActivityIndicator size="small" color="white" />}
            </Pressable>
          </View>
          <View>
            <Text
              style={{ fontWeight: "800", width: 350, textAlign: "center" }}
            >
              By continuing, you agree to our{" "}
              <Text style={styles.link}> Terms of Service</Text> and{""}
              <Text style={[styles.link]}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
  },
  subContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    justifyContent: "space-around",
  },
  imageStyle: {
    marginTop: 20,
    width: 400,
    height: 370,
  },
  link: {
    color: colors.linkBlue,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  form: {
    width: "100%",
    padding: 20,
    marginTop: 20,
  },
  inputContainer: {},
  inputLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  phoneInput: {
    marginBottom: 20,
    borderRadius: 5,
    padding: 12,
    paddingVertical: 15,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.borderGray,
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    // width: "85%",
    flexDirection: "row",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  headingContainer: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 40,
    fontWeight: "bold",
    color: colors.textGray,
  },
  subHeading: {
    fontSize: 30,
    color: colors.textGray,
    fontWeight: "bold",
  },
  optEnterContainer: {
    flex: 1,
    marginTop: 60,
    width: "100%",
    gap: 20,
    padding: 20,
  },
  subHeadingText: {
    fontSize: 30,
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  otpInput: {
    borderColor: colors.borderGray,
    borderWidth: 1,
    color: colors.textPrimary,
    borderRadius: 5,
  },
});
