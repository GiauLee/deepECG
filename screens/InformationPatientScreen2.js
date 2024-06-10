import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, createNavigationContainerRef } from '@react-navigation/native';
import { auth, db, storage, collection, addDoc, query, where, getDocs, ref, uploadBytesResumable, getDownloadURL } from '../firebase';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ViewComponent, FlatList } from 'react-native';

const InformationPatientScreen2 = () => {

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [date, setDate] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [off, setOff] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const navigation = useNavigation();

    const getIdPatient = () => {
        try {
          AsyncStorage.getItem('idPatientShow')
            .then( value => {
              if (value != null) {
                getInfoPatient(value);
              }
            })
        } catch (error) {
          console.log(error);
        }
    };
    
    const getInfoPatient = async (value) => {
        setIsLoading(true);
        const dataInfo = [];
        try {
            const dataPatient = query(collection(db, 'patient_data'), where('id', '==', value)); // xác định điều kiện truy vấn
            const userPatient = query(collection(db, 'patient_users'), where('id', '==', value));
            const infoPatient = query(collection(db, 'patient_records'), where('idPatient', '==', value));
            // const record = query(collection(db, 'patient_records'), where('idPatient', '==', value));

            const querySnapshotDate = await getDocs(dataPatient); //lấy dữ liệu
            const querySnapshotUser = await getDocs(userPatient);
            const querySnapshotPatient = await getDocs(infoPatient);
            // const querySnapshotRecord = await getDocs(record);

            querySnapshotDate.forEach((doc) => {
              console.log(doc.id, "=>", doc.data()); // show dữ liệu ra ngoài: id chính => data trong id đó
            //   patientData = doc.data();
              setName(doc.data().name); // lấy dữ liệu name gán vào setName
              setDate(doc.data().date);
              setAddress(doc.data().address);
            });
            querySnapshotUser.forEach((doc) => {
                setEmail(doc.data().email);
            })
            
            if (querySnapshotPatient.empty) {
                console.log('chưa tìm thấy thông tin hồ sơ của bệnh nhân!');
                setOff(true);
            } else {
                querySnapshotPatient.forEach((docInfo) => {
                    console.log(docInfo.id, "=>", docInfo.data()); // show dữ liệu ra ngoài: id chính => data trong id đó
                    
                    const timeData = docInfo.data().time;
                    const seconds = timeData.seconds;
                    const dateObject = new Date(seconds * 1000); // Chuyển đổi thành đối tượng Date

                    dataInfo.push({
                        id: docInfo.id,
                        time: dateObject,
                        idPatient: docInfo.data().idPatient,
                        imagePathECG: docInfo.data().imagePathECG,
                        imagePathNumericPlot: docInfo.data().imagePathNumericPlot,
                        result: docInfo.data().result,
                    });

                });

                setData(dataInfo);
                console.log('data:', data);
                setOff(false);
            }

        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
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
        getIdPatient();
    }, []);

  return (
    <View style={{flex: 1}}>
    {!isLoading ? (
    <View style={styles.container}>
        <View style={styles.header}>
            <View>
                <Text style={styles.textHeader}>Thông tin bệnh nhân</Text>
            </View>
            
            <View style={{flex: 1, paddingHorizontal: 20}}>
                <Text style={styles.textLarge}>Họ tên</Text>
                {(name == null || address == '') ? (
                    <Text style={styles.text}>Chưa có</Text>
                ) : (
                    <Text style={styles.text}>{name}</Text>
                )}
                
                <Text style={styles.textLarge}>Email</Text>
                {(email == null || address == '') ? (
                    <Text style={styles.text}>Chưa có</Text>
                ) : (
                    <Text style={styles.text}>{email}</Text>
                )}

                <Text style={styles.textLarge}>Ngày sinh</Text>
                {(date == null || address == '') ? (
                    <Text style={styles.text}>Chưa có</Text>
                ) : (
                    <Text style={styles.text}>{date}</Text>
                )}

                <Text style={styles.textLarge}>Nơi sinh</Text>
                {(address == null || address == '') ? (
                    <Text style={styles.text}>Chưa có</Text>
                ) : (
                    <Text style={styles.text}>{address}</Text>
                )}
            </View>
        </View>

        <View style={styles.footer}>
            <View style={styles.showListPatient}>
                <Text style={styles.textHeader}>Thời điểm khám bệnh</Text>
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
                    <View style={styles.card}>
                        
                        <View style={styles.itemContainer}>
                            <Text style={styles.textLarge}>Mã hồ sơ:</Text>
                            <Text style={styles.text}>{item.id}</Text>
        
                            <View style={{flexDirection:'row'}}>
                                <View style={{marginRight: 50}}>
                                    <Text style={styles.textLarge}>Thời gian: </Text>
                                    <Text style={{ fontSize: 15, fontWeight: '400',}}>{item.time.toLocaleDateString()}</Text>
                                    <Text style={styles.text}>{item.time.toLocaleTimeString()}</Text>
                                </View>
        
                                <View>
                                    <Text style={styles.textLarge}>Kết quả: </Text>
                                    <Text style={styles.text}>{item.result}</Text>
                                </View>
                            </View>
                        </View>

                    </View>
                    )}
                />
                )}
            </View>

            <View style={{ position: 'absolute', bottom: 525, left: 0, marginLeft: 35 }}>
                <TouchableOpacity
                    onPress={() => logOut()}
                    style={{
                        backgroundColor: '#7FC7D9',
                        width: 120,
                        height: 40,
                        borderRadius: 13,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: 'center',
                            color: 'white',
                        }}>
                        Đăng xuất
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    </View>
    ) : (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color="#92C7CF"/>
        </View>
    )}
    </View>
  );
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        paddingTop: 30,
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#DCF2F1'
    },
    header: {
        flex: 2,
        paddingHorizontal: 20,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    footer: {
        flex: 3,
        backgroundColor: 'white',
        paddingTop: 10,
        paddingHorizontal: 20,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        elevation: 10,
    },
    // card: {
    //     flex: 1,
    //     // width: 300,
    //     // Height: 200,
    //     borderColor: '#7FC7D9',
    //     // alignItems: 'center',
    //     // paddingHorizontal: 20,
    //     // backgroundColor: 'red',
    // },
    textLarge: {
        // marginBottom: 5,
        fontSize: 17,
        fontWeight: "600",
    },
    text: {
        fontSize: 15,
        fontWeight: '400',
        marginBottom: 8,
    },
    textHeader: {
        // marginTop: 15,
        marginVertical: 15,
        fontSize: 28,
        fontWeight: '900',
        color: '#7FC7D9',
    },
    loading: {
        flex: 1, 
        // ...StyleSheet.absoluteFillObject,
        // position: 'absolute', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'DCF2F1',
        // zIndex: 999,
    },
    itemContainer: {
        // flexDirection: 'row',
        // alignItems: 'center',
        borderRadius: 12,
        marginHorizontal: 10,
        marginVertical: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowRadius: 10,
        shadowOpacity: 0.9,
        elevation: 4,
        backgroundColor: '#F7EEDD',
    },
    showListPatient: {
        flex: 1, 
        borderRadius: 12,
        marginTop: 5,
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
});

export default InformationPatientScreen2;