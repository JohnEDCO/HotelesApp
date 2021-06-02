import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'

/**Funcion Hotels nos muestra en pantalla el boton plus para agregar un hotel, se recibe la navegation ya que esta en un stack */
export default function Hotels({navigation}) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo)=>{
           userInfo? setUser(true): setUser(false)
        })
    }, [])
    
    if(user === null){
        return <Loading isVisible={true} text="Cargando"/>
    }
    return (
        <View style={styles.viewBody}>
            <Text>Hotels...</Text>
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
    }
})
