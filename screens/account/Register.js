import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import RegisterForm from '../../components/account/RegisterForm'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

export default function Register() {
    return (
        <KeyboardAwareScrollView>
            <Image
                source={require('../../assets/Dp_hotel_logo.png')}
                resizeMode="contain"
                style={styles.image}
            />
            <RegisterForm />
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    image:{
        height: 130,
        width: "100%",
        marginTop: 15,
        marginBottom: 20,
    },
})
