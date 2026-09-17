/**
 * Menu transcribed from the restaurant's own menu PDF (the file linked from the
 * "Menu" tab of abyssiniarestobar.pl). Prices are as printed there, in PLN.
 * Obvious typos in the source ("garilc", "chilli paper", "SHRIO") are corrected;
 * no dish, price or ingredient has been added, removed or embellished.
 *
 * Known gaps in the source, deliberately left unstated rather than guessed:
 *  - the meat sharing platter is described as "3 meat and 2 vegan dishes" in
 *    English and "4 dania mięsne i 2 wegańskie" in Polish, so the count is given
 *    generically below until the restaurant confirms it;
 *  - the wine list prints three ABV/volume values without saying which wine each
 *    belongs to, so ABV is omitted.
 */

export type Bi = { pl: string; en: string }

export type Dish = {
  id: string
  name: string
  price?: number
  /** Several sizes, e.g. a platter priced per number of guests. */
  tiers?: { label: Bi; price: number }[]
  note?: Bi
  vegan?: boolean
}

export type Course = {
  id: string
  title: Bi
  intro?: Bi
  dishes: Dish[]
}

export const courses: Course[] = [
  {
    id: 'meat',
    title: { pl: 'Dania mięsne', en: 'Meat dishes' },
    dishes: [
      {
        id: 'kitfo',
        name: 'Kitfo',
        price: 60,
        note: {
          pl: 'Siekana wołowina w przyprawach na bazie chili i niter kibbeh — klarowanego masła z ziołami. Podawana z twarogiem.',
          en: 'Chopped prime beef with chilli pepper and niter kibbeh — herb-infused clarified butter. Served with cottage cheese.',
        },
      },
      {
        id: 'doro-wot',
        name: 'Doro Wot',
        price: 45,
        note: {
          pl: 'Powoli duszona pałka z kurczaka z cebulą, etiopskimi przyprawami i gotowanym jajkiem.',
          en: 'Slow-cooked chicken drumstick stew with onion, Ethiopian spices and a boiled egg.',
        },
      },
      {
        id: 'siga-firfir',
        name: 'Siga Firfir',
        price: 45,
        note: {
          pl: 'Suszona injera z przyprawami i pikantną wołowiną.',
          en: 'Dried injera with spices and spiced beef.',
        },
      },
      {
        id: 'doro-tibs',
        name: 'Doro Tibs',
        price: 50,
        note: {
          pl: 'Pierś kurczaka pokrojona w kostkę, smażona z cebulą, pomidorami, papryczką jalapeño i przyprawami.',
          en: 'Diced chicken breast fried with onion, tomato, jalapeño and spices.',
        },
      },
      {
        id: 'dekak-tibs',
        name: 'Dekak Tibs',
        price: 50,
        note: {
          pl: 'Smażona mielona wołowina z papryczką chili, czosnkiem i etiopskimi przyprawami.',
          en: 'Fried minced beef with chilli pepper, garlic and Ethiopian spices.',
        },
      },
      {
        id: 'dulet',
        name: 'Dulet',
        price: 55,
        note: {
          pl: 'Mielona wołowina z papryczką chili, czosnkiem i etiopskimi przyprawami.',
          en: 'Minced beef with chilli pepper, garlic and Ethiopian spices.',
        },
      },
      {
        id: 'yeawaze-tibs',
        name: 'Yeawaze Tibs',
        price: 60,
        note: {
          pl: 'Delikatne kostki wołowiny z cebulą, zieloną papryką, czosnkiem, pastą z ostrej papryki i etiopskimi przyprawami.',
          en: 'Tender beef cubes with onion, green pepper, garlic, hot pepper paste and Ethiopian spices.',
        },
      },
      {
        id: 'merek-tibs',
        name: 'Merek Tibs',
        price: 60,
        note: {
          pl: 'Kostki wołowiny duszone z pomidorem, cebulą i czosnkiem, wykończone czosnkowym masłem ziołowym i rozmarynem.',
          en: 'Cubed beef cooked with tomato, onion and garlic, finished with herbal garlic butter and rosemary.',
        },
      },
      {
        id: 'shekla-tibs',
        name: 'Shekla Tibs',
        price: 65,
        note: {
          pl: 'Marynowane kostki wołowiny w sosie Abyssinia, z papryczkami jalapeño i świeżym czosnkiem. Podawane na rozgrzanej patelni.',
          en: "Marinated beef cubes in Abyssinia's sauce with jalapeños and fresh garlic. Served on a sizzling pan.",
        },
      },
      {
        id: 'key-wot',
        name: 'Key Wot',
        price: 45,
        note: {
          pl: 'Pikantny gulasz z chudej wołowiny.',
          en: 'Spicy stew with lean beef.',
        },
      },
      {
        id: 'dinch-be-siga',
        name: 'Dinch be Siga',
        price: 45,
        note: {
          pl: 'Gulasz z chudej wołowiny z ziemniakami.',
          en: 'Beef stew with lean beef and potato.',
        },
      },
      {
        id: 'bozena-shiro',
        name: 'Bozena Shiro',
        price: 45,
        note: {
          pl: 'Łagodna ciecierzyca gotowana z cebulą, czosnkiem, pomidorami i wołowiną. Podawana z sałatką.',
          en: 'Mild ground chickpea cooked with onion, garlic, tomato and beef. Served with a side salad.',
        },
      },
      {
        id: 'half-half',
        name: 'Half Half',
        price: 75,
        note: {
          pl: 'Pół na pół — dwa wybrane dania z karty na jednym talerzu.',
          en: 'Two dishes of your choice from the menu on one plate.',
        },
      },
    ],
  },
  {
    id: 'vegan',
    title: { pl: 'Dania wegańskie', en: 'Vegan dishes' },
    dishes: [
      {
        id: 'misir-wot',
        name: 'Misir Wot',
        price: 40,
        vegan: true,
        note: {
          pl: 'Czerwona soczewica duszona w pikantnym sosie pomidorowym z etiopskimi ziołami.',
          en: 'Red lentils simmered in a spicy Ethiopian tomato sauce.',
        },
      },
      {
        id: 'kik-wot',
        name: 'Kik Wot',
        price: 40,
        vegan: true,
        note: {
          pl: 'Alicha — łagodny żółty groszek gotowany w sosie z kurkumy.',
          en: 'Alicha — mild split pea stew simmered in turmeric sauce.',
        },
      },
      {
        id: 'gomen-be-dinch',
        name: 'Gomen be Dinch',
        price: 40,
        vegan: true,
        note: {
          pl: 'Siekany szpinak z ziemniakiem, duszony w łagodnym sosie z oliwy, cebuli, czosnku i imbiru.',
          en: 'Chopped spinach and potato stewed with olive oil, onion, garlic and ginger.',
        },
      },
      {
        id: 'keysir',
        name: 'Keysir',
        price: 40,
        vegan: true,
        note: {
          pl: 'Buraki i ziemniaki gotowane ze świeżym chili i etiopskimi przyprawami.',
          en: 'Beetroot and potato cooked with fresh chilli and Ethiopian spices.',
        },
      },
      {
        id: 'tikil-gomen',
        name: 'Tikil Gomen',
        price: 35,
        vegan: true,
        note: {
          pl: 'Siekana kapusta z marchewką, duszona z cebulą i czosnkiem.',
          en: 'Chopped cabbage with carrot, stewed with onion and garlic.',
        },
      },
      {
        id: 'fosolia',
        name: 'Fosolia',
        price: 40,
        vegan: true,
        note: {
          pl: 'Fasolka szparagowa z marchewką, pomidorami, czosnkiem, imbirem i ziołami.',
          en: 'Green beans with carrot, tomato, garlic, ginger and herbs.',
        },
      },
      {
        id: 'shiro',
        name: 'Shiro',
        price: 45,
        vegan: true,
        note: {
          pl: 'Gulasz z mielonej suszonej ciecierzycy i przypraw. Podawany z sałatką.',
          en: 'Stew of ground dried chickpeas and spices. Served with salad.',
        },
      },
      {
        id: 'alicha-dinich',
        name: 'Alicha Dinich',
        price: 40,
        vegan: true,
        note: {
          pl: 'Ziemniaki duszone z marchewką, czerwoną cebulą, czosnkiem, świeżymi ziołami i kurkumą.',
          en: 'Potato stewed with carrot, red onion, garlic, fresh herbs and turmeric.',
        },
      },
      {
        id: 'firfir',
        name: 'Firfir',
        price: 40,
        vegan: true,
        note: {
          pl: 'Pikantny sos pomidorowy wymieszany z injerą.',
          en: 'Spicy tomato sauce mixed with injera.',
        },
      },
      {
        id: 'suf-fitfit',
        name: 'Suf Fitfit',
        price: 40,
        vegan: true,
        note: {
          pl: 'Kawałki injery z papryczkami jalapeño i cebulą w sosie z nasion krokosza barwierskiego.',
          en: 'Pieces of injera with diced jalapeño and onion in a safflower seed sauce.',
        },
      },
      {
        id: 'pasta',
        name: 'Pasta',
        price: 35,
        vegan: true,
        note: {
          pl: 'Makaron w sosie na bazie berbere.',
          en: 'Pasta in a berbere-based sauce.',
        },
      },
      {
        id: 'salad',
        name: 'Salad',
        price: 30,
        vegan: true,
        note: {
          pl: 'Sałata, pomidor, cebula, sok z limonki.',
          en: 'Lettuce, tomato, onion, lime juice.',
        },
      },
      {
        id: 'timatim-kurt',
        name: 'Timatim Kurt',
        price: 25,
        vegan: true,
        note: {
          pl: 'Pomidor, cebula i jalapeño z sokiem z limonki.',
          en: 'Tomato, onion and jalapeño with lime juice.',
        },
      },
      {
        id: 'veggie-rice',
        name: 'Veggie Rice',
        price: 30,
        vegan: true,
        note: { pl: 'Ryż z warzywami.', en: 'Rice with vegetables.' },
      },
      {
        id: 'karya-sineg',
        name: 'Karya Sineg',
        price: 15,
        vegan: true,
        note: {
          pl: 'Papryczki jalapeño faszerowane pomidorem i świeżymi warzywami.',
          en: 'Jalapeños stuffed with tomato and fresh vegetables.',
        },
      },
      {
        id: 'plain-rice',
        name: 'Plain Rice',
        price: 15,
        vegan: true,
        note: { pl: 'Ryż biały.', en: 'Plain white rice.' },
      },
    ],
  },
  {
    id: 'platters',
    title: { pl: 'Talerze do dzielenia', en: 'Sharing platters' },
    intro: {
      pl: 'Wspólny talerz wyłożony injerą, z kilkoma daniami ułożonymi obok siebie. Zestaw dnia komponuje kuchnia.',
      en: 'One shared platter lined with injera, several dishes set side by side. The selection is the kitchen’s choice that day.',
    },
    dishes: [
      {
        id: 'meat-combo',
        name: 'Meat Combo Platter',
        note: {
          pl: 'Wybór dań mięsnych i wegańskich, skomponowany przez kuchnię.',
          en: 'A selection of meat and vegan dishes, composed by the kitchen.',
        },
        tiers: [
          { label: { pl: '1 osoba', en: '1 guest' }, price: 75 },
          { label: { pl: '2 osoby', en: '2 guests' }, price: 150 },
          { label: { pl: '3 osoby', en: '3 guests' }, price: 210 },
          { label: { pl: '4 osoby', en: '4 guests' }, price: 260 },
        ],
      },
      {
        id: 'vegan-combo',
        name: 'Vegan Combo Platter',
        vegan: true,
        note: {
          pl: 'Pięć dań wegańskich na jednym talerzu.',
          en: 'Five vegan dishes on one platter.',
        },
        tiers: [
          { label: { pl: '1 osoba', en: '1 guest' }, price: 50 },
          { label: { pl: '2 osoby', en: '2 guests' }, price: 90 },
          { label: { pl: '3 osoby', en: '3 guests' }, price: 140 },
          { label: { pl: '4 osoby', en: '4 guests' }, price: 200 },
        ],
      },
      {
        id: 'basket',
        name: 'Traditional Food Basket',
        note: {
          pl: 'Połączenie dań mięsnych podane w tradycyjnym koszyku — mesob.',
          en: 'A combination of meat dishes served in a traditional basket — the mesob.',
        },
        tiers: [
          { label: { pl: 'Mały', en: 'Small' }, price: 100 },
          { label: { pl: 'Średni', en: 'Medium' }, price: 160 },
          { label: { pl: 'Duży', en: 'Large' }, price: 210 },
        ],
      },
      {
        id: 'standard-special',
        name: 'Abyssinia Standard Special',
        price: 300,
        note: {
          pl: 'Specjalny talerz kombo dla 4 osób.',
          en: 'Special combo platter for 4 guests.',
        },
      },
      {
        id: 'premium-special',
        name: 'Abyssinia Premium Special',
        price: 580,
        note: {
          pl: 'Grand combo dla 4 i więcej osób, z tej — miodem pitnym.',
          en: 'Grand combo for 4 or more guests, served with tej — honey wine.',
        },
      },
    ],
  },
  {
    id: 'drinks',
    title: { pl: 'Napoje', en: 'Drinks' },
    dishes: [
      {
        id: 'tej',
        name: 'Tej',
        note: {
          pl: 'Etiopski miód pitny, 11%.',
          en: 'Ethiopian honey wine, 11%.',
        },
        tiers: [
          { label: { pl: '0,125 l', en: '0.125 l' }, price: 26 },
          { label: { pl: '0,25 l', en: '0.25 l' }, price: 38 },
        ],
      },
      {
        id: 'coffee',
        name: 'Ethiopian Coffee',
        price: 15,
        note: { pl: 'Kawa etiopska.', en: 'Ethiopian coffee.' },
      },
      {
        id: 'prosecco',
        name: 'Maschio Prosecco',
        price: 25,
        note: { pl: '0,187 l.', en: '0.187 l.' },
      },
      {
        id: 'chardonnay',
        name: 'Domaine Peirière Réserve Chardonnay',
        price: 25,
        note: { pl: '0,187 l.', en: '0.187 l.' },
      },
      {
        id: 'merlot',
        name: 'Domaine Peirière Réserve Merlot',
        price: 25,
        note: { pl: '0,187 l.', en: '0.187 l.' },
      },
      {
        id: 'beer0',
        name: 'Beer 0%',
        price: 18,
        note: { pl: 'Piwo bezalkoholowe.', en: 'Alcohol-free beer.' },
      },
      { id: 'tea', name: 'Tea', price: 13, note: { pl: 'Herbata.', en: 'Tea.' } },
      {
        id: 'coke',
        name: 'Coca-Cola / Coca-Cola Zero',
        price: 12,
        note: { pl: '0,25 l.', en: '0.25 l.' },
      },
      { id: 'sprite', name: 'Sprite', price: 12 },
      {
        id: 'tonic',
        name: 'Kinley Tonic',
        price: 12,
        note: { pl: '0,25 l.', en: '0.25 l.' },
      },
      {
        id: 'water',
        name: 'Water',
        price: 11,
        note: { pl: 'Woda.', en: 'Water.' },
      },
    ],
  },
]

export const veganCount = courses
  .flatMap((c) => c.dishes)
  .filter((d) => d.vegan).length
