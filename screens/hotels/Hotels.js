import React, {useState, useEffect, useCallback} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import {useFocusEffect} from '@react-navigation/native'
import firebase from 'firebase/app'
import { size } from 'lodash'

import Loading from '../../components/Loading'
import { getHotels, getMoreHotels } from '../../utils/actions'
import ListHotels from '../../components/hotels/ListHotels'

/**Funcion Hotels nos muestra en pantalla el boton plus para agregar un hotel, se recibe la navegation ya que esta en un stack */
export default function Hotels({navigation}) {
    const [user, setUser] = useState(null)
    const [startHotel, setStartHotel] = useState(null)
    const [hotels, setHotels] = useState([])
    const [loading, setLoading] = useState(false)

    const limitHotels = 10
    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo)=>{
           userInfo? setUser(true): setUser(false)
        })
    }, [])
    
    useFocusEffect(
        useCallback( ()=> {
            async function getData() {
                setLoading(true)
                const response = await getHotels(limitHotels)
                if (response.statusResponse) {
                    setStartHotel(response.startHotel)
                    setHotels(response.hotels)
                }

                setLoading(false)
            }
            getData()
        }, [])
    )
    /**Esta funcion me trae mas hoteles al hacer scroll */
    const handleLoadMore = async() => {
        if (!startHotel) {
            return
        }

        setLoading(true)
        const response = await getMoreHotels(limitHotels, startHotel)
        if (response.statusResponse) {
            setStartHotel(response.start)
            setHotels([...hotels, ...response.hotels])
        }
        setLoading(false)
    }
    if(user === null){
        return <Loading isVisible={true} text="Cargando"/>
    }

    return (
        <View style={styles.viewBody}>
            {
                size(hotels) > 0 ?(
                    <ListHotels
                        hotels={hotels}
                        navigation={navigation}
                        handleLoadMore={handleLoadMore}
                    />
                ):(
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No hay Hoteles Registrados ¡Aun!</Text>
                    </View>
                )

            }
            {   user &&
                <Icon
                type="material-community"
                name="plus"
                color="#c77e2c"
                reverse
                containerStyle={styles.btnContainer}
                onPress= {()=> navigation.navigate("add-hotel")}
                />
            }
            <Loading isVisible={loading} text="Cargando Hoteles..."/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex: 1,

    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5
    },
    notFoundView:{
        flex: 1,
        justifyContent:"center",
        alignItems:"center"
    },
    notFoundText:{
        fontSize: 18,
        fontWeight: "bold"
    }
})
