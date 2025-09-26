import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
    Modal,
    StatusBar,
    RefreshControl, Alert,
} from 'react-native';

import {getOrdersByUserId} from "@/services/appwrite/OrderService";
import useAuthStore from "@/store/auth.store";
import {Order, OrderDetail, OrderItem} from "@/type";
import {SafeAreaView} from "react-native-safe-area-context";
import LoadingView from "@/components/LoadingView";

// Iconos - puedes reemplazar con react-native-vector-icons o similar
const Icon = ({ name = "", size = 20, color = '#666' }) => (
    <View style={[styles.icon, { width: size, height: size }]}>
        <Text style={{ color, fontSize: size * 0.7, textAlign: 'center' }}>
            {name === 'search' && '🔍'}
            {name === 'filter' && '⚡'}
            {name === 'user' && '👤'}
            {name === 'truck' && '🚚'}
            {name === 'store' && '🏪'}
            {name === 'clock' && '⏰'}
            {name === 'card' && '💳'}
            {name === 'cash' && '💵'}
            {name === 'wallet' && '💰'}
            {name === 'bank' && '🏦'}
            {name === 'location' && '📍'}
            {name === 'comment' && '💬'}
            {name === 'eye' && '👁️'}
            {name === 'more' && '⋯'}
            {name === 'close' && '✕'}
        </Text>
    </View>
);

// Enums
const OrderStatus = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    READY: 'ready',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

const DeliveryType = {
    PICKUP: 'pickup',
    DELIVERY: 'delivery',
    DINE_IN: 'dine_in'
};

const PaymentMethod = {
    CASH: 'cash',
    CARD: 'card',
    DIGITAL_WALLET: 'digital_wallet',
    BANK_TRANSFER: 'bank_transfer'
};



