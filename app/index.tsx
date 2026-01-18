import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronDown } from "./ChevronDown";
import { colors } from "./colors";

let padding_small = 8;
let padding_medium = 16;
let font_size_title = 32;
let font_size_text = 18;

const styles = StyleSheet.create({
  defaultText: {
    color: colors.text_color1,
  },
  titleText: {
    color: colors.text_color1,
    fontSize: font_size_title,
  },
  headerText: {
    color: colors.text_color1,
    fontSize: 18,
  },
  task: {
    backgroundColor: "red",
  },
  task_title: {
    color: "white",
    flex: 1,
  },
  task_top: {
    backgroundColor: "darkred",
    padding: padding_small,
    gap: padding_small,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default function Index() {
  const [isTaskExpanded, setIsTaskExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const rotationValue = useRef(new Animated.Value(0)).current;
  const heightValue = useRef(new Animated.Value(0)).current;

  const toggle_content = () => {
    // Pick value to animate to based on if expended
    const toValue = isTaskExpanded ? 0 : 1;
    const heightToValue = isTaskExpanded ? 0 : contentHeight;

    // Run animations in parallel
    Animated.parallel([
      // Animate rotationValue between 0 and 1
      Animated.timing(rotationValue, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
      // Animate heightValue between 0 and contentHeight
      Animated.timing(heightValue, {
        toValue: heightToValue,
        duration: 200,
        useNativeDriver: false,
      })
    ]).start();

    setIsTaskExpanded(!isTaskExpanded);
  };

  // interpolate the 0 1 value to deg
  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <SafeAreaView style={{
      flex: 1,
      alignItems: "center",
      backgroundColor: colors.background1,
    }}>
      <Text style={[styles.titleText, { margin: padding_medium * 4 }]}>
        Digilist
      </Text>
      {/* To do list */}
      <View style={{
        borderStyle: "solid",
        borderColor: colors.grey,
        borderWidth: 0.5,
        borderRadius: padding_small,

        justifyContent: "center",
        backgroundColor: colors.background3,
        width: "90%",
        maxWidth: 256 + 128,
        overflow: "hidden",
      }}>
        {/* Top */}
        <View style={{ padding: padding_medium, backgroundColor: colors.background2, }}>
          <Text style={styles.headerText}>To do list</Text>
        </View>
        {/* Content */}
        <View style={{ minHeight: 50, padding: padding_small, }}>
          {/* Task */}
          <View style={styles.task}>
            {/* Top */}
            <View style={styles.task_top}>
              <View style={{
                borderStyle: "solid",
                borderColor: "#ffffff",
                borderWidth: 2,
                borderRadius: 99999,
                height: font_size_text,
                width: font_size_text,
              }}>
              </View>
              <Text style={styles.task_title}>Water Plants</Text>
              <TouchableOpacity onPress={toggle_content}>
                {/* Chevron down */}
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                  <ChevronDown size={24} color={colors.text_color1} />
                </Animated.View>

              </TouchableOpacity>
            </View>



            {/* content */}
            <Animated.View style={{
              height: heightValue,
              overflow: 'hidden',
            }}>
              <View 
                onLayout={(event) => {
                  const { height } = event.nativeEvent.layout;
                  setContentHeight(height);
                }}
                style={{ padding: padding_small, gap: padding_small, }}
              >
                <View style={{backgroundColor: "blue",}}><Text style={{ color: "white" }}>No subtasks yet</Text></View>
                
                <View style={{backgroundColor: "blue",}}><Text style={{ color: "white" }}>No subtasks yet</Text></View>
              </View>
            </Animated.View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
