import React,{useState, useRef} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {AirbnbRating, Button, Input,Card} from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import { isEmpty } from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Loading from '../../components/Loading'
import { addDocumentWithoutId, getCurrentUser, getDocumentById, updateDocumentoById } from '../../utils/actions'

/**Ventana para mostrar el form de añadir un nuevo comentario */
export default function AddCommentHotel({navigation, route}) {
    const {idHotel}= route.params
    const toastRef = useRef()

    const [rating, setRating] = useState(null)
    const [title, setTitle] = useState("")
    const [errorTitle, setErrorTitle] = useState(null)
    const [comment, setComment] = useState("")
    const [errorComment, setErrorComment] = useState(null)
    const [loading, setLoading] = useState(false)
    
    /**Funcion flechar para subir a firbase el comentario */
    const addComment= async()=>{
        if(!validForm()){
            return
        }

        setLoading(true)
        const user = getCurrentUser()
        const data = {
            idUser: user.uid,
            avatarUser: user.photoURL,
            idHotel: idHotel,
            title,
            comment,
            rating,
            createdAtComment: new Date()
        }
        const responseAddComment = await addDocumentWithoutId("comments",data)
        if(!responseAddComment.statusResponse){
            setLoading(false)
            toastRef.current.show("Error al subir el comentario, intentelo nuevamente")
            return
        }
        
        const responseGetHotel = await getDocumentById("hotels", idHotel)
        if(!responseAddComment.statusResponse){
            setLoading(false)
            toastRef.current.show("Error al obtener el comentario, intentelo nuevamente")
            return
        }

        const hotel = responseGetHotel.document
        const ratingTotal = hotel.ratingTotal + rating
        const quantityVotes = hotel.quantityVotes + 1
        const ratingResult = ratingTotal / quantityVotes
        setLoading(false)
        const responseUpdateHotel = await updateDocumentoById("hotels", idHotel,{
            ratingTotal,
            quantityVotes,
            rating: ratingResult
        })
        setLoading(false)
        if(!responseUpdateHotel.statusResponse){
            setLoading(false) 
            toastRef.current.show("Error al actualizar informacion del hotel, intentelo nuevamente")
            return
        }
        navigation.goBack()
    }

    /**funcion flecha para validar el formulario de añadir comentario */
    const validForm= () =>{
        setErrorTitle(null)
        setErrorComment(null)
        let isValid = true
        
        if(!rating){
            toastRef.current.show("Debes dar una calificacion para comentar", 3000)
            isValid= false
        }
        if(isEmpty(title)){
            setErrorTitle("El comentario debe contener un titulo")
            isValid= false
        }
        if(isEmpty(comment)){
            setErrorComment("Ingresa un comentario")
            isValid= false

        }
        return isValid
    }
    return (
        <KeyboardAwareScrollView style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    count={5}
                    reviews={["Malos", "Regular", "Normal", "Muy bueno", "Excelente"]}
                    defaultRating={0}
                    size={30}
                    onFinishRating={(value)=> setRating(value)}
                />
            </View>
            <View style={styles.formComment}>
                <Card containerStyle={styles.cardContainer}>
                    <Card.Title style={styles.cardTitle}>Comentario</Card.Title>
                    <Card.Divider style={{backgroundColor:"gray"}}/>
                    <Input
                        placeholder="Titulo"
                        containerStyle={styles.input}
                        onChange= {(e)=> setTitle(e.nativeEvent.text)}
                        errorMessage={errorTitle}
                    />
                    <Input
                        placeholder="Comentario"
                        containerStyle={styles.input}
                        style={styles.textArea}
                        multiline
                        onChange= {(e)=> setComment(e.nativeEvent.text)}
                        errorMessage={errorComment}
                    />
                    <Button
                        title="Enviar Comentario"
                        containerStyle={styles.btnContainer}
                        buttonStyle={styles.btn}
                        onPress={addComment}
                    />
                </Card>
            </View> 
            <Toast ref={toastRef} position="center" opacity={0.8}/>
            <Loading isVisible={loading} text="Publicando comentario..."/>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2"
    },
    cardContainer: {
        borderRadius: 20,
        marginBottom: 20,
    },
    formComment: {
        flex: 1,
        margin: 10,
        
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 110,
        width: "100%",
        padding: 0,
        margin: 0
    },
    cardTitle: {
        textAlign: "center",
        color: "gray",
        marginLeft:15,
        fontSize: 20
    },
    btnContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%" 
    },
    btn:{
        backgroundColor: "#c77e2c"
    }
})
