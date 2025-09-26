import {CartCustomization, CartStore, DeliveryType, PaymentMethod} from "@/type";
import { create } from "zustand";
import {ComboOption} from "@/type/MenuDetail";

import {CartItemType} from "@/type/CartType";


function areCombosEqual(
    a: ComboOption[] = [],
    b: ComboOption[] = [],
): boolean {
    if (a.length !== b.length) return false;

    const aSorted = [...a].sort((x, y) => x.$id.localeCompare(y.$id));
    const bSorted = [...b].sort((x, y) => x.$id.localeCompare(y.$id));

    return aSorted.every((item, idx) => item.$id === bSorted[idx].$id);
}
//TO DO: Generate a unique ID to distinguish items based on their selected combo.
export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    address: "",
    location:[0,0],
    paymentMethod: "cash",
    deliveryType: "delivery",
    comment: "",
    setPaymentMethod: (customerPaymentMethod: PaymentMethod) => {set({paymentMethod: customerPaymentMethod})},
    setDelivery: (customerAddress: string, customerLocation: number[], deliveryType: DeliveryType) => {
        set({
            address: customerAddress,
            location: customerLocation,
            deliveryType: deliveryType
        })

        console.log(get().address)
        console.log(get().location)
    },
    addItem: ( item : CartItemType) => {
        const selectedCombos = item.selectedCombos ?? [];

        const existing = get().items.find(
            (i) =>
                i.id === item.id &&
                areCombosEqual(i.selectedCombos ?? [], selectedCombos)
        );

        if (existing) {
            set({
                items: get().items.map((i) =>
                    i.id === item.id &&
                    areCombosEqual(i.selectedCombos ?? [], selectedCombos)
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            });
        } else {
            set({
                items: [...get().items, { ...item, quantity: 1, selectedCombos }],
            });
        }
    },

    removeItem: (id, selectedCombos = []) => {
        set({
            items: get().items.filter(
                (i) =>
                    !(
                        i.id === id &&
                        areCombosEqual(i.selectedCombos ?? [], selectedCombos)
                    )
            ),
        });
    },

    increaseQty: (id, selectedCombos = []) => {
        set({
            items: get().items.map((i) =>
                i.id === id &&
                areCombosEqual(i.selectedCombos ?? [], selectedCombos)
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ),
        });
    },

    decreaseQty: (id, selectedCombos = []) => {
        set({
            items: get()
                .items.map((i) =>
                    i.id === id &&
                    areCombosEqual(i.selectedCombos ?? [], selectedCombos)
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                .filter((i) => i.quantity > 0),
        });
    },

    clearCart: () => set({ items: [] }),

    getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

    getTotalPrice: () =>
        get().items.reduce((total, item) => {
            const base = item.price;
            const comboPrice =
                item.selectedCombos?.reduce(
                    (s: number, c: ComboOption) => s + c.price,
                    0
                ) ?? 0;
            return total + item.quantity * (base + comboPrice);
        }, 0),
}));