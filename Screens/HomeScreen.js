import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableHighlightComponent,
  TouchableOpacity,
  View,
} from "react-native";
import useAuth from "../hooks/useAuth";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import tw from "tailwind-rn";
import Swiper from "react-native-deck-swiper";
import { collection, doc, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase";

const Dummy = [
  {
    firstName: "Chris",
    lastName: "Risner",
    job: "React Developer",
    photoURL:
      "https://scontent-atl3-1.xx.fbcdn.net/v/t1.6435-9/c0.23.206.206a/p206x206/55840277_2267249893334381_821954395678703616_n.jpg?_nc_cat=105&ccb=1-5&_nc_sid=da31f3&_nc_ohc=V0zGq99cp_UAX8eeHvQ&_nc_ht=scontent-atl3-1.xx&oh=df1141f842b2ad2dc1a00b0fe21b29d1&oe=61C10D55",
    age: 43,
    id: 1,
  },
  {
    firstName: "Chris",
    lastName: "Risner",
    job: "React Developer",
    photoURL:
      "https://scontent-atl3-1.xx.fbcdn.net/v/t1.6435-9/p206x206/40235630_1966048700121170_8477075817967386624_n.jpg?_nc_cat=105&ccb=1-5&_nc_sid=da31f3&_nc_ohc=uDWjD3xaVTAAX9GzmhZ&_nc_ht=scontent-atl3-1.xx&oh=41fbbca972a9ec4e44bc8056fb6fb09a&oe=61C1119C",
    age: 43,
    id: 2,
  },
  {
    firstName: "Care",
    lastName: "Bear",
    job: "Care Bear",
    photoURL:
      "https://scontent-atl3-1.xx.fbcdn.net/v/t1.18169-9/p206x206/23168017_1613873852005325_4938467460133473005_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=da31f3&_nc_ohc=k9FadCTvTacAX_t2f_n&tn=EfaqVjdKo3FQcb7w&_nc_ht=scontent-atl3-1.xx&oh=c6d44f7f5ab1d995719eefd12b97b079&oe=61C33C9E",
    age: 43,
    id: 3,
  },
];

const HomeScreen = () => {
  const [profiles, setProfiles] = useState([]);
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const swipeRef = useRef(null);

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
    []
  );

  useEffect(() => {
      let unsub;

      const fetchCards = async () => {
        unsub = onSnapshot(collection(db, 'users'), snapshot => {
            setProfiles(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })))
        })
      }

      fetchCards()
      return unsub
  }, [db]);
console.log(profiles)
  return (
    <SafeAreaView style={tw("flex-1")}>
      {/* Header */}
      <View style={tw("flex-row justify-between items-center px-5")}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tw("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tw("h-14 w-14")}
            source={{
              uri: "https://img.icons8.com/fluency/48/000000/--tinder.png",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#ff5864" />
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          stackSize={5}
          cardIndex={0}
          verticalSwipe={false}
          animateCardOpacity
          onSwipedLeft={() => {
            console.log("NOPE");
          }}
          onSwipedRight={() => {
            console.log("MATCH");
          }}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  color: "#4DED30",
                },
              },
            },
          }}
          cards={profiles}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw("relative bg-white h-3/4 rounded-xl bg-white")}
              >
                <Image
                  style={tw("absolute h-full w-full rounded-xl")}
                  source={{ uri: card.photoURL }}
                />
                <View
                  style={[
                    tw(
                      "absolute bottom-0 bg-white w-full h-20 flex-row items-center justify-between px-6 py-2 rounded-b-xl"
                    ),
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw("text-xl font-bold")}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw(
                    "relative bg-white h-3/4 rounded-xl justify-center items-center"
                  ),
                  styles.cardShadow,
                ]}
              >
                <Text style={tw("font-bold pb-5")}>No more profiles</Text>
                <Image
                  style={tw("h-20 w-full")}
                  height={100}
                  width={100}
                  source={{ uri: "https://links.papareact.com/6gb" }}
                />
              </View>
            )
          }
        />
      </View>
      <View style={tw("flex flex-row justify-evenly")}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
