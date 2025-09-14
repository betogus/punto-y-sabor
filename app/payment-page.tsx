import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Modal
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useCartStore} from "@/store/cart.store";
import {SafeAreaView} from "react-native-safe-area-context";
import CustomHeader from "@/components/CustomHeader";

const PaymentSimulation = () => {
    const {items: cartItems, getTotalPrice} = useCartStore();
    const totalAmount = getTotalPrice();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardData, setCardData] = useState({
        number: '',
        expiryDate: '',
        cvv: '',
        holderName: ''
    });
    const [showQR, setShowQR] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Formatear número de tarjeta (espacios cada 4 dígitos)
    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\s/g, '');
        const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
        return formatted.substring(0, 19); // Máximo 16 dígitos + 3 espacios
    };

    // Formatear fecha de expiración (MM/YY)
    const formatExpiryDate = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
        }
        return cleaned;
    };

    // Validar datos de tarjeta
    const validateCardData = () => {
        const {number, expiryDate, cvv, holderName} = cardData;

        if (number.replace(/\s/g, '').length !== 16) {
            Alert.alert('Error', 'El número de tarjeta debe tener 16 dígitos');
            return false;
        }

        if (expiryDate.length !== 5) {
            Alert.alert('Error', 'Fecha de expiración inválida (MM/YY)');
            return false;
        }

        if (cvv.length !== 3) {
            Alert.alert('Error', 'CVV debe tener 3 dígitos');
            return false;
        }

        if (holderName.trim().length < 2) {
            Alert.alert('Error', 'Nombre del titular requerido');
            return false;
        }

        return true;
    };

    // Procesar pago
    const handlePayment = async () => {
        setProcessing(true);

        try {
            if (paymentMethod === 'card' && !validateCardData()) {
                setProcessing(false);
                return;
            }

            // Simular procesamiento de pago (2 segundos)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simular respuesta exitosa (90% de éxito)
            const success = Math.random() > 0.1;

            if (success) {
                const paymentResult = {
                    success: true,
                    paymentId: `PAY_${Date.now()}`,
                    method: paymentMethod,
                    amount: totalAmount,
                    timestamp: new Date().toISOString()
                };

                Alert.alert(
                    'Pago Exitoso',
                    `Tu pedido ha sido confirmado.\nID de pago: ${paymentResult.paymentId}`,
                    [{text: 'OK'}]
                );
            } else {
                Alert.alert('Error de Pago', 'No se pudo procesar el pago. Intenta nuevamente.');
            }
        } catch (error) {
            Alert.alert('Error', 'Error inesperado al procesar el pago');
        } finally {
            setProcessing(false);
        }
    };

    // Renderizar QR Code (simulado)
    const renderQRCode = () => (
        <Modal visible={showQR} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.qrModal}>
                    <Text style={styles.qrTitle}>Código QR para Pago</Text>
                    <View style={styles.qrPlaceholder}>
                        <Text style={styles.qrText}>📱</Text>
                        <Text style={styles.qrInstruction}>
                            Escanea este código con tu app de pagos
                        </Text>
                        <Text style={styles.amount}>${totalAmount}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.qrButton}
                        onPress={() => setShowQR(false)}
                    >
                        <Text style={styles.buttonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader title={"Método de pago"}/>

            <ScrollView >

                {/* Resumen del pedido */}
                <View style={styles.orderSummary}>
                    <Text style={styles.summaryTitle}>Resumen del Pedido</Text>
                    {cartItems.map((item, index) => (
                        <View key={index} style={styles.orderItem}>
                            <Text>{item.name} x{item.quantity}</Text>
                            <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalText}>Total: ${totalAmount}</Text>
                    </View>
                </View>

                {/* Selector de método de pago */}
                <View style={styles.paymentMethodContainer}>
                    <Text style={styles.label}>Método de Pago:</Text>
                    <Picker
                        selectedValue={paymentMethod}
                        onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="💳 Tarjeta de Crédito/Débito" value="card"/>
                        <Picker.Item label="📱 Código QR" value="qr"/>
                        <Picker.Item label="💵 Efectivo" value="cash"/>
                    </Picker>
                </View>

                {/* Formulario de tarjeta */}
                {paymentMethod === 'card' && (
                    <View style={styles.cardForm}>
                        <Text style={styles.formTitle}>Datos de la Tarjeta</Text>

                        <Text style={styles.label}>Número de Tarjeta</Text>
                        <TextInput
                            style={styles.input}
                            value={cardData.number}
                            onChangeText={(text) =>
                                setCardData({...cardData, number: formatCardNumber(text)})
                            }
                            placeholder="1234 5678 9012 3456"
                            keyboardType="numeric"
                            maxLength={19}
                        />

                        <View style={styles.row}>
                            <View style={styles.halfInput}>
                                <Text style={styles.label}>Fecha (MM/YY)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={cardData.expiryDate}
                                    onChangeText={(text) =>
                                        setCardData({...cardData, expiryDate: formatExpiryDate(text)})
                                    }
                                    placeholder="12/25"
                                    keyboardType="numeric"
                                    maxLength={5}
                                />
                            </View>

                            <View style={styles.halfInput}>
                                <Text style={styles.label}>CVV</Text>
                                <TextInput
                                    style={styles.input}
                                    value={cardData.cvv}
                                    onChangeText={(text) =>
                                        setCardData({...cardData, cvv: text.replace(/\D/g, '')})
                                    }
                                    placeholder="123"
                                    keyboardType="numeric"
                                    maxLength={3}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <Text style={styles.label}>Nombre del Titular</Text>
                        <TextInput
                            style={styles.input}
                            value={cardData.holderName}
                            onChangeText={(text) =>
                                setCardData({...cardData, holderName: text})
                            }
                            placeholder="Juan Pérez"
                            autoCapitalize="words"
                        />
                    </View>
                )}

                {/* Pago con QR */}
                {paymentMethod === 'qr' && (
                    <View style={styles.qrSection}>
                        <Text style={styles.formTitle}>Pago con Código QR</Text>
                        <Text style={styles.qrDescription}>
                            Genera un código QR para pagar con tu aplicación de pagos favorita
                        </Text>
                        <TouchableOpacity
                            style={styles.qrGenerateButton}
                            onPress={() => setShowQR(true)}
                        >
                            <Text style={styles.buttonText}>Generar Código QR</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Pago en efectivo */}
                {paymentMethod === 'cash' && (
                    <View style={styles.cashSection}>
                        <Text style={styles.formTitle}>Pago en Efectivo</Text>
                        <Text style={styles.cashDescription}>
                            💵 Pagarás en efectivo al recibir tu pedido
                        </Text>
                        <Text style={styles.cashAmount}>
                            Total a pagar: ${totalAmount}
                        </Text>
                        <Text style={styles.cashNote}>
                            * Asegúrate de tener el monto exacto
                        </Text>
                    </View>
                )}

                {/* Botón de pago */}
                <TouchableOpacity
                    style={[styles.payButton, processing && styles.payButtonDisabled]}
                    onPress={handlePayment}
                    disabled={processing}
                >
                    <Text style={styles.payButtonText}>
                        {processing ? 'Procesando...' :
                            paymentMethod === 'cash' ? 'Confirmar Pedido' : 'Pagar Ahora'}
                    </Text>
                </TouchableOpacity>

                {renderQRCode()}
            </ScrollView>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    orderSummary: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 2,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
        marginTop: 10,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    paymentMethodContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
        color: '#333',
    },
    picker: {
        backgroundColor: '#f8f8f8',
    },
    cardForm: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 2,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        flex: 0.48,
    },
    qrSection: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
        elevation: 2,
    },
    qrDescription: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
    },
    qrGenerateButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        minWidth: 200,
    },
    cashSection: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
        elevation: 2,
    },
    cashDescription: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
    },
    cashAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 10,
    },
    cashNote: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    payButton: {
        backgroundColor: '#FF6B35',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 3,
    },
    payButtonDisabled: {
        backgroundColor: '#ccc',
    },
    payButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrModal: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        width: '80%',
    },
    qrTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    qrPlaceholder: {
        width: 200,
        height: 200,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    qrText: {
        fontSize: 48,
        marginBottom: 10,
    },
    qrInstruction: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 10,
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    qrButton: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 8,
        minWidth: 120,
    },
});

export default PaymentSimulation;