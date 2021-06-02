require('firebase/auth');
import 'firebase/firestore'
import 'firebase/storage'
import firebase from 'firebase/app'

import {firebaseApp} from '../utils/firebase'
import {fileToBlob} from './helpers'
 
const db = firebase.firestore(firebaseApp)

export const isUserLogged = () => {
    let isLogged = false
    firebase.auth().onAuthStateChanged((user) => {
        console.log("desde action lo que saca user:"+user);
        user !== null && (isLogged = true)
    })
    console.log("usuario logueado: "+ isLogged);
    return isLogged
}
/**Funcion que me trae todo lo del usuario que esta logueado en el momento */
export const getCurrentUser = () => {
    return firebase.auth().currentUser
}
/**Funcion para cerrar sesion */
export const closeSession = () => {
    return firebase.auth().signOut()
}

/**Funcion para registrar usuario usando la funcion propia de firebase*/
export const registerUser = async(email, password) => {
    const result = { statusResponse: true, error: null}
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
    } catch (error) {
        result.statusResponse = false
        result.error = "Este correo ya ha sido registrado."
    }
    return result
}
/**Funcion que me inicia sesion con email y password usando las funciones que me provee directamente firebase */
export const loginWithEmailAndPassword = async(email, password) => {
    const result = { statusResponse: true, error: null}
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
        result.statusResponse = false
        result.error = "Usuario o contraseña no válidos."
    }
    return result
}

/** funcion que me sube una imagen seleccionada por el usuario a firebase*/
export const uploadImage = async(image, path, name) => {
    const result = { statusResponse: false, error: null, url: null }
    const ref = firebase.storage().ref(path).child(name)
    const blob = await fileToBlob(image)

    try {
        await ref.put(blob)
        const url = await firebase.storage().ref(`${path}/${name}`).getDownloadURL()
        result.statusResponse = true
        result.url = url
    } catch (error) {
        result.error = error
    }
    return result
}

/** Me actualiza el perfil, recibiendo un parametro que nos sirve para actualizarle la foto al usuario */
export const updateProfile = async(data) =>{
    const result = {statusResponse : true, error: null}

    try {
        await firebase.auth().currentUser.updateProfile(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result 
}
/**Esta funcion me ayuda a auntentificar el usuario que esta logueado sea el que va a realizar cambios en su perfil */
export const reauthenticate = async(password) => {
    const result = { statusResponse: true, error: null }
    const user = getCurrentUser()
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, password)

    try {
        await user.reauthenticateWithCredential(credentials)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}
/**Funcion para actualizar el email del usuario */
export const updateEmail = async(email) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updateEmail(email)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}
/**Funcion para actualizar la contraseña del usuario */
export const updatePassword = async(password) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updatePassword(password)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}
