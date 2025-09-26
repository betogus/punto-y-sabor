import {View, Text, ActivityIndicator} from 'react-native'
import React from 'react'
import colors from "@/assets/themes/colors";
import {SafeAreaView} from "react-native-safe-area-context";

const LoadingView = ({message="Cargando"} ) => {
    return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
            <ActivityIndicator size="large" color={colors.primary}/>
            <Text style={{marginTop: 16, fontSize: 16, color: "#666"}}>{message}</Text>
        </SafeAreaView>
    )
}
export default LoadingView
