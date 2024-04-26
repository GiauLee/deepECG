import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, Button, ActivityIndicator } from 'react-native';
import { CameraView, Camera } from "expo-camera/next";
import { useNavigation } from '@react-navigation/native';
// import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithEmailAndPassword } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BarCodeScannerScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [again, setAgain] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const getCameraPermissions = async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === "granted");
        };
    
        getCameraPermissions();
    }, []);

    const setData = async (user, email, password) => {
        try {
            await AsyncStorage.setItem('idPatientShow', user.uid);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);
        } catch (error) {
            console.log("Lỗi setData: ", error);
        }
    };

    const handleScan = async ({ type, data }) => {
        try {
            setIsLoading(true);
            console.log('data QR: ',data);
            const [email, password] = data.split(',');
            console.log('email and password: ', email, password);
        
            await signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    setScanned(true);
                    const user = userCredential.user;
                    setData(user, email, password);
                    console.log("Đăng nhập thành công: ", user.uid);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'InformationPatient2' }],
                    });
                    Alert.alert('Đăng nhập thành công', 'Chào mừng bạn đến với ứng dụng!');
                })
                .catch(error => {
                    console.log(error);
                    setAgain(true);
                })
            
        } catch (error) {
            Alert.alert('Error', 'Failed to login with QR code');
            console.error('Failed to login with QR code', error);
        }
        setIsLoading(false);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    if (isLoading) {
        return (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#92C7CF"/>
          </View>
        )
    };

    return (
        <View style={styles.margin}>
            {(!scanned) && (
                <CameraView
                onBarcodeScanned={scanned ? undefined : handleScan}
                barcodeScannerSettings={{
                barcodeTypes: ["qr", "pdf417"],
                }}
                style={{flex: 0.5}}
                />
            )}
            {again && (
                <Button title={"Tap to Scan Again"} onPress={() => {setScanned(false), setAgain(false)}} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    margin: {
        flex: 1,
        // paddingTop: 40,
        // paddingHorizontal: 40,
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#DCF2F1'
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
    scanAgain: {
        flex: 1,
        position: 'absolute',
    },
});

export default BarCodeScannerScreen;