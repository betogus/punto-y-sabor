import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
    StatusBar
} from 'react-native';
import { Stack, router } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import {SafeAreaView} from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');

const DeliveryMap = () => {
    const mapRef = useRef<any>(null);
    const [customerLocation, setCustomerLocation] = useState<any>(null);
    const [deliveryLocation, setDeliveryLocation] = useState<any>(null);
    const [orderStatus, setOrderStatus] = useState('confirmed');
    const [estimatedTime, setEstimatedTime] = useState(25);
    const [orderNumber] = useState('R-' + Math.floor(Math.random() * 1000));

    // Ubicación del restaurante (ejemplo en Córdoba)
    const restaurantLocation = {
        latitude: -31.4201,
        longitude: -64.1888,
        title: "Punto y Sabor",
        address: "Av. Colón 1234, Córdoba"
    };

    // Obtener ubicación del cliente
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Error', 'Se necesita permiso de ubicación para funcionar');
                return;
            }

            try {
                let location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });

                setCustomerLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            } catch (error) {
                Alert.alert('Error', 'No se pudo obtener tu ubicación');
            }
        })();
    }, []);

    // Simular ciclo de vida del pedido
    useEffect(() => {
        const statusTimeline = [
            { status: 'preparing', delay: 3000 },
            { status: 'on_way', delay: 8000 },
            { status: 'delivered', delay: 20000 }
        ];

        let timeouts: number[] = [];

        statusTimeline.forEach(({ status, delay }) => {
            const timeout = setTimeout(() => {
                setOrderStatus(status);
                if (status === 'on_way') {
                    startDeliverySimulation();
                }
                if (status === 'delivered') {
                    setEstimatedTime(0);
                }
            }, delay);

            timeouts.push(timeout);
        });

        return () => timeouts.forEach(clearTimeout);
    }, []);

    // Simular movimiento del delivery
    const startDeliverySimulation = () => {
        if (!customerLocation) return;

        setDeliveryLocation({
            latitude: restaurantLocation.latitude + 0.003,
            longitude: restaurantLocation.longitude + 0.002,
        });

        const deliveryInterval = setInterval(() => {
            setDeliveryLocation((prevLocation: { latitude: number; longitude: number; }) => {
                if (!prevLocation || !customerLocation) return prevLocation;

                const latDiff = (customerLocation.latitude - prevLocation.latitude) * 0.08;
                const lngDiff = (customerLocation.longitude - prevLocation.longitude) * 0.08;

                const newLocation = {
                    latitude: prevLocation.latitude + latDiff,
                    longitude: prevLocation.longitude + lngDiff,
                };

                const distance = Math.sqrt(
                    Math.pow(customerLocation.latitude - newLocation.latitude, 2) +
                    Math.pow(customerLocation.longitude - newLocation.longitude, 2)
                );

                if (distance < 0.0005) {
                    clearInterval(deliveryInterval);
                    setOrderStatus('delivered');
                    return customerLocation;
                }

                return newLocation;
            });

            setEstimatedTime(prev => Math.max(0, prev - 1));
        }, 2000);
    };

    // Centrar mapa en todos los puntos
    const fitToMarkers = () => {
        if (!customerLocation || !mapRef.current) return;

        const coordinates = [restaurantLocation, customerLocation];
        if (deliveryLocation) coordinates.push(deliveryLocation);

        mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: true,
        });
    };

    // Obtener info del estado
    const getStatusInfo = () => {
        switch (orderStatus) {
            case 'confirmed':
                return {
                    text: 'Pedido Confirmado',
                    color: '#FF9800',
                    icon: '📝',
                    description: 'Tu pedido fue recibido correctamente'
                };
            case 'preparing':
                return {
                    text: 'Preparando',
                    color: '#FF5722',
                    icon: '🍳',
                    description: 'El chef está preparando tu comida'
                };
            case 'on_way':
                return {
                    text: 'En Camino',
                    color: '#2196F3',
                    icon: '🏍️',
                    description: 'El repartidor está yendo hacia ti'
                };
            case 'delivered':
                return {
                    text: '¡Entregado!',
                    color: '#4CAF50',
                    icon: '🎉',
                    description: 'Tu pedido fue entregado con éxito'
                };
            default:
                return { text: 'Cargando...', color: '#9E9E9E', icon: '⏳' };
        }
    };

    const statusInfo = getStatusInfo();

    if (!customerLocation) {
        return (
            <>
                <Stack.Screen
                    options={{
                        title: "Siguiendo tu pedido",
                        headerShown: true
                    }}
                />
                <SafeAreaView style={styles.loadingContainer}>
                    <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
                    <Text style={styles.loadingText}>📍 Obteniendo tu ubicación...</Text>
                    <Text style={styles.loadingSubtext}>
                        Asegúrate de tener GPS activado
                    </Text>
                </SafeAreaView>
            </>
        );
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                {/* Mapa */}
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: customerLocation.latitude,
                        longitude: customerLocation.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    }}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    onMapReady={fitToMarkers}
                >
                    {/* Marcador del restaurante */}
                    <Marker
                        coordinate={restaurantLocation}
                        title={restaurantLocation.title}
                        description={restaurantLocation.address}
                    >
                        <View style={styles.restaurantMarker}>
                            <Text style={styles.markerText}>🍕</Text>
                        </View>
                    </Marker>

                    {/* Marcador del cliente */}
                    <Marker
                        coordinate={customerLocation}
                        title="Tu ubicación"
                        description="Aquí entregaremos tu pedido"
                    >
                        <View style={styles.customerMarker}>
                            <Text style={styles.markerText}>🏠</Text>
                        </View>
                    </Marker>

                    {/* Marcador del delivery */}
                    {deliveryLocation && orderStatus !== 'delivered' && (
                        <Marker
                            coordinate={deliveryLocation}
                            title="Repartidor"
                            description="En movimiento hacia ti"
                        >
                            <View style={styles.deliveryMarker}>
                                <Text style={styles.markerText}>🏍️</Text>
                            </View>
                        </Marker>
                    )}

                    {/* Línea de ruta */}
                    {deliveryLocation && orderStatus === 'on_way' && (
                        <Polyline
                            coordinates={[restaurantLocation, deliveryLocation, customerLocation]}
                            strokeColor={statusInfo.color}
                            strokeWidth={4}
                            lineDashPattern={[10, 5]}
                        />
                    )}
                </MapView>

                {/* Botones de control */}
                <View style={styles.controls}>

                    <TouchableOpacity
                    style={styles.controlButton}

                    >
                        <Text> Obtener mi ubicación actual</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={fitToMarkers}
                    >
                        <Text style={styles.buttonText}>📍 Ver Todo</Text>
                    </TouchableOpacity>

                    {orderStatus === 'delivered' && (
                        <TouchableOpacity
                            style={[styles.controlButton, styles.rateButton]}
                            onPress={() => Alert.alert('¡Gracias!', 'Tu opinión es importante')}
                        >
                            <Text style={styles.buttonText}>⭐ Calificar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    loadingSubtext: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    header: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    headerContent: {
        alignItems: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    statusText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    statusDescription: {
        color: 'white',
        fontSize: 14,
        opacity: 0.9,
    },
    timeText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    map: {
        flex: 1,
    },
    restaurantMarker: {
        backgroundColor: '#FF5722',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
    },
    customerMarker: {
        backgroundColor: '#2196F3',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
    },
    deliveryMarker: {
        backgroundColor: '#4CAF50',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
    },
    markerText: {
        fontSize: 16,
        textAlign: 'center',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    controlButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        elevation: 2,
    },
    rateButton: {
        backgroundColor: '#FF9800',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default DeliveryMap;