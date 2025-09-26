import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ScrollView,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "@/store/auth.store";

// Iconos - puedes reemplazar con react-native-vector-icons o similar
const Icon = ({ name = "", size = 20, color = '#666' }) => (
    <View style={[styles.icon, { width: size, height: size }]}>
        <Text style={{ color, fontSize: size * 0.7, textAlign: 'center' }}>
            {name === 'user' && '👤'}
            {name === 'edit' && '✏️'}
            {name === 'logout' && '🚪'}
            {name === 'email' && '📧'}
            {name === 'phone' && '📱'}
            {name === 'location' && '📍'}
            {name === 'camera' && '📷'}
            {name === 'save' && '💾'}
            {name === 'close' && '✕'}
            {name === 'settings' && '⚙️'}
            {name === 'help' && '❓'}
            {name === 'privacy' && '🔒'}
            {name === 'notifications' && '🔔'}
            {name === 'arrow-right' && '→'}
        </Text>
    </View>
);

// Avatar Component
const Avatar = ({ name, size = 80, onPress }: { name: string; size?: number; onPress?: () => void }) => {
    const getInitials = (fullName: string) => {
        return fullName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

    const getAvatarColor = (name: string) => {
        const colors = [
            '#FF6B35', '#F7931E', '#FFD23F', '#06FFA5',
            '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <TouchableOpacity
            style={[
                styles.avatar,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: getAvatarColor(name)
                }
            ]}
            onPress={onPress}
        >
            <Text style={[styles.avatarText, { fontSize: size * 0.35 }]}>
                {getInitials(name)}
            </Text>
            {onPress && (
                <View style={styles.avatarEditBadge}>
                    <Icon name="camera" size={12} color="#FFFFFF" />
                </View>
            )}
        </TouchableOpacity>
    );
};

// Profile Info Row Component
const ProfileInfoRow = ({ icon, label, value, onPress }: {
    icon: string;
    label: string;
    value: string;
    onPress?: () => void;
}) => (
    <TouchableOpacity style={styles.infoRow} onPress={onPress} disabled={!onPress}>
        <View style={styles.infoLeft}>
            <View style={styles.infoIconContainer}>
                <Icon name={icon} size={20} color="#6B7280" />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
        {onPress && (
            <Icon name="arrow-right" size={16} color="#9CA3AF" />
        )}
    </TouchableOpacity>
);

// Menu Option Component
const MenuOption = ({ icon, label, onPress, danger = false }: {
    icon: string;
    label: string;
    onPress: () => void;
    danger?: boolean;
}) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress}>
        <View style={styles.menuOptionLeft}>
            <View style={[styles.menuIconContainer, danger && styles.menuIconDanger]}>
                <Icon name={icon} size={20} color={danger ? "#DC2626" : "#6B7280"} />
            </View>
            <Text style={[styles.menuOptionText, danger && styles.menuOptionTextDanger]}>
                {label}
            </Text>
        </View>
        <Icon name="arrow-right" size={16} color="#9CA3AF" />
    </TouchableOpacity>
);

