import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, collection, getDocs, query, where } from '../firebase';
import QRCode from 'react-native-qrcode-svg';
import React from 'react';

const PatientUserScreen = () => {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const generateUserInfoString = () => {
    return `${email},${password}`;
  };

  const getUser = async (value) => {
    try {
      const userData = query(collection(db, 'patient_users'), where('id', '==', value)); // xác định điều kiện truy vấn
      const querySnapshot = await getDocs(userData); //lấy dữ liệu
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data()); // show dữ liệu ra ngoài: id chính => data trong id đó
        setEmail(doc.data().email) // lấy dữ liệu email gán vào setEmail
        setPassword(doc.data().password)
      });
    } catch (error) {
      console.log(error)
    }
    setLoading(false);
  };

  const getData = () => {
    try {
      AsyncStorage.getItem('idPatientUpload')
        .then( value => {
          if (value != null) {
            setLoading(true);
            getUser(value);
          }
        })
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);  

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center', position:'absolute'}}>
          <ActivityIndicator size="large" color="#92C7CF"/>
        </View>
      ):(
        <View styles={{flex: 1, justifyContent:'center'}}>
          <View style={styles.header}>
            <View style={{flex: 1, maxHeight: 100}}>
              <Text style={styles.text}>Tài khoản</Text>
              <Text style={{fontFamily: 'Roboto'}}>{email}</Text>
              <Text style={styles.text}>Mật khẩu</Text>
              <Text style={{fontFamily: 'Roboto'}}>{password}</Text>
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.text}>Mã QR</Text>
              <QRCode
                value={generateUserInfoString()}
                size={170}/>
            </View>
          </View>
        </View>
      )}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCF2F1'
  },
  header: {
    flex: 1,
    borderRadius: 5,
    maxHeight: 350,
    // maxWidth: 500,
    padding: 30,
    borderColor: '#7FC7D9',
    backgroundColor: '#CAA6A6',
    // justifyContent: 'center',
  },
  text: {
    // marginTop: 5,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PatientUserScreen;