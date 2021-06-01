import { StyleSheet, Text, View } from 'react-native'
import React,{useState, useEffect} from 'react'

import {isUserLogged} from '../../utils/actions'
import UserLogged from './UserLogged'
import UserGuest from './UserGuest'

export default function Account() {

    const [login, setlogin] = useState(null) 

    useEffect(() => {
        setlogin(isUserLogged())
    }, [])

    if(login == null){
        <Text>Cargando...</Text>
    }
    
    return login ? <UserLogged/> : <UserGuest/> 
}

const styles = StyleSheet.create({})
