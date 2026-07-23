import type { MenuCategory, MenuDish, OpeningHour } from "./types";

// ---------------------------------------------------------------------------
// Curated stock photography (direct, hot-linkable Unsplash URLs).
// ---------------------------------------------------------------------------
const IMG = {
  dumplings:
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
  springrolls:
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  wontonSoup:
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
  hotSoup:
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
  mapoTofu:
    "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=800&q=80",
  kungPao:
    "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
  grilledFish:
    "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=800&q=80",
  spicyFish:
    "https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?auto=format&fit=crop&w=800&q=80",
  beefNoodle:
    "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80",
  friedRice:
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
  noodles:
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
  seafood:
    "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
  shrimp:
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
  pork:
    "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=800&q=80",
  beef:
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
  chicken:
    "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=800&q=80",
  vegetables:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  dessert:
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
  mochi:
    "https://images.unsplash.com/photo-1631206753348-db44968fd440?auto=format&fit=crop&w=800&q=80",
  tea:
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
  beer:
    "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80",
  cocktail:
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
  hotpot:
    "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80",
  eggplant:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
} as const;

// ---------------------------------------------------------------------------
// Categories (12)
// ---------------------------------------------------------------------------
export const CATEGORIES: MenuCategory[] = [
  { id: "cat-vorspeisen", slug: "vorspeisen", nameDe: "Vorspeisen", nameEn: "Appetizers", icon: "salad", sortOrder: 1 },
  { id: "cat-suppen", slug: "suppen", nameDe: "Suppen", nameEn: "Soups", icon: "soup", sortOrder: 2 },
  { id: "cat-signature", slug: "signature", nameDe: "Signature Gerichte", nameEn: "Signature Dishes", icon: "crown", sortOrder: 3 },
  { id: "cat-grilled-fish", slug: "grilled-fish", nameDe: "Gegrillter Fisch", nameEn: "Grilled Fish", icon: "fish", sortOrder: 4 },
  { id: "cat-sichuan", slug: "sichuan", nameDe: "Sichuan Spezialitäten", nameEn: "Sichuan Specialties", icon: "flame", sortOrder: 5 },
  { id: "cat-seafood", slug: "seafood", nameDe: "Meeresfrüchte", nameEn: "Seafood", icon: "shell", sortOrder: 6 },
  { id: "cat-meat", slug: "meat", nameDe: "Fleischgerichte", nameEn: "Meat", icon: "beef", sortOrder: 7 },
  { id: "cat-tofu", slug: "tofu", nameDe: "Tofu", nameEn: "Tofu", icon: "square", sortOrder: 8 },
  { id: "cat-noodles", slug: "noodles", nameDe: "Nudeln", nameEn: "Noodles", icon: "utensils", sortOrder: 9 },
  { id: "cat-rice", slug: "rice", nameDe: "Reis", nameEn: "Rice", icon: "wheat", sortOrder: 10 },
  { id: "cat-desserts", slug: "desserts", nameDe: "Desserts", nameEn: "Desserts", icon: "cake", sortOrder: 11 },
  { id: "cat-drinks", slug: "drinks", nameDe: "Getränke", nameEn: "Drinks", icon: "cup-soda", sortOrder: 12 },
];

