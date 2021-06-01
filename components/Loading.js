import React from 'react'
import { ActivityIndicator } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Overlay } from 'react-native-elements/dist/overlay/Overlay'

export default function Loading({isVisible, text}) {
    return (
        <Overlay
            isVisible = {isVisible}
            windowBackgroundColor = "rgba(0,0,0,0.5)"
            OverlayBackgroundColor = "transparent"
            overlayStyle = {styles.overlay} 
        >
            <View style={styles.view}>
                <ActivityIndicator
                    size= "large"
                    color="#d0862f" 
                />
                {
                    text && <Text style={styles.text}>{text}</Text>
                }
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlay: {
        height: 100,
        width: 200,
        backgroundColor: "#fff",
        borderColor: "#d0862f",
        borderWidth: 2,
        borderRadius: 10
    },
    view: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        color: "#d0862f",
        marginTop: 10
    }
})
