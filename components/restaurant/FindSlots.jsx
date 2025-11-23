import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Formik } from 'formik';
import validationSchema from '../../utils/guestSchema';
import Ionicons from '@expo/vector-icons/Ionicons';

const FindSlots = ({
  date,
  selectNumber,
  slots,
  selectedSlots,
  setSelectedSlots,
  restaurant,
}) => {
  const [slotsVisible, setSlotsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const slotsBooking = () => {
    setSlotsVisible(!slotsVisible);
  };

  const handleSlotPress = (slot) => {
    if (selectedSlots === slot) setSelectedSlots(null);
    else setSelectedSlots(slot);
  };

  const handleBooking = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    const guestStatus = await AsyncStorage.getItem('isGuest');

    if (userEmail) {
      try {
        await addDoc(collection(db, 'bookings'), {
          email: userEmail,
          slot: selectedSlots,
          date: date.toISOString(),
          guests: selectNumber,
          restaurant: restaurant,
        });

        Alert.alert('Success', 'Your booking added successfully!');
      } 
      catch (error) {
        Alert.alert('Error', 'Something went wrong while booking.');
      }
    } 
    else if (guestStatus === 'true') {
      setFormVisible(true);
      setModalVisible(true);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      await addDoc(collection(db, 'bookings'), {
        ...values,
        slot: selectedSlots,
        date: date.toISOString(),
        guests: selectNumber,
        restaurant: restaurant,
      });

      Alert.alert('Success', 'Your booking added successfully!');
      setModalVisible(false);
      setFormVisible(false);
    } 
    catch (error) {
      Alert.alert('Error', 'Something went wrong while booking.');
    }
  };

  const handleModalClose = () => {
    setFormVisible(false);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ 
        flexDirection: selectedSlots != null ? 'row' : 'column',
        flex: 1 
      }}>
        <View style={{ 
          flex: selectedSlots != null ? 1 : 0 
        }}>
          <TouchableOpacity onPress={slotsBooking}>
            <Text style={{ 
              color: '#000000', 
              fontWeight: '600', 
              textAlign: 'center', 
              backgroundColor: '#f49b33', 
              borderRadius: 8, 
              padding: 8, 
              margin: 8, 
              marginHorizontal: 8 
            }}>
              Find Slot
            </Text>
          </TouchableOpacity>
        </View>

        {selectedSlots != null && (
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={handleBooking}>
              <Text style={{ 
                textAlign: 'center', 
                color: '#ffffff', 
                fontWeight: '600', 
                backgroundColor: '#f49b33', 
                padding: 8, 
                marginVertical: 8, 
                marginRight: 8, 
                borderRadius: 8 
              }}>
                Book slot
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {slotsVisible && (
        <View style={{ 
          flexWrap: 'wrap', 
          flexDirection: 'row', 
          padding: 8, 
          margin: 8, 
          borderRadius: 8, 
          backgroundColor: '#221f1f' 
        }}>
          {slots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              style={[
                { 
                  backgroundColor: '#f88d13', 
                  borderRadius: 8, 
                  padding: 16, 
                  margin: 12, 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                },
                selectedSlots && selectedSlots !== slot && { opacity: 0.5 }
              ]}
              onPress={() => handleSlotPress(slot)}
              disabled={selectedSlots != null && selectedSlots !== slot}
            >
              <Text style={{ color: '#ffffff', fontWeight: '600' }}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal for Guest Form */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ 
          flex: 1, 
          backgroundColor: '#00000080', 
          justifyContent: 'flex-start' 
        }}>
          <View style={{ 
            backgroundColor: '#221f1f', 
            marginHorizontal: 16, 
            borderTopLeftRadius: 8, 
            borderTopRightRadius: 8, 
            padding: 16, 
            paddingBottom: 24, 
            marginVertical: 8 
          }}>
            {formVisible && (
              <Formik
                initialValues={{ fullname: '', phone: '' }}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View style={{ width: '100%' }}>
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'flex-end', 
                      justifyContent: 'flex-end' 
                    }}>
                      <Ionicons
                        name="close-sharp"
                        size={25}
                        color={'#f49b33'}
                        onPress={handleModalClose}
                      />
                    </View>

                    <Text style={{ 
                      color: '#f49b33', 
                      fontWeight: '600', 
                      marginTop: 16, 
                      marginBottom: 8 
                    }}>
                      Name
                    </Text>
                    <TextInput
                      style={{ 
                        height: 44, 
                        borderWidth: 1, 
                        borderColor: '#ffffff', 
                        color: '#ffffff', 
                        borderRadius: 8, 
                        paddingHorizontal: 12, 
                        marginBottom: 8 
                      }}
                      onChangeText={handleChange('fullname')}
                      value={values.fullname}
                      onBlur={handleBlur('fullname')}
                    />
                    {touched.fullname && errors.fullname && (
                      <Text style={{ 
                        color: '#ef4444', 
                        fontSize: 12, 
                        marginBottom: 8 
                      }}>
                        {errors.fullname}
                      </Text>
                    )}

                    <Text style={{ 
                      color: '#f49b33', 
                      fontWeight: '600', 
                      marginTop: 16, 
                      marginBottom: 8 
                    }}>
                      Phone Number
                    </Text>
                    <TextInput
                      style={{ 
                        height: 44, 
                        borderWidth: 1, 
                        borderColor: '#ffffff', 
                        color: '#ffffff', 
                        borderRadius: 8, 
                        paddingHorizontal: 12, 
                        marginBottom: 8 
                      }}
                      keyboardType="phone-pad"
                      onChangeText={handleChange('phone')}
                      value={values.phone}
                      onBlur={handleBlur('phone')}
                    />
                    {touched.phone && errors.phone && (
                      <Text style={{ 
                        color: '#ef4444', 
                        fontSize: 12, 
                        marginBottom: 8 
                      }}>
                        {errors.phone}
                      </Text>
                    )}

                    <TouchableOpacity
                      onPress={() => handleSubmit()}
                      style={{ 
                        padding: 8, 
                        marginVertical: 8, 
                        backgroundColor: '#f49b33', 
                        borderRadius: 8, 
                        marginTop: 32 
                      }}
                    >
                      <Text style={{ 
                        fontWeight: '600', 
                        textAlign: 'center', 
                        color: '#000000' 
                      }}>
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FindSlots;
