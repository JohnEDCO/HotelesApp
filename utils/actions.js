require('firebase/auth');
import 'firebase/firestore'
import 'firebase/storage'
import firebase from 'firebase/app'

import {firebaseApp} from '../utils/firebase'
import {fileToBlob} from './helpers'
import {map} from 'lodash' 

const db = firebase.firestore(firebaseApp)

export const isUserLogged = () => {
    let isLogged = false
    firebase.auth().onAuthStateChanged((user) => {
        user !== null && (isLogged = true)
    })
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
/**Funcion para subir a cualquier collecion la informacion del hotel que enviamos por medio de el parametro data*/
export const addDocumentWithoutId = async(collection, data) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).add(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

/**Funcion para traer los hoteles que se han registrado por los usuarios en general*/
export const getHotels = async(limitHotels) => {
    const result = { statusResponse: true, error: null, hotels: [], startHotel: null}
    try {
        const response = await db
            .collection("hotels")
            .orderBy("createAt", "desc")
            .limit(limitHotels).get()

        if(response.docs.length > 0){
            result.startHotel = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const hotel = doc.data()
            hotel.id = doc.id
            result.hotels.push(hotel)
        });
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

/**Funcion que nos retorna mas Hoteles*/
export const getMoreHotels = async(limitHotels, startHotel) => {
    const result = { statusResponse: true, error: null, hotels: [], startHotel: null}
    try {
        const response = await db
            .collection("hotels")
            .orderBy("createAt", "desc")
            .startAfter(startHotel.data().createAt)
            .get()
            
        if(response.docs.length > 0){
            result.startHotel = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const hotel = doc.data()
            hotel.id = doc.id

            result.hotels.push(hotel)
        });
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}
/**Funcion que me trae un documento de cualquier collecion por el id que le pasemos por parametro */
export const getDocumentById = async(collection, id) => {
    const result = { statusResponse: true, error: null, document: null }
    try {
        const response = await db.collection(collection).doc(id).get()
        result.document = response.data()
        result.document.id = response.id
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

/**Funcion que me  documento de cualquier collecion por el id que le pasemos por parametro */
export const updateDocumentoById = async(collection, id, data) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).doc(id).update(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

/**Funcion para traer los comentarios que se han hecho al hotel*/
export const getHotelComments = async(id) => {
    const result = { statusResponse: true, error: null, comments: []}
    try {
        const response = await db
            .collection("comments")
            .where("idHotel", "==", id)
            .get()

        response.forEach((doc) => {
            const comment = doc.data()
            comment.id = doc.id
            result.comments.push(comment)
        });
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

/**Funcion que me verifica si un hotel esta añadido a favoritos, se le envia el id del hotel al que se accede */
export const getIsFavorite = async(idHotel) => {
    const result = { statusResponse: true, error: null, isFavorite: false }
    try {
        const response = await db
            .collection("favorites")
            .where("idHotel", "==", idHotel)
            .where("idUser", "==", getCurrentUser().uid)
            .get()
        result.isFavorite = response.docs.length > 0
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

/**Funcion que me elimina de favoritos un Hotel añadido por el usuario que esta logueado*/
export const discardFavorite = async(idHotel) => {
    const result = { statusResponse: true, error: null }
    try {
        const response = await db
            .collection("favorites")
            .where("idHotel", "==", idHotel)
            .where("idUser", "==", getCurrentUser().uid)
            .get()
        response.forEach(async(doc) => {
            const favoriteId = doc.id
            await db.collection("favorites").doc(favoriteId).delete()
        })    
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

/**Funcion que me trae todos los hoteles añadidos a favorito por el usuario que esta logueado*/
export const getFavorites = async() => {
    const result = { statusResponse: true, error: null, favorites: [] }
    try {
        const response = await db
            .collection("favorites")
            .where("idUser", "==", getCurrentUser().uid)
            .get()
        
        const IdsHotels = []

        response.forEach((doc) => {
            const favorite = doc.data()
            IdsHotels.push(favorite.idHotel)
        })    
        await Promise.all(
            map(IdsHotels, async(IdHotel)=>{
                const responseHotels = await getDocumentById("hotels", IdHotel)
                if(responseHotels.statusResponse){
                    result.favorites.push(responseHotels.document)
                }
            })
        )
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

/**Funcion que me verifica si un hotel esta añadido a favoritos, se le envia el id del hotel al que se accede */
export const getRankingHotels = async(limitRanking) => {
    const result = { statusResponse: true, error: null, hotels: [] }
    try {
        const response = await db
            .collection("hotels")
            .orderBy("rating", "desc")
            .limit(limitRanking)
            .get()
        response.forEach((doc) => {
            const hotel = doc.data()
            hotel.id = doc.id
            result.hotels.push(hotel)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result    
}