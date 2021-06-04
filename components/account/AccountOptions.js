import React,{useState} from 'react'
import { map } from 'lodash'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { ListItem, Icon } from 'react-native-elements'
import Modal from '../Modal'

import ChangeDisplayNameForm from './ChangeDisplayNameForm';
import ChangeEmailForm from './ChangeEmailForm';
import ChangePasswordForm from './ChangePasswordForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function AccountOptions({user, toastRef, setRelodUser }) {
    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)
    /**Funcion que me retorna un arreglo de objetos  */
    function generateOptions(){
        return [
            {
                title: "Cambiar nombres y apellidos",
                iconNameLeft: "account-circle",
                iconColorLeft: "#ebb85f",
                iconNameRight: "chevron-right",
                iconColorRight: "#ebb85f",
                onPress: () => selectedComponent("displayName")
            },
            {
                title: "Cambiar Email",
                iconNameLeft: "at",
                iconColorLeft: "#ebb85f",
                iconNameRight: "chevron-right",
                iconColorRight: "#ebb85f",
                onPress: () => selectedComponent("email")
            },
            {
                title: "Cambiar contraseña",
                iconNameLeft: "lock-reset",
                iconColorLeft: "#ebb85f",
                iconNameRight: "chevron-right",
                iconColorRight: "#ebb85f",
                onPress: () => selectedComponent("password")
            }
        ]
    }

    const selectedComponent = (key) => {
        switch (key) {
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm
                        displayName={user.displayName}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setRelodUser={setRelodUser}
                    />
                    
                )
                break;
            case "email":
                setRenderComponent(
                    <ChangeEmailForm
                        email={user.email}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setRelodUser={setRelodUser}
                    />
                )
                break;
            case "password":
                setRenderComponent(
                    <ChangePasswordForm
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                    />
                )
                break;
        }
        setShowModal(true)
    }
    
    const menuOptions = generateOptions();

    return (
        <KeyboardAwareScrollView>
            {
                map(menuOptions, (menu, index) => (
                    <ListItem
                        key={index}
                        style={styles.menuItem}
                        onPress={menu.onPress}
                        containerStyle={{borderRadius: 30}}
                    >
                        <Icon
                            type="material-community"
                            name={menu.iconNameLeft}
                            color={menu.iconColorLeft}
                        />
                        <ListItem.Content>
                            <ListItem.Title >{menu.title}</ListItem.Title>
                        </ListItem.Content>
                        <Icon
                            type="material-community"
                            name={menu.iconNameRight}
                            color={menu.iconColorRight}
                            iconStyle={{borderRadius:40}}
                        />
                    </ListItem>
                ))
            }
            <Modal isVisible={showModal} setVisible={setShowModal}>
                {
                    renderComponent
                }
            </Modal>
               
        </KeyboardAwareScrollView>
    )
}



const styles = StyleSheet.create({
    menuItem: {
        borderColor: "#a4a4a4",
        borderWidth:1,
        borderBottomWidth:7,
        borderBottomColor: "#ebb85f",
        margin: 15,
        marginTop: 7,
        borderRadius: 30,
    }
})
