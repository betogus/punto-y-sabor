export const ROUTES = {
    home: "/",
    tabs:"/(tabs)",
    auth:"/(auth)",
    signIn: "/sign-in",
    signUp: "/sign-up",
    profile: "/profile",
    cart: "/cart",
    delivery: "/checkout/delivery",
    payment: "/checkout/payment",
    confirm: "/checkout/confirm",
    item: (id: string) => `/item/${id}`
} as const;