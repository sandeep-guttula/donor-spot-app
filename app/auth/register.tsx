import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { colors } from "@/constants/Colors";
import ReactNativePhoneInput from "react-native-phone-input";
import OTPInputView from "react-native-expo-opt-input";
import { StatusBar } from "expo-status-bar";
import auth from "@react-native-firebase/auth";

const register = () => {
  const [phone, setPhone] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [OTP, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  function onAuthStateChanged(user: any) {
    if (user) {
      console.log("User: ", user);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const sendCode = async () => {
    const confirmation = await auth().signInWithPhoneNumber(phone);
    setConfirmationResult(confirmation);
    console.log("Confirmation: ", confirmation);
    setShowOTP(true);
  };
  const confirmCode = async () => {
    try {
      setLoading(true);
      const userCredentials = await confirmationResult.confirm(OTP);
      console.log("UserCredentials: ", userCredentials);
      setLoading(false);
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
