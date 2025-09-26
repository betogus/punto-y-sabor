import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    ActivityIndicator,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

import {getMenuDetailById, getMenuRelatedById} from "@/services/appwrite";
import colors from "@/assets/themes/colors";
import {MenuItem} from "@/type";
import {ComboOption, MenuDetail} from "@/type/MenuDetail";
import MenuList from "@/components/MenuList";
import {useCartStore} from "@/store/cart.store";
import AddToCartModal from "@/components/AddToCartModal";
import {ROUTES} from "@/src/routes";
import LoadingView from "@/components/LoadingView"; // Importar el nuevo modal

const ProductDetail = () => {
    const {itemId} = useLocalSearchParams<{ itemId: string }>();
    const {addItem, removeItem } = useCartStore()
    const router = useRouter();

    const [data, setData] = useState<MenuDetail | null>(null);
    const [relatedItems, setRelatedItems] = useState<MenuItem[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedCombos, setSelectedCombos] = useState<ComboOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [addedItem, setAddedItem] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const menu = await getMenuDetailById({id: itemId});
                setData(menu);
                if (menu?.relatedItemsId) {
                    const related = await getMenuRelatedById({id: menu.relatedItemsId})
                    setRelatedItems(related as MenuItem[]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                Alert.alert("Error", "No se pudo cargar la información del producto");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [itemId]);

    if (loading) {
        return <LoadingView message="Cargando producto..." />;
    }

    if (!data) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <Ionicons name="alert-circle-outline" size={64} color="#ccc"/>
                <Text style={{marginTop: 16, fontSize: 18, color: "#666"}}>Producto no encontrado</Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        marginTop: 16,
                        backgroundColor: colors.primary,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 20
                    }}
                >
                    <Text style={{color: "white", fontWeight: "600"}}>Volver</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleAdd = () => setQuantity((prev) => prev + 1);
    const handleRemove = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const toggleCombo = (combo: { $id: string; name: string; image_url: string; price: number }) => {
        if (selectedCombos.find((c) => c.$id === combo.$id)) {
            setSelectedCombos((prev) => prev.filter((c) => c.$id !== combo.$id));
        } else {
            setSelectedCombos((prev) => [...prev, combo]);
        }
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // Aquí puedes agregar la lógica para guardar en favoritos
    };

    const handleRelatedItemPress = (item: MenuItem) => {
        router.push(ROUTES.item(item.$id) as any)
    };

    const totalPrice = data.price + selectedCombos.reduce((acc, combo) => acc + combo.price, 0);

    const handleAddToCart = () => {
        const cartItem = {
            id: data.$id,
            name: data.name,
            price: data.price,
            quantity,
            selectedCombos,
            comment: comment.trim(),
            totalPrice: totalPrice * quantity,
            image_url: data.image_url
        };
        addItem(cartItem);
        setAddedItem(cartItem);
        setShowModal(true);

    };

    const handleCloseModal = () => {
        setShowModal(false);
        setAddedItem(null);
    };

    const handleViewCart = () => {
        handleCloseModal();
        router.push(ROUTES.cart);
    };

    const handleContinueShopping = () => {
        handleCloseModal();
        // Opcional: resetear el formulario
        setQuantity(1);
        setSelectedCombos([]);
        setComment("");
    };

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-white">
            <ScrollView
                contentContainerStyle={{paddingBottom: 120}}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Image
                        source={{uri: data.image_url}}
                        style={{
                            width: "100%",
                            height: Dimensions.get("screen").height / 2.5,
                            resizeMode: "cover",
                        }}
                    />

                    {/* Botones superiores */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            position: "absolute",
                            top: 50,
                            left: 20,
                            zIndex: 10,
                            backgroundColor: "rgba(255,255,255,0.95)",
                            borderRadius: 25,
                            padding: 8,
                            shadowColor: "#000",
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 5,
                        }}
                    >
                        <Ionicons name="arrow-back" size={28} color={colors.primary}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={toggleFavorite}
                        style={{
                            position: "absolute",
                            top: 50,
                            right: 20,
                            zIndex: 10,
                            backgroundColor: "rgba(255,255,255,0.95)",
                            borderRadius: 25,
                            padding: 8,
                            shadowColor: "#000",
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 5,
                        }}
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={28}
                            color={isFavorite ? "#ff4757" : colors.primary}
                        />
                    </TouchableOpacity>
                </View>

                {/* Información del producto */}
                <View className="px-4 pt-4">
                    <Text
                        style={{
                            fontSize: 28,
                            fontWeight: "700",
                            color: colors.primary,
                            marginBottom: 8,
                            lineHeight: 32,
                        }}
                        numberOfLines={3}
                    >
                        {data.name}
                    </Text>

                    <Text style={{
                        fontSize: 16,
                        color: "#666",
                        marginBottom: 16,
                        lineHeight: 22
                    }}>
                        {data.description}
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 20,
                        }}
                    >
                        <Text style={{fontSize: 32, fontWeight: "bold", color: colors.primary}}>
                            ${data.price}
                        </Text>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                            <Ionicons name="star" size={20} color="#ffcd03"/>
                            <Text style={{fontWeight: "600", fontSize: 16}}>{data.rating}</Text>
                        </View>
                    </View>

                    {/* Stats */}
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        backgroundColor: "#f8f8f8",
                        paddingVertical: 16,
                        borderRadius: 12,
                        marginBottom: 24
                    }}>
                        <View className={"flex-row items-center gap-2"}>
                            <Ionicons name="star-outline" size={18} color="#666"/>
                            <Text style={{fontSize: 14, color: "#666"}}>{data.rating} Rating</Text>
                        </View>
                        <View className={"flex-row items-center gap-2"}>
                            <Ionicons name="time-outline" size={18} color="#666"/>
                            <Text style={{fontSize: 14, color: "#666"}}>{data.preparationTime} min</Text>
                        </View>
                        <View className={"flex-row items-center gap-2"}>
                            <Ionicons name="restaurant-outline" size={18} color="#666"/>
                            <Text style={{fontSize: 14, color: "#666"}}>Caliente</Text>
                        </View>
                    </View>

                    {/* Ingredientes */}
                    <View style={{marginBottom: 24}}>
                        <Text style={{fontWeight: "700", fontSize: 18, marginBottom: 12, color: colors.primary}}>
                            Ingredientes
                        </Text>
                        <View style={{flexDirection: "row", flexWrap: "wrap", gap: 8}}>
                            {data.ingredients.map((ing, i) => (
                                <View
                                    key={i}
                                    style={{
                                        backgroundColor: "#e8f4f8",
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 15,
                                        borderWidth: 1,
                                        borderColor: "#d1ecf1",
                                    }}
                                >
                                    <Text style={{color: "#495057", fontSize: 13, fontWeight: "500"}}>
                                        {ing}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Combos */}
                    {data.comboOptions.length > 0 && (
                        <View style={{marginBottom: 24}}>
                            <Text style={{
                                fontWeight: "700",
                                fontSize: 18,
                                marginBottom: 12,
                                color: colors.primary
                            }}>
                                Añade a tu pedido
                            </Text>
                            {data.comboOptions.map((combo) => {
                                const selected = !!selectedCombos.find((c) => c.$id === combo.$id);
                                return (
                                    <TouchableOpacity
                                        key={combo.$id}
                                        onPress={() => toggleCombo(combo)}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginBottom: 12,
                                            backgroundColor: selected ? "#fff3cd" : "#f8f9fa",
                                            padding: 12,
                                            borderRadius: 12,
                                            borderWidth: selected ? 2 : 1,
                                            borderColor: selected ? "#ffeaa7" : "#e9ecef",
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <Image
                                            source={{uri: combo.image_url}}
                                            style={{width: 60, height: 60, borderRadius: 10}}
                                        />
                                        <View style={{flex: 1, marginLeft: 12}}>
                                            <Text style={{fontWeight: "600", fontSize: 15, marginBottom: 2}}>
                                                {combo.name}
                                            </Text>
                                            <Text style={{color: colors.primary, fontWeight: "700", fontSize: 16}}>
                                                +${combo.price}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: selected ? colors.primary : "#dee2e6",
                                                width: 32,
                                                height: 32,
                                                borderRadius: 16,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Ionicons
                                                name={selected ? "checkmark" : "add"}
                                                size={18}
                                                color={selected ? "#fff" : "#6c757d"}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    {/* Comentario */}
                    <View style={{marginBottom: 24}}>
                        <Text style={{
                            fontWeight: "700",
                            fontSize: 18,
                            marginBottom: 12,
                            color: colors.primary
                        }}>
                            Instrucciones especiales
                        </Text>
                        <TextInput
                            placeholder="¿Alguna preferencia o alergia que debamos saber?"
                            value={comment}
                            onChangeText={setComment}
                            multiline
                            numberOfLines={3}
                            style={{
                                borderWidth: 1,
                                borderColor: "#dee2e6",
                                borderRadius: 12,
                                padding: 12,
                                fontSize: 15,
                                textAlignVertical: "top",
                                backgroundColor: "#f8f9fa",
                            }}
                        />
                    </View>

                    <MenuList items={relatedItems} loading={relatedItems.length === 0}
                              title="También te puede interesar"/>
                </View>
            </ScrollView>

            {/* Botón fijo abajo - CON SAFE AREA */}
            <SafeAreaView
                edges={['bottom']}
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "#fff",
                    paddingHorizontal: 16,
                    paddingTop: 12,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTopWidth: 1,
                    borderColor: "#e9ecef",
                    shadowColor: "#000",
                    shadowOffset: {width: 0, height: -2},
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 10,
                }}
            >
                {/* Cantidad */}
                <View style={{flexDirection: "row", alignItems: "center", gap: 12}}>
                    <TouchableOpacity
                        onPress={handleRemove}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: quantity === 1 ? "#e9ecef" : colors.primary,
                            justifyContent: "center",
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                        disabled={quantity === 1}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="remove"
                            size={20}
                            color={quantity === 1 ? "#adb5bd" : "#fff"}
                        />
                    </TouchableOpacity>
                    <Text style={{fontSize: 18, fontWeight: "600", minWidth: 30, textAlign: "center"}}>
                        {quantity}
                    </Text>
                    <TouchableOpacity
                        onPress={handleAdd}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: colors.primary,
                            justifyContent: "center",
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={20} color="#fff"/>
                    </TouchableOpacity>
                </View>

                {/* Botón Agregar */}
                <TouchableOpacity
                    onPress={handleAddToCart}
                    style={{
                        backgroundColor: colors.primary,
                        borderRadius: 25,
                        paddingHorizontal: 24,
                        paddingVertical: 14,
                        shadowColor: "#000",
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 5,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                    }}
                    activeOpacity={0.9}
                >
                    <Ionicons name="basket-outline" size={20} color="#fff"/>
                    <Text style={{
                        color: "#fff",
                        fontWeight: "700",
                        fontSize: 16
                    }}>
                        Agregar ${totalPrice * quantity}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>

            {/* Modal de confirmación */}
            <AddToCartModal
                visible={showModal}
                onClose={handleCloseModal}
                onViewCart={handleViewCart}
                onContinueShopping={handleContinueShopping}
                item={addedItem}
            />
        </SafeAreaView>
    );
};

export default ProductDetail;