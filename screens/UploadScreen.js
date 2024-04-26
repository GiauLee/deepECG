import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import React from 'react';
import { Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, storage, collection, addDoc, query, where, getDocs, ref, uploadBytesResumable, getDownloadURL, createUserWithEmailAndPassword } from '../firebase';
// import RNDateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';

const UploadScreen = () => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [sex, setSex] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [date, setDate] = React.useState('');
  const [history, setHistory] = React.useState('');
  const [isChecked, setIsChecked] = React.useState(false);
  const [formatDate, setFormaDate] = React.useState('');
  const [offShowUserPatient, setOffShowUserPatient] = React.useState(true);

  const navigation = useNavigation();

  const setData = async (user) => {
    try {
      await AsyncStorage.setItem('idPatientUpload', user.uid);
    } catch (error) {
      console.log("Lỗi setData: ", error);
    }
  };

  // thêm data bệnh nhân vào patient_data sau khi tạo tài khoản thành công
  const uploadData = async (user) => {
    try {
      // console.log('id:', user.uid, ', name:', name, ', sex:', sex, ', address:', address, ', phone', phone, ', date:', formatDate, ',history:', history);
      const doc = collection(db, "patient_data")
      const docRef = await addDoc( doc, {
        id: user.uid,
        name: name,
        sex: sex,
        address: address,
        phone: phone,
        date: formatDate,
        history: history,
        position: "Bệnh nhân",
      });
      // uploadImage(image, user);
      console.log("Thêm dữ liệu ok với id data: ", docRef.id);
      console.log("-------------------------------------------------------------------------------");
    } catch (error) {
      console.error("Lỗi thêm dữ liệu: ", error);
    }
  };

  // Thêm tài khoản bệnh nhân vào collection patient_users
  const uploadUser = async (user) => {
    try {
      const doc = collection(db, "patient_users")
      const docRef = await addDoc( doc, {
        id: user.uid,
        email: email,
        password: password,
      });
      console.log("Thêm dữ liệu ok với id.user: ", docRef.id);
    } catch (error) {
      console.error("Lỗi thêm dữ liệu: ", error);
    }
  };

  const generateRandomEmailPassword = async (number) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; //chuỗi các ký tự
    let result = ""; // biến giữ kết quả
    for (let i = 0; i < 7; i++) {
      const randomChar = chars[Math.floor(Math.random() * chars.length)]; // Chọn một ký tự ngẫu nhiên từ chuỗi
      result += randomChar; // Thêm ký tự vào kết quả
    }
    if (number == 0) {
      result += '@gmail.com';
    }

    return result; // Trả về kết quả
  };

  const createUser = async () => {
    if (name.length == 0 || sex.length == 0 || address.length == 0 || phone.length == 0 || date.length == 0 || history.length == 0) {
      Alert.alert('Thông báo','Xin vui lòng điền đầy đủ thông tin!');
      return
    } else {
      let e = await generateRandomEmailPassword(0);
      let p = await generateRandomEmailPassword(1);
  
      console.log("e: ", e);
      console.log("p: ", p);
  
      // Gọi hàm callback hoặc sử dụng useEffect để tránh bị delay của useState
      setEmail(e);
      setPassword(p);
  
      console.log("email: ", email);
      console.log("password: ", password);
    }
  };

  React.useEffect(() => {
    if (email.length != 0 && password.length != 0) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (value) => {
          const user = value.user; // lấy thông tin người dùng
          console.log(user); // trả về thông tin trên terminal
          console.log("Đăng ký thành công với id user: ", user.uid);
          console.log("create email:", email);
          console.log("create password:", password);

          uploadUser(user);
          uploadData(user);

          setData(user);
          setOffShowUserPatient(false);
          setEmail('');
          setPassword('');
          setName('');
          setSex('');
          setAddress('');
          setPhone('');
          setDate('');
          setHistory('');

          Alert.alert('Thông báo', 'Đăng ký thành công!');

          navigation.navigate("PatientUser", {idPatient: user.uid});
        })
        .catch((error) => {
          console.log("Đăng ký thất bại", error);
          Alert.alert('Thông báo', 'Đăng ký không thành công!');
        });
    }
  }, [email, password]);

  const showPatientUser = () => {
    navigation.navigate("PatientUser");
  };

  React.useEffect(() => {
    const changeDate = () => {
      if (date.length != '') {
        const dateObject = new Date(date);
        const formattedDate = dateObject.toISOString().split('T')[0]; // Lấy ngày tháng năm
        console.log(formattedDate); // Kết quả: "2000-12-23"
        setFormaDate(formattedDate);
      } else {
        return
      }
    };
    console.log(date);
    changeDate();
  }, [date]);

  const showDateTimePicker = () => {
    setIsChecked(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.textHeader}>Hồ sơ bệnh nhân</Text>
        <View style={styles.marginInput}>
          {/* Name */}
          <TextInput 
            value= {name}
            onChangeText={text => setName(text)} 
            placeholder='Họ tên' 
            style={styles.input} />

          <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
            <Checkbox
              status={sex == 'Nam' ? 'checked' : 'unchecked'}
              onPress={() => {setSex('Nam')}}
            />
            <Text>Nam</Text>

            <Checkbox
              status={sex == 'Nữ' ? 'checked' : 'unchecked'}
              onPress={() => {setSex('Nữ')}}
            />
            <Text>Nữ</Text>

            <TouchableOpacity style={styles.buttonDate} onPress={() => showDateTimePicker()}>
              <FontAwesome name="calendar" size={18} color="black"/>
            </TouchableOpacity>
            <Text>{formatDate}</Text>

            {isChecked && (
              <RNDateTimePicker 
                mode='date' 
                display='spinner' 
                value={new Date()}
                onChange={(event, date) => {
                  setIsChecked(false);
                  if (date) {
                    setDate(date);
                  }
                }}
              /> 
            )}
            
          </View>
          {/* Email */}
          <TextInput 
            value= {address}
            onChangeText={text => setAddress(text)} 
            placeholder='Địa chỉ' 
            style={styles.input} />
          {/* Password */}
          <TextInput 
            value= {phone}
            onChangeText={text => setPhone(text)} 
            placeholder='Điện thoại' 
            keyboardType='numeric'
            style={styles.input} />

          <TextInput 
            value= {history}
            multiline={true}
            numberOfLines={5}
            onChangeText={text => setHistory(text)} 
            placeholder='Tiền sử bệnh lý' 
            style={styles.input} />
        </View>

        {/* Button Upload */}
        <View style={styles.marginButton}>
            <TouchableOpacity style={styles.button} onPress={createUser}>
              <Text style={styles.textButton}>Lưu hồ sơ</Text>
            </TouchableOpacity>
        </View>

        {/* Button Show PatientData */}
        {!offShowUserPatient && (
          <View style={styles.marginButton}>
            <TouchableOpacity style={styles.button} onPress={showPatientUser}>
              <Text style={styles.textButton}>Tài khoản đã tạo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#DCF2F1',
  },
  card: {
    flex: 1,
    // borderRadius: 25,
    // borderColor: '#7FC7D9',
    padding: 5,
    marginTop: 20,
    marginBottom: 50,
  },
  marginInput: {
    marginTop: 5,
    justifyContent: 'center'
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    backgroundColor: '#E5E1DA',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 2,
    elevation: 3
  },
  textHeader: {
    fontSize: 30,
    fontWeight: '900',
    color: '#7FC7D9'
  },
  marginButton :{
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    color: '#7FC7D9',
    backgroundColor: '#7FC7D9',
    width: 270,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    elevation: 5
  },
  buttonDate: {
    color: '#7FC7D9',
    backgroundColor: '#7FC7D9',
    marginLeft: 30,
    marginRight: 10,
    // width: 270,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    elevation: 5
  },
  image: {
    marginTop: 5,
  },
  textButton: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default UploadScreen