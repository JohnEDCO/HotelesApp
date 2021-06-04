import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {Input} from 'react-native-elements'
import {Button,Icon} from 'react-native-elements'
import { size } from 'lodash'
import {useNavigation} from '@react-navigation/native'

import { validateEmail } from '../../utils/helpers'
import { registerUser } from '../../utils/actions'
import Loading from '../Loading'

export default function RegisterForm() {
    const [showPassword, setshowPassword] = useState(false)
    const [formData, setformData] = useState(defaultValuesForm())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorConfirm, setErrorConfirm] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    const onChange = (e, type)=>{
        setformData({...formData, [type]: e.nativeEvent.text})
    } 

    const doRegisterUser = async() =>{
        if(!validateData()){
            return;
        }
        setLoading(true)
        const result = await registerUser(formData.email, formData.password)

        if (!result.statusResponse) {
            setLoading(false)
            setErrorEmail(result.error)
            return
        }
        setLoading(false)
        console.log("Cargandoo consoleeeeeeeeeeeeee");
        navigation.navigate("account")
    }

    const validateData = ()=>{
        setErrorPassword("")
        setErrorConfirm("")
        setErrorEmail("")
        let isValid = true
        
        if(!validateEmail(formData.email)){
            setErrorEmail("Debes ingresar un correo valido")
            isValid = false
        }
        else if(size(formData.password) < 5) {
            setErrorPassword("Tu contraseña es muy corta, escribe almenos 5 caracteres")
            isValid = false
        }

        else if(size(formData.confirm) < 5) {
            setErrorConfirm("Tu confirmacion de contraseña no coincide")
            isValid = false
        }

        else if(formData.password !== formData.confirm) {
            setErrorPassword("La contraseña y la confirmación no son iguales.")
            setErrorConfirm("La contraseña y la confirmación no son iguales.")
            isValid = false
        }

        return isValid

    }
    return (
        <View style={styles.form}>
            <Input
                style={styles.input}
                placeholder= "Email"
                onChange={(e) => onChange(e,"email")}
                errorMessage={errorEmail}
                defaultValue={formData.email}
            />
            <Input
                style={styles.input}
                placeholder= "Contraseña"
                password= {true}
                secureTextEntry={!showPassword}
                onChange={(e) => onChange(e,"password")}
                errorMessage={errorPassword}
                defaultValue={formData.password}
                rightIcon= {
                    <Icon
                        type="material-community"
                        name={showPassword? "eye-off-outline":"eye-outline"}
                        iconStyle={styles.icon}
                        onPress={() => setshowPassword(!showPassword)}
                    />
                }
            />
            <Input
                style={styles.input}
                placeholder= "Confirmar contraseña"
                password= {true}
                secureTextEntry={!showPassword}
                onChange={(e) => onChange(e,"confirm")}
                errorMessage={errorConfirm}
                defaultValue={formData.confirm}
                rightIcon= {
                    <Icon
                        type="material-community"
                        name={showPassword? "eye-off-outline":"eye-outline"}
                        iconStyle={styles.icon}
                        onPress={() => setshowPassword(!showPassword)}
                    />
                }
            />
            <Button
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                title= "Registrarme"
                onPress={()=> doRegisterUser()}
            />
            <Loading 
                isVisible= {loading} 
                text="Creando cuenta"
            />
        </View>
    )
}

const defaultValuesForm = ()=>{
    return {email: "", password: "", confirm: ""}
}
const styles = StyleSheet.create({
    form: {
        marginHorizontal: 25,
        backgroundColor:"white",
        borderRadius: 30,
        width: 335,
        height: 370,
        borderWidth:2,
        borderColor: "#e2e2e5",
        borderRightWidth: 8, 
        borderRightColor: "#e2e2e5",
        padding: 27
    },
    input: {
        width: "100%",
        margin: 7
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
        alignSelf: "center"
    }, 
    btn: {
        backgroundColor: "#c77e2c",
    },
    icon: {
        color: "#c1c1c1"
    }
})
    