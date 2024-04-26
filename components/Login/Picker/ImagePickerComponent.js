import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';

const ImagePickerComponent = () => {
  const [image, setImage] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  const handleQRCode = () => {
      setScanned(true);
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  const selectImage = async () => {
  let options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
  };

  let result = await ImagePicker.launchImageLibraryAsync({options});

  if (!result.canceled) {
      console.log(result);
      handleQRCode(result.uri);
  } else {
      console.log("cancelled!");
  }
  };

  // const handleScan = async ({ data }) => {
  //   try {
  //     setScanning(false);
  //     const [email, password] = data.split(':');

  //     // Đăng nhập vào Firebase với email và mật khẩu
  //     await firebase.auth().signInWithEmailAndPassword(email, password);
      
  //     // Đăng nhập thành công, thực hiện các thao tác tiếp theo (ví dụ: điều hướng đến màn hình chính)
  //   } catch (error) {
  //     Alert.alert('Error', 'Failed to login with QR code');
  //     console.error('Failed to login with QR code', error);
  //   }
  // };

  // const renderScanner = () => (
  //   <BarCodeScanner
  //     onBarCodeScanned={handleScan()}
  //     style={{ flex: 1 }}
  //   />
  // );

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  return (
    <>
      <View style={styles.margin}>
        {/* {scanned ? renderScanner() : null} */}
        <TouchableOpacity onPress={() => navigation.navigate('Barcodescanner')}>
          <Text>Quét mã QR</Text>
        </TouchableOpacity>
        {/* <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        /> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  margin: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default ImagePickerComponent;
