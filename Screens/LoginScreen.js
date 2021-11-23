import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";

const LoginScreen = () => {
  const { signInWithGoogle, loading } = useAuth();

  // can be used in individual screens or look at StackNavigator to set for every screen
  // useLayoutEffect(() => {
  //     navigation.setOptions({
  //         headerShown: false,
  //     })
  // })

  return (
    <View style={tw("flex-1")}>
      <ImageBackground
        source={{ url: "https://tinder.com/static/tinder.png" }}
        resizeMode="cover"
        style={tw("flex-1")}
      >
        <TouchableOpacity
          style={[
            tw("absolute bottom-40 w-52 p-4 rounded-2xl bg-white"),
            { marginHorizontal: "25%" },
          ]}
          onPress={signInWithGoogle}
        >
          <Text style={tw("font-semibold text-center")}>
            Sign in & get swiping
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
