import {View, Text, Image, TouchableOpacity, Platform} from 'react-native'
import React from 'react'
import {MenuItem} from "@/type";
import {useCartStore} from "@/store/cart.store";
import {Ionicons} from '@expo/vector-icons'

const MenuCard = ({ item: {$id, image_url, name, price, rating}} : {item: MenuItem}) => {

    const {addItem} = useCartStore();

    return (
        <TouchableOpacity className="menu-card" style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787'} : {}}>
            <Image
                className="menu-card__image"
                source={{ uri: image_url }}
                style={{ width: "100%", height: 128, objectFit: "cover" }}
            />
            <View className="menu-card__info">
                <Text className="base-bold font-bold text-dark-100 mb-2" numberOfLines={1}>{name}</Text>
                <View className="flex-row justify-between">
                    <Text className="paragraph-bold text-gray-200 mb-4 text-lg">${price}</Text>
                    <View className="flex flex-row gap-2">
                        <Ionicons name="star" size={24} color="#ffcd03" />
                        <Text className="paragraph-bold text-lg">{rating}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}
export default MenuCard
