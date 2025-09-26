import {ID, Query} from "react-native-appwrite";
import {Order, OrderDetail, OrderItem} from "@/type";
import {appwriteConfig, databases} from "@/services/appwrite/AppwriteClient";
import {MenuDetail} from "@/type/MenuDetail";
import {CartItemType} from "@/type/CartType";

export const saveOrder = async (items: CartItemType[], order: Order ) => {
    try {
        for (const item of items) {
            const orderItem: OrderItem = {
                name: item.name,
                menuId: item.id,
                quantity: item.quantity
            };
            const resultOrderItem = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.orderItemsCollectionId,
                ID.unique(),
                orderItem
            );

            if (resultOrderItem.$id) {
                order.orderItems.push(resultOrderItem.$id)
            } else {
                console.log("error en orderItems")
                throw new Error("No fue posible crear un order item")
            }

        }
        try {
            const resultOrder = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.orderCollectionId,
                ID.unique(),
                order
            );
        } catch (error) {
            console.log("error en order")
            console.error(error);
        }
    } catch (e) {
        console.error("Error al obtener documento:", e);
        return null;
    }
};

export const getOrdersByUserId = async ({ id }: { id: string }): Promise<OrderDetail[]> => {
    try {
        if (!id) return [];

        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.orderCollectionId,
            [Query.equal("userId", id)]
        );

        return response.documents.map((doc) => ({
            $id: doc.$id,
            userId: doc.userId,
            totalPrice: doc.totalPrice,
            status: doc.status as Order["status"],
            deliveryType: doc.deliveryType as Order["deliveryType"],
            deliveryAddress: doc.deliveryAddress ?? "",
            deliveryTime: doc.deliveryTime ?? 0,
            paymentMethod: doc.paymentMethod as Order["paymentMethod"],
            orderItems: doc.orderItems.map((item: OrderItem) => ({
                menuId: item.menuId, quantity: item.quantity, name: item.name,
            })),
            comment: doc.comment ?? "",
            deliveryLocation: doc.deliveryLocation ?? [],
        }));
    } catch (error) {
        console.error("Error al obtener órdenes:", error);
        return [];
    }
};

