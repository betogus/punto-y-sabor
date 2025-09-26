import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
    TextInput,
    FlatList,
    ActivityIndicator, Keyboard,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import {router} from "expo-router";
import {ROUTES} from "@/src/routes";
import colors from "@/assets/themes/colors";
import CustomHeader from "@/components/CustomHeader";
import {useCartStore} from "@/store/cart.store";

const { width, height } = Dimensions.get('window');

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY; // <-- poné tu API KEY

const Delivery = () => {
    const manualPredictions = [
        {index: "CurrentLocation", description: "Obtener mi ubicación actual"},
        {index: "ManualLocation", description: "Marcar en el mapa"}
    ];
    const { setDelivery } = useCartStore();
    const mapRef = useRef<any>(null);
    const [customerLocation, setCustomerLocation] = useState<any>(null);
    const [deliveryLocation, setDeliveryLocation] = useState<any>(null);
    const [orderStatus, setOrderStatus] = useState('confirmed');
    const [estimatedTime, setEstimatedTime] = useState(25);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [showPredictions, setShowPredictions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [isManualMode, setIsManualMode] = useState(false);

    const fetchPlaces = async (text: string) => {
        if (!text.trim()) {
            // Si no hay texto, solo mostrar opciones manuales
            setPredictions([]);
            setShowPredictions(true);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
                    text
                )}&key=${GOOGLE_API_KEY}&language=es&components=country:ar`
            );
            const json = await res.json();

            if (json.predictions) {
                setPredictions(json.predictions);
                setShowPredictions(true);
            } else {
                setPredictions([]);
                setShowPredictions(true); // Mantener visible para mostrar opciones manuales
            }
        } catch (error) {
            console.error('Error fetching places:', error);
            setPredictions([]);
            setShowPredictions(true); // Mantener visible para mostrar opciones manuales
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextStep = () => {
        const location = [customerLocation.latitude, customerLocation.longitude];
        setDelivery(selectedAddress, location, "delivery")
        router.push(ROUTES.payment)
    }

    // Función para obtener las predicciones a mostrar
    const getPredictionsToShow = () => {
        // Si hay texto y predicciones de Google, mostrar esas + opciones manuales
        if (searchText.trim() && predictions.length > 0) {
            return [...predictions, ...manualPredictions];
        }
        // Si no hay texto o no hay predicciones, solo mostrar opciones manuales
        return manualPredictions;
    };

    const getPlaceDetails = async (placeId: string) => {
        try {
            console.log('Obteniendo detalles para place_id:', placeId);
            setIsLoading(true);
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}&fields=geometry,formatted_address`
            );
            const json = await res.json();

            console.log('Respuesta de Place Details:', json);

            if (json.result && json.result.geometry) {
                const location = {
                    latitude: json.result.geometry.location.lat,
                    longitude: json.result.geometry.location.lng,
                };

                console.log('Nueva ubicación del cliente:', location);

                setCustomerLocation(location);
                setSelectedAddress(json.result.formatted_address);
                setSearchText(json.result.formatted_address);
                setShowPredictions(false);

                // Centrar el mapa en la nueva ubicación
                if (mapRef.current) {
                    console.log('Animando mapa a nueva ubicación');
                    mapRef.current.animateToRegion({
                        ...location,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }, 1000);
                }
            } else {
                console.error('No se encontraron resultados válidos:', json);
                Alert.alert('Error', 'No se pudo obtener la ubicación de esta dirección');
            }
        } catch (error) {
            console.error('Error getting place details:', error);
            Alert.alert('Error', 'No se pudo obtener los detalles de la dirección');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectAddress = (item: any) => {
        if (item?.index == "CurrentLocation") return handleCurrentPosition()
        if (item?.index == "ManualLocation") return toggleManualMode()
        console.log('Seleccionando dirección:', item.description);
        getPlaceDetails(item.place_id);
    };

    const handleManualLocationSelect = async (event: any) => {
        if (!isManualMode) return;

        const { latitude, longitude } = event.nativeEvent.coordinate;

        console.log('Ubicación manual seleccionada:', { latitude, longitude });

        setCustomerLocation({ latitude, longitude });
        setIsManualMode(false); // Salir del modo manual después de seleccionar
        Keyboard.dismiss();
        setShowPredictions(false);
        // Obtener dirección de las coordenadas (geocoding reverso)
        try {
            setIsLoading(true);
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}&language=es`
            );
            const json = await res.json();

            if (json.results && json.results[0]) {
                const address = json.results[0].formatted_address;
                setSelectedAddress(address);
                setSearchText(address);
                console.log('Dirección obtenida:', address);
            } else {
                setSelectedAddress('Ubicación seleccionada manualmente');
                setSearchText('Ubicación seleccionada manualmente');
            }
        } catch (error) {
            console.log('Error getting address from coordinates:', error);
            setSelectedAddress('Ubicación seleccionada manualmente');
            setSearchText('Ubicación seleccionada manualmente');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleManualMode = () => {
        setIsManualMode(!isManualMode);
        setShowPredictions(false);
    };

    // Ubicación del restaurante (ejemplo en Córdoba)
    const restaurantLocation = {
        latitude: -31.4201,
        longitude: -64.1888,
        title: "Punto y Sabor",
        address: "Av. Colón 1234, Córdoba"
    };

    useEffect(() => {
        fitToMarkers()
    }, [customerLocation, deliveryLocation]);

    const handleCurrentPosition = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Error', 'Se necesita permiso de ubicación para funcionar');
            return;
        }

        try {
            setIsLoading(true);
            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const currentLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            setCustomerLocation(currentLocation);
            setShowPredictions(false); // Ocultar predicciones después de seleccionar

            // Obtener dirección de las coordenadas
            try {
                const res = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLocation.latitude},${currentLocation.longitude}&key=${GOOGLE_API_KEY}&language=es`
                );
                const json = await res.json();

                if (json.results && json.results[0]) {
                    const address = json.results[0].formatted_address;
                    setSelectedAddress(address);
                    setSearchText(address);
                }
            } catch (error) {
                console.log('Error getting address from coordinates:', error);
            }

        } catch (error) {
            Alert.alert('Error', 'No se pudo obtener tu ubicación');
        } finally {
            setIsLoading(false);
            Keyboard.dismiss();
        }
    }

    // Centrar mapa en todos los puntos
    const fitToMarkers = () => {
        if (!mapRef.current) return;

        const coordinates = [restaurantLocation];
        if (customerLocation) coordinates.push(customerLocation);
        if (deliveryLocation) coordinates.push(deliveryLocation);

        if (coordinates.length > 1) {
            setTimeout(() => {
                mapRef.current.fitToCoordinates(coordinates, {
                    edgePadding: { top: 150, right: 100, bottom: 200, left: 100 }, // Más padding
                    animated: true,
                });
            }, 300); // Delay para que el teclado termine de cerrarse
        }
    };

    const handleInputChange = (text: string) => {
        setSearchText(text);
        fetchPlaces(text);
        // Salir del modo manual si el usuario empieza a escribir
        if (isManualMode) {
            setIsManualMode(false);
        }
    };

    const handleInputOnPressIn = () => {
        setShowPredictions(true);
        // Si no hay texto, fetchPlaces se encargará de mostrar solo las opciones manuales
        if (!searchText.trim()) {
            fetchPlaces('');
        }
    };

    const clearSearch = () => {
        setSearchText('');
        setSelectedAddress('');
        setPredictions([]);
        setShowPredictions(false);
        setCustomerLocation(null);
        setIsManualMode(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{paddingTop: 20, paddingHorizontal: 20}}>
                <CustomHeader title={"Métodos de entrega"}/>
            </View>
            <View style={styles.searchContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Ingresá tu dirección de entrega..."
                        value={searchText}
                        onChangeText={handleInputChange}
                        onPressIn={handleInputOnPressIn}
                        placeholderTextColor="#999"
                    />
                    {(searchText.length > 0 || isLoading) && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={clearSearch}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#666" />
                            ) : (
                                <Text style={styles.clearButtonText}>✕</Text>
                                    )}
                                </TouchableOpacity>
                                )}
                        </View>

                    {/* Lista de predicciones mejorada */}
                    {showPredictions && (
                        <View style={styles.predictionsContainer}>
                    <FlatList
                        data={getPredictionsToShow()}
                        keyExtractor={(item, index) => item.place_id || `manual-${item.index}-${index}`}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item, index }) => {
                            const isManualOption = item.index === "CurrentLocation" || item.index === "ManualLocation";
                            const displayData = getPredictionsToShow();

                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.predictionItem,
                                        isManualOption && styles.manualPredictionItem,
                                        index === displayData.length - 1 && styles.lastPredictionItem
                                    ]}
                                    onPress={() => handleSelectAddress(item)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.predictionContent}>
                                        <View style={styles.predictionTextContainer}>
                                            <Text style={[
                                                styles.predictionMainText,
                                                isManualOption && styles.manualOptionText
                                            ]}>
                                                {isManualOption ?
                                                    item.description
                                                    : (item.structured_formatting?.main_text || item.description.split(',')[0])
                                                }
                                            </Text>
                                            {!isManualOption && (
                                                <Text style={styles.predictionSecondaryText}>
                                                    {item.structured_formatting?.secondary_text ||
                                                        item.description.split(',').slice(1).join(',').trim()}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
                )}
            </View>

            {/* Instrucciones para modo manual */}
            {isManualMode && (
                <View style={styles.manualModeInstructions}>
                    <Text style={styles.instructionText}>
                        📌 Tocá en el mapa para marcar tu dirección
                    </Text>
                </View>
            )}

            {/* Mapa */}
            <MapView
                ref={mapRef}
                style={[styles.map, isManualMode && styles.mapManualMode]}
                initialRegion={{
                    latitude: restaurantLocation.latitude,
                    longitude: restaurantLocation.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
                showsUserLocation={true}
                showsMyLocationButton={false}
                toolbarEnabled={false}
                showsCompass={false}
                showsScale={false}
                showsBuildings={false}
                showsIndoors={false}
                onMapReady={fitToMarkers}
                onPress={isManualMode ? handleManualLocationSelect : () => setShowPredictions(false)}
            >
                {/* Restaurante */}
                <Marker
                    coordinate={restaurantLocation}
                    title={restaurantLocation.title}
                    description={restaurantLocation.address}
                >
                    <View style={styles.restaurantMarker}>
                        <Text style={styles.markerText}>🍕</Text>
                    </View>
                </Marker>

                {/* Cliente */}
                {customerLocation && (
                    <Marker
                        coordinate={customerLocation}
                        title="Tu dirección"
                        description={selectedAddress || "Aquí se entregará el pedido"}
                    >
                        <View style={styles.customerMarker}>
                            <Text style={styles.markerText}>🏠</Text>
                        </View>
                    </Marker>
                )}

                {/* Delivery */}
                {deliveryLocation && orderStatus !== 'delivered' && (
                    <Marker
                        coordinate={deliveryLocation}
                        title="Repartidor"
                    >
                        <View style={styles.deliveryMarker}>
                            <Text style={styles.markerText}>🏍️</Text>
                        </View>
                    </Marker>
                )}

                {/* Ruta */}
                {deliveryLocation && orderStatus === 'on_way' && customerLocation && (
                    <Polyline
                        coordinates={[restaurantLocation, deliveryLocation, customerLocation]}
                        strokeColor="#2196F3"
                        strokeWidth={4}
                        lineDashPattern={[10, 5]}
                    />
                )}
            </MapView>

            {/* Botones de control */}
            <View style={styles.controls}>
                <TouchableOpacity
                    disabled={!customerLocation}
                    onPress={handleNextStep}
                    style={{
                        backgroundColor: !customerLocation ? colors.disabled :  colors.primary,
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
                    <Text style={{
                        color: "#fff",
                        fontWeight: "700",
                        fontSize: 16,
                    }}>
                        Ir a pagar
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
    };

export default Delivery

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    map: {
        flex: 1
    },
    searchContainer: {
        backgroundColor: 'white',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
            shadowRadius: 4,
            zIndex: 1000,
    },
    inputContainer: {
        flexDirection: 'row',
            alignItems: 'center',
            margin: 16,
            backgroundColor: '#f8f8f8',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e0e0e0',
    },
    searchInput: {
        flex: 1,
            paddingVertical: 14,
            paddingHorizontal: 16,
            fontSize: 16,
            color: '#333',
    },
    manualModeButton: {
        padding: 12,
            marginRight: 4,
            backgroundColor: '#4CAF50',
            borderRadius: 20,
            minWidth: 40,
            alignItems: 'center',
    },
    manualModeIcon: {
        fontSize: 16,
            color: 'white',
            fontWeight: 'bold',
    },
    clearButton: {
        padding: 12,
            marginRight: 4,
    },
    clearButtonText: {
        fontSize: 18,
            color: '#666',
            fontWeight: 'bold',
    },
    predictionsContainer: {
        backgroundColor: 'white',
            maxHeight: 280,
            marginHorizontal: 16,
            marginBottom: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e0e0e0',
            borderTopWidth: 0,
    },
    predictionItem: {
        paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
    },
    manualPredictionItem: {
        backgroundColor: '#f8f9fa',
    },
    lastPredictionItem: {
        borderBottomWidth: 0,
    },
    predictionContent: {
        flexDirection: 'row',
            alignItems: 'center',
    },
    locationIcon: {
        fontSize: 16,
            marginRight: 12,
    },
    predictionTextContainer: {
        flex: 1,
    },
    predictionMainText: {
        fontSize: 16,
            color: '#333',
            fontWeight: '500',
            marginBottom: 2,
    },
    manualOptionText: {
        color: '#4CAF50',
            fontWeight: '600',
    },
    predictionSecondaryText: {
        fontSize: 14,
            color: '#666',
            lineHeight: 18,
    },
    manualModeInstructions: {
        backgroundColor: '#4CAF50',
            padding: 12,
            alignItems: 'center',
    },
    instructionText: {
        color: 'white',
            fontSize: 16,
            fontWeight: '500',
    },
    mapManualMode: {
        // Podríamos agregar un overlay o cambio visual aquí si queremos
    },
    restaurantMarker: {
        backgroundColor: '#FF5722',
            padding: 8,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: 'white',
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
            shadowRadius: 3,
    },
    customerMarker: {
        backgroundColor: '#2196F3',
            padding: 8,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: 'white',
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
            shadowRadius: 3,
    },
    deliveryMarker: {
        backgroundColor: '#4CAF50',
            padding: 8,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: 'white',
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
            shadowRadius: 3,
    },
    markerText: {
        fontSize: 16,
            textAlign: 'center'
    },
    controls: {
        flexDirection: 'row',
            justifyContent: 'center',
            padding: 16,
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
            shadowRadius: 4,
    },
    controlButton: {
        backgroundColor: '#2196F3',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 25,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
            shadowRadius: 3,
            flex: 1,
            marginHorizontal: 4,
    },
    controlButtonDisabled: {
        backgroundColor: '#ccc',
            elevation: 0,
    },
    manualButton: {
        backgroundColor: '#4CAF50',
    },
    manualButtonActive: {
        backgroundColor: '#f44336',
    },
    activeButtonText: {
        color: 'white',
    },
    buttonText: {
        color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
            textAlign: 'center',
    },
});