import React, {useState} from 'react'
import { Alert } from 'react-native';
import { StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements';
import { updateProfile, uploadImage } from '../../utils/actions';
import { loadImageFromGallery } from '../../utils/helpers';

export default function InfoUser({user, setloading, setloadingText}) {
    const [photoURL, setPhotoURL] = useState(user.photoURL)

    const changePhoto = async() => {
        const result = await loadImageFromGallery([1,1])
        console.log(result);
        if(!result.status){
            return
        }
        setloadingText("Actualizando perfil")
        setloading(true)

        const resultUploadImage = await uploadImage(result.image, "avatars", user.uid)
        console.log("resulado upload: "+ resultUploadImage);   
        console.log("url: "+ resultUploadImage.url);   
        if(!resultUploadImage.statusResponse){
            console.log("Entrooooooooooo");
            setloading(false)
            Alert.alert("Error al importar la imagen seleccionada")
            return
        }

        const resultUpdateProfile = await updateProfile({photoURL: resultUploadImage.url})
        console.log("resulado update: "+ resultUpdateProfile.statusResponse);   
        setloading(false) 
        if(resultUpdateProfile.statusResponse){
            setPhotoURL(resultUploadImage.url)
        }else{
            Alert.alert("Ha ocurrido un error al actualizar la foto de perfil")
        }
    }
    return (
        <View style={styles.container}>
            <Avatar
                rounded
                size= "large"
                containerStyle={styles.avatar}
                onPress={changePhoto}
                source={
                    photoURL ? {uri: photoURL} : require('../../assets/avatar-default.png')
                } 
            />
            <View style={styles.infoUser}>
                <Text style={styles.displayName}>
                    {
                        user.displayName ? user.displayName : "N/A"
                    }
                </Text>
                <Text>{user.email}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems:"center",
        justifyContent:"center",
        flexDirection: "row",
        backgroundColor: "#f9f9f9",
        paddingVertical: 30
    },
    infoUser: {
        marginLeft: 10,
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 2
    }
})
