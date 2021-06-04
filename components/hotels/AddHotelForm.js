import React,{useState} from 'react'
import { StyleSheet, Dimensions, Text, View, ScrollView,Alert } from 'react-native'
import {Input} from 'react-native-elements'
import {Button,Icon, Avatar,Image} from 'react-native-elements'
import {map, size, filter, isEmpty} from 'lodash'
import uuid from 'random-uuid-v4'

import { loadImageFromGallery } from '../../utils/helpers'
import {addDocumentWithoutId, getCurrentUser, uploadImage} from '../../utils/actions'

/**constante para saber las dimensiones de la pantalla */
const widthScreen = Dimensions.get("window").width

/**Este archivo contiene los elemento del formulario para agregar un nuevo hotel */
/**Recibe el toast para mostrar un mensaje tipo toast */
export default function AddHotelForm({toastRef, setLoading, navigation}) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorDescription, setErrorDescription] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])

    /**esta constante con funcion flecha nos agrega el hotel al firebase*/
    const addHotel = async()=>{
        if(!validForm()){
            return
        }
        setLoading(true)
        const responseUploadImages = await upLoadImagesForm()

        /**creo una constante de objeto para tener la informacion del hotel y enviarlo a la bd de firebase */
        const hotel = {
            name: formData.name,
            address: formData.address,
            phone: formData.phone,
            description: formData.description,
            images: responseUploadImages,
            rating: 0,
            ratingTotal: 0,
            quantityVotes:0,
            numberVotes: 0,
            createAt: new Date(),
            createBy: getCurrentUser().uid,
        }

        const responseAddDocument = await addDocumentWithoutId("hotels", hotel)
        setLoading(false)

        if(!responseAddDocument.statusResponse){
            toastRef.current.show("Error al grabar el hotel, intenta de nuevo")
            return
        }
        navigation.navigate("hotels")
    }

    /**Funcion flecha que me sube las imagens que tengo seleccionada en el form a firebase */
    const upLoadImagesForm = async() =>{
        const imagesUrl = []
        await Promise.all(
            map(imagesSelected, async(image) =>{
                const response = await uploadImage(image, "hotels", uuid())
                if(response.statusResponse){
                    imagesUrl.push(response.url)
                }
            })
        )
        return imagesUrl
    }

    const validForm= ()=> {

        clearErrors()
        let isValid = true

        if(isEmpty(formData.name)){
            setErrorName("Debes ingresar el nombre del hotel")
            isValid= false
        }
        if(isEmpty(formData.address)){
            setErrorAddress("Debes ingresar la direccion del hotel")
            isValid= false
        }
        if(size(formData.phone) < 10){
            setErrorPhone("Debes ingresar un telefono de contacto")
            isValid= false
        }
        if(isEmpty(formData.description)){
            setErrorDescription("La descripcion es muy importante para los usuarios, ingresa una porfavor")
            isValid= false
        }
        if(size(imagesSelected) === 0){
            toastRef.current.show("Debes ingresar al menos una imagen del hotel")
            isValid= false
        }

        return isValid
    }
    /**funcion flecha para limpiar los campos de errors, para evitar mensajes de errores no deseados */
    const clearErrors= () =>{
        setErrorAddress(null)
        setErrorDescription(null)
        setErrorName(null)
        setErrorPhone(null)
    }
    return (
        <ScrollView  style={styles.viewContainer}>
            <ImageHotel
                imageHotel= {imagesSelected[0]}
            />
            <FormAdd
                formData = {formData}
                setFormData ={setFormData}
                errorName={errorName}
                errorPhone= {errorPhone}
                errorAddress={errorAddress}
                errorDescription={errorDescription}
            />
            <UploadImageHotel
                toastRef= {toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button
                containerStyle={styles.btnContainer}
                title= "Crear Hotel"
                onPress={addHotel}
                buttonStyle={styles.btnAddHotel}

            />
        </ScrollView>
    )
}
/**funcion flecha que tiene un componente interno y nos devuelve la imagen del hotel */
function ImageHotel({imageHotel}){
    return (
        <View style={styles.viewPhoto}
        >
            <Image
                style={styles.imageStyle}
                source = {
                    imageHotel ?
                    {uri: imageHotel}
                    : require('../../assets/no-image.png')
                }
            />
        </View>
    )
}
/**Funcion(componente) que contiene los componentes para subir imagenes de hoteles*/
function UploadImageHotel({toastRef, imagesSelected, setImagesSelected}){

    /**Funcion flecha que me sube imagenes al firebase */
    const imageSelected = async()=>{
        const response = await loadImageFromGallery([4,3])
        if(!response.status){
            toastRef.current.show("No se ha seleccionado ninguna imagen", 2000)
            return
        }
        setImagesSelected([...imagesSelected, response.image])
    }
    /**funcion flecha para remover una imagen de las que se seleccionaron de la galleria para subir */
    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro que quieres eliminar la imagen?",
            [
                {
                    text: "No",
                    style: "cancel"                    
                },
                {
                    text: "Sí",
                    onPress: () => {
                        setImagesSelected(
                            filter(imagesSelected, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ],
            { cancelable: false }
        )
    }
    return (
        <ScrollView
            horizontal
            style={styles.viewImages}
        >   
            {   
                size(imagesSelected)<10 && (
                    <Icon
                        type= "material-community"
                        name= "camera"
                        color= "#7a7a7a"
                        containerStyle={styles.containerIcon}
                        onPress= {imageSelected}
                    />
                )
            }    
            {
                map(imagesSelected, (imageHotel, index) =>(
                    <Avatar
                        key={index}
                        style={styles.miniatureStyle}
                        source={{uri: imageHotel}}
                        onPress={()=>removeImage(imageHotel)}
                    />
                ))
            }
        </ScrollView>
    )
}
/**Funcion componente que me retorna los campos(input) que lleva el formulario */
function FormAdd({formData,setFormData,errorName,errorPhone,errorAddress,errorDescription}){

    const onChange = (e, type) => {
        setFormData({...formData, [type] : e.nativeEvent.text})
    }
    return(
        <View style={styles.viewForm}>
            <Input
                style={styles.input}
                placeholder= "Nombre"
                defaultValue={formData.name}
                onChange={(e) => onChange(e,"name")}
                errorMessage={errorName}
            />
            <Input
                style={styles.input}
                placeholder= "Direccion"
                defaultValue={formData.address}
                onChange={(e) => onChange(e,"address")}
                errorMessage={errorAddress}
            />
            <Input
                style={styles.input}
                placeholder= "Telefono"
                defaultValue={formData.phone}
                onChange={(e) => onChange(e,"phone")}
                errorMessage={errorPhone}
            />
            <Input
                containerStyle={styles.textArea}
                placeholder= "Descripcion"
                multiline
                defaultValue={formData.description}
                onChange={(e) => onChange(e,"description")}
                errorMessage={errorDescription}
            />
           
        </View>
    )
}
/**Constante que me retorna los valores por defecto para mandar al formData */
const defaultFormValues = () => {
    return {
        name: "",
        description: "",
        phone: "",
        address: "",
    }
}
/**Estilos de los componentes */
const styles = StyleSheet.create({
    viewContainer:{
        height: "100%",
        
    },
    viewForm: {
        marginHorizontal: 10,
    },
    textArea: {
        height: 100,
        width: "100%"
    },
    input: {
        width: "100%"
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
        alignSelf: "center"
    }, 
    btnAddHotel: {
        margin:10,
        backgroundColor: "#c77e2c",
    },
    icon: {
        color: "#c1c1c1"
    },
    viewImages: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 20
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    imageStyle: {
        width: widthScreen,
        height: 200
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20,
    }
})
