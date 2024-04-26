import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db, collection, addDoc, query, where, getDocs } from '../firebase';
import react from 'react';

const SearchPatientScreen = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [off, setOff] = react.useState(false);
  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState(null);

  const navigation = useNavigation();

  const getDataUser = async (searchQuery) => {
    setIsLoading(true);
    try {
      let tempData = [];
      let userData = query(
        collection(db, 'patient_data'), 
        where('name', '>=', searchQuery),
        where('name', '<', searchQuery + '\uf8ff')
        ); // xác định điều kiện truy vấn
      console.log(searchQuery);
      let querySnapshot = await getDocs(userData); //lấy dữ liệu
      if (querySnapshot.empty) {
        console.log('chưa tìm thấy thông tin bệnh nhân!');
        setOff(true)
      } else {
        // console.log('----------------------------------')
        querySnapshot.forEach((doc) => {
          // console.log("Bệnh nhân:", doc.data());
          tempData.push(doc.data());
        });
        setData(tempData);
        setOff(false);
      }
    } catch (error) {
      console.log('lỗi:', error);
    }
    // console.log('data:', data);
    setIsLoading(false);
  };

const setIdAndNavigate = async (idPatient) => {
  try {
    await AsyncStorage.setItem('idPatientShow', idPatient);
    navigation.navigate('InformationPatient');
  } catch (error) {
    console.log("Lỗi setData: ", error);
  }
};

  if (error) {
    return (
      <View>
        <Text>Error in fetching data ... Please check your internet connection!</Text>
      </View>
    )
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput 
        style={styles.searchBar} 
        placeholder='tìm kiếm bệnh nhân...'
        autoCapitalize='none'
        autoCorrect={false}
        // value={searchQuery}
        onChangeText={(query) => getDataUser(query)}
      />
      <View style={styles.showListPatient}>
        {(isLoading) && (
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size="large" color="#92C7CF"/>
          </View>
        )}
        {(!isLoading && !off) && (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <TouchableOpacity style={styles.itemContainer} onPress={() => setIdAndNavigate(item.id)}>
                <View>
                  <Text style={styles.textName}>{item.name}</Text>
                  <Text style={styles.textInfo}>{item.sex}   {item.date}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#DCF2F1'
  },
  searchBar: {
    marginVertical: 10,
    marginHorizontal: 30,
    backgroundColor: 'beige',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  showListPatient: {
    flex: 1, 
    borderRadius: 12,
    marginTop: 5,
    paddingVertical: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 10,
    shadowOpacity: 0.9,
    elevation: 4,
    backgroundColor: '#DCF2F1',
  },
  Image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textName: {
    fontSize: 17,
    marginLeft: 10,
    fontWeight: "600"
  },
  textInfo: {
    fontSize: 14,
    marginLeft: 10,
    // marginHorizontal: 0,
    color: "grey",
  },
});

export default SearchPatientScreen;