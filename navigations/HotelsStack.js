import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import Hotels from '../screens/hotels/Hotels'
import Hotel from '../screens/hotels/Hotel'
import AddHotel from '../screens/hotels/AddHotel'
import AddCommentHotel from '../screens/hotels/AddCommentHotel'

const Stack = createStackNavigator()

export default function HotelsStack() {
    
    return (
        <Stack.Navigator>
            <Stack.Screen
                name= "hotels"
                component = {Hotels}
                options = {{title: "Hoteles"}}
            />
            <Stack.Screen
                name= "add-hotel"
                component = {AddHotel}
                options = {{title: "Crear Hotel"}}
            />
            <Stack.Screen
                name= "hotel"
                component = {Hotel}
            />
            <Stack.Screen
                name= "add-comment-hotel"
                component = {AddCommentHotel}
                options = {{title: "Nuevo Comentario"}}
            />
        </Stack.Navigator>
    )
}
