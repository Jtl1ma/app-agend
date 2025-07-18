import { Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Button(props) {
  return (
    <TouchableOpacity
      style={[styles.btn, props.theme == 'light' ? styles.lightButton : styles.darkButton]}
        onPress={props.onPress}>
    <Text style={styles.text}>{props.title}</Text>
        </TouchableOpacity>
  );
    
}
const styles = StyleSheet.create({

    btn: {
        width: '70%',
        position: 'absolute',
        borderRadius: 12,
        padding: 14,
        opacity: 1,
    },
    lightButton: {
        backgroundColor: 'black',
    },
    darkButton: {
        backgroundColor: '#007bff',
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
    },
});