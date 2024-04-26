import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from "./screens/LoginScreen";
// import MainScreen from "./screens/MainScreen";
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import UploadScreen from './screens/UploadScreen';
// import PatientScreen from './screens/PatientScreen';
import PatientUserScreen from './screens/PatientUserScreen';
import BarCodeScannerScreen from './screens/BarCodeScannerScreen';
import SearchPatientScreen from './screens/SearchPatientScreen';
import InformationPatientScreen from './screens/InformationPatientScreen';
import InformationPatientScreen2 from './screens/InformationPatientScreen2';
import AddInformationPatientScreen from './screens/AddInformationPatientScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import 'expo-dev-client';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        {/* Đăng ký */}
        <Stack.Screen name="Register" component={RegisterScreen}/>
        {/* Đăng nhập */}
        <Stack.Screen name="Login" component={LoginScreen}/>
        {/* Hiện nhóm Screen của nhân viên */}
        <Stack.Screen name="Staff" component={HomeStaffScreen}/>
        {/* Hiện màn hình QR code và tài khoản */}
        <Stack.Screen name="PatientUser" component={PatientUserScreen}/>
        {/* Quét mã QR */}
        <Stack.Screen name="Barcodescanner" component={BarCodeScannerScreen}/>
        {/* Thông tin bệnh nhân của Staff */}
        <Stack.Screen name="InformationPatient" component={InformationPatientScreen}/>
        {/* Thông tin bệnh nhân của Patient */}
        <Stack.Screen name="InformationPatient2" component={InformationPatientScreen2}/>
        {/* Gửi dữ liệu lên sever và cập nhật lên firebase */}
        <Stack.Screen name="AddInformationPatient" component={AddInformationPatientScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeStaffScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName='SearchPatient'
      screenOptions={{headerShown: false, tabBarShowLabel: false}}>
        {/* <Tab.Screen
          name='Main'
          component={MainScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size}/>
            ),
            headerShown: false,
          }}/> */}
        <Tab.Screen
          name='SearchPatient'
          component={SearchPatientScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-search" color={color} size={size}/>
            ),
          }}/>
        <Tab.Screen
          name='Profile'
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size}/>
            ),
            headerShown: false,
          }}/>
        <Tab.Screen
          name='UpLoad'
          component={UploadScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="file-edit-outline" color={color} size={size}/>
            ),
            headerShown: false,
          }}/>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    backgroundColor: '#DCF2F1'
  }
});
