import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import HotelsStack from './HotelsStack'
import FavoritesStack from './FavoritesStack'
import AccountStack from './AccountStack'
import TopHotelsStack from './TopHotelsStack'

const Tab = createBottomTabNavigator()
/**Esta funcion es la navegacion principal, es el menu que aparece en la parte inferior de la aplicacion */
export default function Navigation() {
    const screenOptions = (route, color) =>{
        let iconName
        switch (route.name) {
            case "hotels":
                iconName = "home-city-outline"
                break;
            case "favorites":
                iconName = "heart-outline"
                break; 
            case "top":
                iconName = "star-outline"
                break;    
            case "account":
                iconName = "account-outline"
                break;   
            default:
                break;
        }
        return (
            <Icon 
                type= "material-community"
                name= {iconName}
                size= {22}
                color={color}

            />
        )
    }
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName = "hotels"
                tabBarOptions={{
                    inactiveTintColor: "#e28743",
                    activeTintColor: "#ebb85f"
                }}

                screenOptions ={({route})=>({
                    tabBarIcon : ({color})=> screenOptions(route, color)
                })}
            >
                <Tab.Screen
                    name="hotels"
                    component = {HotelsStack}
                    options = {{title: "Hoteles"}}
                />
                <Tab.Screen
                    name="favorites"
                    component = {FavoritesStack}
                    options = {{title: "Favoritos"}}
                />
                <Tab.Screen
                    name="top"
                    component = {TopHotelsStack}
                    options = {{title: "Mejores Hoteles"}}
                    
                />
                <Tab.Screen
                    name="account"
                    component = {AccountStack}
                    options = {{title: "Cuenta"}}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