const  OrdersView = () => {
    const [orders, setOrders] = useState<OrderDetail[] | []>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const {user} = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orders = await getOrdersByUserId({id: user?.$id ?? ""});
                setOrders(orders);

            } catch (error) {
                console.error("Error fetching data:", error);
                Alert.alert("Error", "No se pudo cargar la información del producto");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStatusColor = (status: string | number) => {
        const colors = {
            [OrderStatus.PENDING]: {bg: '#FEF3C7', text: '#D97706', border: '#FCD34D'},
            [OrderStatus.CONFIRMED]: {bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD'},
            [OrderStatus.PREPARING]: {bg: '#FED7AA', text: '#EA580C', border: '#FDBA74'},
            [OrderStatus.READY]: {bg: '#D1FAE5', text: '#059669', border: '#6EE7B7'},
            [OrderStatus.DELIVERED]: {bg: '#F3F4F6', text: '#374151', border: '#D1D5DB'},
            [OrderStatus.CANCELLED]: {bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5'}
        };
        return colors[status] || colors[OrderStatus.PENDING];
    };

    const getStatusText = (status: string) => {
        const texts = {
            [OrderStatus.PENDING]: 'Pendiente',
            [OrderStatus.CONFIRMED]: 'Confirmada',
            [OrderStatus.PREPARING]: 'Preparando',
            [OrderStatus.READY]: 'Lista',
            [OrderStatus.DELIVERED]: 'Entregada',
            [OrderStatus.CANCELLED]: 'Cancelada'
        };
        return texts[status] || status;
    };



    const getPaymentMethodText = (method: string | number) => {
        const texts = {
            [PaymentMethod.CASH]: 'Efectivo',
            [PaymentMethod.CARD]: 'Tarjeta',
            [PaymentMethod.DIGITAL_WALLET]: 'Billetera Digital',
            [PaymentMethod.BANK_TRANSFER]: 'Transferencia'
        };
        return texts[method] || method;
    };

    const getDeliveryIcon = (type: any) => {
        switch (type) {
            case DeliveryType.DELIVERY:
                return 'truck';
            case DeliveryType.PICKUP:
                return 'clock';
            case DeliveryType.DINE_IN:
                return 'store';
            default:
                return 'truck';
        }
    };

    const getPaymentIcon = (method: any) => {
        switch (method) {
            case PaymentMethod.CASH:
                return 'cash';
            case PaymentMethod.CARD:
                return 'card';
            case PaymentMethod.DIGITAL_WALLET:
                return 'wallet';
            case PaymentMethod.BANK_TRANSFER:
                return 'bank';
            default:
                return 'card';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesSearch = order?.$id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order?.userId?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const updateOrderStatus = (orderId: string | undefined, newStatus: string) => {
        /*setOrders(orders.map(order =>
            order.$id === orderId ? {...order, status: newStatus} : order
        ));*/
    };

    const onRefresh = () => {
        setRefreshing(true);
        // Simular carga de datos
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const getNextStatus = (currentStatus: string | number) => {
        const statusFlow = {
            [OrderStatus.PENDING]: OrderStatus.CONFIRMED,
            [OrderStatus.CONFIRMED]: OrderStatus.PREPARING,
            [OrderStatus.PREPARING]: OrderStatus.READY,
            [OrderStatus.READY]: OrderStatus.DELIVERED,
        };
        return statusFlow[currentStatus];
    };

    const getNextStatusText = (currentStatus: string | number) => {
        const nextStatus = getNextStatus(currentStatus);
        return nextStatus ? getStatusText(nextStatus) : null;
    };

    if (loading) {
        return <LoadingView message="Cargando órdenes..." />;
    }



    const renderOrderItem = ({ item }: { item: OrderDetail }) => {
        const statusColor = getStatusColor(item.status);
        const nextStatusText = getNextStatusText(item.status);

        return (
            <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                    <View style={styles.orderIdContainer}>
                        <Text style={styles.orderId}>#{item.$id}</Text>
                        <View style={[styles.statusBadge, {
                            backgroundColor: statusColor.bg,
                            borderColor: statusColor.border
                        }]}>
                            <Text style={[styles.statusText, {color: statusColor.text}]}>
                                {getStatusText(item.status)}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.totalPrice}>
                        ${item.totalPrice.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                    </Text>
                </View>

                <View style={styles.orderInfo}>

                    <View style={styles.infoRow}>
                        <Icon name={getDeliveryIcon(item.deliveryType)} size={16}/>
                        <Text style={styles.infoText}>
                           {(item.deliveryType)}
                            {item.deliveryTime > 0 && ` (${item.deliveryTime} min)`}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name={getPaymentIcon(item.paymentMethod)} size={16}/>
                        <Text style={styles.infoText}>{getPaymentMethodText(item.paymentMethod)}</Text>
                    </View>

                    {item.deliveryAddress && (
                        <View style={styles.infoRow}>
                            <Icon name="location" size={16}/>
                            <Text style={styles.infoText} numberOfLines={2}>{item.deliveryAddress}</Text>
                        </View>
                    )}

                    {item.comment && (
                        <View style={styles.infoRow}>
                            <Icon name="comment" size={16}/>
                            <Text style={styles.commentText} numberOfLines={2}>"{item.comment}"</Text>
                        </View>
                    )}
                </View>

                <View style={styles.orderActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setSelectedOrder(item)}
                    >
                        <Icon name="eye" size={16} color="#4B5563"/>
                        <Text style={styles.actionButtonText}>Ver detalles</Text>
                    </TouchableOpacity>

                    {nextStatusText && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.primaryButton]}
                            onPress={() => updateOrderStatus(item.$id, getNextStatus(item.status))}
                        >
                            <Text style={styles.primaryButtonText}>{nextStatusText}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const renderOrderDetail = () => {
        if (!selectedOrder) return null;

        return (
            <Modal
                visible={!!selectedOrder}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Orden #{selectedOrder.$id}</Text>
                        <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                            <Icon name="close" size={24}/>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <View style={styles.detailSection}>
                            <Text style={styles.sectionTitle}>Información General</Text>
                            <View style={styles.detailGrid}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Estado</Text>
                                    <View
                                        style={[styles.statusBadge, {backgroundColor: getStatusColor(selectedOrder.status).bg}]}>
                                        <Text
                                            style={[styles.statusText, {color: getStatusColor(selectedOrder.status).text}]}>
                                            {getStatusText(selectedOrder.status)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Tipo de entrega</Text>
                                   <Text style={styles.detailValue}>{(selectedOrder.deliveryType)}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Método de pago</Text>
                                    <Text
                                        style={styles.detailValue}>{getPaymentMethodText(selectedOrder.paymentMethod)}</Text>
                                </View>
                            </View>

                            {selectedOrder.deliveryAddress && (
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Dirección</Text>
                                    <Text style={styles.detailValue}>{selectedOrder.deliveryAddress}</Text>
                                </View>
                            )}

                            {selectedOrder.deliveryTime > 0 && (
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Tiempo estimado</Text>
                                    <Text style={styles.detailValue}>{selectedOrder.deliveryTime} minutos</Text>
                                </View>
                            )}

                            {selectedOrder.comment && (
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Comentarios</Text>
                                    <Text
                                        style={[styles.detailValue, styles.commentText]}>"{selectedOrder.comment}"</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.detailSection}>
                            <Text style={styles.sectionTitle}>Items de la orden</Text>
                            {selectedOrder.orderItems.map((item : OrderItem) => {
                                console.log(item)
                                return  item ? (
                                    <View key={item.menuId} style={styles.itemCard}>
                                        <View style={styles.itemInfo}>
                                            <Text style={styles.itemName}>{item.name}</Text>
                                            <Text style={styles.itemDetail}>
                                                {item.quantity}
                                            </Text>
                                        </View>
                                    </View>
                                ) : null;
                            })}
                        </View>

                        <View style={styles.totalSection}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalAmount}>
                                ${selectedOrder.totalPrice.toLocaleString('es-AR', {minimumFractionDigits: 2})}
                            </Text>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF"/>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Órdenes de Compra</Text>
                <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
                    <Icon name="filter" size={24}/>
                </TouchableOpacity>
            </View>

            {/* Search and Filters */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Icon name="search" size={20}/>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por ID o usuario..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>
            </View>

            {showFilters && (
                <View style={styles.filtersContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity
                            style={[styles.filterChip, filterStatus === 'all' && styles.activeFilterChip]}
                            onPress={() => setFilterStatus('all')}
                        >
                            <Text
                                style={[styles.filterChipText, filterStatus === 'all' && styles.activeFilterChipText]}>
                                Todas
                            </Text>
                        </TouchableOpacity>
                        {Object.values(OrderStatus).map((status) => (
                            <TouchableOpacity
                                key={status}
                                style={[styles.filterChip, filterStatus === status && styles.activeFilterChip]}
                                onPress={() => setFilterStatus(status)}
                            >
                                <Text
                                    style={[styles.filterChipText, filterStatus === status && styles.activeFilterChipText]}>
                                    {getStatusText(status)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Orders List */}
            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.$id ?? String(item.$id)}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No se encontraron órdenes</Text>
                        <Text style={styles.emptySubtext}>
                            {searchTerm || filterStatus !== 'all'
                                ? "Intenta cambiar los filtros de búsqueda"
                                : "No hay órdenes disponibles en este momento"
                            }
                        </Text>
                    </View>
                )}
            />

            {/* Order Detail Modal */}
            {renderOrderDetail()}
        </SafeAreaView>
    );
}

export default OrdersView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#111827',
    },
    filtersContainer: {
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginLeft: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        marginRight: 8,
    },
    activeFilterChip: {
        backgroundColor: '#3B82F6',
    },
    filterChipText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    activeFilterChipText: {
        color: '#FFFFFF',
    },
    listContainer: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderIdContainer: {
        flex: 1,
    },
    orderId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    orderInfo: {
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#6B7280',
        flex: 1,
    },
    commentText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#6B7280',
        fontStyle: 'italic',
        flex: 1,
    },
    orderActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        flex: 0.48,
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: '#3B82F6',
    },
    actionButtonText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    primaryButtonText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    detailSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
    },
    detailGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    detailItem: {
        width: '48%',
        marginBottom: 16,
    },
    detailLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    itemDetail: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    itemTotal: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    totalAmount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});