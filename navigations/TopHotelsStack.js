import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import TopHotels from '../screens/TopHotels'

const Stack = createStackNavigator()
/**navegacion del ranking de hoteles */
export default function TopHotelsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="top-hotels"
                component = {TopHotels}
                options = {{title: "Top 5 Mejores Hoteles"}}
            />
        </Stack.Navigator>
    )
}
