import React, {useRef, useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-easy-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import AddHotelForm from '../../components/hotels/AddHotelForm'
import Loading from '../../components/Loading'

/**Este archivo es la ventana que me llama al formulario de crear hotel*/
export default function AddHotel({navigation}) {
    const toastRef = useRef()
    const [loadgin, setLoading] = useState(false)

    return (
        <KeyboardAwareScrollView>
            <AddHotelForm
                toastRef= {toastRef}
                setLoading={setLoading}
                navigation={navigation}
            />
            <Loading isVisible={Loading} text="Creando Hotel..."/>
            <Toast ref={toastRef} position="center" opacity={0.9}/>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({})
