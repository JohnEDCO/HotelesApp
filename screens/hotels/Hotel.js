import React, {useState, useCallback, useRef,useEffect} from 'react'
import { StyleSheet, Dimensions,Text, View, Alert,ScrollView } from 'react-native'
import { Rating, ListItem, Icon, Card, Button } from 'react-native-elements'
import {useFocusEffect} from '@react-navigation/native'
import { map } from 'lodash'
import Toast from 'react-native-easy-toast'
import firebase from 'firebase/app'
import Loading from '../../components/Loading'

import CarrouselImages from '../../components/CarrouselImages'
import ListComment from '../../components/hotels/ListComment'
import { addDocumentWithoutId, getCurrentUser, getDocumentById, getIsFavorite, discardFavorite } from '../../utils/actions'
import { formatPhone } from '../../utils/helpers'

const widthScreen = Dimensions.get("window").width

export default function Hotel({navigation, route}) {
    const {id, name} = route.params
    const toastRef = useRef()

    const [hotel, setHotel] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
    const [userLogged, setUserLogged] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const [loading, setLoading] = useState(false)

    /**Verifico que haya un usuario loggueado, porque de lo contrario no podria hacer comentarios */
    firebase.auth().onAuthStateChanged((user)=>{
        user? setUserLogged(true): setUserLogged(false)
    })

    /**envio a la pantalla de navegacion el nombre del Hotel seleccionado */
    navigation.setOptions({title: name})

    useFocusEffect(
        useCallback(() => {
            (async() =>{
                const response = await getDocumentById("hotels", id)
                if(response.statusResponse){
                    setHotel(response.document)
                }else{
                    setHotel({})
                    Alert.alert("Error al cargar el hotel. Intenta nuevamente")
                }
            })()
    
        }, [])
    )
    
    useEffect(() => {
        (async() => {
            if (userLogged && hotel) {
                const response = await getIsFavorite(hotel.id)
                response.statusResponse && setIsFavorite(response.isFavorite)
            }
        })()
    }, [userLogged, hotel])

    /**funcion tipo flecha para adicionar a favorito un e */
    const addFavorite = async()=>{
        if(!userLogged){
            toastRef.current.show("Para agregar a favoritos debes iniciar sesion", 3000)
            return
        }
        setLoading(true)
        const response = await addDocumentWithoutId("favorites", {
            idUser: getCurrentUser().uid,
            idHotel: hotel.id
        })
        setLoading(false)
        if(response.statusResponse){
            setIsFavorite(true)
            toastRef.current.show("Añadido a favoritos",3000)    
            setLoading(false)
        }else{
            toastRef.current.show("No se pudo agregar a favoritos, intenta nuevamente", 3000)    
        }
    }
    /**funcion tipo flecha para remover de favoritos un e */
    const removeFavorite = async()=>{

        setLoading(true)
        const response = await discardFavorite(hotel.id)
        setLoading(false)

        if (response.statusResponse) {
            setIsFavorite(false)
            toastRef.current.show("Descartado de favoritos", 3000)
        } else {
            toastRef.current.show("No se puedo descartar, intenta nuevamente porfavor", 3000)
        }
    }

    if(!hotel){
        return <Loading isVisible={true} text="Cargando..."/>
    }
    return (
        <ScrollView style={styles.viewBody}>
            <CarrouselImages 
                images={hotel.images}
                height={250}
                width={widthScreen}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
                style={{borderRadius: 20}}
            />
            <View style={styles.viewFavorite}>
                <Icon
                    iconStyle={styles.iconFavoriteStyle}
                    type = "material-community"
                    name={isFavorite ? "heart": "heart-outline" }
                    onPress={ isFavorite ? removeFavorite : addFavorite}
                    color= "red"
                    size={30}
                    underlayColor = "transparent"
                />
            </View>
            <Card containerStyle={styles.cardContainer}>
                <Card.Title style={styles.cardTitle}>{hotel.name}</Card.Title>
                <Card.Divider style={{backgroundColor:"#c77e2c"}}/>
                <TitleHotel
                    name={"Descripcion"}
                    description={hotel.description}
                    rating={hotel.rating}
                />
                <HotelInfo
                    name={hotel.name}
                    address={hotel.address}
                    phone={formatPhone(hotel.phone)}
                />
            </Card>
            {
                    !userLogged &&(
                        <Text 
                            style={styles.mustLoginText}
                            onPress={() => navigation.navigate("login")}
                        >
                            Para comentar debes iniciar sesion con tu cuenta.{" "}
                            <Text style={styles.loginText}>
                                Iniciar Sesion
                            </Text>
                        </Text>
                            )
            }   
            <Card containerStyle={styles.cardContainer}>
                <View style={styles.viewCardComment}>
                    <Card.Title style={styles.cardTitleComments}>
                        Comentarios
                    </Card.Title>
                        {
                            userLogged &&(
                                <Card.Title style={styles.cardBtnComment}>
                                    <Button 
                                        buttonStyle= {styles.btnComment}
                                        titleStyle={styles.btnTitleAddComment}
                                        onPress={()=> navigation.navigate("add-comment-hotel", {idHotel: hotel.id})}
                                        icon={{
                                            type: "material-community",
                                            name: "square-edit-outline",
                                            color:"white"
                                        }}
                                    />
                                </Card.Title>
                            )
                        }    
                   
                </View>

                <Card.Divider style={{backgroundColor:"#c77e2c"}}/>
                <ListComment
                    navigation={navigation}
                    idHotel={hotel.id}
                />
            </Card>
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Cargando..."/>
        </ScrollView>
    )
}
/**Funcion que me retorna los componentes para mostrar la informacion de contacto del hotel */
function HotelInfo({name, address, phone}){
    const listInfo =[
        {text: address, iconName: "map-marker"},
        {text: phone, iconName: "phone"},
    ]
    return(
        <View style={styles.viewHotelInfo}>
            <Text style={styles.hotelInfoTitle}>
                Informacion de contacto
            </Text>
            {
                map(listInfo, (item, index) =>(
                    <ListItem
                        key={index}
                        style={styles.containerListItem}
                    >
                        <Icon
                            type="material-community"
                            name={item.iconName}
                            color="#c77e2c"
                        />
                        <ListItem.Content>
                            <ListItem.Title>{item.text}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))
            }
            
        </View>
    )
}
/**Funcion que me muestra los componentes con la informacion de titulo, descripcion y calificacion del hotel */
function TitleHotel({name, description, rating}) {
    return (
        <View style={styles.viewHotelTitle}>
            <View style={styles.viewHotelContainer}>
                <View style={styles.viewRating}>
                    <Rating 
                        style= {styles.rating} 
                        imageSize={20}
                        readonly
                        startingValue={parseFloat(rating)}
                    />
                    <Text style={styles.ratingText}>{rating.toFixed(1)} / 5</Text>
                </View>
                
                <Text style={styles.nameHotel}>{name}</Text>
                <Text style={styles.descriptionHotel}>{description}</Text>
            </View>
        </View> 
    )
}  

