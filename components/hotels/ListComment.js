import React,{useState, useEffect,useCallback} from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import firebase from 'firebase/app'
import { Button, Icon, Avatar, Rating } from 'react-native-elements'
import moment from 'moment/min/moment-with-locales'
import { getHotelComments } from '../../utils/actions'
import { size, map} from 'lodash'
import {useFocusEffect} from '@react-navigation/native'
import { ScrollView } from 'react-native'

moment.locale("ES")

/**Este componente me manda a la ventana que muestra toda la info del hotel, los botones para realizar un comentario nuevo */
export default function ListComment({navigation, idHotel}) {
    const [userLogged, setUserLogged] = useState(false)
    const [comments, setComments] = useState([])

    /**Verifico que haya un usuario loggueado, porque de lo contrario no podria hacer comentarios */
    firebase.auth().onAuthStateChanged((user)=>{
        user? setUserLogged(true): setUserLogged(false)
    })
    
    useFocusEffect(
        useCallback(() => {
            (async()=>{
                const response = await getHotelComments(idHotel)
                if(response.statusResponse){
                    setComments(response.comments)
                }   
            })()
        }, [])
    )

    return (
        <ScrollView>
            {
                size(comments)>0 && (
                    map(comments, commentDoc =>(
                        <Comment  commentDoc={commentDoc}/>
                    ))
                )
            }
        </ScrollView>
    )
}

function Comment({ commentDoc}){
    const {title, comment,createdAtComment, avatarUser, rating} = commentDoc
    const creatComment = new Date(createdAtComment.seconds * 1000)
    return (
        <View style={styles.viewComment}> 
            <View style={styles.viewImageAvatar}>
                <Avatar
                    renderPlaceholderContent= {<ActivityIndicator color="white"/>}
                    size="large"
                    redonded
                    containerStyle={styles.imageAvatarUser}
                    source={
                        avatarUser ?
                        {uri: avatarUser}
                        : require("../../assets/avatar-default.png")
                    }
                />
            </View>
            <View style={styles.viewInfoComment}>
                <Text style={styles.commentTitle}>{title}</Text>
                <Text style={styles.commentText}>{comment}</Text>
                <Rating 
                    imageSize={15}
                    startingValue={rating}
                    readonly
                />
                <Text style={styles.commentDate}>
                    {moment(creatComment).format("LLL")}
                </Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    btnComment: {
        borderRadius: 15, 
        marginHorizontal: 100,
        backgroundColor:"#c77e2c",
        marginBottom: 15
    },
    btnTitleAddComment: {
        color: "white"
    },
    mustLoginText: {
        textAlign: "center",
        color: "#c77e2c", 
        padding: 20
    },
    loginText: {
        fontWeight: "bold"
    },
    viewComment: {
        flexDirection: "row",
        padding: 10,
        paddingBottom: 20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1
    },
    viewImageAvatar: {
        marginRight: 15
    },
    imageAvatarUser: {
        width: 50,
        height: 50
    },
    viewInfoComment: {
        flex: 1,
        alignItems: "flex-start"
    },
    commentTitle: {
        fontWeight: "bold"
    },
    commentText: {
        paddingTop: 2,
        color: "gray",
        marginBottom: 5
    },
    commentDate: {
        marginTop: 5,
        color: "gray",
        fontSize: 12,
        position: "absolute",
        right: 0,
        bottom: 0
    }
})
