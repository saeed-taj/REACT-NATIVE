
import React from 'react';
import { View,Text } from 'react-native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";


const DatePickerComponent = ({date , setDate}) => {
  const [show , setShow] = useState(false);
  
  const [hasPicked, setHasPicked] = useState(false);
  
 
  const handlePress = () => {
   setShow(true);
    }

    const onChange = (event , selectedDate) => {
     const currentDate = selectedDate || date;
     setShow(false);
     setDate(currentDate);
     setHasPicked(true); // mark that user picked
    
    }

  return (
    <View className = "flex flex-row">
        <TouchableOpacity 
        onPress={handlePress} 
        style={{ padding: 16, borderRadius: 10, backgroundColor: "#221f1f"}}>
            <Text style={{ color: "#f49b33", fontWeight: "600" }}>
    {`${date.toDateString()}`}
            </Text>

        </TouchableOpacity>

    {show && 
    <DateTimePicker 
        value={date} 
        mode='date' 
        display='deafult' 
        minimumDate={new Date()}
        maximumDate={new Date(new Date().setDate(new Date().getDate() + 7 ))}
        accentColor="#f49b33"
        textColor="#f49b33"
        onChange={onChange}/>
    }
    
    </View>
  );
};

export default DatePickerComponent
