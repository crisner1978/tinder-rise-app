import { doc, serverTimestamp, setDoc } from "@firebase/firestore";
import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import { View, Text, Image, Keyboard, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import tw from "tailwind-rn";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";

const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = useState("");
  const [job, setJob] = useState("");
  const [age, setAge] = useState("");

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const incomplete = !image || !job || !age;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={tw("flex-1 items-center pt-1")}>
        <Image
          style={tw("h-12 w-full my-5")}
          resizeMode="contain"
          source={{
            uri: "https://chris-risner-portfolio.herokuapp.com/api/shorturl/66zUf6JZ",
          }}
        />
        <Text style={tw("text-xl text-gray-500 p-4 font-bold")}>
          Welcome {user.displayName}
        </Text>
        <Text style={tw("text-center p-4 font-bold text-red-400")}>
          Step 1: The Profile Pic
        </Text>
        <TextInput
          value={image}
          onChangeText={setImage}
          style={tw("text-center text-xl pb-2")}
          placeholder="Enter a Profile Pic URL"
        />

        <Text style={tw("text-center p-4 font-bold text-red-400")}>
          Step 2: The Job
        </Text>
        <TextInput
          value={job}
          onChangeText={setJob}
          style={tw("text-center text-xl pb-2")}
          placeholder="Enter your occupation"
        />

        <Text style={tw("text-center p-4 font-bold text-red-400")}>
          Step 3: The Age
        </Text>
        <TextInput
          value={age}
          onChangeText={setAge}
          style={tw("text-center text-xl pb-2")}
          placeholder="Enter your age"
          keyboardType="numeric"
          maxLength={2}
          onEndEditing={Keyboard.dismiss}
        />

        <TouchableOpacity
          onPress={updateUserProfile}
          disabled={incomplete}
          style={[
            tw("w-64 p-3 rounded-xl absolute bottom-10"),
            incomplete ? tw("bg-gray-400") : tw("bg-red-400"),
          ]}
        >
          <Text style={tw("text-center text-white text-xl")}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
    
  );
};

export default ModalScreen;
