import { StyleSheet } from "react-native";
import colors from "./colors";

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
    borderRadius: padding_small * 2,
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "rgba(200, 200, 200, 0.7)",
    overflow: "hidden",
    // shadowColor: "black",
    // shadowOpacity: 0.8,
    // shadowRadius: 4,
    // shadowOffset: {
    //   width: 2,
    //   height: 2,
    // }
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

export default styles;