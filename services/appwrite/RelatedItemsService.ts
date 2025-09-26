import { databases } from "@/services/appwrite/AppwriteClient";
import { appwriteConfig } from "@/services/appwrite/AppwriteClient";
import { MenuItem } from "@/type";

interface GetMenuRelatedParams {
    id: string;
}

export const getMenuRelatedById = async ({ id }: GetMenuRelatedParams): Promise<MenuItem[] | []> => {
    try {
        const doc = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.relatedItemsCollectionId,
            id
        );
        return doc.menu.map(({ $id, name, rating, image_url, price } : MenuItem) => ({
            $id: $id,
            name,
            rating,
            image_url,
            price,
        }));

    } catch (error) {
        console.error(id);
        console.error("Error al obtener related item:", error);
        return [];
    }
};
