import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import {Divider} from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'
import LoginForm from '../../components/account/LoginForm'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

export default function Login({navigation}) {
    
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
        marginHorizontal: 25,
        backgroundColor:"white",
        borderRadius: 30,
        width: 335,
        height: 370,
        borderWidth:2,
        borderColor: "#e2e2e5",
        borderLeftWidth: 8,
        borderLeftColor: "#e2e2e5",
        padding: 1
        
    },
    divider: {
        backgroundColor: "#d0862f",
        margin: 70,
        bottom: 100
    },
    register: {
        marginTop: 15,
        marginHorizontal: 10,
        alignSelf: "center",
        bottom: 50
    },
    btnRegister:{
        color: "#d0862f",
        fontWeight: "bold"
    }
})