const UserProfileView = () => {
    const { user, setIsAuthenticated } = useAuthStore();
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedUser, setEditedUser] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });

    const handleEditProfile = () => {
        setShowEditModal(true);
    };

    const handleSaveProfile = () => {
        // Aquí implementarías la lógica para actualizar el perfil
        Alert.alert(
            'Perfil Actualizado',
            'Los cambios se han guardado correctamente.',
            [{ text: 'OK', onPress: () => setShowEditModal(false) }]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que quieres cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: () => {
                        setIsAuthenticated(false);
                        // Aquí podrías navegar a la pantalla de login
                        // navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    }
                }
            ]
        );
    };

    const handleChangeAvatar = () => {
        Alert.alert(
            'Cambiar Avatar',
            'Selecciona una opción',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Galería', onPress: () => console.log('Seleccionar de galería') },
                { text: 'Cámara', onPress: () => console.log('Tomar foto') }
            ]
        );
    };

    const renderEditModal = () => (
        <Modal
            visible={showEditModal}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setShowEditModal(false)}>
                        <Icon name="close" size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Editar Perfil</Text>
                    <TouchableOpacity onPress={handleSaveProfile}>
                        <Icon name="save" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    <View style={styles.editAvatarSection}>
                        <Avatar
                            name={editedUser.name}
                            size={100}
                            onPress={handleChangeAvatar}
                        />
                        <Text style={styles.editAvatarText}>Tocar para cambiar foto</Text>
                    </View>

                    <View style={styles.editForm}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nombre Completo</Text>
                            <TextInput
                                style={styles.input}
                                value={editedUser.name}
                                onChangeText={(text) => setEditedUser({...editedUser, name: text})}
                                placeholder="Ingresa tu nombre completo"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={editedUser.email}
                                onChangeText={(text) => setEditedUser({...editedUser, email: text})}
                                placeholder="tu@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Dirección</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={editedUser.address}
                                onChangeText={(text) => setEditedUser({...editedUser, address: text})}
                                placeholder="Ingresa tu dirección completa"
                                multiline={true}
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Avatar
                            name={user?.name || 'Usuario'}
                            size={100}
                        />
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user?.name || 'Nombre de Usuario'}</Text>
                            <Text style={styles.userEmail}>{user?.email || 'email@ejemplo.com'}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={handleEditProfile}
                    >
                        <Icon name="edit" size={16} color="#FFFFFF" />
                        <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Personal</Text>
                    <View style={styles.infoContainer}>
                        <ProfileInfoRow
                            icon="email"
                            label="Email"
                            value={user?.email || 'No especificado'}
                        />
                        <ProfileInfoRow
                            icon="location"
                            label="Dirección"
                            value={user?.address || 'No especificado'}
                        />
                    </View>
                </View>

                {/* Menu Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Opciones</Text>
                    <View style={styles.menuContainer}>
                        <MenuOption
                            icon="settings"
                            label="Configuración"
                            onPress={() => Alert.alert('Configuración', 'Próximamente disponible')}
                        />
                        <MenuOption
                            icon="notifications"
                            label="Notificaciones"
                            onPress={() => Alert.alert('Notificaciones', 'Próximamente disponible')}
                        />
                        <MenuOption
                            icon="privacy"
                            label="Privacidad"
                            onPress={() => Alert.alert('Privacidad', 'Próximamente disponible')}
                        />
                        <MenuOption
                            icon="help"
                            label="Ayuda y Soporte"
                            onPress={() => Alert.alert('Ayuda', 'Próximamente disponible')}
                        />
                    </View>
                </View>

                {/* Logout Button */}
                <View style={styles.section}>
                    <View style={styles.menuContainer}>
                        <MenuOption
                            icon="logout"
                            label="Cerrar Sesión"
                            onPress={handleLogout}
                            danger={true}
                        />
                    </View>
                </View>

                {/* Footer spacing */}
                <View style={styles.footer} />
            </ScrollView>

            {/* Edit Modal */}
            {renderEditModal()}
        </SafeAreaView>
    );
};

export default UserProfileView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContainer: {
        flex: 1,
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerContent: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    avatarText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    avatarEditBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#3B82F6',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    userInfo: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: '#6B7280',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3B82F6',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        alignSelf: 'center',
    },
    editButtonText: {
        marginLeft: 8,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
    },
    infoContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '500',
    },
    menuContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuIconDanger: {
        backgroundColor: '#FEE2E2',
    },
    menuOptionText: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '500',
    },
    menuOptionTextDanger: {
        color: '#DC2626',
    },
    footer: {
        height: 100,
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Modal Styles
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
    editAvatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    editAvatarText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
    },
    editForm: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111827',
    },
    textArea: {
        height: 80,
        paddingTop: 12,
    },
});

