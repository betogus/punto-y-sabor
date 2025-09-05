import {Query} from "react-native-appwrite";
import {GetMenuParams, MenuDetail, MenuItem} from "@/type";
import {appwriteConfig, databases} from "@/services/appwrite/AppwriteClient";



export const getAllMenus = async ({ category, query }: GetMenuParams) => {
    const queries: any[] = [];
    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));

    const menus = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        queries
    );

    return menus.documents;
};

export const getMenuById = async ({ id }: { id: string }): Promise<MenuDetail | null> => {
    try {
        const doc = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            id
        );

        return {
            $id: doc.$id,
            name: doc.name,
            description: doc.description,
            price: doc.price,
            image_url: doc.image_url,
            rating: doc.rating,
        };
    } catch (error) {
        console.error("Error al obtener documento:", error);
        return null;
    }
};



export const getTopRatedMenu = async (): Promise<MenuItem[]> => {
    const menus = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        [Query.orderDesc("rating"), Query.limit(10)]
    );

    return menus.documents.map((doc) => ({
        $id: doc.$id,
        name: doc.name,
        popularity_score: doc.popularity_score,
        rating: doc.rating,
        image_url: doc.image_url,
        price: doc.price,
    }));
};

export const getMostPopularMenu = async () => {
    const menus = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        [Query.orderDesc("popularity_score"), Query.limit(10)]
    );

    return menus.documents.map(({ $id, name, popularity_score, rating, image_url, price }) => ({
        $id: $id,
        name,
        popularity_score,
        rating,
        image_url,
        price,
    }));
};