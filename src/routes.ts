export const ROUTES = {
    home: "/",
    tabs:"/(tabs)",
    auth:"/(auth)",
    signIn: "/sign-in",
    signUp: "/sign-up",
    profile: "/profile",
    cart: "/cart",
    item: (id: string) => `/item/${id}`
} as const;