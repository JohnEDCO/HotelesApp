import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import Hotels from '../screens/Hotels'

const Stack = createStackNavigator()

export default function HotelsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name= "hotels"
                component = {Hotels}
                options = {{title: "Hoteles"}}
            />
        </Stack.Navigator>
    )
}
