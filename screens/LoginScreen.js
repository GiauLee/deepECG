import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, createNavigationContainerRef } from '@react-navigation/native';
import React from 'react';
import ImagePickerComponent from '../components/Login/Picker/ImagePickerComponent';
// import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from '@expo/vector-icons';
import { auth, db, collection, addDoc, query, where, getDocs, signInWithEmailAndPassword } from '../firebase';

// import input from '../components/Login/Input/input';

const LoginScreen = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);
    const [emailMissing, setEmailMissing] = React.useState(false);
    const [passwordMissing, setPasswordMissing] = React.useState(false);

    const navigation = useNavigation();

    const setDataStaff = async (user) => {
        try {
            await AsyncStorage.setItem('id', user.uid);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);
        } catch (error) {
            console.log("Lỗi setData: ", error);
        }
    };

    const setDataPatient = async (user) => {
        try {
            await AsyncStorage.setItem('idPatientShow', user.uid);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);
        } catch (error) {
            console.log("Lỗi setData: ", error);
        }
    };

    const checkLogin = async () => {
        if (email.length == 0 || password.length == 0) {
            if (email.length == 0) {
                setEmailMissing(true);
            } else {
                setEmailMissing(false);
            }
    
            if (password.length == 0) {
                setPasswordMissing(true);
            } else {
                setPasswordMissing(false);
            }

            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!');
        } else {
            handleLogin();
        }

    };

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            const user = userCredential.user; // lấy thông tin người đăng nhập thông qua đối tượng userCredential, còn có thuộc tính khác mà chỉ lấy user thôi
            const userData = query(collection(db, 'patient_data'), where('id', '==', user.uid)); // tìm trong patient_data thông tin của user có id đó
            const doc = await getDocs(userData); // Sử dụng await ở đây để lấy dữ liệu đã truy vấn được
            
            if (doc.empty) { // Kiểm tra nếu trong patient_data trống thì chuyển giao diện staff và ngược lại, chuyển qua patient
                console.log('This is staff!');
                setDataStaff(user);
                navigation.replace('Staff');
            } else {
                console.log('This is patient!');
                setDataPatient(user);
                navigation.replace('InformationPatient2');
            }
            setEmailMissing(false);
            setPasswordMissing(false);
            setEmail('');
            setPassword('');

            Alert.alert('Đăng nhập thành công', 'Chào mừng bạn đến với ứng dụng!');
            console.log("Đăng nhập thành công");
        } catch (error) {
            console.log(error);
            setEmailMissing(true);
            setPasswordMissing(true);
            Alert.alert('Đăng nhập không thành công', 'Vui lòng nhập lại!');
        }
        setIsLoading(false);
    };

    checkLoginStatus = async () => {
        try {
            const userEmail = await AsyncStorage.getItem('email');
            const userPassword = await AsyncStorage.getItem('password');
            if (userEmail != null && userPassword != null) {
                console.log('emai, password: ', userEmail, userPassword);
                const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);

                const user = userCredential.user; // lấy thông tin người đăng nhập thông qua đối tượng userCredential, còn có thuộc tính khác mà chỉ lấy user thôi
                const userData = query(collection(db, 'patient_data'), where('id', '==', user.uid)); // tìm trong patient_data thông tin của user có id đó
                const doc = await getDocs(userData); // Sử dụng await ở đây để lấy dữ liệu đã truy vấn được
                
                if (doc.empty) { // Kiểm tra nếu trong patient_data trống thì chuyển giao diện staff và ngược lại, chuyển qua patient
                    console.log('This is staff!');
                    // setData(user);
                    navigation.replace('Staff');
                } else {
                    console.log('This is patient!');
                    // setData(user);
                    navigation.replace('InformationPatient2');
                }
                setEmailMissing(false);
                setPasswordMissing(false);
    
                // Alert.alert('Đăng nhập thành công', 'Chào mừng bạn đến với ứng dụng!');
                console.log("Đăng nhập thành công");

                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error); 
            setEmailMissing(true);
            setPasswordMissing(true);
            setIsLoading(false);
            Alert.alert('Đăng nhập không thành công', 'Vui lòng nhập lại!');
        }
    }

    React.useEffect(() => {
        checkLoginStatus();
    }, [])

  return (
    <View style={{flex: 1}}>
    {(!isLoading) ? (
            <View style={styles.container}>
            <View style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.textHeader}>Đăng nhập</Text>
                </View>

                <View style={styles.footer}>
                    {/* Input */}
                    <View style={styles.marginInput}>
                        <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <TextInput 
                                onChangeText={text => setEmail(text)} 
                                placeholder='Email' 
                                style={styles.input} />
                            {(emailMissing) && <FontAwesome6 name="triangle-exclamation" size={20} color="red" position='absolute'/>}
                        </View>

                        <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <TextInput 
                                onChangeText={text => setPassword(text)} 
                                placeholder='Password' 
                                style={styles.input} 
                                secureTextEntry = {true} />
                            {(passwordMissing) && <FontAwesome6 name="triangle-exclamation" size={20} color="red" position='absolute'/>}
                        </View>
                    </View>
                    {/* Button Login */}
                    <View style={styles.marginButton}>
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={checkLogin}>
                            <Text style={styles.textButton}>Đăng Nhập</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Question */}
                    <View style={styles.marginRegister}>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text>Chưa có tài khoản? Đăng ký thôi!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Barcodescanner')}>
                            <Text>Quét mã QR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    ):(
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
        paddingTop: 40,
        paddingHorizontal: 40,
        justifyContent: 'center',
        backgroundColor: '#DCF2F1',
        position: 'relative',
    },
    card: {
        flex: 1,
        width: 300,
        maxHeight: 370,
        borderRadius: 25,
        borderColor: '#7FC7D9',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        elevation: 5
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
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textHeader: {
        fontSize: 30,
        fontWeight: '900',
        color: '#7FC7D9'
    },
    footer: {
        flex: 2
    },
    marginInput: {
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
        marginRight: 25,
        backgroundColor: '#E5E1DA',
        borderRadius: 20,
        width: 250,
    },
    marginButton :{
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        color: '#7FC7D9',
        backgroundColor: '#7FC7D9',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        elevation: 5,
        width: 180,
    },
    textButton: {
        fontWeight: 'bold',
        fontSize: 18
    },
    marginRegister: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default LoginScreen;