// ---------------------------------------------------------------------------
// Dishes (36)
// ---------------------------------------------------------------------------
export const DISHES: MenuDish[] = [
  // --- Vorspeisen ---
  {
    id: "dish-jiaozi", slug: "jiaozi-teigtaschen", nameDe: "Jiaozi Teigtaschen (8 Stück)", nameEn: "Jiaozi Dumplings (8 pcs)", nameZh: "饺子",
    descriptionDe: "Handgemachte Teigtaschen gefüllt mit Schweinefleisch und Chinakohl, dazu hausgemachte Chili-Sojasauce.",
    descriptionEn: "Handmade dumplings filled with pork and napa cabbage, served with house chili-soy sauce.",
    price: 7.9, imageUrl: IMG.dumplings, spiceLevel: 1, isBestseller: true, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["gluten", "soja", "sesam"], sortOrder: 1, categoryId: "cat-vorspeisen",
  },
  {
    id: "dish-fruehlingsrollen", slug: "fruehlingsrollen", nameDe: "Frühlingsrollen (4 Stück)", nameEn: "Spring Rolls (4 pcs)", nameZh: "春卷",
    descriptionDe: "Knusprig frittierte Frühlingsrollen mit Gemüsefüllung und süß-saurer Sauce.",
    descriptionEn: "Crispy fried spring rolls with vegetable filling and sweet & sour dip.",
    price: 5.9, imageUrl: IMG.springrolls, spiceLevel: 0, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: ["gluten", "soja"], sortOrder: 2, categoryId: "cat-vorspeisen",
  },
  {
    id: "dish-gurkensalat", slug: "sichuan-gurkensalat", nameDe: "Sichuan Gurkensalat", nameEn: "Smashed Cucumber Salad", nameZh: "拍黄瓜",
    descriptionDe: "Zerdrückte Gurken mit Knoblauch, Chiliöl, schwarzem Essig und Sesam.",
    descriptionEn: "Smashed cucumber with garlic, chili oil, black vinegar and sesame.",
    price: 5.5, imageUrl: IMG.vegetables, spiceLevel: 1, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: ["sesam", "soja"], sortOrder: 3, categoryId: "cat-vorspeisen",
  },
  {
    id: "dish-wan-tan", slug: "gebratene-wan-tan", nameDe: "Gebratene Wan-Tan (6 Stück)", nameEn: "Fried Wontons (6 pcs)", nameZh: "炸馄饨",
    descriptionDe: "Frittierte Wan-Tan mit Garnelen-Schweinefleisch-Füllung, dazu süß-saure Sauce.",
    descriptionEn: "Fried wontons with shrimp-pork filling and sweet & sour sauce.",
    price: 6.9, imageUrl: IMG.springrolls, spiceLevel: 0, isBestseller: false, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["gluten", "krebstiere", "ei", "soja"], sortOrder: 4, categoryId: "cat-vorspeisen",
  },

  // --- Suppen ---
  {
    id: "dish-wan-tan-suppe", slug: "wan-tan-suppe", nameDe: "Wan-Tan Suppe", nameEn: "Wonton Soup", nameZh: "馄饨汤",
    descriptionDe: "Klare Hühnerbrühe mit gefüllten Wan-Tan und Frühlingszwiebeln.",
    descriptionEn: "Clear chicken broth with filled wontons and spring onions.",
    price: 5.9, imageUrl: IMG.wontonSoup, spiceLevel: 0, isBestseller: false, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["gluten", "ei", "soja", "sellerie"], sortOrder: 1, categoryId: "cat-suppen",
  },
  {
    id: "dish-suan-la-tang", slug: "suan-la-tang", nameDe: "Suan La Tang – Scharf-Sauer Suppe", nameEn: "Hot & Sour Soup", nameZh: "酸辣汤",
    descriptionDe: "Die klassische scharf-saure Suppe mit Tofu, Bambus, Pilzen und Ei.",
    descriptionEn: "The classic hot & sour soup with tofu, bamboo, mushrooms and egg.",
    price: 6.5, imageUrl: IMG.hotSoup, spiceLevel: 2, isBestseller: true, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["ei", "soja", "sellerie"], sortOrder: 2, categoryId: "cat-suppen",
  },
  {
    id: "dish-tomaten-ei-suppe", slug: "tomaten-ei-suppe", nameDe: "Tomaten-Ei-Suppe", nameEn: "Tomato & Egg Soup", nameZh: "番茄蛋汤",
    descriptionDe: "Sanfte Tomatensuppe mit seidigen Eierflocken und Frühlingszwiebeln.",
    descriptionEn: "Gentle tomato soup with silky egg ribbons and spring onions.",
    price: 5.5, imageUrl: IMG.hotSoup, spiceLevel: 0, isBestseller: false, isVegetarian: true, isVegan: false, isAvailable: true,
    allergens: ["ei"], sortOrder: 3, categoryId: "cat-suppen",
  },

  // --- Signature ---
  {
    id: "dish-mapo-tofu", slug: "mapo-tofu", nameDe: "Mapo Tofu", nameEn: "Mapo Tofu", nameZh: "麻婆豆腐",
    descriptionDe: "Seidentofu in feuriger Doubanjiang-Sauce mit Hackfleisch und Sichuan-Pfeffer – herrlich betäubend scharf (má là).",
    descriptionEn: "Silken tofu in fiery doubanjiang sauce with minced meat and Sichuan pepper – wonderfully numbing (má là).",
    price: 14.9, imageUrl: IMG.mapoTofu, spiceLevel: 3, isBestseller: true, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["soja", "gluten"], sortOrder: 1, categoryId: "cat-signature",
  },
  {
    id: "dish-kung-pao", slug: "kung-pao-huhn", nameDe: "Gong Bao Huhn", nameEn: "Kung Pao Chicken", nameZh: "宫保鸡丁",
    descriptionDe: "Gewürfeltes Hähnchen mit Erdnüssen, getrockneten Chilis und Sichuan-Pfeffer in würziger Sauce.",
    descriptionEn: "Diced chicken with peanuts, dried chilies and Sichuan pepper in a savory sauce.",
    price: 15.9, imageUrl: IMG.kungPao, spiceLevel: 2, isBestseller: true, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["erdnuss", "soja", "gluten"], sortOrder: 2, categoryId: "cat-signature",
  },
  {
    id: "dish-shuizhu-beef", slug: "shuizhu-rindfleisch", nameDe: "Shuizhu Rindfleisch", nameEn: "Boiled Beef in Chili Oil", nameZh: "水煮牛肉",
    descriptionDe: "Zarte Rindfleischscheiben in schwimmendem Chiliöl mit Sojasprossen und Sichuan-Pfeffer – ein Klassiker aus Sichuan.",
    descriptionEn: "Tender beef slices in a bath of chili oil with bean sprouts and Sichuan pepper – a Sichuan icon.",
    price: 18.9, imageUrl: IMG.spicyFish, spiceLevel: 3, isBestseller: true, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["soja", "gluten", "sellerie"], sortOrder: 3, categoryId: "cat-signature",
  },
  {
    id: "dish-dan-dan", slug: "dan-dan-nudeln-signature", nameDe: "Dan Dan Nudeln", nameEn: "Dan Dan Noodles", nameZh: "担担面",
    descriptionDe: "Weizennudeln mit würzigem Schweinehack, Sesampaste, Chiliöl und eingelegtem Gemüse.",
    descriptionEn: "Wheat noodles with spicy pork, sesame paste, chili oil and preserved vegetables.",
    price: 13.9, imageUrl: IMG.noodles, spiceLevel: 2, isBestseller: true, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["gluten", "sesam", "soja", "erdnuss"], sortOrder: 4, categoryId: "cat-signature",
  },

  // --- Grilled Fish ---
  {
    id: "dish-kaoyu-classic", slug: "kaoyu-classic", nameDe: "Kao Yu – Gegrillter Wolfsbarsch (Classic)", nameEn: "Kao Yu – Grilled Sea Bass (Classic)", nameZh: "烤鱼",
    descriptionDe: "Ganzer Wolfsbarsch über offener Flamme gegrillt, serviert in würziger Brühe mit Gemüse. Für 2 Personen.",
    descriptionEn: "Whole sea bass grilled over open flame, served in a savory broth with vegetables. Serves 2.",
    price: 32.9, imageUrl: IMG.grilledFish, spiceLevel: 2, isBestseller: true, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["fisch", "soja", "gluten", "sellerie"], sortOrder: 1, categoryId: "cat-grilled-fish",
  },
  {
    id: "dish-kaoyu-mala", slug: "kaoyu-mala", nameDe: "Kao Yu – Gegrillter Fisch Má Là", nameEn: "Kao Yu – Grilled Fish Má Là", nameZh: "麻辣烤鱼",
    descriptionDe: "Gegrillter Fisch in feurig-betäubender Má-Là-Sauce mit Sichuan-Pfeffer und getrockneten Chilis. Für 2 Personen.",
    descriptionEn: "Grilled fish in fiery numbing má là sauce with Sichuan pepper and dried chilies. Serves 2.",
    price: 34.9, imageUrl: IMG.spicyFish, spiceLevel: 3, isBestseller: false, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["fisch", "soja", "gluten", "sellerie"], sortOrder: 2, categoryId: "cat-grilled-fish",
  },
  {
    id: "dish-kaoyu-pickled", slug: "kaoyu-pickled", nameDe: "Kao Yu – Fisch mit eingelegtem Gemüse", nameEn: "Kao Yu – Fish with Pickled Greens", nameZh: "酸菜烤鱼",
    descriptionDe: "Gegrillter Fisch mit eingelegtem Senfgemüse (Suancai) in aromatischer, leicht säuerlicher Brühe. Für 2 Personen.",
    descriptionEn: "Grilled fish with pickled mustard greens (suancai) in an aromatic, tangy broth. Serves 2.",
    price: 33.9, imageUrl: IMG.grilledFish, spiceLevel: 1, isBestseller: false, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["fisch", "soja", "gluten", "sellerie"], sortOrder: 3, categoryId: "cat-grilled-fish",
  },

  // --- Sichuan Specialties ---
  {
    id: "dish-yuxiang-eggplant", slug: "yuxiang-aubergine", nameDe: "Yúxiāng Aubergine", nameEn: "Fish-Fragrant Eggplant", nameZh: "鱼香茄子",
    descriptionDe: "Geschmorte Aubergine in süß-scharf-saurer Yúxiāng-Sauce mit Knoblauch und Ingwer.",
    descriptionEn: "Braised eggplant in sweet-spicy-sour yúxiāng sauce with garlic and ginger.",
    price: 12.9, imageUrl: IMG.eggplant, spiceLevel: 2, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: ["soja", "gluten"], sortOrder: 1, categoryId: "cat-sichuan",
  },
  {
    id: "dish-laziji", slug: "laziji", nameDe: "Là Zǐ Jī – Chili Hähnchen", nameEn: "Chongqing Chili Chicken", nameZh: "辣子鸡",
    descriptionDe: "Knusprig frittierte Hähnchenwürfel versteckt in einem Berg aus getrockneten Chilis und Sichuan-Pfeffer.",
    descriptionEn: "Crispy fried chicken cubes hidden in a mountain of dried chilies and Sichuan pepper.",
    price: 16.9, imageUrl: IMG.chicken, spiceLevel: 3, isBestseller: true, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["soja", "gluten"], sortOrder: 2, categoryId: "cat-sichuan",
  },
  {
    id: "dish-huiguorou", slug: "huiguorou", nameDe: "Huí Guō Ròu – Twice Cooked Pork", nameEn: "Twice Cooked Pork", nameZh: "回锅肉",
    descriptionDe: "Doppelt gegarter Schweinebauch mit Lauch und Paprika in Doubanjiang-Bohnensauce.",
    descriptionEn: "Twice-cooked pork belly with leek and peppers in doubanjiang bean sauce.",
    price: 15.9, imageUrl: IMG.pork, spiceLevel: 2, isBestseller: false, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["soja", "gluten"], sortOrder: 3, categoryId: "cat-sichuan",
  },
  {
    id: "dish-mala-xiangguo", slug: "mala-xiangguo", nameDe: "Má Là Xiāng Guō", nameEn: "Mala Dry Pot", nameZh: "麻辣香锅",
    descriptionDe: "Wok-gebratener Trockentopf mit Gemüse, Fleisch und Pilzen nach Wahl in Má-Là-Gewürzöl.",
    descriptionEn: "Stir-fried dry pot with vegetables, meat and mushrooms of choice in má là spice oil.",
    price: 17.9, imageUrl: IMG.hotpot, spiceLevel: 3, isBestseller: false, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["soja", "gluten", "sesam"], sortOrder: 4, categoryId: "cat-sichuan",
  },
  {
    id: "dish-dry-fried-beans", slug: "dry-fried-beans", nameDe: "Gānbiān Sìjìdòu – Trockengebratene Bohnen", nameEn: "Dry-Fried Green Beans", nameZh: "干煸四季豆",
    descriptionDe: "Grüne Bohnen im Wok gebraten mit Knoblauch, Chili und eingelegtem Gemüse.",
    descriptionEn: "Green beans wok-fried with garlic, chili and preserved vegetables.",
    price: 11.9, imageUrl: IMG.vegetables, spiceLevel: 1, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: ["soja"], sortOrder: 5, categoryId: "cat-sichuan",
  },

  // --- Seafood ---
  {
    id: "dish-gongbao-shrimp", slug: "gongbao-garnelen", nameDe: "Gong Bao Garnelen", nameEn: "Kung Pao Prawns", nameZh: "宫保虾球",
    descriptionDe: "Saftige Garnelen mit Erdnüssen, Chili und Sichuan-Pfeffer im Wok gebraten.",
    descriptionEn: "Juicy prawns stir-fried with peanuts, chili and Sichuan pepper.",
    price: 18.9, imageUrl: IMG.shrimp, spiceLevel: 2, isBestseller: false, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["krebstiere", "erdnuss", "soja", "gluten"], sortOrder: 1, categoryId: "cat-seafood",
  },
  {
    id: "dish-garlic-squid", slug: "knoblauch-tintenfisch", nameDe: "Tintenfisch mit Knoblauch & Chili", nameEn: "Garlic Chili Squid", nameZh: "蒜香鱿鱼",
    descriptionDe: "Zarter Tintenfisch im Wok mit viel Knoblauch, Frühlingszwiebeln und Chili.",
    descriptionEn: "Tender squid wok-tossed with plenty of garlic, spring onion and chili.",
    price: 17.9, imageUrl: IMG.seafood, spiceLevel: 2, isBestseller: false, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["weichtiere", "soja", "gluten"], sortOrder: 2, categoryId: "cat-seafood",
  },
  {
    id: "dish-scallops-blackbean", slug: "jakobsmuscheln-bohnensauce", nameDe: "Jakobsmuscheln in schwarzer Bohnensauce", nameEn: "Scallops in Black Bean Sauce", nameZh: "豉汁带子",
    descriptionDe: "Gebratene Jakobsmuscheln in aromatischer schwarzer Bohnensauce mit Paprika.",
    descriptionEn: "Seared scallops in fragrant black bean sauce with bell peppers.",
    price: 21.9, imageUrl: IMG.seafood, spiceLevel: 1, isBestseller: false, isVegetarian: false, isVegan: false, isAvailable: false,
    allergens: ["weichtiere", "soja", "gluten"], sortOrder: 3, categoryId: "cat-seafood",
  },

  // --- Meat ---
  {
    id: "dish-cumin-lamb", slug: "kreuzkuemmel-lamm", nameDe: "Kreuzkümmel-Lamm", nameEn: "Cumin Lamb", nameZh: "孜然羊肉",
    descriptionDe: "Lammstreifen im Wok mit gerösteten Kreuzkümmelsamen, Chiliflocken und Frühlingszwiebeln.",
    descriptionEn: "Wok-fried lamb strips with roasted cumin seeds, chili flakes and spring onions.",
    price: 17.9, imageUrl: IMG.beef, spiceLevel: 2, isBestseller: true, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["soja", "gluten"], sortOrder: 1, categoryId: "cat-meat",
  },
  {
    id: "dish-beef-blackpepper", slug: "rind-schwarzer-pfeffer", nameDe: "Rindfleisch mit schwarzem Pfeffer", nameEn: "Black Pepper Beef", nameZh: "黑椒牛柳",
    descriptionDe: "Zarte Rindfleischstreifen mit Zwiebeln und Paprika in kräftiger schwarzer Pfeffersauce.",
    descriptionEn: "Tender beef strips with onions and peppers in a bold black pepper sauce.",
    price: 16.9, imageUrl: IMG.beef, spiceLevel: 1, isBestseller: false, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["soja", "gluten"], sortOrder: 2, categoryId: "cat-meat",
  },
  {
    id: "dish-sweet-sour-pork", slug: "sued-saures-schweinefleisch", nameDe: "Süß-saures Schweinefleisch", nameEn: "Sweet & Sour Pork", nameZh: "咕噜肉",
    descriptionDe: "Knusprig frittiertes Schweinefleisch mit Ananas und Paprika in süß-saurer Sauce.",
    descriptionEn: "Crispy fried pork with pineapple and peppers in sweet & sour sauce.",
    price: 14.9, imageUrl: IMG.pork, spiceLevel: 0, isBestseller: false, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["gluten", "soja"], sortOrder: 3, categoryId: "cat-meat",
  },
  {
    id: "dish-chicken-cashew", slug: "haehnchen-cashew", nameDe: "Hähnchen mit Cashewkernen", nameEn: "Chicken with Cashews", nameZh: "腰果鸡丁",
    descriptionDe: "Zartes Hähnchen mit gerösteten Cashewkernen und Gemüse in leichter Sojasauce.",
    descriptionEn: "Tender chicken with roasted cashews and vegetables in a light soy sauce.",
    price: 14.9, imageUrl: IMG.chicken, spiceLevel: 0, isBestseller: false, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["schalenfruechte", "soja", "gluten"], sortOrder: 4, categoryId: "cat-meat",
  },

  // --- Tofu ---
  {
    id: "dish-jiachang-tofu", slug: "jiachang-tofu", nameDe: "Jiācháng Tofu – Hausmacher Tofu", nameEn: "Home-Style Braised Tofu", nameZh: "家常豆腐",
    descriptionDe: "Gebratener Tofu mit Pilzen, Paprika und Lauch in würziger Bohnensauce.",
    descriptionEn: "Pan-fried tofu with mushrooms, peppers and leek in a savory bean sauce.",
    price: 12.9, imageUrl: IMG.mapoTofu, spiceLevel: 1, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: ["soja", "gluten"], sortOrder: 1, categoryId: "cat-tofu",
  },
  {
    id: "dish-mapo-tofu-veggie", slug: "mapo-tofu-vegetarisch", nameDe: "Mapo Tofu (vegetarisch)", nameEn: "Mapo Tofu (Vegetarian)", nameZh: "素麻婆豆腐",
    descriptionDe: "Seidentofu in feuriger Doubanjiang-Sauce mit Shiitake statt Fleisch – vegan zubereitet.",
    descriptionEn: "Silken tofu in fiery doubanjiang sauce with shiitake instead of meat – prepared vegan.",
    price: 12.9, imageUrl: IMG.mapoTofu, spiceLevel: 3, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: ["soja", "gluten"], sortOrder: 2, categoryId: "cat-tofu",
  },
  {
    id: "dish-crispy-tofu", slug: "knuspriger-tofu-salz-pfeffer", nameDe: "Knuspriger Tofu Salz & Pfeffer", nameEn: "Salt & Pepper Crispy Tofu", nameZh: "椒盐豆腐",
    descriptionDe: "Frittierte Tofuwürfel mit Salz, Pfeffer, Knoblauch und Chili – außen knusprig, innen cremig.",
    descriptionEn: "Fried tofu cubes with salt, pepper, garlic and chili – crispy outside, creamy inside.",
    price: 11.9, imageUrl: IMG.mapoTofu, spiceLevel: 1, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: ["soja", "gluten"], sortOrder: 3, categoryId: "cat-tofu",
  },

  // --- Noodles ---
  {
    id: "dish-beef-noodle-soup", slug: "rindfleisch-nudelsuppe", nameDe: "Sichuan Rindfleisch-Nudelsuppe", nameEn: "Sichuan Beef Noodle Soup", nameZh: "红烧牛肉面",
    descriptionDe: "Handgezogene Nudeln in würziger Rinderbrühe mit geschmortem Rindfleisch und Pak Choi.",
    descriptionEn: "Hand-pulled noodles in a spiced beef broth with braised beef and pak choi.",
    price: 13.9, imageUrl: IMG.beefNoodle, spiceLevel: 2, isBestseller: true, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["gluten", "soja", "sellerie"], sortOrder: 1, categoryId: "cat-noodles",
  },
  {
    id: "dish-chow-mein", slug: "gebratene-nudeln", nameDe: "Gebratene Nudeln mit Gemüse", nameEn: "Vegetable Chow Mein", nameZh: "素炒面",
    descriptionDe: "Weizennudeln aus dem Wok mit knackigem Gemüse und Sojasauce.",
    descriptionEn: "Wok-fried wheat noodles with crunchy vegetables and soy sauce.",
    price: 11.9, imageUrl: IMG.noodles, spiceLevel: 0, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: ["gluten", "soja"], sortOrder: 2, categoryId: "cat-noodles",
  },
  {
    id: "dish-dan-dan-noodles", slug: "dan-dan-nudeln", nameDe: "Dan Dan Nudeln (Portion)", nameEn: "Dan Dan Noodles (Portion)", nameZh: "担担面",
    descriptionDe: "Kleinere Portion der klassischen Dan Dan Nudeln mit Sesam und Chiliöl.",
    descriptionEn: "Smaller portion of the classic dan dan noodles with sesame and chili oil.",
    price: 10.9, imageUrl: IMG.noodles, spiceLevel: 2, isBestseller: false, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["gluten", "sesam", "soja", "erdnuss"], sortOrder: 3, categoryId: "cat-noodles",
  },

  // --- Rice ---
  {
    id: "dish-yangzhou-fried-rice", slug: "yangzhou-gebratener-reis", nameDe: "Yangzhou Gebratener Reis", nameEn: "Yangzhou Fried Rice", nameZh: "扬州炒饭",
    descriptionDe: "Gebratener Reis mit Ei, Garnelen, Schinken, Erbsen und Frühlingszwiebeln.",
    descriptionEn: "Fried rice with egg, shrimp, ham, peas and spring onions.",
    price: 11.9, imageUrl: IMG.friedRice, spiceLevel: 0, isBestseller: true, isVegetarian: false, isVegan: false, isAvailable: true,
    allergens: ["ei", "krebstiere", "soja"], sortOrder: 1, categoryId: "cat-rice",
  },
  {
    id: "dish-veg-fried-rice", slug: "gemuese-gebratener-reis", nameDe: "Gebratener Reis mit Gemüse", nameEn: "Vegetable Fried Rice", nameZh: "素炒饭",
    descriptionDe: "Duftreis aus dem Wok mit buntem Gemüse und Sojasauce.",
    descriptionEn: "Wok-fried jasmine rice with mixed vegetables and soy sauce.",
    price: 9.9, imageUrl: IMG.friedRice, spiceLevel: 0, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: ["soja"], sortOrder: 2, categoryId: "cat-rice",
  },
  {
    id: "dish-steamed-rice", slug: "duftreis", nameDe: "Duftreis", nameEn: "Steamed Jasmine Rice", nameZh: "米饭",
    descriptionDe: "Frisch gedämpfter Jasminreis.",
    descriptionEn: "Freshly steamed jasmine rice.",
    price: 3.5, imageUrl: IMG.friedRice, spiceLevel: 0, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: [], sortOrder: 3, categoryId: "cat-rice",
  },

  // --- Desserts ---
  {
    id: "dish-sesam-baelle", slug: "sesam-baelle", nameDe: "Frittierte Sesambällchen (3 Stück)", nameEn: "Fried Sesame Balls (3 pcs)", nameZh: "煎堆",
    descriptionDe: "Knusprige Klebreisbällchen mit süßer roter Bohnenpaste, gerollt in Sesam.",
    descriptionEn: "Crispy glutinous rice balls filled with sweet red bean paste, rolled in sesame.",
    price: 5.9, imageUrl: IMG.mochi, spiceLevel: 0, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: ["gluten", "sesam"], sortOrder: 1, categoryId: "cat-desserts",
  },
  {
    id: "dish-mango-pudding", slug: "mango-pudding", nameDe: "Mango-Pudding", nameEn: "Mango Pudding", nameZh: "芒果布丁",
    descriptionDe: "Cremiger Mango-Pudding mit frischen Mangostücken.",
    descriptionEn: "Creamy mango pudding with fresh mango pieces.",
    price: 5.5, imageUrl: IMG.dessert, spiceLevel: 0, isBestseller: false, isVegetarian: true, isVegan: false, isAvailable: true,
    allergens: ["milch"], sortOrder: 2, categoryId: "cat-desserts",
  },
  {
    id: "dish-fried-banana", slug: "gebackene-banane", nameDe: "Gebackene Banane mit Honig", nameEn: "Fried Banana with Honey", nameZh: "拔丝香蕉",
    descriptionDe: "Frittierte Bananenstücke im Teigmantel mit Honig und Sesam.",
    descriptionEn: "Battered fried banana pieces glazed with honey and sesame.",
    price: 6.5, imageUrl: IMG.dessert, spiceLevel: 0, isBestseller: false, isVegetarian: true, isVegan: false, isAvailable: true,
    allergens: ["gluten", "ei", "sesam"], sortOrder: 3, categoryId: "cat-desserts",
  },

  // --- Drinks ---
  {
    id: "dish-jasmine-tea", slug: "jasmintee", nameDe: "Jasmintee (Kanne)", nameEn: "Jasmine Tea (Pot)", nameZh: "茉莉花茶",
    descriptionDe: "Aromatischer Jasmintee, frisch aufgegossen – ideal zu scharfen Gerichten.",
    descriptionEn: "Fragrant jasmine tea, freshly brewed – perfect with spicy dishes.",
    price: 4.5, imageUrl: IMG.tea, spiceLevel: 0, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: [], sortOrder: 1, categoryId: "cat-drinks",
  },
  {
    id: "dish-tsingtao", slug: "tsingtao-bier", nameDe: "Tsingtao Bier 0,33l", nameEn: "Tsingtao Beer 0.33l", nameZh: "青岛啤酒",
    descriptionDe: "Klassisches chinesisches Lagerbier, gut gekühlt.",
    descriptionEn: "Classic Chinese lager, served well chilled.",
    price: 4.9, imageUrl: IMG.beer, spiceLevel: 0, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: ["gluten"], sortOrder: 2, categoryId: "cat-drinks",
  },
  {
    id: "dish-lychee-cooler", slug: "lychee-cooler", nameDe: "Lychee Cooler (alkoholfrei)", nameEn: "Lychee Cooler (non-alcoholic)", nameZh: "荔枝饮",
    descriptionDe: "Erfrischender Lychee-Drink mit Limette und Minze.",
    descriptionEn: "Refreshing lychee drink with lime and mint.",
    price: 5.5, imageUrl: IMG.cocktail, spiceLevel: 0, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: ["sulfite"], sortOrder: 3, categoryId: "cat-drinks",
  },
  {
    id: "dish-still-water", slug: "wasser-still", nameDe: "Mineralwasser 0,75l", nameEn: "Mineral Water 0.75l", nameZh: "矿泉水",
    descriptionDe: "Stilles oder sprudelndes Mineralwasser.",
    descriptionEn: "Still or sparkling mineral water.",
    price: 4.5, imageUrl: IMG.tea, spiceLevel: 0, isBestseller: false, isVegetarian: true, isVegan: true, isAvailable: true,
    allergens: [], sortOrder: 4, categoryId: "cat-drinks",
  },
];

