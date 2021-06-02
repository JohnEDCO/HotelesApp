import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import {Divider} from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'
import LoginForm from '../../components/account/LoginForm'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

export default function Login() {

    return (
        <KeyboardAwareScrollView >
            <Image
                source={require('../../assets/Dp_hotel_logo.png')}
                resizeMode="contain"
                style={styles.image}
            />
            <View style={styles.container}>
                <LoginForm/>
                <CreateAccount/>
            </View>
            <Divider style={styles.divider}/>
        </KeyboardAwareScrollView>
        
    )
}
function CreateAccount(props){
    const navigation = useNavigation()

    return(
        <Text 
            style={styles.register}
            onPress= {() => navigation.navigate("register")}
        >  
            ¿Aun no tienes cuenta? {' '}
            <Text style={styles.btnRegister}>
                Registrate
            </Text>
        </Text>
    )
}
const styles = StyleSheet.create({
    image:{
        height: 130,
        width: "100%",
        marginTop: 15,
        marginBottom: 20,
    },
    container: {
        marginHorizontal: 40,

    },
    divider: {
        backgroundColor: "#d0862f",
        margin: 40
    },
    register: {
        marginTop: 15,
        marginHorizontal: 10,
        alignSelf: "center"
    },
    btnRegister:{
        color: "#d0862f",
        fontWeight: "bold"
    }
})
