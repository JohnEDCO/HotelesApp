import React from 'react'
import { StyleSheet, Text, ScrollView, Image} from 'react-native'
import Loading from '../../components/Loading'
import {Button} from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'

export default function UserGuest() {
    const navigation = useNavigation()
    return (
        <ScrollView
            centerContent
            style={styles.viewBody}
        >
            <Image
                source={require('../../assets/Dp_hotel_logo.png')}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.text}>Consulta tu perfil en DP Hoteles</Text>
            <Text style={styles.description}>
                ¿Cual seria el hotel ideal para ti? Descubre todos los hoteles disponibles que se encuentran a tu 
                alrededor, contacta con su administracion y realiza tus reservas
            </Text>
            <Button 
                buttonStyle={styles.button}
                title= "Ver tu perfil"
                onPress={()=> navigation.navigate("login")}
            />
        </ScrollView> 
    )
}

const styles = StyleSheet.create({
    viewBody: {
        marginHorizontal: 30,
    },

    image:{
        height: 300,
        width: "100%",
        marginTop: 15,
        marginBottom: 10,
    },
    text: {
        fontWeight: "bold",
        fontSize: 19,
        marginVertical: 10,
        textAlign: "center"

    },
    description: {
        textAlign: "justify",
        marginBottom:20,
        color: "gray"
    },
    button: {
        backgroundColor: "#c77e2c",
    }
})

