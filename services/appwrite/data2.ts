import dummyData from "@/services/appwrite/data";

const dummyData2 = {
    categories: [
        {name: "Entradas", image_url: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68adfe29001341654856/view?project=689e04bd0017a558b83e&mode=admin"},
        {name: "Platos principales", image_url: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68adfe830038d1d836cb/view?project=689e04bd0017a558b83e&mode=admin"},
        {name: "Acompañamiento", image_url: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68adfeac001b5ae0d40e/view?project=689e04bd0017a558b83e&mode=admin"},
        {name: "Meriendas", image_url: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68adfeea000c5dd14e1e/view?project=689e04bd0017a558b83e&mode=admin"},
        {name: "Postres", image_url: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68adff0d0013e3cc77e0/view?project=689e04bd0017a558b83e&mode=admin"},
        {name: "Bebidas", image_url: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68adff2c00116d5d886b/view?project=689e04bd0017a558b83e&mode=admin"},
    ],
    subCategories: [
        {name: "Empanadas", category: "Platos principales"},
        {name: "Lomos", category: "Platos principales"},
        {name: "Carnes", category: "Platos principales"},
        {name: "Pasta", category: "Platos principales"},
        {name: "Pizza", category: "Platos principales"},
        {name: "Parrilla", category: "Platos principales"},
        {name: "Picadas", category: "Entradas"},
        {name: "Tapas", category: "Entradas"},
        {name: "Sin alcohol", category: "Bebidas"},
        {name: "Tragos", category: "Bebidas"},
        {name: "Cervezas", category: "Bebidas"},
        {name: "Vinos", category: "Bebidas"},
        {name: "Tortas", category: "Postres"},
        {name: "Helados", category: "Postres"},
        {name: "Postres clásicos", category: "Postres"},
    ],
    menu: [
        {
            name: "Empanadas criollas",
            description: "Empanadas caseras de carne cortada a cuchillo, al horno de barro.",
            price: 1200,
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68adff9d001b61675a41/view?project=689e04bd0017a558b83e&mode=admin",
            ingredients: ["Carne vacuna", "Cebolla", "Morrón", "Especias"],
            rating: 4.5,
            category: "Platos principales",
            subcategory: "Empanadas",
            tags: ["Tradicional"],
            isAvailable: true,
            popularityScore: 85,
            preparationTime: 25,
            comboOptions: [
                {
                    name: "Salsa chimichurri",
                    imageUrl: "https://ejemplo.com/salsa.jpg",
                    additionalPrice: 150
                },
                {
                    name: "Ensalada",
                    imageUrl: "https://ejemplo.com/ensalada.jpg",
                    additionalPrice: 200
                }
            ],
            relatedItems: ["Milanesa", "Hamburguesa"]
        },
        {
            name: "Milanesa",
            description: "Milanesa de carne.",
            price: 2500,
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68ae004e000a8fe572b9/view?project=689e04bd0017a558b83e&mode=admin",
            ingredients: ["Carne vacuna"],
            rating: 4.7,
            subcategory: "Carnes",
            category: "Platos principales",
            tags: ["Clásico", "Favorito"],
            isAvailable: true,
            popularityScore: 95,
            comboOptions: [
                {
                    name: "Papas fritas",
                    imageUrl: "https://ejemplo.com/papas.jpg",
                    additionalPrice: 250
                },
                {
                    name: "Ensalada",
                    imageUrl: "https://ejemplo.com/ensalada.jpg",
                    additionalPrice: 200
                }
            ],
            relatedItems: ["Hamburguesa", "Empanadas criollas"]
        },
        {
            name: "Cheesecake de frutos rojos",
            description: "Tarta de queso cremosa con cobertura de frutos rojos frescos.",
            price: 2000,
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68ae039e0020c4fff7f9/view?project=689e04bd0017a558b83e&mode=admin",
            ingredients: ["Queso crema", "Galletitas", "Frutos rojos"],
            rating: 4.9,
            subcategory: "Tartas",
            category: "Postres",
            tags: ["Postre", "Popular"],
            isAvailable: false,
            popularityScore: 90,
            relatedItems: ["Limonada menta y jengibre"]
        },
        {
            name: "Limonada menta y jengibre",
            description: "Refrescante bebida natural con toque de menta y jengibre.",
            price: 800,
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68ae04eb002d4ca0a6db/view?project=689e04bd0017a558b83e&mode=admin",
            ingredients: ["Limón", "Menta", "Jengibre", "Agua"],
            rating: 4.2,
            subcategory: "Sin alcohol",
            category: "Bebidas",
            tags: ["Refrescante", "Verano"],
            isAvailable: true,
            popularityScore: 70,
            relatedItems: ["Cheesecake de frutos rojos"]
        },
        {
            name: "Hamburguesa",
            description: "Medallón de carne con pan y guarnición.",
            price: 2300,
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68ae05bd001c6e8a3e82/view?project=689e04bd0017a558b83e&mode=admin",
            ingredients: ["Carne", "Pan", "Papas", "Queso", "Tomate", "Lechuga"],
            rating: 4.6,
            subcategory: "Vegano",
            category: "Platos principales",
            tags: ["Saludable", "Vegetariano"],
            isAvailable: true,
            popularityScore: 88,
            comboOptions: [
                {
                    name: "Papas fritas",
                    imageUrl: "https://ejemplo.com/papas.jpg",
                    additionalPrice: 250
                },
                {
                    name: "Bebida",
                    imageUrl: "https://ejemplo.com/bebida.jpg",
                    additionalPrice: 200
                }
            ],
            relatedItems: ["Milanesa", "Empanadas criollas"]
        }
    ]
}

export default dummyData2;
