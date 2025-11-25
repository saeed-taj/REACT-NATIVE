import { increment } from 'firebase/firestore'
import React, { Component } from 'react'
import { Text, View , TouchableOpacity } from 'react-native'

const GuestPickerComponent = ({selectNumber , setSelectNumber}) => {
  

    const decrement = () => {
        setSelectNumber(selectNumber - 1);
         if(selectNumber == 1){
            setSelectNumber(1);
        }
    }

    const increment = () => {
        setSelectNumber(selectNumber + 1);
        if(selectNumber == 10){
            setSelectNumber(10);
        }
    }

    return (
  <View style={{ 
    flexDirection: 'row', 
    borderRadius: 8, 
    marginRight: 6, 
    alignItems: 'center' 
  }}>
    <TouchableOpacity style={{ borderRadius: 8, marginHorizontal: 16 }}>
      <Text 
        onPress={decrement} 
        style={{ 
          padding: 8, 
          color: '#ffffff', 
          fontWeight: 'bold', 
          fontSize: 18, 
          borderWidth: 1, 
          borderColor: '#f49b33', 
          borderTopLeftRadius: 8, 
          borderBottomLeftRadius: 8 
        }}
      > 
        - 
      </Text> 
    </TouchableOpacity>

    <Text style={{ color: '#f49b33', fontSize: 18 }}> {selectNumber} </Text>
    
    <TouchableOpacity style={{ borderRadius: 8, marginHorizontal: 16 }}>
      <Text 
        onPress={increment} 
        style={{ 
          padding: 8, 
          color: '#ffffff', 
          fontWeight: '600', 
          fontSize: 18, 
          borderWidth: 1, 
          borderColor: '#f49b33', 
          borderTopRightRadius: 8, 
          borderBottomRightRadius: 8 
        }}
      > 
        + 
      </Text>
    </TouchableOpacity>
  </View>
)
  
}

export default GuestPickerComponent
