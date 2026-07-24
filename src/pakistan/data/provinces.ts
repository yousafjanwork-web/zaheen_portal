import type { Province } from "../types";

import nihari from "../assets/images/food/nihari.png";
import lassi from "../assets/images/food/lassi.png";
import samosa from "../assets/images/food/samosa.png";
import briyani from "../assets/images/food/biryani.png";
import sai from "../assets/images/food/sai.jpg";
import chaplikebab from "../assets/images/food/chapli-kebab.png";
import kabuliPulao from "../assets/images/food/kabuli-pulao.png";
import saji from "../assets/images/food/sajji.png";
import kaakBread from "../assets/images/food/kaak.webp";
import mamtu from "../assets/images/food/mamtu.png";
import driedApricots from "../assets/images/food/dried-apricots.webp";
import trout from "../assets/images/food/trout.png";
import noonChai from "../assets/images/food/noon-chai.png";
import hilltopBBQ from "../assets/images/food/hilltop-bbq.png";

export const provinces: Province[] = [
  {
    id: "punjab",
    name: "Punjab",
    nameUrdu: "پنجاب",
    capital: "Lahore",
    emoji: "🌾",
    color: "#f59e0b",
    gradient: "from-amber-400 via-orange-400 to-yellow-500",
    description:
      "Punjab means 'Land of Five Rivers'! It is the heart of Pakistan with golden wheat fields, delicious food, and friendly people.",
    funFacts: [
      "Punjab has five famous rivers that give it its name!",
      "Lahore is called the 'City of Gardens' and 'Paris of the East'!",
      "The Badshahi Mosque can hold 100,000 people!",
      "Punjab grows most of Pakistan's wheat and rice!",
      "Basant kite festival fills the sky with colorful kites!",
    ],
    population: "110+ million",
    area: "205,344 km²",
    language: ["Punjabi", "Urdu", "Saraiki"],
    traditionalDress: {
      name: "Shalwar Kameez & Phulkari",
      emoji: "👗",
      description:
        "Bright embroidered phulkari shawls and colorful shalwar kameez for festivals!",
    },
    famousFoods: [
      {
        id: "food-nihari",
        name: "Nihari",
        image: nihari,
        description: "Slow-cooked spicy stew perfect for breakfast!",
        provinceId: "punjab",
        ingredients: ["Beef", "Spices", "Ginger", "Flour"],
      },
      {
        id: "food-lassi",
        name: "Lassi",
        image: lassi,
        description: "Cool yogurt drink — sweet or salty!",
        provinceId: "punjab",
        ingredients: ["Yogurt", "Sugar", "Cardamom"],
      },
      {
        id: "food-samosa",
        name: "Samosa",
        image: samosa,
        description: "Crispy triangular pastry filled with spicy potatoes!",
        provinceId: "punjab",
        ingredients: ["Potato", "Peas", "Spices", "Flour"],
      },
    ],
    animals: [
      {
        id: "animal-chinkara",
        name: "Chinkara Gazelle",
        image: "🦌",
        habitat: "Plains & scrublands",
        funFact: "Chinkaras can go without water for long periods!",
        sound: "soft bleat",
        provinceId: "punjab",
      },
      {
        id: "animal-peacock",
        name: "Indian Peafowl",
        image: "🦚",
        habitat: "Gardens & forests",
        funFact: "Male peacocks fan their colorful feathers to dance!",
        sound: "loud call",
        provinceId: "punjab",
      },
    ],
    cities: [
      {
        id: "lahore",
        name: "Lahore",
        emoji: "🕌",
        description:
          "The cultural capital of Pakistan! Full of Mughal history, street food, and warm hearts.",
        funFacts: [
          "Lahore Fort is a UNESCO World Heritage Site!",
          "Food Street lights up beautifully at night!",
          "Wagah Border ceremony happens every evening!",
        ],
        landmarks: [
          {
            id: "badshahi",
            name: "Badshahi Mosque",
            emoji: "🕌",
            description:
              "A giant red sandstone mosque built by Emperor Aurangzeb in 1673.",
            funFact:
              "It was the largest mosque in the world for over 300 years!",
            narration:
              "Wow! Look at the Badshahi Mosque! Its red walls glow at sunset. Emperor Aurangzeb built this amazing place so people could pray together.",
          },
          {
            id: "lahore-fort",
            name: "Lahore Fort",
            emoji: "🏰",
            description:
              "A massive Mughal fort with beautiful palaces and gardens inside.",
            funFact: "The Sheesh Mahal has thousands of tiny mirrors!",
            narration:
              "Step inside Lahore Fort! The Sheesh Mahal sparkles like a diamond cave. Kings once lived here!",
          },
          {
            id: "minar-e-pakistan",
            name: "Minar-e-Pakistan",
            emoji: "🗼",
            description:
              "A tall tower built where Pakistan's independence resolution was passed.",
            funFact: "It is 70 meters tall — like a 23-story building!",
            narration:
              "This tower marks a super important place! In 1940, leaders decided Pakistan should become a free country right here!",
          },
          {
            id: "food-street",
            name: "Food Street",
            emoji: "🍜",
            description:
              "A magical street full of lights, music, and delicious Pakistani food!",
            funFact: "You can try over 50 different dishes on one street!",
            narration:
              "Yum! Food Street smells amazing! Try spicy chicken, sweet jalebi, and cold lassi!",
          },
        ],
        foods: ["Nihari", "Lassi", "Samosa", "Kulfi", "Haleem"],
        narration:
          "Welcome to Lahore, the City of Gardens! Let's walk through the old city gates and discover magic!",
      },
      {
        id: "multan",
        name: "Multan",
        emoji: "🕌",
        description:
          "The City of Saints — famous for blue pottery and mangoes!",
        funFacts: [
          "Multan is one of the oldest cities in South Asia!",
          "It is famous for delicious mangoes!",
          "Blue pottery from Multan is world famous!",
        ],
        landmarks: [
          {
            id: "shah-rukn",
            name: "Shah Rukn-e-Alam Tomb",
            emoji: "🏛️",
            description: "A beautiful octagonal tomb with blue tiles.",
            funFact: "It is one of the largest tombs in South Asia!",
            narration:
              "Look at the sparkling blue tiles! This peaceful tomb has stood for centuries.",
          },
        ],
        foods: ["Sohan Halwa", "Mangoes", "Multani Chaamp"],
        narration: "Welcome to Multan, the City of Saints and sweet mangoes!",
      },
      {
        id: "faisalabad",
        name: "Faisalabad",
        emoji: "🧵",
        description: "The Manchester of Pakistan — a busy textile city!",
        funFacts: [
          "It is designed like the Union Jack from above!",
          "Faisalabad makes lots of clothes for the world!",
        ],
        landmarks: [
          {
            id: "clock-tower",
            name: "Clock Tower",
            emoji: "🕐",
            description: "A historic clock tower at the heart of the city.",
            funFact:
              "Eight bazaars spread out from the clock tower like a star!",
            narration:
              "The Clock Tower is the center of Faisalabad. Eight colorful markets surround it!",
          },
        ],
        foods: ["Daal Mash", "Kebabs"],
        narration: "Welcome to Faisalabad — the city of cloth and clocks!",
      },
    ],
    landmarks: [],
    culture: [
      "Bhangra dance makes everyone smile!",
      "Folk songs tell stories of love and harvest.",
      "Weddings last many days with mehndi and dhol!",
      "Basant kite festival paints the sky!",
    ],
    weather: "Hot summers, cool winters, monsoon rains in July–August",
    music: "Bhangra & folk dhol beats",
    history:
      "Punjab has been home to the Indus Valley Civilization, Mughals, Sikhs, and now modern Pakistan. It is called the breadbasket of the nation!",
    narration:
      "Assalam-o-Alaikum! Welcome to Punjab — Land of Five Rivers! Golden wheat waves in the wind, and the smell of fresh naan fills the air. Let's explore!",
    mapPath:
      "M280,180 L340,160 L380,180 L400,220 L390,280 L360,320 L300,340 L250,320 L230,260 L240,200 Z",
  },
  {
    id: "sindh",
    name: "Sindh",
    nameUrdu: "سندھ",
    capital: "Karachi",
    emoji: "🌊",
    color: "#06b6d4",
    gradient: "from-cyan-400 via-teal-400 to-blue-500",
    description:
      "Sindh is home to the mighty Indus River, ancient Mohenjo-daro, and Pakistan's biggest city — Karachi by the sea!",
    funFacts: [
      "Mohenjo-daro is over 4,500 years old!",
      "Karachi is one of the largest cities in the world!",
      "The Indus River is the lifeline of Sindh!",
      "Ajrak is the famous block-printed cloth of Sindh!",
      "Sindhi people celebrate the Indus with festivals!",
    ],
    population: "50+ million",
    area: "140,914 km²",
    language: ["Sindhi", "Urdu"],
    traditionalDress: {
      name: "Ajrak & Topi",
      emoji: "🧣",
      description:
        "Beautiful block-printed Ajrak shawls in red, blue, and black with geometric patterns!",
    },
    famousFoods: [
      {
        id: "food-biryani",
        name: "Sindhi Biryani",
        image: briyani,
        description: "Spicy rice with meat, potatoes, and tangy flavors!",
        provinceId: "sindh",
        ingredients: ["Rice", "Meat", "Potato", "Yogurt", "Spices"],
      },
      {
        id: "food-sai-bhaji",
        name: "Sai Bhaji",
        image: sai,
        description: "Healthy spinach and lentil curry!",
        provinceId: "sindh",
        ingredients: ["Spinach", "Lentils", "Dill", "Spices"],
      },
    ],
    animals: [
      {
        id: "animal-dolphin",
        name: "Indus River Dolphin",
        image: "🐬",
        habitat: "Indus River",
        funFact: "These dolphins are almost blind and use sonar to swim!",
        sound: "clicks and whistles",
        provinceId: "sindh",
      },
      {
        id: "animal-turtle",
        name: "Green Sea Turtle",
        image: "🐢",
        habitat: "Karachi beaches",
        funFact: "Baby turtles race to the sea under the moonlight!",
        sound: "splash",
        provinceId: "sindh",
      },
    ],
    cities: [
      {
        id: "karachi",
        name: "Karachi",
        emoji: "🏙️",
        description:
          "The City of Lights! Pakistan's biggest city by the Arabian Sea.",
        funFacts: [
          "Karachi has a busy seaport that connects Pakistan to the world!",
          "Clifton Beach is perfect for camel rides!",
          "It is called the City of Lights because it never sleeps!",
        ],
        landmarks: [
          {
            id: "quaid-mazar",
            name: "Mazar-e-Quaid",
            emoji: "🏛️",
            description:
              "The resting place of Quaid-e-Azam Muhammad Ali Jinnah.",
            funFact: "The white marble dome glows beautifully at night!",
            narration:
              "This peaceful white building is where our great leader Quaid-e-Azam rests. People come to say thank you!",
          },
          {
            id: "clifton",
            name: "Clifton Beach",
            emoji: "🏖️",
            description:
              "A lively beach with camels, food stalls, and sea breeze!",
            funFact: "You can ride a camel along the Arabian Sea!",
            narration:
              "Feel the sea breeze! Ride a camel and watch the waves crash!",
          },
          {
            id: "mohatta",
            name: "Mohatta Palace",
            emoji: "🏰",
            description: "A pink palace that looks like a fairy tale!",
            funFact: "It was built in 1927 with pink Jodhpur stone!",
            narration:
              "Look at the pink palace! It looks like something from a storybook!",
          },
        ],
        foods: ["Biryani", "Bun Kebab", "Burns Road sweets"],
        narration: "Welcome to Karachi — the City of Lights by the sea!",
      },
      {
        id: "hyderabad-sindh",
        name: "Hyderabad",
        emoji: "🏛️",
        description: "A historic city famous for bangles and spicy food!",
        funFacts: [
          "Hyderabad is famous for colorful glass bangles!",
          "Pacco Qillo is an old fort in the city!",
        ],
        landmarks: [
          {
            id: "pacco-qillo",
            name: "Pacco Qillo",
            emoji: "🧱",
            description: "An old fort built by the Talpur rulers.",
            funFact: "Its name means 'Strong Fort'!",
            narration: "This strong fort protected the city long ago!",
          },
        ],
        foods: ["Hyderabadi Biryani", "Palla Fish"],
        narration: "Welcome to Hyderabad — city of bangles and bold flavors!",
      },
    ],
    landmarks: [
      {
        id: "mohenjo",
        name: "Mohenjo-daro",
        emoji: "🏺",
        description: "An ancient city from the Indus Valley Civilization.",
        funFact:
          "People lived here 4,500 years ago with brick houses and drains!",
        narration:
          "Wow! This ancient city is older than the pyramids of Egypt! Smart people built streets and bathrooms here long ago!",
      },
    ],
    culture: [
      "Ajrak day celebrates Sindhi culture with pride!",
      "Sindhi music uses the beautiful algoza flute!",
      "Sufi shrines welcome people of all backgrounds.",
      "The Indus River is celebrated like a mother!",
    ],
    weather: "Hot and dry, mild winters, monsoon influence near coast",
    music: "Sindhi folk & Sufi songs",
    history:
      "Sindh is the cradle of the Indus Valley Civilization. It has been a land of saints, traders, and the mighty Indus River for thousands of years.",
    narration:
      "Welcome to Sindh! The Indus River sparkles like a silver ribbon. Ancient cities whisper secrets, and the sea sings at Karachi!",
    mapPath:
      "M250,340 L300,330 L340,360 L350,420 L320,480 L270,490 L230,450 L220,380 Z",
  },
  {
    id: "kpk",
    name: "Khyber Pakhtunkhwa",
    nameUrdu: "خیبر پختونخوا",
    capital: "Peshawar",
    emoji: "🏔️",
    color: "#22c55e",
    gradient: "from-green-400 via-emerald-500 to-teal-600",
    description:
      "Land of hospitality! Majestic mountains, green valleys, and the famous Khyber Pass welcome brave explorers!",
    funFacts: [
      "The Khyber Pass was used by traders and armies for centuries!",
      "Peshawar is one of the oldest living cities in Asia!",
      "Swat is called the Switzerland of Pakistan!",
      "Pashtun people are famous for their hospitality — Melmastia!",
      "Kalash people celebrate unique colorful festivals!",
    ],
    population: "40+ million",
    area: "101,741 km²",
    language: ["Pashto", "Urdu", "Hindko"],
    traditionalDress: {
      name: "Partug & Khet Partug",
      emoji: "🧥",
      description:
        "Baggy trousers with long shirts, and beautiful embroidered waistcoats!",
    },
    famousFoods: [
      {
        id: "food-chapli",
        name: "Chapli Kebab",
        image: chaplikebab,
        description: "Flat, spicy minced meat kebabs — Peshawar's pride!",
        provinceId: "kpk",
        ingredients: ["Minced meat", "Tomato", "Coriander", "Spices"],
      },
      {
        id: "food-kabuli",
        name: "Kabuli Pulao",
        image: kabuliPulao,
        description: "Fragrant rice with raisins, carrots, and tender meat!",
        provinceId: "kpk",
        ingredients: ["Rice", "Meat", "Carrot", "Raisins"],
      },
    ],
    animals: [
      {
        id: "animal-markhor",
        name: "Markhor",
        image: "🐐",
        habitat: "Mountain cliffs",
        funFact:
          "Pakistan's national animal! Its corkscrew horns can be 1.5 meters long!",
        sound: "mountain bleat",
        provinceId: "kpk",
      },
      {
        id: "animal-pheasant",
        name: "Monal Pheasant",
        image: "🐦",
        habitat: "Himalayan forests",
        funFact: "Males shine with rainbow-colored feathers!",
        sound: "whistling call",
        provinceId: "kpk",
      },
    ],
    cities: [
      {
        id: "peshawar",
        name: "Peshawar",
        emoji: "🕌",
        description: "The City of Flowers — an ancient stop on the Silk Road!",
        funFacts: [
          "Peshawar is over 2,000 years old!",
          "Qissa Khwani Bazaar means Storytellers' Market!",
          "The Khyber Pass is nearby!",
        ],
        landmarks: [
          {
            id: "bab-e-khyber",
            name: "Bab-e-Khyber",
            emoji: "🚪",
            description: "The grand gateway to the legendary Khyber Pass.",
            funFact: "Armies and caravans passed through here for 2,000 years!",
            narration:
              "Walk through the Khyber Gate! Explorers and traders walked this path long ago!",
          },
          {
            id: "masjid-mahabat",
            name: "Mahabat Khan Mosque",
            emoji: "🕌",
            description: "A beautiful Mughal mosque in the old city.",
            funFact: "It was built in the 17th century!",
            narration:
              "This peaceful mosque has stood in Peshawar for hundreds of years!",
          },
        ],
        foods: ["Chapli Kebab", "Shinwari Karahi", "Namak Mandi BBQ"],
        narration: "Welcome to Peshawar — City of Flowers and ancient stories!",
      },
      {
        id: "swat",
        name: "Swat",
        emoji: "🏞️",
        description:
          "Green valleys, rivers, and snowy peaks — the Switzerland of Pakistan!",
        funFacts: [
          "Buddha statues and stupas hide in Swat's hills!",
          "Malam Jabba has a ski resort!",
          "The Swat River is crystal clear!",
        ],
        landmarks: [
          {
            id: "malam-jabba",
            name: "Malam Jabba",
            emoji: "⛷️",
            description: "A mountain resort for skiing and adventure!",
            funFact: "You can ski in Pakistan at Malam Jabba!",
            narration: "Whoosh! Slide down snowy slopes at Malam Jabba!",
          },
        ],
        foods: ["Trout Fish", "Local honey"],
        narration: "Welcome to Swat Valley — green paradise in the mountains!",
      },
    ],
    landmarks: [],
    culture: [
      "Melmastia means treating guests like kings!",
      "Attan is a powerful circle dance!",
      "Pashto poetry and storytelling are treasured.",
      "Kalash valleys celebrate colorful spring festivals!",
    ],
    weather: "Pleasant valleys, cold snowy winters in mountains, warm summers",
    music: "Pashto folk & rubab music",
    history:
      "Khyber Pakhtunkhwa sits on the historic Khyber Pass — the gateway between Central Asia and South Asia. Brave people have lived among these mountains for thousands of years.",
    narration:
      "Welcome to Khyber Pakhtunkhwa! Snowy peaks touch the sky. The Khyber Pass whispers ancient secrets. Hospitality is the law of the land!",
    mapPath: "M200,120 L260,100 L300,140 L290,200 L250,240 L200,220 L180,160 Z",
  },
  {
    id: "balochistan",
    name: "Balochistan",
    nameUrdu: "بلوچستان",
    capital: "Quetta",
    emoji: "🏜️",
    color: "#d97706",
    gradient: "from-orange-400 via-amber-500 to-yellow-600",
    description:
      "Pakistan's largest province! Deserts, mountains, Hingol's magic rocks, and the deep blue Arabian Sea coast!",
    funFacts: [
      "Balochistan is bigger than many countries!",
      "Hingol National Park has a rock that looks like a sphinx!",
      "The Makran Coast has golden beaches!",
      "Ziarat has the world's second-largest juniper forest!",
      "Quetta is called the Fruit Garden of Pakistan!",
    ],
    population: "15+ million",
    area: "347,190 km²",
    language: ["Balochi", "Brahui", "Pashto", "Urdu"],
    traditionalDress: {
      name: "Balochi Embroidered Dress",
      emoji: "👘",
      description:
        "Incredibly detailed hand embroidery with mirrors and bright threads!",
    },
    famousFoods: [
      {
        id: "food-sajji",
        name: "Sajji",
        image: saji,
        description:
          "Whole lamb roasted with simple salt and spices — desert feast!",
        provinceId: "balochistan",
        ingredients: ["Lamb", "Salt", "Spices"],
      },
      {
        id: "food-kaak",
        name: "Kaak Bread",
        image: kaakBread,
        description: "Hard bread cooked on stones — perfect for journeys!",
        provinceId: "balochistan",
        ingredients: ["Flour", "Salt", "Water"],
      },
    ],
    animals: [
      {
        id: "animal-camel",
        name: "Makran Camel",
        image: "🐪",
        habitat: "Deserts & coasts",
        funFact:
          "Camels are ships of the desert and can drink 200 liters at once!",
        sound: "grunt",
        provinceId: "balochistan",
      },
      {
        id: "animal-ibex",
        name: "Sindh Ibex",
        image: "🐐",
        habitat: "Rocky mountains",
        funFact: "They climb cliffs that look impossible!",
        sound: "bleat",
        provinceId: "balochistan",
      },
    ],
    cities: [
      {
        id: "quetta",
        name: "Quetta",
        emoji: "🍎",
        description: "The Fruit Garden of Pakistan, surrounded by mountains!",
        funFacts: [
          "Quetta means 'fort' in Pashto!",
          "Famous for apples, grapes, and cherries!",
          "Hanna Lake is a peaceful picnic spot!",
        ],
        landmarks: [
          {
            id: "hanna-lake",
            name: "Hanna Lake",
            emoji: "🏞️",
            description: "A beautiful lake nestled in the mountains.",
            funFact: "It is a favorite picnic spot for families!",
            narration: "Splash! Hanna Lake sparkles between brown mountains!",
          },
        ],
        foods: ["Sajji", "Landhi", "Fresh fruits"],
        narration:
          "Welcome to Quetta — where mountains guard gardens of fruit!",
      },
      {
        id: "gwadar",
        name: "Gwadar",
        emoji: "🌊",
        description: "A sparkling port city on the Arabian Sea!",
        funFacts: [
          "Gwadar has one of the world's deepest sea ports!",
          "The coastline looks like a tropical paradise!",
          "You can watch dolphins from the cliffs!",
        ],
        landmarks: [
          {
            id: "gwadar-port",
            name: "Gwadar Port",
            emoji: "⚓",
            description:
              "A modern deep-sea port connecting Pakistan to the world.",
            funFact: "Ships from many countries visit Gwadar!",
            narration:
              "Look at the giant ships! Gwadar connects Pakistan to the ocean world!",
          },
        ],
        foods: ["Fresh seafood", "Fish curry"],
        narration:
          "Welcome to Gwadar — where the desert meets the deep blue sea!",
      },
    ],
    landmarks: [
      {
        id: "hingol",
        name: "Hingol National Park",
        emoji: "🦁",
        description:
          "Pakistan's largest national park with magical rock formations!",
        funFact:
          "The Princess of Hope rock looks like a woman looking at the sea!",
        narration:
          "Amazing rocks shaped by wind and water! Can you spot the Princess of Hope?",
      },
    ],
    culture: [
      "Balochi embroidery is world famous!",
      "Folk music uses the suroz string instrument!",
      "Tribal hospitality is a sacred tradition.",
      "Camel festivals celebrate desert life!",
    ],
    weather:
      "Mostly arid desert, cold winters in highlands, mild coastal climate",
    music: "Balochi folk & suroz",
    history:
      "Balochistan has ancient caves, coastal trade routes, and proud tribal traditions. It is a land of deserts, mountains, and endless skies.",
    narration:
      "Welcome to vast Balochistan! Golden deserts stretch forever. Strange rocks stand like statues. The sea kisses the shore at Gwadar!",
    mapPath:
      "M120,280 L220,260 L250,320 L240,420 L180,480 L100,450 L80,360 L90,300 Z",
  },
  {
    id: "gilgit",
    name: "Gilgit-Baltistan",
    nameUrdu: "گلگت بلتستان",
    capital: "Gilgit",
    emoji: "⛰️",
    color: "#3b82f6",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    description:
      "Home of giant mountains! K2, glaciers, crystal lakes, and the roof of the world await brave explorers!",
    funFacts: [
      "K2 is the second-highest mountain on Earth!",
      "Three great mountain ranges meet here: Karakoram, Himalayas, and Hindu Kush!",
      "Attabad Lake was created by a landslide!",
      "Apricots grow sweet in these high valleys!",
      "The Karakoram Highway is one of the highest paved roads!",
    ],
    population: "1.5+ million",
    area: "72,971 km²",
    language: ["Shina", "Balti", "Burushaski", "Urdu"],
    traditionalDress: {
      name: "Woolen Caps & Robes",
      emoji: "🧢",
      description:
        "Warm woolen pakol caps and colorful traditional robes for mountain life!",
    },
    famousFoods: [
      {
        id: "food-mamtu",
        name: "Mamtu",
        image: mamtu,
        description:
          "Steamed dumplings filled with meat — perfect mountain food!",
        provinceId: "gilgit",
        ingredients: ["Flour", "Meat", "Onion"],
      },
      {
        id: "food-apricot",
        name: "Dried Apricots",
        image: driedApricots,
        description: "Sweet sun-dried apricots from high valleys!",
        provinceId: "gilgit",
        ingredients: ["Apricots", "Sunshine"],
      },
    ],
    animals: [
      {
        id: "animal-snow-leopard",
        name: "Snow Leopard",
        image: "🐆",
        habitat: "High mountains",
        funFact:
          "Snow leopards are called ghosts of the mountains — so hard to spot!",
        sound: "soft growl",
        provinceId: "gilgit",
      },
      {
        id: "animal-yak",
        name: "Yak",
        image: "🦬",
        habitat: "High pastures",
        funFact: "Yaks give milk, wool, and help carry heavy loads!",
        sound: "low moo",
        provinceId: "gilgit",
      },
    ],
    cities: [
      {
        id: "gilgit-city",
        name: "Gilgit",
        emoji: "🏔️",
        description: "The capital gateway to the mighty Karakoram!",
        funFacts: [
          "Gilgit sits at the meeting of great mountain ranges!",
          "The Kargah Buddha is carved into a rock face!",
          "Polo is played on the world's highest grounds nearby!",
        ],
        landmarks: [
          {
            id: "kargah",
            name: "Kargah Buddha",
            emoji: "🗿",
            description: "An ancient Buddha carved into a cliff.",
            funFact: "It is about 1,400 years old!",
            narration: "Look up! An ancient Buddha watches from the rock wall!",
          },
        ],
        foods: ["Mamtu", "Chapshoro", "Apricot oil bread"],
        narration: "Welcome to Gilgit — gateway to the roof of the world!",
      },
      {
        id: "skardu",
        name: "Skardu",
        emoji: "💎",
        description:
          "Gateway to K2 with turquoise lakes and desert-like dunes!",
        funFacts: [
          "Shangrila Resort sits by a heart-shaped lake!",
          "Cold Desert has sand dunes with snowy peaks behind!",
          "Base camps for giant mountains start near Skardu!",
        ],
        landmarks: [
          {
            id: "shangrila",
            name: "Shangrila Lake",
            emoji: "💙",
            description: "A heart-shaped lake often called 'Heaven on Earth'.",
            funFact: "The resort is built around a crashed aircraft!",
            narration:
              "A heart-shaped lake! Mountains hug the water like a painting!",
          },
          {
            id: "k2-view",
            name: "K2 Region",
            emoji: "🗻",
            description:
              "Home of K2 — the Savage Mountain — second highest on Earth!",
            funFact: "K2 is 8,611 meters tall!",
            narration:
              "There it is — K2! The second tallest mountain on our whole planet!",
          },
        ],
        foods: ["Balti cuisine", "Fresh trout"],
        narration: "Welcome to Skardu — land of lakes, dunes, and giant peaks!",
      },
      {
        id: "hunza",
        name: "Hunza",
        emoji: "🌸",
        description:
          "A fairy-tale valley of apricots, peaks, and legendary long life!",
        funFacts: [
          "Hunza people are famous for living long healthy lives!",
          "Rakaposhi and Ladyfinger Peak watch over the valley!",
          "In spring, apricot blossoms turn Hunza pink and white!",
        ],
        landmarks: [
          {
            id: "baltit",
            name: "Baltit Fort",
            emoji: "🏯",
            description: "A 700-year-old fort overlooking Hunza Valley.",
            funFact: "It looks like a castle from a mountain fairy tale!",
            narration:
              "Climb up to Baltit Fort! The whole valley sparkles below!",
          },
          {
            id: "attabad",
            name: "Attabad Lake",
            emoji: "🩵",
            description: "A stunning turquoise lake formed in 2010.",
            funFact: "It was created when a landslide blocked the river!",
            narration: "The water is so blue it looks like a gemstone!",
          },
        ],
        foods: ["Dried apricots", "Walnut cake", "Hunza bread"],
        narration: "Welcome to Hunza — the smiling valley under giant peaks!",
      },
    ],
    landmarks: [],
    culture: [
      "Mountain polo is thrilling to watch!",
      "Silk Route traditions still live on.",
      "Many languages are spoken in nearby valleys!",
      "Apricot blossoms mean spring festivals!",
    ],
    weather: "Cold winters with heavy snow, mild pleasant summers, cool nights",
    music: "Mountain folk songs",
    history:
      "Gilgit-Baltistan sat on the ancient Silk Road. For centuries, traders crossed these high passes with silk, spices, and stories.",
    narration:
      "Welcome to Gilgit-Baltistan! Mountains bigger than clouds! Lakes like blue jewels! Are you ready to climb into the sky?",
    mapPath: "M260,40 L340,30 L380,70 L360,120 L300,130 L250,100 L240,60 Z",
  },
  {
    id: "kashmir",
    name: "Azad Kashmir",
    nameUrdu: "آزاد کشمیر",
    capital: "Muzaffarabad",
    emoji: "🌲",
    color: "#10b981",
    gradient: "from-emerald-400 via-green-500 to-lime-500",
    description:
      "Paradise on Earth! Rolling green hills, rushing rivers, waterfalls, and meadows full of flowers!",
    funFacts: [
      "Kashmir is often called Paradise on Earth!",
      "Neelum Valley has some of the greenest views in Pakistan!",
      "Rivers here are perfect for rafting adventures!",
      "In winter, snow turns valleys into wonderlands!",
      "Fresh trout swim in cold mountain streams!",
    ],
    population: "4+ million",
    area: "13,297 km²",
    language: ["Pahari", "Gojri", "Urdu", "Kashmiri"],
    traditionalDress: {
      name: "Pheran & Embroidered Shawls",
      emoji: "🧥",
      description:
        "Warm long pheran coats and soft embroidered shawls for chilly valleys!",
    },
    famousFoods: [
      {
        id: "food-trout",
        name: "River Trout",
        image: trout,
        description: "Fresh trout from icy mountain rivers!",
        provinceId: "kashmir",
        ingredients: ["Trout", "Herbs", "Butter"],
      },
      {
        id: "food-noon-chai",
        name: "Pink Tea (Noon Chai)",
        image: noonChai,
        description: "Salty pink tea — a Kashmiri special treat!",
        provinceId: "kashmir",
        ingredients: ["Tea", "Salt", "Milk", "Baking soda"],
      },
    ],
    animals: [
      {
        id: "animal-hangul",
        name: "Hangul Deer",
        image: "🦌",
        habitat: "Forest valleys",
        funFact: "The Hangul is a rare red deer found in Kashmir!",
        sound: "call",
        provinceId: "kashmir",
      },
      {
        id: "animal-black-bear",
        name: "Asiatic Black Bear",
        image: "🐻",
        habitat: "Forest mountains",
        funFact: "They love honey and berries!",
        sound: "growl",
        provinceId: "kashmir",
      },
    ],
    cities: [
      {
        id: "muzaffarabad",
        name: "Muzaffarabad",
        emoji: "🌉",
        description: "Capital city where two rivers meet!",
        funFacts: [
          "The Neelum and Jhelum rivers meet near the city!",
          "Red Fort stands by the river!",
          "Mountains surround the capital on all sides!",
        ],
        landmarks: [
          {
            id: "red-fort-kashmir",
            name: "Red Fort",
            emoji: "🧱",
            description: "A historic fort overlooking the river.",
            funFact: "It has watched over the valley for centuries!",
            narration: "The Red Fort stands proudly where rivers sing!",
          },
        ],
        foods: ["Trout", "Kashmiri cuisine"],
        narration: "Welcome to Muzaffarabad — where two rivers dance together!",
      },
      {
        id: "neelum",
        name: "Neelum Valley",
        emoji: "🌿",
        description:
          "A long green valley with rivers, bridges, and dreamy villages!",
        funFacts: [
          "The Neelum River is a stunning blue-green color!",
          "Wooden bridges connect mountain villages!",
          "Keran and Arang Kel are famous scenic spots!",
        ],
        landmarks: [
          {
            id: "arang-kel",
            name: "Arang Kel",
            emoji: "🏡",
            description: "A meadow village above the clouds!",
            funFact: "You hike up to reach this peaceful paradise!",
            narration:
              "Climb higher! Arang Kel sits on a green carpet above the valley!",
          },
        ],
        foods: ["Fresh corn", "Mountain honey", "Trout"],
        narration: "Welcome to Neelum Valley — green paradise of Azad Kashmir!",
      },
    ],
    landmarks: [],
    culture: [
      "Folk songs echo through the valleys!",
      "Handwoven shawls keep families warm.",
      "Spring brings flower-filled meadows!",
      "River rafting is a favorite adventure!",
    ],
    weather:
      "Four beautiful seasons — snowy winters, flowery springs, mild summers",
    music: "Kashmiri & Pahari folk",
    history:
      "Azad Kashmir's valleys have inspired poets for centuries. Rivers, forests, and mountains make it one of the most beautiful places on Earth.",
    narration:
      "Welcome to Azad Kashmir — Paradise on Earth! Green hills roll like waves. Rivers sparkle. Flowers smile at the sun!",
    mapPath: "M300,100 L350,90 L370,130 L350,170 L300,180 L280,140 Z",
  },
  {
    id: "islamabad",
    name: "Islamabad",
    nameUrdu: "اسلام آباد",
    capital: "Islamabad",
    emoji: "🏛️",
    color: "#8b5cf6",
    gradient: "from-violet-400 via-purple-500 to-fuchsia-500",
    description:
      "Pakistan's beautiful capital city! Clean, green, and home to the stunning Faisal Mosque at the foot of the Margalla Hills.",
    funFacts: [
      "Islamabad was carefully planned as the capital in the 1960s!",
      "Faisal Mosque is one of the largest mosques in the world!",
      "Margalla Hills are full of hiking trails and wildlife!",
      "The city is divided into neat sectors like a grid!",
      "Rawal Lake is perfect for boating and picnics!",
    ],
    population: "1+ million",
    area: "906 km²",
    language: ["Urdu", "English", "Punjabi"],
    traditionalDress: {
      name: "Modern Pakistani Wear",
      emoji: "👔",
      description:
        "A mix of traditional shalwar kameez and modern styles from all over Pakistan!",
    },
    famousFoods: [
      {
        id: "food-monal",
        name: "Hilltop BBQ",
        image: hilltopBBQ,
        description: "Tasty grilled food with a view of the whole city!",
        provinceId: "islamabad",
        ingredients: ["Meat", "Spices", "Herbs"],
      },
    ],
    animals: [
      {
        id: "animal-leopard-margalla",
        name: "Common Leopard",
        image: "🐆",
        habitat: "Margalla Hills",
        funFact: "Leopards quietly live in the hills above the capital!",
        sound: "roar",
        provinceId: "islamabad",
      },
      {
        id: "animal-monkey",
        name: "Rhesus Macaque",
        image: "🐒",
        habitat: "Margalla trails",
        funFact: "Monkeys sometimes visit picnic spots looking for snacks!",
        sound: "chatter",
        provinceId: "islamabad",
      },
    ],
    cities: [
      {
        id: "islamabad-city",
        name: "Islamabad",
        emoji: "🌆",
        description:
          "Pakistan's green capital nestled against the Margalla Hills.",
        funFacts: [
          "One of the most beautiful capital cities in Asia!",
          "Wide roads and lots of trees everywhere!",
          "Daman-e-Koh viewpoint shows the whole city!",
        ],
        landmarks: [
          {
            id: "faisal-mosque",
            name: "Faisal Mosque",
            emoji: "🕌",
            description: "A stunning modern mosque shaped like a desert tent!",
            funFact: "King Faisal of Saudi Arabia helped build it!",
            narration:
              "Look at Faisal Mosque! Its roof looks like a Bedouin tent. The four minarets stand like pencils pointing to the sky!",
          },
          {
            id: "pak-monument",
            name: "Pakistan Monument",
            emoji: "🌸",
            description:
              "A blooming flower-shaped monument representing the provinces!",
            funFact:
              "The petals represent the provinces of Pakistan coming together!",
            narration:
              "This monument looks like a flower! Each petal is a province. Together they make one beautiful Pakistan!",
          },
          {
            id: "centaurus",
            name: "Centaurus",
            emoji: "🏢",
            description: "A tall modern building and fun shopping mall.",
            funFact: "It is one of the tallest buildings in Islamabad!",
            narration: "Wow, so tall! Centaurus touches the clouds!",
          },
          {
            id: "rawal-lake",
            name: "Rawal Lake",
            emoji: "🚣",
            description: "A peaceful lake for boating and bird watching.",
            funFact: "Many migratory birds visit in winter!",
            narration: "Row your boat on Rawal Lake and watch the birds!",
          },
        ],
        foods: ["Capital street food", "Cafe treats", "BBQ"],
        narration:
          "Welcome to Islamabad — Pakistan's green and glowing capital!",
      },
    ],
    landmarks: [],
    culture: [
      "People from every province live here!",
      "Museums teach Pakistan's story.",
      "Hiking in Margalla is a weekend tradition.",
      "Festivals bring music and food from all regions!",
    ],
    weather: "Four seasons — hot summers, cool pleasant winters, monsoon rains",
    music: "National & modern Pakistani music",
    history:
      "Islamabad became Pakistan's capital in the 1960s. It was designed to be green, modern, and welcoming to people from every province.",
    narration:
      "Welcome to Islamabad! Faisal Mosque shines against green hills. The Pakistan Monument blooms like a flower. This is our capital!",
    mapPath: "M270,160 L295,150 L310,170 L295,190 L270,185 Z",
  },
];

export const getProvince = (id: string) => provinces.find((p) => p.id === id);
export const getCity = (provinceId: string, cityId: string) => {
  const p = getProvince(provinceId);
  return p?.cities.find((c) => c.id === cityId);
};
