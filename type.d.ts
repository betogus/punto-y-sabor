import { Models } from "react-native-appwrite";
import {ComboOption} from "@/type/MenuDetail";
import {CartItemType} from "@/type/CartType";

export interface MenuItem  {
    $id: string;
    name: string;
    popularity_score?: number;
    rating: number;
    image_url: string;
    price: number;
}


export interface Category extends Models.Document {
    name: string;
    description: string;
}

export interface User extends Models.Document {
    $id?: string;
    name: string;
    email: string;
    avatar: string;
    phone: number;
    address: string;
    location: string;
}

export interface CartCustomization {
    id: string;
    name: string;
    price: number;
    type: string;
}

export type PaymentMethod = "card" | "cash" | "qr";

export const PAYMENT_METHODS = {
    CARD: "card" as PaymentMethod,
    CASH: "cash" as PaymentMethod,
    QR: "qr" as PaymentMethod,
};

export type DeliveryType = "delivery" | "pickup"

export const DELIVERY_TYPE = {
    DELIVERY: "delivery" as DeliveryType,
    PICKUP: "pickup" as DeliveryType
}

export interface OrderItem {
    $id?: string;
    name: string;
    menuId: string;
    quantity: number;
}

export type OrderStatus = "pending" | "preparing" | "delivering" | "cancelled"
export interface OrderDetail {
    $id?: string;
    userId?: string;
    totalPrice: number;
    status: OrderStatus;
    deliveryType?: DeliveryType;
    deliveryAddress?: string;
    deliveryTime?: float;
    paymentMethod: PaymentMethod;
    orderItems: OrderItem[];
    comment: string;
    deliveryLocation: number[];
}
export interface Order  {
    $id?: string;
    userId?: string;
    totalPrice: number;
    status: OrderStatus;
    deliveryType?: DeliveryType;
    deliveryAddress?: string;
    deliveryTime?: float;
    paymentMethod: PaymentMethod;
    orderItems: string[];
    comment: string;
    deliveryLocation: number[];
}

export interface CartStore {
    setDelivery: (address: string, location: number[], deliveryType: DeliveryType) => void;
    paymentMethod: string;
    deliveryType: DeliveryType;
    setPaymentMethod: (paymentMethod: PaymentMethod) => void;
    address: string;
    location: number[];
    items: CartItemType[];
    addItem: (item: CartItemType) => void;
    removeItem: (id: string, selectedCombos: ComboOption[]) => void;
    increaseQty: (id: string, selectedCombos: ComboOption[]) => void;
    decreaseQty: (id: string, selectedCombos: ComboOption[]) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    comment: string;
}

interface TabBarIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
    title: string;
}

interface PaymentInfoStripeProps {
    label: string;
    value: string;
    labelStyle?: string;
    valueStyle?: string;
}

interface CustomButtonProps {
    onPress?: () => void;
    title?: string;
    style?: string;
    leftIcon?: React.ReactNode;
    textStyle?: string;
    isLoading?: boolean;
}

interface CustomHeaderProps {
    title?: string;
}

interface CustomInputProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    label: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

interface ProfileFieldProps {
    label: string;
    value: string;
    icon: ImageSourcePropType;
}

interface CreateUserParams {
    email: string;
    password: string;
    name: string;
}

interface SignInParams {
    email: string;
    password: string;
}

interface GetMenuParams {
    category: string;
    query: string;
}