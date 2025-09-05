import {View, Text, Image, Dimensions, TouchableOpacity} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {getMenuById} from "@/services/appwrite";
import useAppwrite from "@/services/appwrite/useAppwrite";
import React, {useState} from "react";
import {MenuDetail} from "@/type";
import {Ionicons} from "@expo/vector-icons";
import colors from "@/assets/themes/colors";
import {SafeAreaView} from "react-native-safe-area-context";

const ProductDetail = () => {
    const {itemId} = useLocalSearchParams<{ itemId: string }>();
    const {data, loading, error} = useAppwrite<MenuDetail | null, { id: string }>({
        fn: getMenuById,
        params: {id: itemId},
    });
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);

    const handleAdd = () => setQuantity(prev => prev + 1);
    const handleRemove = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        // Lógica para agregar al carrito
        console.log(`Agregado al carrito: ${data?.name} x${quantity}`);
    };

    if (loading) return <Text>Cargando...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return data && (
        <SafeAreaView edges={['left', 'right', 'bottom']} className="flex-1 bg-white">
            {/* Imagen */}
            <Image
                source={{ uri: data.image_url }}
                style={{
                    width: "100%",
                    height: Dimensions.get("screen").height / 2.5,
                    resizeMode: "cover",
                }}
            />
            <TouchableOpacity
                onPress={() => router.back()}
                style={{
                    position: "absolute",
                    top: 50,
                    left: 20,
                    zIndex: 10,
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderRadius: 20,
                    padding: 6,
                }}
            >
                <Ionicons name="arrow-back" size={28}/>
            </TouchableOpacity>

            {/* Info */}
            <View className="menu-detail__info flex-1">
                <Text className="font-bold text-dark-100 text-4xl mb-2" numberOfLines={1}>
                    {data.name}
                </Text>

                <View className="flex-row justify-between">
                    <Text className="mb-4 text-2xl font-bold" style={{ color: colors.primary }}>
                        ${data.price}
                    </Text>
                    <View className="flex flex-row gap-2">
                        <Ionicons name="star" size={24} color="#ffcd03" />
                        <Text className="paragraph-bold text-lg">{data.rating}</Text>
                    </View>
                </View>

                <Text className="mb-4 text-xl text-gray-400">{data.description}</Text>
            </View>

            {/* Botones abajo */}
            <View className="justify-center items-center flex-row gap-8 p-4">
                <View
                    className="flex-row items-center"
                    style={{
                        backgroundColor: "#fff",
                        padding: 10,
                        borderRadius: 30,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor:
                                quantity == 1 ? colors.backgroundGray : colors.primary,
                        }}
                        className="rounded-full w-14 h-14 flex justify-center items-center"
                        onPress={handleRemove}
                    >
                        <Text
                            style={{ color: quantity == 1 ? colors.disabled : "#fff" }}
                            className="text-5xl"
                        >
                            -
                        </Text>
                    </TouchableOpacity>

                    <Text style={{ marginHorizontal: 20, fontSize: 18 }}>{quantity}</Text>

                    <TouchableOpacity
                        onPress={handleAdd}
                        style={{ backgroundColor: colors.primary }}
                        className="rounded-full w-14 h-14 flex justify-center items-center"
                    >
                        <Text style={{ color: "#fff" }} className="text-4xl">
                            +
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handleAddToCart}
                    style={{
                        backgroundColor: colors.primary,
                        borderRadius: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 20,
                        height: 60,
                        width: 200,
                    }}
                >
                    <Text className="text-white text-2xl font-bold">Agregar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>

    );
}
export default ProductDetail;
