import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

// import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, collection, addDoc, createUserWithEmailAndPassword } from '../firebase';

const RegisterScreen = () => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [name, setName] = React.useState('')
    const [date, setDate] = React.useState('')

    const navigation = useNavigation();

    const handleSignUp = async () => {
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user; // lấy thông tin người dùng
                console.log(user)
                console.log("Đăng ký thành công!")

                add(user);
                Alert.alert('Thông báo', 'Đăng ký thành công!')
                navigation.goBack()
            })
            .catch((error) => {
                console.log("Đăng ký thất bại", error)
                Alert.alert('Thông báo', 'Đăng ký không thành công!')
            });
    }

    const add = async (user) => {
        try {
            const docRef = await addDoc(collection(db, "users"), {
                id: user.uid,
                name: name,
                date: date,
                email: email,
                password: password,
                position: "nhân viên y tế",
            })
            console.log("Thêm dữ liệu ok với ID: ", docRef.id);
        } catch (error) {
            console.error("Lỗi thêm dữ liệu: ", error);
        }
    };

    const buttonSave = () => {
        if (email.length == 0 || password.length == 0 || name.length == 0 || date.length == 0) {
            Alert.alert('Thông báo', 'Hãy điền đầy đủ thông tin!')
            return
        }
        handleSignUp();
    }

  return (
    <View style={styles.container}>
        {/* Login */}
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.textHeader}>Đăng ký</Text>
            </View>

            <View style={styles.footer}>
                {/* Input */}
                <View style={styles.marginInput}>
                    {/* Name */}
                    <TextInput 
                        value= {name}
                        onChangeText={text => setName(text)} 
                        placeholder='Name' 
                        style={styles.input} />
                    {/* Date */}
                    <TextInput 
                        value= {date}
                        onChangeText={text => setDate(text)} 
                        placeholder='Date' 
                        style={styles.input} />
                    {/* Email */}
                    <TextInput 
                        value= {email}
                        onChangeText={text => setEmail(text)} 
                        placeholder='Email' 
                        style={styles.input} />
                    {/* Password */}
                    <TextInput 
                        value= {password}
                        secureTextEntry = {true} // che mật khẩu
                        onChangeText={text => setPassword(text)} 
                        placeholder='Password' 
                        style={styles.input} />
                    
                </View>
                {/* Button Register */}
                <View style={styles.marginButton}>
                    <TouchableOpacity style={styles.button} onPress={buttonSave}>
                        <Text style={styles.textButton}>Đăng Ký</Text>
                    </TouchableOpacity>
                </View>
                {/* Question */}
                <View style={styles.marginRegister}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text>Đã có tài khoản? Đăng nhập nào!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 40,
        justifyContent: 'center',
        backgroundColor: '#DCF2F1'
    },
    card: {
        flex: 1,
        width: 300,
        maxHeight: 500,
        borderRadius: 25,
        borderColor: '#7FC7D9',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        elevation: 5
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
        justifyContent: 'center'
    },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
        backgroundColor: '#E5E1DA',
        borderRadius: 20
    },
    marginButton :{
        marginTop: 15,
        justifyContent: 'center'
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
        elevation: 5
    },
    textButton: {
        fontWeight: 'bold',
        fontSize: 18
    },
    marginRegister: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default RegisterScreen