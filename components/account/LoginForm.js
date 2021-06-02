import { useNavigation } from '@react-navigation/native'
import { isEmpty } from 'lodash'
import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements'

import Loading from '../Loading'
import { validateEmail } from '../../utils/helpers'
import { loginWithEmailAndPassword } from '../../utils/actions'

export default function LoginForm() {
    const [showPassword, setshowPassword] = useState(false)
    const [formData, setformData] = useState(defaultValuesForm())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    const onChange = (e, type)=>{
        setformData({...formData, [type]: e.nativeEvent.text})
    } 

    const validateData = ()=>{
        setErrorPassword("")
        setErrorEmail("")
        let isValid = true
        
        if(!validateEmail(formData.email)){
            setErrorEmail("Debes ingresar un correo valido")
            isValid = false
        }
        
        if(isEmpty(formData.password)) {
            setErrorPassword("Debes ingresar tu contraseña")
            isValid = false
        }
        return isValid

    }

    const doLogin = async() =>{
        if(!validateData()){
            return
        }
        setLoading(true)
        const result = await loginWithEmailAndPassword(formData.email, formData.password)
    
        if (!result.statusResponse) {
            setLoading(false)
            setErrorEmail(result.error)
            setErrorPassword(result.error)
            return
        }
        navigation.navigate("account")
    }
    return (
        <View style= {styles.container}>
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
            <Button
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                title= "Iniciar"
                onPress={()=> doLogin()}
            />
            <Loading 
                isVisible= {loading} 
                text="Iniciando sesion..."
            />
        </View>
    )
}
const defaultValuesForm = ()=>{
    return {email: "", password: ""}
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop:30
    },
    input: {
        width: "100%"
    },
    icon: {
        color: "#c1c1c1"
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
        alignSelf: "center"
    }, 
    btn: {
        backgroundColor: "#c77e2c",
    }
})
