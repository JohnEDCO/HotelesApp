import React, {useState, useEffect, useCallback} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {useFocusEffect} from '@react-navigation/native'
import { getRankingHotels } from '../utils/actions'
import ListRankingHotels from '../components/ranking/ListRankingHotels'
import Loading from '../components/Loading'

export default function TopHotels({navigation}) {
    const [hotels, setHotels] = useState(null)
    const [loading, setLoading] = useState(false)

    useFocusEffect(
        useCallback(() =>{
            async function getData(){
                setLoading(true)
                const response = await getRankingHotels(5)
                if(response.statusResponse){
                    setHotels(response.hotels)
                }
                setLoading(false)
            }
            getData()
        }, [])
    )
    return (
        <View>
            <ListRankingHotels
                hotels={hotels}
                navigation={navigation}
            />
            <Loading isVisible={loading} text="Cargando..."/>
        </View>
    )
}

const styles = StyleSheet.create({})
