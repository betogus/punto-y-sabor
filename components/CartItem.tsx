import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/store/cart.store';
import colors from '@/assets/themes/colors';
import {CartItemType} from "@/type/CartType";



const CartItem: React.FC<CartItemType> = ( item ) => {
    const { decreaseQty, increaseQty, removeItem } = useCartStore();

    const basePrice = item.price;
    const combosPrice = item.selectedCombos.reduce((acc, combo) => acc + combo.price, 0);
    const unitPrice = basePrice + combosPrice;

    return (
        <View style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#e9ecef',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'flex-start'
            }}>
                {/* Imagen del producto */}
                <Image
                    source={{ uri: item.image_url }}
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 12,
                        backgroundColor: '#f8f9fa'
                    }}
                    resizeMode="cover"
                />

                {/* Información del producto */}
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: colors.primary,
                        marginBottom: 4
                    }} numberOfLines={2}>
                        {item.name}
                    </Text>

                    {/* Precio base */}
                    <Text style={{
                        fontSize: 14,
                        color: '#666',
                        marginBottom: 8
                    }}>
                        Precio base: ${basePrice.toFixed(2)}
                    </Text>

                    {/* Combos seleccionados */}
                    {item.selectedCombos.length > 0 && (
                        <View style={{
                            backgroundColor: '#f8f9fa',
                            borderRadius: 8,
                            padding: 8,
                            marginBottom: 8
                        }}>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: '600',
                                color: colors.primary,
                                marginBottom: 4
                            }}>
                                Extras:
                            </Text>
                            {item.selectedCombos.map((combo, index) => (
                                <View key={combo.$id || index} style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 2
                                }}>
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#666',
                                        flex: 1
                                    }}>
                                        • {combo.name}
                                    </Text>
                                    <Text style={{
                                        fontSize: 12,
                                        fontWeight: '600',
                                        color: colors.primary
                                    }}>
                                        +${combo.price.toFixed(2)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Comentario */}
                    {item.comment && (
                        <View style={{
                            backgroundColor: '#fff3cd',
                            borderRadius: 8,
                            padding: 8,
                            marginBottom: 8,
                            borderWidth: 1,
                            borderColor: '#ffeaa7'
                        }}>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: '600',
                                color: '#856404',
                                marginBottom: 2
                            }}>
                                Nota especial:
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: '#856404'
                            }}>
                                {item.comment}
                            </Text>
                        </View>
                    )}

                    {/* Precio total del item */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: '#666'
                        }}>
                            ${unitPrice.toFixed(2)} c/u
                        </Text>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '700',
                            color: colors.primary
                        }}>
                            ${item.totalPrice.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Controles de cantidad */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 16,
                paddingTop: 16,
                borderTopWidth: 1,
                borderColor: '#e9ecef'
            }}>
                <TouchableOpacity
                    onPress={() => removeItem(item.id, [])}
                    style={{
                        backgroundColor: '#ff4757',
                        borderRadius: 8,
                        padding: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4
                    }}
                    activeOpacity={0.8}
                >
                    <Ionicons name="trash-outline" size={16} color="#fff" />
                    <Text style={{
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: '600'
                    }}>
                        Eliminar
                    </Text>
                </TouchableOpacity>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 12,
                    padding: 4
                }}>
                    <TouchableOpacity
                        onPress={() => decreaseQty(item.id, [])}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: item.quantity === 1 ? '#e9ecef' : colors.primary,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        disabled={item.quantity === 1}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="remove"
                            size={16}
                            color={item.quantity === 1 ? '#adb5bd' : '#fff'}
                        />
                    </TouchableOpacity>

                    <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: colors.primary,
                        minWidth: 40,
                        textAlign: 'center'
                    }}>
                        {item.quantity}
                    </Text>

                    <TouchableOpacity
                        onPress={() => increaseQty(item.id, [])}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: colors.primary,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default CartItem;