import {MenuItem} from "@/type";

export interface MenuDetail {
    $id: string;
    name: string;
    description: string;
    image_url: string;
    ingredients: string[];
    is_available: boolean;
    preparationTime: number;
    popularity_score: number | null;
    price: number;
    rating: number;
    tags: string[];
    comboOptions: ComboOption[];
    relatedItemsId: string;
}

export interface ComboOption {
    $id: string;
    name: string;
    image_url: string;
    price: number;
}

export function transformMenuItem(raw: any): MenuDetail {
    return {
        $id: raw.$id,
        name: raw.name,
        description: raw.description,
        image_url: raw.image_url ?? null,
        ingredients: raw.ingredients ?? [],
        preparationTime: raw.preparationTime ?? null,
        is_available: raw.is_available,
        popularity_score: raw.popularity_score ?? null,
        price: raw.price,
        rating: raw.rating,
        tags: raw.tags ?? [],
        comboOptions: (raw.comboOptions ?? []).map((c: any) => ({
            $id: c.$id,
            name: c.name,
            image_url: c.image_url ?? null,
            price: c.price,
        })),
        relatedItemsId: (raw.relatedItems?.$id),
    };
}
