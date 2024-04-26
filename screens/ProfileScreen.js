import React from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, collection, getDocs, query, where } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [name, setName] = React.useState("");
  const [emailStaff, setEmailStaff] = React.useState("");
  const [id, setId] = React.useState("");
  const [date, setDate] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const navigation = useNavigation();

  const getUser = async (value) => {
    try {
      let userData = query(collection(db, 'users'), where('id', '==', value)); // xác định điều kiện truy vấn
      let querySnapshot = await getDocs(userData); //lấy dữ liệu

      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data()); // show dữ liệu ra ngoài: id chính => data trong id đó
        setName(doc.data().name) // lấy dữ liệu name gán vào setName
        setEmailStaff(doc.data().email)
        setDate(doc.data().date)
        setId(doc.data().id)
        setPosition(doc.data().position)
      });
    } catch (error) {
      console.log(error)
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const getData = () => {
    try {
      AsyncStorage.getItem('id')
        .then( value => {
          if (value != null) {
            setIsLoading(true);
            getUser(value);
          }
        })
    } catch (error) {
      console.log(error);
    }
  };

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem('id');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');
      await AsyncStorage.removeItem('idPatientUpload');
      await AsyncStorage.removeItem('idPatientShow');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      console.log('Đăng xuất thành công!');
    } catch (error) {
      console.log('error:', error);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image size={150} source={require('../assets/avatar_image.jpg')}/>
        <Text style={styles.textHeader}>Welcome {name}</Text>
      </View>

      <View style={styles.footer}>
        {isLoading ? (
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large" color="#92C7CF"/>
          </View>
        ) : (
        <View style={{flex: 1}}>
          <View style={styles.card}>
            <Text style={styles.text}>Email: {emailStaff}</Text>

            <Text style={styles.text}>ID: {id}</Text>

            <Text style={styles.text}>Ngày sinh: {date}</Text>

            <Text style={styles.text}>Chức vụ: {position}</Text>
          </View>
        </View>
        )}

        <TouchableOpacity style={styles.button} onPress={() => logOut()}>
          <Text style={styles.textButton}>Đăng xuất</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#DCF2F1'
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 3,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
    padding: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    elevation: 10,
  },
  card: {
    flex: 1,
    // width: 300,
    // Height: 200,
    borderColor: '#7FC7D9',
    // alignItems: 'center',
    // paddingHorizontal: 20,
    // backgroundColor: 'red',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
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
  textButton: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  textHeader: {
    marginTop: 15,
    fontSize: 28,
    fontWeight: '900',
    color: '#7FC7D9',
  },
});

export default ProfileScreen;