// ---------------------------------------------------------------------------
// Default opening hours (Mon–Sun). Day: 0 = Sunday ... 6 = Saturday.
// ---------------------------------------------------------------------------
export const DEFAULT_OPENING_HOURS: OpeningHour[] = [
  { day: 1, open: "12:00", close: "23:00", closed: false }, // Mon
  { day: 2, open: "12:00", close: "23:00", closed: false }, // Tue
  { day: 3, open: "12:00", close: "23:00", closed: false }, // Wed
  { day: 4, open: "12:00", close: "23:00", closed: false }, // Thu
  { day: 5, open: "12:00", close: "23:30", closed: false }, // Fri
  { day: 6, open: "12:00", close: "23:30", closed: false }, // Sat
  { day: 0, open: "12:00", close: "22:30", closed: false }, // Sun
];

export const RESTAURANT = {
  name: "China Restaurant Three Kingdoms",
  shortName: "Three Kingdoms",
  street: "Stresemannstraße 4",
  zip: "40210",
  city: "Düsseldorf",
  country: "Deutschland",
  countryCode: "DE",
  phone: "0211 46800494",
  phoneIntl: "+492114680494",
  email: "info@three-kingdoms.de",
  rating: 4.4,
  reviewCount: 786,
  cuisine: "Authentische Sichuan-Küche",
  cuisineEn: "Authentic Sichuan Cuisine",
  latitude: 51.2192,
  longitude: 6.7906,
} as const;

export function getFallbackCategoriesWithDishes() {
  return [...CATEGORIES]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((cat) => ({
      ...cat,
      dishes: DISHES.filter((d) => d.categoryId === cat.id).sort(
        (a, b) => a.sortOrder - b.sortOrder,
      ),
    }));
}
