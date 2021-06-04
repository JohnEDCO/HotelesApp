import React, { useState, useEffect }  from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Card, Image, Icon, Rating } from 'react-native-elements'
import {size} from 'lodash'

export default function ListRankingHotels({hotels, navigation}) {
    return (
        <FlatList
            data={hotels}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(hotel) => (
                <Hotel hotel={hotel} navigation={navigation}/>
            )}
        />
    )
}

function Hotel({ hotel, navigation }) {
    const { name, rating, images, description, id } = hotel.item
    const [iconColor, setIconColor] = useState("#cd7f32")


    // b9f2ff
    // #e3e4e5
    // #cd7f32
    useEffect(() => {
        if (hotel.index === 0) {
            setIconColor("#b9f2ff")
        } else if (hotel.index === 1) {
            setIconColor("#efb819")
        } else if (hotel.index === 2) {
            setIconColor("#8a9597")
        }
    }, [])

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("hotels", {
                screen: "hotel",
                params: { id, name }
            })}
        >
            <Card containerStyle={styles.containerCard}>
                
                <View style={styles.viewHotel}> 
                <Image
                    style={styles.hotelImage}
                    resizeMode="cover"
                    PlaceholderContent={<ActivityIndicator size="large" color="#FFF"/> }
                    source={{ uri: images[0] }}
                />
                </View>
                <View style={styles.titleRating}>
                    <Text style={styles.title}>{name}</Text>
                    
                </View>
                <View style={styles.rating}>
                    <Rating
                            imageSize={20}
                            startingValue={rating}
                            readonly
                    />
                    <Text style={styles.ratinValue}>{rating.toFixed(1)} / 5</Text>
                    <Icon
                        type="material-community"
                        name="chess-queen"
                        color={iconColor}
                        size={40}
                        containerStyle={styles.containerIcon}
                    />
                </View>
                
                <Text style={styles.description}>
                    {
                        size(description) > 200 ?
                        `${description.substr(0, 200)}...`
                        : description
                    }
                </Text>
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    viewHotel: {
         margin: 10,
         marginLeft: -15,
         marginVertical: -5,
         marginTop: -15,
         width:  362,
         height: 250
    },
    containerStyle: {
        marginBottom: 30,
        borderWidth: 0
    },
    containerIcon: {
        position: "absolute",
        top: -19,
        left: 290,
        zIndex: 1
    },
    hotelImage: {      
        width: "100%",
        height: 245,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: -40,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    description: {
        color: "grey",
        marginTop: 0,
        textAlign: "justify"
    },
    titleRating: {
        flexDirection: "row",
        marginVertical: 10,
        justifyContent: "space-between"
    },
    rating: {
        flexDirection: "row",
        marginVertical: 10,
        marginRight: 230,
        marginTop: 1
    },
    ratinValue: {
        fontSize: 13,
        color: "gray",
        marginLeft: 5,
        marginTop: 1
    },
    containerCard:{
        borderRadius: 30,
        borderColor: "#DBCBB9"
    }
})
