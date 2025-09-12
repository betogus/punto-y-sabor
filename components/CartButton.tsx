import {View, Text, TouchableOpacity, Image} from 'react-native'
import React, {useContext} from 'react'
import {images} from "@/constants";
import {useCartStore} from "@/store/cart.store";
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {ROUTES} from "@/src/routes";

const CartButton = () => {
    const {getTotalItems} = useCartStore();
    const totalItems = getTotalItems();

    return (
        <TouchableOpacity className="cart-btn" onPress={() => router.push(ROUTES.cart)}>
            <Ionicons name='bag-outline' size={18} className="size-5" resizeMode="contain" />
            {totalItems > 0 && (
                <View className="cart-badge">
                    <Text className="small-bold text-white">{totalItems}</Text>
                </View>
            )}
        </TouchableOpacity>
    )
}
export default CartButton
