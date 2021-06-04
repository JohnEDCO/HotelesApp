import React,{useState, useCallback,useRef} from 'react'
import { StyleSheet, Text, View, Alert, ActivityIndicator,FlatList, TouchableOpacity} from 'react-native'
import { Button, Icon, Image } from 'react-native-elements'
import {useFocusEffect} from '@react-navigation/native'
import Toast from 'react-native-easy-toast'
import firebase from 'firebase/app'
import {size} from 'lodash'

import {getFavorites, discardFavorite} from '../utils/actions'
import Loading from '../components/Loading'

export default function Favorites({navigation}) {
    const toastRef = useRef()
    const [hotels, setHotels] = useState(null)
    const [userLogged, setUserLogged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [reloadData, setReloadData] = useState(false)
    
    firebase.auth().onAuthStateChanged((user)=>{
        user ? setUserLogged(true) : setUserLogged(false) 
    })
    /**Se me va a recargar esta funcion cada que hayan cambios en las dos variables que se le pasan (userLogged y reloadData) */
    useFocusEffect(
        useCallback(() => {
            if (userLogged) {
                async function getData() {
                    setLoading(true)
                    const response = await getFavorites()
                    setHotels(response.favorites)
                    setLoading(false)
                }
                getData()
            }
            setReloadData(false)
        }, [userLogged,reloadData])
    )

    if (!userLogged) {
        return <UserNoLogged navigation={navigation}/>
    }
    if(hotels?.length === 0){
        return <NotFoundHotels/>
    }

    return (
        <View style={styles.viewBody}>
            {
                hotels ? (
                    <FlatList
                        data={hotels}
                        keyExtractor={(item, index) => index.toString() }
                        renderItem={(hotel) => (
                            <Hotel 
                                hotel={hotel}
                                setLoading={setLoading}
                                toastRef={toastRef}
                                navigation={navigation}
                                setReloadData={setReloadData}
                            />
                        )}
                    />
                ) : (
                    <View >
                        <ActivityIndicator size="large"/>
                        <Text style={{ textAlign: "center"}}>
                            .Cargando Hoteles...
                        </Text>
                    </View>
                )
            } 
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Por favor espere..."/>
        </View>
    )
}

/**funcion que me retorna el componente para mostar el mensaje y el botono de iniciar sesion cuando el usuario no esta logueado */
function UserNoLogged({navigation}) {
    return(
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon type="material-community" name="alert-outline" size={50} color="black"/>
            <Text style={{ fontSize: 18, color: "gray",justifyContent:"center", margin: 20, marginLeft: 50, marginBottom: 10 }}>
                Debes ingresar a tu cuenta para ver favoritos

            </Text>
            <Button
                title="Iniciar Sesion"
                containerStyle={{ marginTop: 20, width: "80%" }}
                buttonStyle={{ backgroundColor: "#c77e2c", borderRadius: 10 }}
                onPress={() => navigation.navigate("account", { screen: "login" })}
            />
        </View>
    )
}

function Hotel({hotel,setLoading, toastRef,navigation, setReloadData}) {
    const {id, name, images} = hotel.item

    /**funcion que me muestra un mensaje de confirmacion para descartar de favorito un hotel */
    const confirmRemoveFavorite = () => {
        Alert.alert(
            "Descartar Hotel de favoritos",
            "¿Está seguro de descartar el hotel de favoritos?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Sí",
                    onPress: removeFavorite
                }
            ],
            { cancelable: false }
        )
    }

    /**Funcion para remover de favorito el hotel seleccionado */
    const removeFavorite = async() => {
        setLoading(true)
        const response = await discardFavorite(id)
        setLoading(false)
        if (response.statusResponse) {
            setReloadData(true)
            toastRef.current.show("Se ha descartado el hotel", 3000)

        } else {
            toastRef.current.show("Error al descartar el hotel", 3000)
        }
    }

    return(
        <View style={styles.hotel}>
            <TouchableOpacity
                onPress={() => navigation.navigate("hotels", {
                    screen: "hotel",
                    params: { id, name }
                })}
            >
                <Image
                    resizeMode="cover"
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator color="#fff"/>}
                    source={{ uri: images[0] }}
                />
                <Icon
                        type="material-community"
                        name="heart"
                        color="#f00"
                        containerStyle={styles.favorite}
                        underlayColor="transparent"
                        onPress={confirmRemoveFavorite} 
                    />
                <View style={styles.info}>
                    <Text style={styles.name}>
                        {
                            size(name) > 27 ?
                            `${name.substr(0, 27)}...`
                            : name
                        }
                    </Text>
                    
                </View>
            </TouchableOpacity>
        </View>
    )
}   

/**Funcion que me retorna el componente que muestra el mensaje cuando no se han encontrado hoteles favoritos del usuario logueado */
function NotFoundHotels() {
    return (
        <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
            <Icon  type="material-community" name="alert-outline" size={50}/>
            <Text style={{fontSize: 17, color:"gray"}}>Aun no hay favoritos</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex:1,
        backgroundColor: "#f2f2f2"
    },
    loaderHotel: {
        marginVertical: 10
    },
    hotel: {
        margin: 10
    },
    image: {
        width: "100%",
        height: 180,
        borderRadius: 30,
        borderTopLeftRadius: 0
    },
    info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: -30,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 30,
       
    },
    name: {
        fontWeight: "bold",
        fontSize: 20
    },
    favorite: {
        position: "absolute",
        marginTop: -2,
        right: 17,
        backgroundColor: "#fff",
        padding: 12,
        borderBottomRightRadius: 6,
        borderBottomLeftRadius: 6,
    } 
})
