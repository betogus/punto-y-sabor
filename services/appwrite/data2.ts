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
        {name: "Empanadas", category: "Platos principales"}, //68af55875bd31df5ab7f
        {name: "Lomos", category: "Platos principales"}, //68af55875bd56e9e1961
        {name: "Carnes", category: "Platos principales"}, //68af55875bd5d80b25e3
        {name: "Pasta", category: "Platos principales"}, //68af55875bd62615d4b2
        {name: "Pizza", category: "Platos principales"}, //68af55875bd6782d2e14
        {name: "Parrilla", category: "Platos principales"}, //68af55875bd6caa5b82d
        {name: "Picadas", category: "Entradas"}, //68af55875bd708b178b4
        {name: "Tapas", category: "Entradas"}, //68af55875bd750de1522
        {name: "Sin alcohol", category: "Bebidas"}, //68af55875bd7aec2907d
        {name: "Tragos", category: "Bebidas"}, //68af55875bd7ed398151
        {name: "Cervezas", category: "Bebidas"}, //68af55875bd83f1881c6
        {name: "Vinos", category: "Bebidas"}, //68af55875bd87e4f201c
        {name: "Tortas", category: "Postres"}, //68af55875bd8c6c0bd4b
        {name: "Helados", category: "Postres"}, //68af55875bd9059b4062
        {name: "Postres clásicos", category: "Postres"}, //68af55875bd9521ef621
        {name: "Cafetería", category: "Meriendas"}, //68d6ac7c002409a411c2
    ],
    comboOptions: [
        {
            name: "Ensalada",
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68b9cff700291b473e27/view?project=689e04bd0017a558b83e&mode=admin",
            price: 1200
        }, {
            name: "Papas fritas",
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68b9d133001b761a8325/view?project=689e04bd0017a558b83e&mode=admin",
            price: 2000
        }, {
            name: "Chimichurri",
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68b9d18700311844bb2e/view?project=689e04bd0017a558b83e&mode=admin",
            price: 1000
        }, {
            name: "Bebida",
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68b9d41d000529490cb5/view?project=689e04bd0017a558b83e&mode=admin",
            price: 1500
        }, {
            name: "Extra cheddar",
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68b9d16c000703255c36/view?project=689e04bd0017a558b83e&mode=admin",
            price: 500
        }
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
            comboOptions: ["Chimichurri", "Ensalada"],
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
            preparationTime: 15,
            comboOptions: ["Papas fritas", "Ensalada"],
            relatedItems: ["Hamburguesa", "Empanadas criollas"]
        },
        {
            name: "Cheesecake de frutos rojos",
            description: "Tarta de queso cremosa con cobertura de frutos rojos frescos.",
            price: 4000,
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68ae039e0020c4fff7f9/view?project=689e04bd0017a558b83e&mode=admin",
            ingredients: ["Queso crema", "Galletitas", "Frutos rojos"],
            rating: 4.9,
            subcategory: "Tortas",
            category: "Postres",
            tags: ["Postre", "Popular"],
            isAvailable: false,
            popularityScore: 90,
            preparationTime: 10,
            relatedItems: ["Limonada menta y jengibre"]
        },
        {
            name: "Limonada menta y jengibre",
            description: "Refrescante bebida natural con toque de menta y jengibre.",
            price: 2800,
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68ae04eb002d4ca0a6db/view?project=689e04bd0017a558b83e&mode=admin",
            ingredients: ["Limón", "Menta", "Jengibre", "Agua"],
            rating: 4.2,
            subcategory: "Sin alcohol",
            category: "Bebidas",
            tags: ["Refrescante", "Verano"],
            isAvailable: true,
            preparationTime: 10,
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
            subcategory: "Lomos",
            category: "Platos principales",
            tags: ["Saludable", "Vegetariano"],
            isAvailable: true,
            popularityScore: 88,
            preparationTime: 20,
            comboOptions: ["Papas fritas", "Bebida"],
            relatedItems: ["Milanesa", "Empanadas criollas"]
        },
        {
            name: "Aperol",
            description: "Clásico cóctel italiano con Aperol, soda y rodaja de naranja.",
            price: 3500,
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68adff2c00116d5d886b/view?project=689e04bd0017a558b83e&mode=admin",
            ingredients: ["Aperol", "Soda", "Naranja"],
            rating: 4.8,
            subcategory: "Tragos",
            category: "Bebidas",
            tags: ["Cóctel", "Refrescante"],
            isAvailable: true,
            popularityScore: 80,
            preparationTime: 5,
            relatedItems: ["Picada", "Entrecot"]
        },
        {
            name: "Tarta de arándanos",
            description: "Tarta artesanal con base de masa sableé y relleno de arándanos frescos.",
            price: 4200,
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68adff0d0013e3cc77e0/view?project=689e04bd0017a558b83e&mode=admin",
            ingredients: ["Arándanos", "Masa sableé", "Azúcar", "Crema"],
            rating: 4.7,
            subcategory: "Tortas",
            category: "Postres",
            tags: ["Postre", "Artesanal"],
            isAvailable: true,
            popularityScore: 75,
            preparationTime: 15,
            relatedItems: ["Café", "Cheesecake de frutos rojos", "Medialunas"]
        },
        {
            name: "Café",
            description: "Café espresso intenso y aromático.",
            price: 1200,
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68adfeea000c5dd14e1e/view?project=689e04bd0017a558b83e&mode=admin",
            ingredients: ["Café en grano molido"],
            rating: 4.4,
            subcategory: "Cafetería",
            category: "Meriendas",
            tags: ["Clásico", "Caliente"],
            isAvailable: true,
            popularityScore: 65,
            preparationTime: 15,
            relatedItems: ["Tarta de arándanos", "Medialunas", "Cheesecake de frutos rojos"]
        },
        {
            name: "Entrecot",
            description: "Corte premium de carne vacuna a la parrilla.",
            price: 5500,
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68adfe830038d1d836cb/view?project=689e04bd0017a558b83e&mode=admin",
            ingredients: ["Entrecot de novillo", "Sal gruesa"],
            rating: 4.9,
            subcategory: "Carnes",
            category: "Platos principales",
            tags: ["Premium", "Parrilla"],
            isAvailable: true,
            popularityScore: 98,
            preparationTime: 30,
            comboOptions: ["Ensalada", "Papas fritas", "Salsa criolla"],
            relatedItems: ["Aperol", "Picada"]
        },
        {
            name: "Picada",
            description: "Tabla de fiambres y quesos para compartir.",
            price: 4800,
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68adfe29001341654856/view?project=689e04bd0017a558b83e&mode=admin",
            ingredients: ["Jamón", "Queso", "Salame", "Aceitunas", "Pan"],
            rating: 4.6,
            subcategory: "Picadas",
            category: "Entradas",
            tags: ["Para compartir", "Tradicional"],
            isAvailable: true,
            popularityScore: 82,
            preparationTime: 15,
            relatedItems: ["Aperol", "Entrecot"]
        },
        {
            name: "Medialunas",
            description: "Medialunas de manteca recién horneadas.",
            price: 1000,
            imageUrl: "https://nyc.cloud.appwrite.io/v1/storage/buckets/68a661200036a0303bc1/files/68d6a8b500048401424a/view?project=689e04bd0017a558b83e&mode=admin",
            ingredients: ["Harina", "Manteca", "Azúcar"],
            rating: 4.5,
            subcategory: "Cafetería",
            category: "Meriendas",
            tags: ["Clásico", "Desayuno"],
            isAvailable: true,
            popularityScore: 72,
            preparationTime: 5,
            relatedItems: ["Café", "Tarta de arándanos", "Cheesecake de frutos rojos"]
        }
    ]
}

export default dummyData2;