const styles = StyleSheet.create({
    viewBody: {
        zIndex:1,
        flex: 1,
        backgroundColor: "#Efefef"
    },
    viewHotelTitle:{
        padding: 15,
    },
    viewHotelContainer: {
        flexDirection: "column"
    },
    descriptionHotel:{
        marginTop: 10,
        color: "gray",
        textAlign: "justify"
    },
    nameHotel: {
        fontWeight: "bold",
        color: "black"
    }, 
    rating: {
        marginTop: -15,
        marginBottom: 10,
        marginLeft: 60,
        position:"relative",
        right: 65 
    },
    viewHotelInfo: {
        margin: 15,
        marginTop: 25
    },
    hotelInfoTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom:15
    },
    containerListItem: {
        borderBottomColor: "#f3c970",
        borderBottomWidth: 0.7
    },
    cardContainer: {
        borderRadius: 30,
        marginBottom: 20,
        marginTop: -10,
        borderColor: "#DBCBB9"
    },
    viewCardComment:{
        flexDirection:"row",
        marginBottom: -25
    },
    cardBtnComment:{
        alignContent: "flex-end",
        marginLeft: 55,
        top: -5
    },
    cardTitle: {
        fontWeight: "bold",
        textAlign: "center",
        marginLeft:15,
        fontSize: 18
    },
    cardTitleComments:{
        fontWeight: "bold",
        marginLeft:15,
        marginTop: 20,
        bottom: 20,
        fontSize: 18
    },
    ratingText: {
        marginLeft: -58,
        marginTop: -13,
        color: "#BEAD9A",
        fontSize: 13
    },
    viewRating: {
        flexDirection: "row",
    },
    
    btnComment: {
        borderRadius: 15, 
        marginHorizontal: 100,
        backgroundColor:"#c77e2c",
        marginBottom: 15
    },
    btnTitleAddComment: {
        color: "white"
    },
    mustLoginText: {
        textAlign: "center",
        color: "#c77e2c", 
        padding: 20,
        marginTop: -10,
        marginBottom: 10
    },
    loginText: {
        fontWeight: "bold"
    },
    /**estilos para favoritos */
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 20,
        backgroundColor: "white",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: 5,
        paddingLeft: 10
    },
    iconFavoriteStyle: {
        alignItems: "center",
        right: 5, 
        marginLeft: 5,
        marginTop: 4
    }
    
})
