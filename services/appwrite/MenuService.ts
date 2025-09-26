import {Query} from "react-native-appwrite";
import {GetMenuParams, MenuItem} from "@/type";
import {appwriteConfig, databases} from "@/services/appwrite/AppwriteClient";
import {MenuDetail, transformMenuItem} from "@/type/MenuDetail";



export const getAllMenus = async ({ category, query }: GetMenuParams) => {
    const queries: any[] = [];

    // 1. Traer las subcategorías de la categoría seleccionada
    const subCategories = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.subCategoriesCollectionId,
        [Query.equal("categories", category)]
    );
    if (query) queries.push(Query.search("name", query))

    if (!subCategories) {
        return await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries
        );
    }
    const subCategoryIds = subCategories.documents.map((doc) => doc.$id);
        console.log(subCategories);
    // 2. Filtros adicionales (ej: search)

    // 3. Buscar menús que tengan esas subcategorías
    if (subCategoryIds.length > 0) {
        queries.push(Query.equal("subcategories", subCategoryIds));
    }

    console.log(queries);

    const menus = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        queries
    );

    return menus.documents;
};


export const getMenuDetailById = async ({ id }: { id: string }): Promise<MenuDetail | null> => {
    try {
        const doc = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            id
        );
        return transformMenuItem(doc);
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