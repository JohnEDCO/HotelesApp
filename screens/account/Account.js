import { StyleSheet, Text, View } from 'react-native'
import React,{useState, useEffect, useCallback} from 'react'
import Loading from '../../components/Loading'
import {useFocusEffect} from '@react-navigation/native'
 
import {getCurrentUser,isUserLogged} from '../../utils/actions'
import UserLogged from './UserLogged'
import UserGuest from './UserGuest'

export default function Account() {

    const [login, setlogin] = useState(null) 
    useFocusEffect (
        useCallback(() => {
            const user = getCurrentUser()
            user ? setlogin(true): setlogin(false)
        }, [])
    )

    if(login == null){
        <Loading isVisible={true} text="Cargando..."/> 
    }
    return login ? <UserLogged/> : <UserGuest/> 
}

const styles = StyleSheet.create({})
