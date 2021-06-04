import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { Alert, Linking } from 'react-native'
import {size} from 'lodash'

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
}
/**Funcion asincrona que me carga la imagen que seleccionde de galeria y me retorna un response con la url de la imagen*/
export const loadImageFromGallery = async(array) => {
    const response = { status: false, image: null }
    const resultPermissions = await Permissions.askAsync(Permissions.CAMERA)
    if (resultPermissions.status === "denied") {
        Alert.alert("Debes de darle permiso para accerder a las imágenes del teléfono.")
        return response
    }   
    const result = await ImagePicker.launchImageLibraryAsync({      
        allowsEditing: true,
        aspect: array
    })
    if (result.cancelled) {
        return response
    }
    response.status = true
    response.image = result.uri
    return response
}

export const fileToBlob = async(path) => {
    const file = await fetch(path)
    const blob = await file.blob()
    return blob
}

export const formatPhone = (phone) => {
    if (size(phone) < 10)
    {
        return `+(57) ${phone}`
    }
    return `+(57) ${phone.substr(0, 3)} ${phone.substr(3, 3)} ${phone.substr(6, 6)}`
}

