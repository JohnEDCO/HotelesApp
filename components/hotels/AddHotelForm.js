import React,{useState} from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import {Input} from 'react-native-elements'
import {Button,Icon, Avatar} from 'react-native-elements'
import {map, size, filter} from 'lodash'
import { loadImageFromGallery } from '../../utils/helpers'
import { Alert } from 'react-native'

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
    const addHotel = ()=>{
        console.log(formData)
    }

    return (
        <ScrollView  style={styles.viewContainer}>
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
    const removeImage = (image) =>{
        Alert.alert()
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
        name: "na",
        description: "des",
        phone: "ph",
        address: "ad",
    }
}
/**Estilos de los componentes */
const styles = StyleSheet.create({
    viewContainer:{
        height: "100%",
        marginTop: 30
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
    
})
