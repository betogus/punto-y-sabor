import {ComboOption} from "@/type/MenuDetail";

export interface CartItemType {
    item: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        selectedCombos: ComboOption[];
        comment?: string;
        totalPrice: number;
        image_url: string;
    };
}