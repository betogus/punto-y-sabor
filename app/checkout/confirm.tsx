import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import {ROUTES} from "@/src/routes";
import {router} from "expo-router";

const Confirm = ({ orderStatus = 'success', onRetry = () => {} }) => {
    // orderStatus puede ser: 'success', 'error', 'loading'
    // orderData contiene información del pedido como número, total, etc.

    let orderData : any;
    const renderSuccessView = () => (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Text style={styles.successIcon}>✓</Text>
            </View>

            <Text style={styles.title}>¡Pedido Confirmado!</Text>
            <Text style={styles.subtitle}>Tu orden ha sido procesada exitosamente</Text>

            <View style={styles.orderDetails}>
                <Text style={styles.orderNumber}>Número de pedido: #{orderData?.orderNumber || '12345'}</Text>
                <Text style={styles.orderInfo}>Total: ${orderData?.total || '0.00'}</Text>
                <Text style={styles.orderInfo}>Tiempo estimado: {orderData?.estimatedTime || '30-45'} minutos</Text>
            </View>

            <Text style={styles.description}>
                Recibirás una notificación cuando tu pedido esté siendo preparado.
            </Text>

            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push(ROUTES.home)}>
                <Text style={styles.primaryButtonText}>Volver al Inicio</Text>
            </TouchableOpacity>
        </View>
    )

    const renderErrorView = () => (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Text style={styles.errorIcon}>✗</Text>
            </View>

            <Text style={styles.titleError}>Algo salió mal</Text>
            <Text style={styles.subtitle}>No pudimos procesar tu pedido</Text>

            <View style={styles.errorDetails}>
                <Text style={styles.errorMessage}>
                    {orderData?.errorMessage || 'Hubo un problema con el procesamiento del pago o la disponibilidad de los productos.'}
                </Text>
            </View>

            <Text style={styles.description}>
                Por favor, verifica tu información e intenta nuevamente.
            </Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={onRetry}>
                    <Text style={styles.primaryButtonText}>Intentar de Nuevo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push(ROUTES.home)}>
                    <Text style={styles.secondaryButtonText}>Volver al Inicio</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    const renderLoadingView = () => (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Text style={styles.loadingIcon}>⏳</Text>
            </View>

            <Text style={styles.title}>Procesando tu pedido...</Text>
            <Text style={styles.subtitle}>Esto solo tomará unos segundos</Text>
        </View>
    )

    return (
        <View style={styles.wrapper}>
            {orderStatus === 'success' && renderSuccessView()}
            {orderStatus === 'error' && renderErrorView()}
            {orderStatus === 'loading' && renderLoadingView()}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    successIcon: {
        fontSize: 36,
        color: '#28a745',
        fontWeight: 'bold',
    },
    errorIcon: {
        fontSize: 36,
        color: '#dc3545',
        fontWeight: 'bold',
    },
    loadingIcon: {
        fontSize: 36,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        marginBottom: 8,
    },
    titleError: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#dc3545',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 32,
    },
    orderDetails: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    orderNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
        textAlign: 'center',
    },
    orderInfo: {
        fontSize: 16,
        color: '#495057',
        textAlign: 'center',
        marginBottom: 4,
    },
    errorDetails: {
        backgroundColor: '#fff5f5',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#dc3545',
    },
    errorMessage: {
        fontSize: 14,
        color: '#721c24',
        textAlign: 'center',
        lineHeight: 20,
    },
    description: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 20,
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#007bff',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 32,
        width: '100%',
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 32,
        width: '100%',
        borderWidth: 1,
        borderColor: '#6c757d',
    },
    secondaryButtonText: {
        color: '#6c757d',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
})

export default Confirm

