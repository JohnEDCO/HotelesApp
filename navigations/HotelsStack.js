import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import Hotels from '../screens/hotels/Hotels'
import AddHotel from '../screens/hotels/AddHotel'

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
        </Stack.Navigator>
    )
}
