import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, ScrollView, View, TextInput, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import * as colors from '../assets/css/Colors';
import { api_url, bold, regular } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { updateLabPatientName, updateLabPatientDob, updateLabPatientGenderId, updateLabPatientGenderName } from '../actions/LabOrderActions';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from '../components/StatusBar';
import LinearGradient from 'react-native-linear-gradient';
const { width, height, fontScale } = Dimensions.get('window');
import RNPickerSelect from 'react-native-picker-select';
import axiosInstance from './AxiosInstance';

const PatientDetails = (props) => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [gender, setGender] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const showDatepicker = () => {
    showMode('date');
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   setShow(Platform.OS === 'ios');
  //   default_date(selectedDate);
  // };

  const onChange = (event, selected) => {
    setShow(Platform.OS === 'ios'); 
    if (selected) {
      setDate(selected);
      const formatted = selected.toISOString().split('T')[0]; 
      setSelectedDate(formatted);
    }
  };

  const default_date = async (currentdate) => {
    var datetime = await ((currentdate.getDate() < 10) ? "0" : "") + currentdate.getDate() + "-"
      + (((currentdate.getMonth() + 1) < 10) ? "0" : "") + (currentdate.getMonth() + 1) + "-"
      + currentdate.getFullYear()
    props.updateLabPatientDob(datetime);
  }

  const handleBackButtonClick = () => {
    navigation.goBack()
  }

  const handleAddPatient = async () => {
    if (name == '' || relation == '' || selectedDate == null) {
      alert("Please fill the all details")
    } else if (gender == '') {
      alert('Please Reselect the Gender');
    } else {
      const data = {
        "customer_id": global.id,
        "name": name,
        "date_of_birth": selectedDate,
        "gender": gender,
        "relation": relation,
      }
      try {
        const response = await axiosInstance.post(`${api_url}customer/family-members`, data)
        console.log('Response --->', response.data);
        handleBackButtonClick();
      } catch (e) {
        console.log('Error occured : ', e);
        alert('Somthing went Please check ');
      }
    }
    console.log('check ---->', name, relation, selectedDate, gender);
  }

  const check_details = () => {
    if (props.patient_name == undefined || props.patient_dob == undefined || props.patient_gender_id == undefined) {
      alert("Please fill the details")
    } else {
      handleBackButtonClick();
    }
  }

  const relationOptions = [
    { label: 'Father', value: 'Father' },
    { label: 'Mother', value: 'Mother' },
    { label: 'Brother', value: 'Brother' },
    { label: 'Sister', value: 'Sister' },
    { label: 'Me', value: 'Me' },
  ];

  const check_box_data = [
    {
      id: 1,
      title: 'Male',
      ischecked: false,
    },
    {
      id: 2,
      title: 'Female',
      ischecked: false,
    },
    {
      id: 3,
      title: 'Others',
      ischecked: false,
    },
  ]

  const change_check_box = (id, name) => {
    setGender(name);
    props.updateLabPatientGenderId(id);
    props.updateLabPatientGenderName(name);
  }

  // const renderItem = ({ item }) => (
  //   <TouchableOpacity onPress={change_check_box.bind(this, item.id, item.title)} style={{ flexDirection: 'row', alignItems: 'center' }}>
  //     {props.patient_gender_id == item.id ?
  //       <CheckBox
  //         checkedIcon={
  //           <Icon type={Icons.Ionicons} name="radio-button-on" color={colors.theme_fg_two} style={{ fontSize: 20 }} />
  //         }
  //         uncheckedIcon={
  //           <Icon type={Icons.Ionicons} name="radio-button-off" color={colors.theme_fg_two} style={{ fontSize: 20 }} />
  //         }
  //         checked={!item.ischecked}
  //       />
  //       :
  //       <CheckBox
  //         checkedIcon={
  //           <Icon type={Icons.Ionicons} name="radio-button-on" color={colors.theme_fg_two} style={{ fontSize: 20 }} />
  //         }
  //         uncheckedIcon={
  //           <Icon type={Icons.Ionicons} name="radio-button-off" color={colors.theme_fg_two} style={{ fontSize: 20 }} />
  //         }
  //         checked={item.ischecked}
  //       />
  //     }
  //     <Text onPress={change_check_box.bind(this, item.id, item.title)} style={{ color: colors.grey, fontFamily: bold, fontSize: 14 }}>{item.title}</Text>
  //   </TouchableOpacity>
  // );

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => change_check_box(item.id, item.title)} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <CheckBox
        checkedIcon={
          <Icon type={Icons.Ionicons} name="radio-button-on" color={colors.theme_fg_two} style={{ fontSize: 20 }} />
        }
        uncheckedIcon={
          <Icon type={Icons.Ionicons} name="radio-button-off" color={colors.theme_fg_two} style={{ fontSize: 20 }} />
        }
        checked={props.patient_gender_id === item.id}
      />
      <Text style={{ color: colors.grey, fontFamily: bold, fontSize: 14 }}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={{ color: colors.theme_fg_two, fontFamily: bold, fontSize: 18 }}>Add Patient Details</Text>
        <View style={{ margin: 5 }} />
        <Text style={{ color: colors.grey, fontFamily: regular, fontSize: 12 }}>Report will be generated with this name</Text>
        <View style={{ margin: 5 }} />
        <View style={styles.textFieldcontainer}>
          <TextInput
            style={styles.textField}
            placeholder="Patient name"
            placeholderTextColor={colors.grey}
            underlineColorAndroid="transparent"
            onChangeText={text => setName(text)}
            value={props.patient_name}
          />
        </View>
        <View style={{ margin: 5 }} />
        <View style={styles.textFieldcontainer}>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={value => setRelation(value)}
              value={relation}
              placeholder={{ label: "Select Relation", value: null }}
              items={relationOptions}
              style={{
                inputIOS: styles.pickerText,
                inputAndroid: styles.pickerText,
                placeholder: {
                  color: colors.grey,
                },
              }}
              useNativeAndroidPickerStyle={false}
            />
          </View>
        </View>
        <View style={{ margin: 5 }} />

        {/* {props.patient_dob == undefined ?
          <TouchableOpacity onPress={showDatepicker} style={styles.textFieldcontainer}>
            <Text style={styles.textField}>Select your date of birth</Text>
          </TouchableOpacity>
          :
          <TouchableOpacity onPress={showDatepicker} style={styles.textFieldcontainer}>
            <Text style={styles.textField}>{props.patient_dob}</Text>
          </TouchableOpacity>
        }
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
            maximumDate={date}
          />
        )} */}

        <TouchableOpacity onPress={showDatepicker} style={styles.textFieldcontainer}>
          <Text style={styles.textField}>
            {selectedDate ? selectedDate : 'Select your date of birth'}
          </Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
            maximumDate={new Date()}
          />
        )}
        <View style={{ margin: 10 }} />
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: colors.theme_fg_two, fontFamily: bold, fontSize: 14 }}>Gender</Text>
          <View style={{ margin: 1 }} />
          <Icon type={Icons.Ionicons} name="medical" color={colors.theme_fg} style={{ fontSize: 9 }} />
        </View>
        <FlatList
          data={check_box_data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        <View style={{ margin: 10 }} />
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 0, height: 60, padding: 10, backgroundColor: colors.theme_fg_three, width: '100%' }}>
        <View style={{ width: '100%', flexDirection: 'row' }}>
          <LinearGradient colors={[colors.theme_color, colors.theme_color_One,]} style={styles.button2}>
            <TouchableOpacity onPress={() => handleAddPatient()} style={styles.button}>
              <Text style={{ fontSize: 14, color: colors.theme_fg_three, fontFamily: bold }}>Done</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  button2: {
    borderRadius: 10,
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45,
  },

  pickerWrapper: {
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    backgroundColor: '#fff',
    width: '100%'
  },

  pickerText: {
    paddingVertical: Platform.OS === 'ios' ? 0 : 10,
    color: colors.theme_fg_two,
    fontSize: 14,
    fontFamily: regular
  },
  textField: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: '#000',
  },
  textFieldIcon: {
    padding: 5
  },
  textField: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    height: 45,
    backgroundColor: colors.theme_bg_three,
    color: colors.theme_fg_two,
    fontSize: 14,
    fontFamily: regular
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    // backgroundColor:colors.theme_bg
  },
});
function mapStateToProps(state) {
  return {
    patient_name: state.lab_order.patient_name,
    patient_dob: state.lab_order.patient_dob,
    patient_gender_id: state.lab_order.patient_gender_id,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateLabPatientName: (data) => dispatch(updateLabPatientName(data)),
  updateLabPatientDob: (data) => dispatch(updateLabPatientDob(data)),
  updateLabPatientGenderId: (data) => dispatch(updateLabPatientGenderId(data)),
  updateLabPatientGenderName: (data) => dispatch(updateLabPatientGenderName(data)),

});

export default connect(mapStateToProps, mapDispatchToProps)(PatientDetails);
