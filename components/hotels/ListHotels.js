import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity,ActivityIndicator } from 'react-native'
import {Image,Card, Icon} from 'react-native-elements'
import {size} from 'lodash'
import { formatPhone } from '../../utils/helpers'

export default function ListHotels({hotels, navigation, handleLoadMore}) {
    return (
        <View>
            <FlatList   
                data={hotels}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(hotel)=>(
                    <Hotel hotel={hotel} navigation={navigation}/>
                )}
            />
        </View>
    )
}

function Hotel({hotel, navigation}){
    const {id, images, name, address, description, phone} = hotel.item
    const imageHotel = images[0]

    const goHotel = () =>{
        navigation.navigate("hotel", {id, name})
    }
    return (
        <TouchableOpacity
            onPress={goHotel}
        >   
            <Card containerStyle={styles.containerCard}>
                    
                    <View style={styles.viewHotel}> 
                        <View style={styles.viewHotelImage}>
                            <Image
                                resizeMode= "cover"
                                PlaceholderContent={<ActivityIndicator color="white"/>}
                                source={{uri: imageHotel}}
                                style={styles.imageHotel}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text style={styles.hotelName}>
                                {
                                    size(name) > 25 ?
                                    `${name.substr(0, 25)}...`
                                    : name
                                }
                            </Text>
                            <Text style={styles.hotelAddress}>{address}</Text>
                            <Text style={styles.hotelPhone}>{formatPhone(phone)}</Text>
                            <Text style={styles.hotelDescription}>
                                {
                                    size(description) > 40 ? 
                                    `${description.substr(0, 40)}...`
                                    : description
                                }
                            </Text>
                        </View>
                    </View>
            </Card>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    viewHotel: {
         flexDirection: "row",
         margin: 10,
         marginLeft: -25,
         marginVertical: -25
    },
    viewHotelImage:{
        marginRight: 15,
    },
    imageHotel: {
        width: 120,
        height: 130,
        margin: 10,
        borderBottomLeftRadius: 30,
        borderTopLeftRadius: 30
    },
    hotelName: {
        fontWeight: "bold"
    },
    hotelAddress: {
        paddingTop: 2,
        paddingRight: 4,
        color: "gray"
    },
    hotelDescription: {
        paddingTop: 2,
        paddingRight: 5,
        color: "gray",
        width: "75%"
    },
    containerCard: {
        borderRadius: 30
    },

})
