import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Image,
    Animated,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/assets/themes/colors';

const { width, height } = Dimensions.get('window');

interface AddToCartModalProps {
    visible: boolean;
    onClose: () => void;
    onViewCart: () => void;
    onContinueShopping: () => void;
    item: {
        name: string;
        price: number;
        quantity: number;
        selectedCombos: Array<{ name: string; price: number }>;
        totalPrice: number;
        image_url: string;
    } | null;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
                                                           visible,
                                                           onClose,
                                                           onViewCart,
                                                           onContinueShopping,
                                                           item
                                                       }) => {
    const [scaleAnim] = React.useState(new Animated.Value(0));
    const [opacityAnim] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        if (visible) {
            scaleAnim.setValue(0);
            opacityAnim.setValue(0);
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 150,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!item) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20,
            }}>
                <Animated.View style={{
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    width: width - 40,
                    maxHeight: height * 0.8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 20,
                }}>
                    {/* Header con animación de éxito */}
                    <View style={{
                        backgroundColor: colors.primary,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        paddingVertical: 20,
                        paddingHorizontal: 20,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Círculos decorativos */}
                        <View style={{
                            position: 'absolute',
                            top: -30,
                            right: -30,
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                        }} />
                        <View style={{
                            position: 'absolute',
                            bottom: -20,
                            left: -20,
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                        }} />

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderRadius: 25,
                                padding: 8,
                                marginRight: 12
                            }}>
                                <Ionicons name="checkmark-circle" size={32} color="#fff" />
                            </View>
                            <Text style={{
                                color: '#fff',
                                fontSize: 20,
                                fontWeight: '700',
                                textAlign: 'center'
                            }}>
                                ¡Agregado al carrito!
                            </Text>
                        </View>
                    </View>

                    {/* Contenido del producto */}
                    <View style={{ padding: 20 }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 20
                        }}>
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
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '700',
                                    color: colors.primary,
                                    marginBottom: 4
                                }} numberOfLines={2}>
                                    {item.name}
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#666',
                                    marginBottom: 8
                                }}>
                                    Cantidad: {item.quantity}
                                </Text>
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: '700',
                                    color: colors.primary
                                }}>
                                    ${item.totalPrice.toFixed(2)}
                                </Text>
                            </View>
                        </View>

                        {/* Combos seleccionados */}
                        {item.selectedCombos.length > 0 && (
                            <View style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: 12,
                                padding: 16,
                                marginBottom: 20
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: colors.primary,
                                    marginBottom: 12
                                }}>
                                    Extras incluidos:
                                </Text>
                                {item.selectedCombos.map((combo, index) => (
                                    <View key={index} style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 8,
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Ionicons name="add-circle-outline" size={16} color="#666" />
                                            <Text style={{
                                                marginLeft: 8,
                                                fontSize: 14,
                                                color: '#333',

                                            }}>
                                                {combo.name}
                                            </Text>
                                        </View>
                                        <Text style={{
                                            fontSize: 14,
                                            flex: 1,
                                            textAlign: "right",
                                            fontWeight: '600',
                                            color: colors.primary,
                                        }}>
                                            +${combo.price.toFixed(2)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Botones de acción */}
                        <View style={{ gap: 12 }}>
                            <TouchableOpacity
                                onPress={onViewCart}
                                style={{
                                    backgroundColor: colors.primary,
                                    borderRadius: 16,
                                    paddingVertical: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 6,
                                    elevation: 5
                                }}
                                activeOpacity={0.9}
                            >
                                <Ionicons name="basket-outline" size={20} color="#fff" />
                                <Text style={{
                                    color: '#fff',
                                    fontSize: 16,
                                    fontWeight: '700'
                                }}>
                                    Ver carrito
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onContinueShopping}
                                style={{
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: 16,
                                    paddingVertical: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    borderWidth: 1,
                                    borderColor: '#e9ecef'
                                }}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="restaurant-outline" size={20} color={colors.primary} />
                                <Text style={{
                                    color: colors.primary,
                                    fontSize: 16,
                                    fontWeight: '600'
                                }}>
                                    Seguir comprando
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default AddToCartModal;