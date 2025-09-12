import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {useCartStore} from "@/store/cart.store";
import CustomHeader from "@/components/CustomHeader";
import {PaymentInfoStripeProps} from "@/type";
import cn from "clsx";
import CustomButton from "@/components/CustomButton";
import CartItem from "@/components/CartItem";
import {Ionicons} from "@expo/vector-icons";
import colors from "@/assets/themes/colors";
import {ROUTES} from "@/src/routes";
import {router} from "expo-router";

const PaymentInfoStripe = ({label, value, labelStyle, valueStyle}: PaymentInfoStripeProps) => (
    <View className="flex-between flex-row my-1">
        <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
            {label}
        </Text>
        <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
            {value}
        </Text>
    </View>
)

const Cart = () => {
    const {items, getTotalItems, getTotalPrice} = useCartStore();
    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    const deliveryFee = 5.00;
    const discount = 0.50;
    const finalTotal = totalPrice + deliveryFee - discount;

    const EmptyCartComponent = () => (
        <View className="flex-1 justify-center items-center px-6 pt-20">
            <View style={{
                width: 120,
                height: 120,
                backgroundColor: '#f8f9fa',
                borderRadius: 60,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 24
            }}>
                <Ionicons name="basket-outline" size={48} color="#adb5bd" />
            </View>

            <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.primary,
                marginBottom: 8,
                textAlign: 'center'
            }}>
                Tu carrito está vacío
            </Text>

            <Text style={{
                fontSize: 16,
                color: '#666',
                textAlign: 'center',
                lineHeight: 22,
                marginBottom: 32
            }}>
                ¡Agrega algunos productos deliciosos para empezar tu pedido!
            </Text>

            <TouchableOpacity
                onPress={() => router.push(ROUTES.home)}
                style={{
                    backgroundColor: colors.primary,
                    paddingHorizontal: 32,
                    paddingVertical: 16,
                    borderRadius: 25,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8
                }}
            >
                <Ionicons name="restaurant-outline" size={20} color="#fff" />
                <Text style={{
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: 16
                }}>
                    Ver menú
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={items}
                renderItem={({ item }) => <CartItem {...item} />}
                keyExtractor={(item) => item.id}
                contentContainerClassName="pb-32 px-5 pt-5"
                ListHeaderComponent={() => (
                    <View>
                        <CustomHeader title="Tu Carrito"/>
                        {totalItems > 0 && (
                            <View style={{
                                backgroundColor: '#e8f4f8',
                                borderRadius: 12,
                                padding: 16,
                                marginBottom: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 12
                            }}>
                                <View style={{
                                    backgroundColor: colors.primary,
                                    borderRadius: 20,
                                    padding: 8
                                }}>
                                    <Ionicons name="information" size={16} color="#fff" />
                                </View>
                                <Text style={{
                                    flex: 1,
                                    fontSize: 14,
                                    color: '#495057',
                                    lineHeight: 18
                                }}>
                                    Tienes {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu carrito
                                </Text>
                            </View>
                        )}
                    </View>
                )}
                ListEmptyComponent={EmptyCartComponent}
                ListFooterComponent={() => totalItems > 0 && (
                    <View className="gap-5">
                        {/* Información de entrega */}
                        <View style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: 16,
                            padding: 16,
                            marginTop: 20,
                            borderWidth: 1,
                            borderColor: '#e9ecef'
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 12
                            }}>
                                <Ionicons name="time-outline" size={20} color={colors.primary} />
                                <Text style={{
                                    marginLeft: 8,
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: colors.primary
                                }}>
                                    Tiempo estimado de entrega
                                </Text>
                            </View>
                            <Text style={{
                                fontSize: 14,
                                color: '#666',
                                marginLeft: 28
                            }}>
                                25-35 minutos
                            </Text>
                        </View>

                        {/* Resumen de pago mejorado */}
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 16,
                            padding: 20,
                            borderWidth: 1,
                            borderColor: '#e9ecef',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3
                        }}>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: '700',
                                color: colors.primary,
                                marginBottom: 16
                            }}>
                                Resumen del pedido
                            </Text>

                            <PaymentInfoStripe
                                label={`Subtotal (${totalItems} ${totalItems === 1 ? 'producto' : 'productos'})`}
                                value={`$${totalPrice.toFixed(2)} `}
                            />

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 4
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text className="paragraph-medium text-gray-200">
                                        Costo de envío
                                    </Text>
                                    <Ionicons name="bicycle-outline" size={16} color="#666" style={{ marginLeft: 4 }} />
                                </View>
                                <Text className="paragraph-bold text-dark-100">
                                    ${deliveryFee.toFixed(2)}
                                </Text>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginVertical: 4
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text className="paragraph-medium text-gray-200">
                                        Descuento
                                    </Text>
                                    <Ionicons name="pricetag-outline" size={16} color="#28a745" style={{ marginLeft: 4 }} />
                                </View>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: '600',
                                    color: '#28a745'
                                }}>
                                    -${discount.toFixed(2)}
                                </Text>
                            </View>

                            <View style={{
                                borderTopWidth: 1,
                                borderColor: '#e9ecef',
                                marginVertical: 16,
                                paddingTop: 16
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{
                                        fontSize: 18,
                                        fontWeight: '700',
                                        color: '#000'
                                    }}>
                                        Total
                                    </Text>
                                    <Text style={{
                                        fontSize: 20,
                                        fontWeight: '700',
                                        color: colors.primary
                                    }}>
                                        ${finalTotal.toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <CustomButton
                            onPress={() => {router.push('/delivery-map');}}
                            title={`Ordenar ahora • $${finalTotal.toFixed(2)}`}

                        />
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default Cart