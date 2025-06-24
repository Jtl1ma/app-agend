/*import { Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { styless } from "./calendars.style";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import Button from "../../componets/button/button"
import { ptBR } from "../../constants/calendars";

LocaleConfig.locales["pt-br"] = ptBR;
LocaleConfig.defaultLocale = "pt-br";

export default function Calendar() {
    const [selects, setSelects] = useState(new Date().toISOString().slice(0, 10));
    const [selectsHours, setSelectsHours] = useState("");


    return <View style={styless.container}>
        <Text>Calendario de Agendamento</Text>

        <Calendar style={styless.theme}
        onDayPress={(day)=> {
            setSelects(day.dateString)
        }}
        markedDates={{
            [selects]: { selected: true }
        }}
        minDate={new Date().toDateString()}
        />

        <View>
            <Text style={styless.textHorario}>Horário</Text>
        </View>

        <View>
            <Picker selectedValue={selectsHours}
            onValueChange={(itemValue, itemIndex) => {
                setSelectsHours(itemValue)
            }}>
                <Picker.Item label="09:00" value="09:00" />
                <Picker.Item label="09:30" value="09:30" />
                <Picker.Item label="10:00" value="10:00" />
                <Picker.Item label="10:30" value="10:30" />
            </Picker>
        </View>
        <View>
            <Button title="Confirmar!"/>
        </View>
        
    </View>
    
}

const styless = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingLeft: 25,
        paddingRight: 25,
                
    },
  
    textHorario: {
        //textAlign: "center",
        color: "gray",
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 25
    },
    pickerHour: {

    },
    theme: {
        backgroundColor: '#ffffff',
        calendarBackground: '#ffffff',
        textSectionTitleColor: '#b6c1cd',
        selectedDayBackgroundColor: '#00adf5',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#00adf5',
        dayTextColor: '#2d4150',
        textDisabledColor: '#dd99ee'
      }
});*/