import axios from "axios";
import { Alert } from "react-native";

 const api = axios.create({
    baseUrl: "https://test-api.loca.lt"
   // baseUrl: "http://127.0.0.1:3333"
});


const validate = () => {
    if(password !== confirmpassword){
        return Alert.alert('Unauthorized!');
      }
}

export default {api, validate};