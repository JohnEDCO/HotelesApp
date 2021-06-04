import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import {Button} from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'
import Toast from 'react-native-easy-toast'

import { closeSession, getCurrentUser } from '../../utils/actions'
import Loading from '../../components/Loading'
import InfoUser from '../../components/account/InfoUser'
import AccountOptions from '../../components/account/AccountOptions'

export default function UserLogged() {
    const toastRef = useRef()
    const navigation = useNavigation()

    const [loading, setloading] = useState(false)
    const [loadingText, setloadingText] = useState("")
    const [user, setUser] = useState(null)
    const [relodUser, setRelodUser] = useState(false)

    useEffect(() => {
        setUser(getCurrentUser())
        setRelodUser(false)
    }, [relodUser])

    return (
        <ScrollView style={styles.container}>
            {
                user && (
                    <View>
                        <InfoUser 
                           user={user} 
                           setloading={setloading} 
                           setloadingText = {setloadingText}
                        />
                        <AccountOptions
                            user= {user}
                            toastRef= {toastRef}
                            setRelodUser={setRelodUser}
                        />
                    </View>
                    )
            }
            <Button
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionTitle}
                onPress = {() => {
                    closeSession()
                    navigation.navigate('hotels')
                }}
                icon={{
                    type: "material-community",
                    name: "logout",
                    color:"#c77e2c",
                    size: 60
                }}
            />
            <Toast
                ref={toastRef}
                position="center"
                opacity={0.9}
            />
            <Loading
                isVisible= {loading}
                text={loadingText}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight:"100%",
        backgroundColor: "#f9f9f9"
    },
    btnCloseSession: {
        alignItems: "center",
        backgroundColor:"transparent",
        margin: 250,
        marginTop: 20,
        marginLeft: 65,
        right: -80
    },
    btnCloseSessionTitle: {
        color: "#c77e2c",

    }
})
