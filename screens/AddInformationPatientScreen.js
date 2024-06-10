import { auth, db, storage, collection, doc, addDoc, updateDoc, query, where, getDocs, ref, uploadBytesResumable, getDownloadURL, Timestamp, uploadBytes } from '../firebase';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ViewComponent, Image, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation, createNavigationContainerRef } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import React from 'react';

const AddInformationPatientScreen = () => {
    const [imagePatient, setImagePatient] = React.useState(null);
    const [imageResult, setImageResult] = React.useState(null);
    const [prediction, setPrediction] = React.useState('');
    const [idPatient, setIdPatient] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const navigation = useNavigation();

    const getIdPatient = () => {
        try {
          AsyncStorage.getItem('idPatientShow')
            .then( value => {
              if (value != null) {
                setIdPatient(value);
              }
            })
        } catch (error) {
          console.log(error);
        }
    };

    React.useEffect(() => {
        getIdPatient();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [16, 9],
          quality: 1,
          saveToPhotos: true,
        });
    
        if (!result.canceled && result.assets.length > 0) {
            setIsLoading(true);
            const selectedImage = result.assets[0];
            const imageURI = selectedImage.uri;
            setImagePatient(imageURI);
        }
        setIsLoading(false);
    };
    
    // Chọn file
    const pickAndSendFileToServer = async () => {
        // Chọn file
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*', // Chọn mọi loại file
            multiple: true, // Cho phép lựa chọn nhiều file
        });

        console.log('result: ', result);
        
        if (!result.canceled) {
            // setIsLoading(true);
            // Thêm mỗi file vào formData
            const formData = new FormData();
            for (const file of result.assets) {
                formData.append('file', {
                    uri: file.uri,
                    name: file.name,
                    type: file.mimeType, // Sử dụng mimeType từ kết quả
                });
            }

            console.log('fromData:', formData);

            const options = {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            };

            const response = await fetch('http://192.168.42.159:5000/upload', options);

            if (response.ok) {
                console.log('Phản hồi thành công: ', response);
                const data = await response.json();
                const base64Image = data.image; // lưu dữ liệu lại
                const imageSrc = `data:image/png;base64,${base64Image}`; // uri của bức ảnh
                setImageResult(imageSrc);
                setPrediction(data.class);
            }
            setIsLoading(false);
        }
        // setIsLoading(false);
    };

    const UploadDocumentPatient = async () => {
        setIsLoading(true);
        try {
            const currenTime = Timestamp.now();
            const record = collection(db, "patient_records");
            const docRef = await addDoc( record, {
                idPatient: idPatient,
                result: prediction,
                time: currenTime,
            });
            const recordId = docRef.id;

            // Thêm trường mới vào hồ sơ
            await updateDoc(doc(record, recordId), {
                imagePathECG: `/ImagePatientECG/ECG_${recordId}.png`,
                imagePathNumericPlot: `/ImagePatientNumericPlot/Numeric_${recordId}.png`,
            });

            console.log("Thêm dữ liệu ok với id record: ", recordId);
            // setIdRecord(docRef.id);
            await UploadImages(recordId);
            navigation.goBack();
        } catch (error) {
            console.log('Lỗi upload hồ sơ bệnh nhân:', error)
        }
        setIsLoading(false);
    };

    const UploadImages = async (recordId) => {
        const ImagePatientNumericPlot = ref(storage, '/ImagePatientNumericPlot/Numeric_' + recordId + '.png');
        const ImagePatientECG = ref(storage, '/ImagePatientECG/ECG_' + recordId + '.png')
        // console.log('name and path imageNumeric:', ImagePatientNumericPlot.name, '+', ImagePatientNumericPlot.fullPath);
        // console.log('name and path imageECG:', ImagePatientECG.name, '+', ImagePatientECG.fullPath);

        await uploadBytes(ImagePatientNumericPlot, imageResult).then((snapshot) => {
            console.log('Uploaded:', ImagePatientNumericPlot.name);
        });
        await uploadBytes(ImagePatientECG, imagePatient).then((snapshot) => {
            console.log('Uploaded:', ImagePatientECG.name);
        });
    };

  return (
    <View style={styles.container}>
        {!isLoading ? (
        <SafeAreaView>
            <View style={styles.marginButton}>
                <TouchableOpacity style={styles.button} onPress={pickAndSendFileToServer}>
                <Text style={styles.textButton}>Chọn file dữ liệu</Text>
                </TouchableOpacity>
                {(!isLoading && imageResult && prediction) && (
                    <View style={{alignItems: 'center'}}>
                        <Image resizeMode="contain" source={{ uri: imageResult }} style={{ width: 380, aspectRatio: 16 / 7 }} />
                        <Text>Kết quả dự đoán: {prediction}</Text>
                    </View>
                )}
                {isLoading && (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#92C7CF"/>
                    </View>
                )}

                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.textButton}>Chụp ảnh</Text>
                </TouchableOpacity>
                {(!isLoading && imagePatient) && (
                    <View style={{alignItems: 'center'}}>
                        <Image resizeMode="contain" source={{ uri: imagePatient }} style={{ marginTop: 10, width: 380, aspectRatio: 16 / 9 }} />
                    </View>
                )}
                {isLoading && (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#92C7CF"/>
                    </View>
                )}

                <TouchableOpacity style={styles.button} onPress={UploadDocumentPatient}>
                    <Text style={styles.textButton}>Tải ảnh và file lên cơ sở dữ liệu</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        ):(
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#92C7CF"/>
            </View>
        )}
    </View>
  )
}

const styles = StyleSheet.create({ 
    containerScroolView: {
        flex: 1,
        paddingTop: 50,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#DCF2F1'
    },
    container: {
        flex: 1,
        paddingTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
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
    card: {
        flex: 1,
        // width: 300,
        // Height: 200,
        borderColor: '#7FC7D9',
        // alignItems: 'center',
        // paddingHorizontal: 20,
        // backgroundColor: 'red',
    },
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
        // marginHorizontal: 20,
        marginVertical: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowRadius: 10,
        shadowOpacity: 0.9,
        elevation: 4,
        backgroundColor: '#F7EEDD',
    },
    button: {
        color: '#7FC7D9',
        backgroundColor: '#7FC7D9',
        width: 270,
        borderRadius: 25,
        marginTop: 10,
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
    marginButton: {
        flex: 1,
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AddInformationPatientScreen;