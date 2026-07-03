import {
  Thermometer,
  Ruler,
  Orbit,
  MapPin,
  Moon,
  Sun,
  Wind,
  Zap,
  Cloud,
  Ghost,
} from "lucide-react";

// Helper type for localized string values
export interface LocalizedString {
  en: string;
  ur: string;
}

export interface LocalizedArray {
  en: string[];
  ur: string[];
}

export interface PlanetData {
  id: string;
  name: LocalizedString; // Updated to support both languages
  color: string;
  size: number;
  distance: number;
  speed: number;
  tags: LocalizedArray; // Updated
  description: LocalizedString; // Updated
  funFacts: LocalizedArray; // Updated
  stats: {
    temp: string; // Keep as number string since units can be shared or appended
    moons: number;
    yearLength: LocalizedString; // Updated
    dayLength: LocalizedString; // Updated
    type: LocalizedString; // Updated
  };
  livingCondition: LocalizedString; // Updated
  comparison: LocalizedString; // Updated
  earthRatio: number;
  volumeCapacity: number;
}

export const PLANETS: PlanetData[] = [
  {
    id: "mercury",
    name: { en: "Mercury", ur: "عطارد" },
    color: "#A5A5A5",
    size: 0.8,
    distance: 15,
    speed: 0.04,
    tags: {
      en: ["The Baker", "Smallest"],
      ur: ["تندور سیارہ", "سب سے چھوٹا"],
    },
    description: {
      en: "Mercury is the smallest planet in our solar system and the closest to the Sun—is only slightly larger than Earth's Moon.",
      ur: "عطارد ہمارے نظام شمسی کا سب سے چھوٹا سیارہ ہے اور سورج کے سب سے قریب ہے۔ یہ زمین کے چاند سے صرف تھوڑا سا بڑا ہے۔",
    },
    funFacts: {
      en: [
        "Mercury is the fastest planet, zipping around the Sun every 88 Earth days.",
        "A day on Mercury is longer than its year!",
        "It has almost no atmosphere to trap heat, so it gets freezing cold at night.",
      ],
      ur: [
        "عطارد سب سے تیز رفتار سیارہ ہے، جو صرف 88 زمین کے دنوں میں سورج کے گرد چکر پورا کرتا ہے۔",
        "عطارد پر ایک دن اس کے پورے سال سے لمبا ہوتا ہے!",
        "گرمی کو روکنے کے لیے اس پر کوئی کرہ ہوائی (ایٹموسفیئر) نہیں ہے، اس لیے رات کو یہ برف کی طرح ٹھنڈا ہو جاتا ہے۔",
      ],
    },
    stats: {
      temp: "430°C to -180°C",
      moons: 0,
      yearLength: { en: "88 Days", ur: "88 دن" },
      dayLength: { en: "59 Days", ur: "59 دن" },
      type: { en: "Terrestrial", ur: "چٹانی سیارہ" },
    },
    livingCondition: {
      en: "Too hot and too cold! No air to breathe.",
      ur: "بہت زیادہ گرم اور بہت زیادہ ٹھنڈا! سانس لینے کے لیے یہاں ہوا نہیں ہے۔",
    },
    comparison: {
      en: "As big as a small orange if Earth was a beach ball.",
      ur: "اگر زمین ایک بیچ بال ہو، تو عطارد ایک چھوٹے مالٹے جتنا ہوگا۔",
    },
    earthRatio: 0.38,
    volumeCapacity: 0.05,
  },
  {
    id: "venus",
    name: { en: "Venus", ur: "زہرہ" },
    color: "#E3BB76",
    size: 1.2,
    distance: 22,
    speed: 0.015,
    tags: {
      en: ["Earth's Twin", "Hottest"],
      ur: ["زمین کا جڑواں", "سب سے گرم"],
    },
    description: {
      en: "Venus is often called Earth's twin because they are similar in size and structure, but Venus is much hotter and has a thick, toxic atmosphere.",
      ur: "زہرہ کو اکثر زمین کا جڑواں سیارہ کہا جاتا ہے کیونکہ دونوں کا سائز اور ساخت ملتی جلتی ہے، لیکن زہرہ بہت زیادہ گرم ہے اور اس کی ہوا زہریلی ہے۔",
    },
    funFacts: {
      en: [
        "Venus rotates backwards compared to most other planets.",
        "It is the second brightest object in the night sky after the Moon.",
        "Clouds on Venus are made of sulfuric acid. Stinky!",
      ],
      ur: [
        "دوسرے سیاروں کے برعکس، زہرہ اپنے محور پر الٹا گھومتا ہے۔",
        "چاند کے بعد رات کے آسمان میں یہ دوسری سب سے چمکدار چیز ہے۔",
        "زہرہ پر بادل گندھک کے تیزاب (سلفیورک ایسڈ) سے بنے ہیں۔ بہت بدبودار!",
      ],
    },
    stats: {
      temp: "465°C",
      moons: 0,
      yearLength: { en: "225 Days", ur: "225 دن" },
      dayLength: { en: "243 Days", ur: "243 دن" },
      type: { en: "Terrestrial", ur: "چٹانی سیارہ" },
    },
    livingCondition: {
      en: "Way too hot! The pressure would squash you like a pancake.",
      ur: "بہت ہی زیادہ گرم! یہاں ہوا کا دباؤ آپ کو پینکیک کی طرح کچل دے گا۔",
    },
    comparison: {
      en: "Almost the same size as Earth.",
      ur: "تقریباً زمین کے برابر سائز کا ہے۔",
    },
    earthRatio: 0.95,
    volumeCapacity: 0.86,
  },
  {
    id: "earth",
    name: { en: "Earth", ur: "زمین" },
    color: "#2271B3",
    size: 1.3,
    distance: 30,
    speed: 0.01,
    tags: {
      en: ["Home", "Blue Planet"],
      ur: ["ہمارا گھر", "نیلا سیارہ"],
    },
    description: {
      en: "Earth is our home! It's the only place we know of that has life. It has huge oceans and plenty of oxygen for us to breathe.",
      ur: "زمین ہمارا گھر ہے! یہ کائنات میں واحد جگہ ہے جہاں زندگی موجود ہے۔ یہاں بڑے سمندر اور سانس لینے کے لیے آکسیجن موجود ہے۔",
    },
    funFacts: {
      en: [
        "70% of Earth's surface is covered by water.",
        "Earth is the only planet not named after a god.",
        "Our atmosphere protects us from meteoroids and radiation.",
      ],
      ur: [
        "زمین کی 70 فیصد سطح پانی سے ڈھکی ہوئی ہے۔",
        "زمین واحد سیارہ ہے جس کا نام کسی قدیم دیوتا کے نام پر نہیں رکھا گیا۔",
        "ہمارا کرہ ہوائی ہمیں خلائی چٹانوں اور خطرناک شعاعوں سے بچاتا ہے۔",
      ],
    },
    stats: {
      temp: "15°C",
      moons: 1,
      yearLength: { en: "365 Days", ur: "365 دن" },
      dayLength: { en: "24 Hours", ur: "24 گھنٹے" },
      type: { en: "Terrestrial", ur: "چٹانی سیارہ" },
    },
    livingCondition: {
      en: "Perfect! Not too hot, not too cold. Just right.",
      ur: "بالکل بہترین! نہ زیادہ گرم، نہ زیادہ ٹھنڈا۔ بالکل مناسب۔",
    },
    comparison: {
      en: "The standard beach ball!",
      ur: "اصل بیچ بال سائز!",
    },
    earthRatio: 1,
    volumeCapacity: 1,
  },
  {
    id: "mars",
    name: { en: "Mars", ur: "مریخ" },
    color: "#E27B58",
    size: 1,
    distance: 40,
    speed: 0.008,
    tags: {
      en: ["Red Planet", "Desert Planet"],
      ur: ["سرخ سیارہ", "صحراوی سیارہ"],
    },
    description: {
      en: "Mars is a dusty, cold, desert world with a very thin atmosphere. It's home to the solar system's largest volcanoes and deepest canyons.",
      ur: "مریخ ایک گرد آلود، ٹھنڈا اور صحرائی سیارہ ہے جہاں ہوا بہت کم ہے۔ یہاں نظام شمسی کے سب سے بڑے آتش فشاں اور گہری کھائیاں موجود ہیں۔",
    },
    funFacts: {
      en: [
        "Mars is red because of rusty iron in its soil.",
        "It has the tallest volcano in the solar system, Olympus Mons.",
        "There are robots (rovers) living on Mars right now!",
      ],
      ur: [
        "مریخ کی مٹی میں زنگ آلود لوہا موجود ہے، اس لیے یہ سرخ دکھائی دیتا ہے۔",
        "اس پر نظام شمسی کا سب سے اونچا آتش فشاں 'اولمپس مونس' موجود ہے۔",
        "اس وقت مریخ پر انسانوں کے بھیجے گئے روبوٹس (روورز) رہ رہے ہیں!",
      ],
    },
    stats: {
      temp: "-60°C",
      moons: 2,
      yearLength: { en: "687 Days", ur: "687 دن" },
      dayLength: { en: "24.6 Hours", ur: "24.6 گھنٹے" },
      type: { en: "Terrestrial", ur: "چٹانی سیارہ" },
    },
    livingCondition: {
      en: "Very cold and dusty. You'd need a special space suit and a lot of training.",
      ur: "بہت ٹھنڈا اور گرد آلود۔ یہاں رہنے کے لیے خاص خلائی لباس اور بہت تربیت کی ضرورت ہوگی۔",
    },
    comparison: {
      en: "About half the size of Earth.",
      ur: "سائز میں زمین سے تقریباً آدھا ہے۔",
    },
    earthRatio: 0.53,
    volumeCapacity: 0.15,
  },
  {
    id: "jupiter",
    name: { en: "Jupiter", ur: "مشتری" },
    color: "#D39C7E",
    size: 2.5,
    distance: 55,
    speed: 0.004,
    tags: {
      en: ["King of Planets", "Gas Giant"],
      ur: ["سیاروں کا بادشاہ", "گیسی دیو"],
    },
    description: {
      en: "Jupiter is more than twice as massive as the other planets of our solar system combined. The Great Red Spot is a centuries-old storm bigger than Earth.",
      ur: "مشتری کا وزن باقی تمام سیاروں کے مجموعی وزن سے بھی دو گنا زیادہ ہے۔ اس پر موجود 'گریٹ ریڈ اسپاٹ' ایک صدیوں پرانا طوفان ہے جو زمین سے بھی بڑا ہے۔",
    },
    funFacts: {
      en: [
        "Jupiter has 95 moons! It's like its own mini solar system.",
        "If Jupiter was a balloon, you could fit 1,300 Earths inside it.",
        "It doesn't have a solid surface. It's mostly gas!",
      ],
      ur: [
        "مشتری کے 95 چاند ہیں! یہ اپنے آپ میں ایک چھوٹا نظام شمسی ہے۔",
        "اگر مشتری ایک غبارہ ہوتا، تو اس کے اندر 1,300 زمینیں سما سکتیں۔",
        "اس کی کوئی ٹھوس سطح نہیں ہے، یہ زیادہ تر گیس سے بنا ہوا ہے!",
      ],
    },
    stats: {
      temp: "-110°C",
      moons: 95,
      yearLength: { en: "12 Years", ur: "12 سال" },
      dayLength: { en: "10 Hours", ur: "10 گھنٹے" },
      type: { en: "Gas Giant", ur: "گیسی دیو" },
    },
    livingCondition: {
      en: "No ground to stand on! Extreme gravity and storms.",
      ur: "کھڑے ہونے کے لیے زمین ہی نہیں ہے! شدید کشش ثقل اور خطرناک طوفان ہیں۔",
    },
    comparison: {
      en: "If Earth was a grape, Jupiter would be a basketball.",
      ur: "اگر زمین ایک انگور ہو، تو مشتری ایک باسٹ بال جتنا بڑا ہوگا۔",
    },
    earthRatio: 11.2,
    volumeCapacity: 1321,
  },
  {
    id: "saturn",
    name: { en: "Saturn", ur: "زحل" },
    color: "#C5AB6E",
    size: 2.2,
    distance: 72,
    speed: 0.002,
    tags: {
      en: ["Ringed Planet", "Jewel of the Solar System"],
      ur: ["چھلوں والا سیارہ", "نظام شمسی کا زیور"],
    },
    description: {
      en: "Saturn is the second largest planet and is adorned with a dazzling system of icy rings that are unique among the planets.",
      ur: "زحل دوسرا سب سے بڑا سیارہ ہے اور اس کے گرد برفانی چھلوں (رنگز) کا ایک شاندار نظام ہے جو اسے سب سے منفرد بناتا ہے۔",
    },
    funFacts: {
      en: [
        "Saturn's rings are mostly made of ice and rock.",
        "Saturn could float in a giant bathtub because it's mostly made of gas!",
        "It has the most spectacular rings, but other planets have them too.",
      ],
      ur: [
        "زحل کے چھلے زیادہ تر برف اور چٹانوں کے ٹکڑوں سے بنے ہیں۔",
        "زحل پانی کے ایک بڑے ٹب میں تیر سکتا ہے کیونکہ یہ ہوا سے بھی ہلکی گیسوں سے بنا ہے!",
        "اس کے چھلے سب سے خوبصورت ہیں، حالانکہ کچھ دوسرے سیاروں کے گرد بھی چھلے ہوتے ہیں۔",
      ],
    },
    stats: {
      temp: "-140°C",
      moons: 146,
      yearLength: { en: "29 Years", ur: "29 سال" },
      dayLength: { en: "10.7 Hours", ur: "10.7 گھنٹے" },
      type: { en: "Gas Giant", ur: "گیسی دیو" },
    },
    livingCondition: {
      en: "No solid ground, freezing cold, and very windy.",
      ur: "کوئی ٹھوس سطح نہیں، انتہائی جمادینے والی ٹھنڈ اور تیز ہوائیں ہیں۔",
    },
    comparison: {
      en: "Almost as big as Jupiter's basketball.",
      ur: "تقریباً مشتری کی باسکٹ بال جتنا ہی بڑا ہے۔",
    },
    earthRatio: 9.4,
    volumeCapacity: 764,
  },
  {
    id: "uranus",
    name: { en: "Uranus", ur: "یورینس" },
    color: "#B5E3E3",
    size: 1.8,
    distance: 85,
    speed: 0.001,
    tags: {
      en: ["Ice Giant", "The Sideways Planet"],
      ur: ["برفانی دیو", "ٹیڑھا سیارہ"],
    },
    description: {
      en: "Uranus is the first planet found with the aid of a telescope. It rotates at a nearly 90-degree angle from the plane of its orbit.",
      ur: "یورینس دوربین کی مدد سے دریافت ہونے والا پہلا سیارہ ہے۔ یہ اپنے مدار پر تقریباً 90 ڈگری کے زاویے پر بالکل لیٹا ہوا گھومتا ہے۔",
    },
    funFacts: {
      en: [
        "Uranus is blue because of methane gas in its atmosphere.",
        "It orbits the Sun on its side, like a rolling ball.",
        "It was the first planet discovered with a telescope.",
      ],
      ur: [
        "یورینس اپنی فضا میں میتھین گیس کی وجہ سے نیلا دکھائی دیتا ہے۔",
        "یہ سورج کے گرد ایک گھومتی ہوئی گیند کی طرح بالکل پہلو کے بل چکر لگاتا ہے۔",
        "یہ دوربین کے ذریعے دریافت ہونے والا کائنات کا پہلا سیارہ تھا۔",
      ],
    },
    stats: {
      temp: "-195°C",
      moons: 27,
      yearLength: { en: "84 Years", ur: "84 سال" },
      dayLength: { en: "17 Hours", ur: "17 گھنٹے" },
      type: { en: "Ice Giant", ur: "برفانی دیو" },
    },
    livingCondition: {
      en: "Extremely cold and dark. You would freeze instantly!",
      ur: "انتہائی ٹھنڈا اور تاریک۔ آپ یہاں جاتے ہی سیکنڈوں میں جم جائیں گے!",
    },
    comparison: {
      en: "4 times wider than Earth.",
      ur: "چوڑائی میں زمین سے 4 گنا بڑا ہے۔",
    },
    earthRatio: 4,
    volumeCapacity: 63,
  },
  {
    id: "neptune",
    name: { en: "Neptune", ur: "نیپچون" },
    color: "#4B70DD",
    size: 1.8,
    distance: 98,
    speed: 0.0008,
    tags: {
      en: ["Ice Giant", "The Windy Planet"],
      ur: ["برفانی دیو", "طوفانی سیارہ"],
    },
    description: {
      en: "Neptune is dark, cold, and whipped by supersonic winds. It is more than 30 times as far from the Sun as Earth.",
      ur: "نیپچون اندھیرا، انتہائی ٹھنڈا اور تیز ترین آواز کی رفتار سے چلنے والی ہواؤں کا گھر ہے۔ یہ سورج سے زمین کے مقابلے میں 30 گنا زیادہ دور ہے۔",
    },
    funFacts: {
      en: [
        "Neptune has the fastest winds in the solar system, reaching 1,200 mph!",
        "It takes Neptune 165 Earth years to orbit the Sun once.",
        "It has a 'Great Dark Spot' similar to Jupiter's Red Spot.",
      ],
      ur: [
        "نیپچون پر پورے نظام شمسی کی سب سے تیز ہوائیں چلتی ہیں، جو 1,200 میل فی گھنٹہ تک پہنچتی ہیں!",
        "نیپچون کو سورج کا ایک چکر لگانے میں 165 سال لگتے ہیں۔",
        "اس پر مشتری کی طرح کا ایک بڑا طوفانی دھبہ ہے جسے 'گریٹ ڈارک اسپاٹ' کہتے ہیں۔",
      ],
    },
    stats: {
      temp: "-200°C",
      moons: 14,
      yearLength: { en: "165 Years", ur: "165 سال" },
      dayLength: { en: "16 Hours", ur: "16 گھنٹے" },
      type: { en: "Ice Giant", ur: "برفانی دیو" },
    },
    livingCondition: {
      en: "Super strong winds and freezing temperatures. Not friendly!",
      ur: "خطرناک حد تک تیز ہوائیں اور ہڈیاں جما دینے والی سردی۔ بالکل رہنے کے قابل نہیں۔",
    },
    comparison: {
      en: "About the same size as Uranus.",
      ur: "تقریباً یورینس جتنا ہی بڑا ہے۔",
    },
    earthRatio: 3.8,
    volumeCapacity: 58,
  },
];

export interface SpaceObject {
  id: string;
  name: LocalizedString; // Updated
  type: LocalizedString; // Updated
  color: string;
  description: LocalizedString; // Updated
  funFacts: LocalizedArray; // Updated
  emoji: string;
}

export const SPACE_OBJECTS: SpaceObject[] = [
  {
    id: "sun",
    name: { en: "The Sun", ur: "سورج" },
    type: { en: "Star", ur: "ستارہ" },
    color: "#FFD700",
    emoji: "☀️",
    description: {
      en: "The Sun is a yellow dwarf star at the center of our solar system. It's a nearly perfect sphere of hot plasma.",
      ur: "سورج ایک پیلا بونا ستارہ ہے جو ہمارے نظام شمسی کے مرکز میں واقع ہے۔ یہ گرم پلازما کا ایک خوبصورت گول گولا ہے۔",
    },
    funFacts: {
      en: [
        "The Sun is 4.6 billion years old!",
        "It takes 8 minutes for light from the Sun to reach Earth.",
        "The Sun is so big that you could fit 1.3 million Earths inside it!",
      ],
      ur: [
        "سورج کی عمر تقریباً 4.6 ارب سال ہے!",
        "سورج کی روشنی کو زمین تک پہنچنے میں 8 منٹ لگتے ہیں۔",
        "سورج اتنا بڑا ہے کہ اس کے اندر 13 لاکھ زمینیں سما سکتی ہیں!",
      ],
    },
  },
  {
    id: "moon",
    name: { en: "The Moon", ur: "چاند" },
    type: { en: "Satellite", ur: "قدرتی سیارہ" },
    color: "#D1D1D1",
    emoji: "🌙",
    description: {
      en: "Earth's only natural satellite. It's the fifth-largest satellite in the Solar System.",
      ur: "زمین کا واحد قدرتی چاند۔ یہ نظام شمسی کا پانچواں بڑا چاند ہے۔",
    },
    funFacts: {
      en: [
        "The Moon has very weak gravity (1/6th of Earth's).",
        "Footprints made by astronauts on the Moon will be there for millions of years.",
        "The Moon's gravity causes tides on Earth.",
      ],
      ur: [
        "چاند پر کشش ثقل بہت کم ہے (زمین کا صرف 6واں حصہ)۔",
        "خلا بازوں کے چاند پر چھوڑے گئے قدموں کے نشان لاکھوں سال تک ایسے ہی رہیں گے کیونکہ وہاں ہوا نہیں ہے۔",
        "چاند کی کشش ثقل زمین کے سمندروں میں لہریں (جوار بھاٹا) پیدا کرتی ہے۔",
      ],
    },
  },
  {
    id: "halley",
    name: { en: "Halley's Comet", ur: "ہیلی کا دم دار ستارہ" },
    type: { en: "Comet", ur: "دم دار ستارہ" },
    color: "#88CCEE",
    emoji: "☄️",
    description: {
      en: "The most famous comet, visible from Earth every 75-76 years.",
      ur: "سب سے مشہور دم دار ستارہ، جو ہر 75 سے 76 سال بعد زمین سے دیکھا جا سکتا ہے۔",
    },
    funFacts: {
      en: [
        "Comets are like giant dirty snowballs of ice and dust.",
        "A comet's tail always points away from the Sun.",
        "Halley's comet was last seen in 1986.",
      ],
      ur: [
        "دم دار ستارے برف اور مٹی سے بنے بڑے گندے برف کے گولوں کی طرح ہوتے ہیں۔",
        "دم دار ستارے کی پونچھ ہمیشہ سورج کی مخالف سمت میں ہوتی ہے۔",
        "ہیلی کا ستارہ آخری بار 1986 میں دیکھا گیا تھا۔",
      ],
    },
  },
  {
    id: "ceres",
    name: { en: "Ceres", ur: "سیریس" },
    type: { en: "Asteroid", ur: "سیارچہ" },
    color: "#A0A0A0",
    emoji: "🪨",
    description: {
      en: "The largest object in the asteroid belt between Mars and Jupiter.",
      ur: "مریخ اور مشتری کے درمیان سیارچوں کی پٹی (ایسٹرائڈ بیلٹ) میں سب سے بڑی چیز۔",
    },
    funFacts: {
      en: [
        "Ceres is so big it's also classified as a dwarf planet.",
        "It makes up 1/3 of the total mass of the asteroid belt.",
        "Scientists think Ceres might have a subsurface ocean!",
      ],
      ur: [
        "سیریس اتنا بڑا ہے کہ اسے بونا سیارہ (ڈوارف پلینٹ) بھی مانا جاتا ہے۔",
        "یہ پوری ایسٹرائڈ بیلٹ کے کل وزن کا ایک تہائی حصہ ہے۔",
        "سائنسدانوں کا خیال ہے کہ اس کی سطح کے نیچے پانی کا سمندر ہو سکتا ہے!",
      ],
    },
  },
  {
    id: "milky-way",
    name: { en: "Milky Way", ur: "کہکشاں (ملکی وے)" },
    type: { en: "Galaxy", ur: "کہکشاں" },
    color: "#663399",
    emoji: "🌌",
    description: {
      en: "Our home galaxy! A huge spiral containing hundreds of billions of stars.",
      ur: "ہماری اپنی کہکشاں! ایک بہت بڑا گھومتا ہوا جالا جس میں اربوں ستارے موجود ہیں۔",
    },
    funFacts: {
      en: [
        "The Milky Way is 100,000 light-years across.",
        "It is warped, shaped like a floppy record.",
        "There is a supermassive black hole at its center.",
      ],
      ur: [
        "ہماری کہکشاں ایک سرے سے دوسرے سرے تک ایک لاکھ نوری سال چوڑی ہے۔",
        "یہ بالکل سیدھی نہیں بلکہ ایک مڑی ہوئی پرانی گراموفون ریکارڈ کی طرح ہے۔",
        "اس کہکشاں کے بالکل بیچ میں ایک بہت بڑا بلیک ہول موجود ہے۔",
      ],
    },
  },
  {
    id: "iss",
    name: { en: "ISS", ur: "آئی ایس ایس" },
    type: { en: "Space Station", ur: "خلائی اسٹیشن" },
    color: "#FFFFFF",
    emoji: "🛰️",
    description: {
      en: "A large spacecraft in orbit around Earth. It serves as a home for astronauts.",
      ur: "زمین کے گرد چکر لگانے والا ایک بہت بڑا خلائی جہاز جہاں خلا باز رہتے اور ریسرچ کرتے ہیں۔",
    },
    funFacts: {
      en: [
        "The ISS travels at 17,500 miles per hour!",
        "It orbits the Earth every 90 minutes.",
        "It's about as big as a football field.",
      ],
      ur: [
        "خلائی اسٹیشن 17,500 میل فی گھنٹہ کی تیز رفتار سے سفر کرتا ہے!",
        "یہ صرف 90 منٹ میں زمین کے گرد اپنا ایک چکر پورا کر لیتا ہے۔",
        "اس کا سائز فٹ بال کے ایک پورے میدان جتنا بڑا ہے۔",
      ],
    },
  },
];

export interface QuizQuestion {
  id: number;
  question: LocalizedString;
  options: string[]; // Options stay simple strings, but we will access translated options
  answer: string; // Used to check logic values
  localizedOptions: LocalizedArray; // Added for rendering translations
  fact: LocalizedString;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: {
      en: "Which planet is known as the 'Red Planet'?",
      ur: "کس سیارے کو 'سرخ سیارہ' کہا جاتا ہے؟",
    },
    options: ["Venus", "Mars", "Jupiter", "Saturn"], // Kept for matching engine values
    localizedOptions: {
      en: ["Venus", "Mars", "Jupiter", "Saturn"],
      ur: ["زہرہ", "مریخ", "مشتری", "زحل"],
    },
    answer: "Mars",
    fact: {
      en: "Mars is red because its soil contains iron oxide, which is just like rust!",
      ur: "مریخ سرخ ہے کیونکہ اس کی مٹی میں آئرن آکسائیڈ پایا جاتا ہے، جو بالکل زنگ کی طرح ہوتا ہے!",
    },
  },
  {
    id: 2,
    question: {
      en: "Which is the largest planet in our solar system?",
      ur: "ہمارے نظام شمسی کا سب سے بڑا سیارہ کون سا ہے؟",
    },
    options: ["Earth", "Jupiter", "Neptune", "Saturn"],
    localizedOptions: {
      en: ["Earth", "Jupiter", "Neptune", "Saturn"],
      ur: ["زمین", "مشتری", "نیپچون", "زحل"],
    },
    answer: "Jupiter",
    fact: {
      en: "Jupiter is so big that all the other planets could fit inside it twice!",
      ur: "مشتری اتنا بڑا ہے کہ نظام شمسی کے باقی تمام سیارے اس کے اندر دو بار سما سکتے ہیں!",
    },
  },
  {
    id: 3,
    question: {
      en: "What is at the center of our solar system?",
      ur: "ہمارے نظام شمسی کے مرکز (بیچ) میں کیا ہے؟",
    },
    options: ["Earth", "The Moon", "The Sun", "A Black Hole"],
    localizedOptions: {
      en: ["Earth", "The Moon", "The Sun", "A Black Hole"],
      ur: ["زمین", "چاند", "سورج", "بلیک ہول"],
    },
    answer: "The Sun",
    fact: {
      en: "The Sun is a star and makes up 99.8% of the mass in our solar system.",
      ur: "سورج ایک ستارہ ہے اور یہ پورے نظام شمسی کے کل وزن کا 99.8 فیصد حصہ ہے۔",
    },
  },
  {
    id: 4,
    question: {
      en: "Which planet has beautiful rings made of ice and rock?",
      ur: "کس سیارے کے گرد برف اور چٹانوں سے بنے خوبصورت چھلے ہیں؟",
    },
    options: ["Jupiter", "Uranus", "Saturn", "Mercury"],
    localizedOptions: {
      en: ["Jupiter", "Uranus", "Saturn", "Mercury"],
      ur: ["مشتری", "یورینس", "زحل", "عطارد"],
    },
    answer: "Saturn",
    fact: {
      en: "Saturn is not the only planet with rings, but it definitely has the most spectacular ones!",
      ur: "زحل واحد سیارہ نہیں ہے جس کے چھلے ہیں، لیکن اس کے چھلے سب سے شاندار اور واضح ہیں!",
    },
  },
  {
    id: 5,
    question: {
      en: "Which planet is closest to the Sun?",
      ur: "کون سا سیارہ سورج کے سب سے زیادہ قریب ہے؟",
    },
    options: ["Venus", "Earth", "Mercury", "Mars"],
    localizedOptions: {
      en: ["Venus", "Earth", "Mercury", "Mars"],
      ur: ["زہرہ", "زمین", "عطارد", "مریخ"],
    },
    answer: "Mercury",
    fact: {
      en: "Mercury is the smallest planet and also the fastest, orbiting the Sun in just 88 days!",
      ur: "عطارد سب سے چھوٹا سیارہ ہے اور سب سے تیز بھی، جو صرف 88 دنوں میں سورج کے گرد چکر لگا لیتا ہے!",
    },
  },
];

export interface TimelineEvent {
  year: string;
  title: LocalizedString;
  description: LocalizedString;
}

export const TIMELINE: TimelineEvent[] = [
  {
    year: "1957",
    title: { en: "Sputnik 1", ur: "اسپوتنک 1" },
    description: {
      en: "The first artificial satellite was launched into space by the Soviet Union.",
      ur: "سوویت یونین نے دنیا کا پہلا مصنوعی سیارہ کامیابی سے خلا میں بھیجا۔",
    },
  },
  {
    year: "1961",
    title: { en: "First Human in Space", ur: "پہلا انسان خلا میں" },
    description: {
      en: "Yuri Gagarin became the first human to journey into outer space.",
      ur: "یوری گاگرین خلائی سفر کرنے والے دنیا کے پہلے انسان بنے۔",
    },
  },
  {
    year: "1969",
    title: { en: "Moon Landing", ur: "چاند پر قدم" },
    description: {
      en: "Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon.",
      ur: "نیل آرمسٹرانگ اور بز الڈرین چاند کی سطح پر چلنے والے پہلے انسان بنے۔",
    },
  },
  {
    year: "1990",
    title: { en: "Hubble Telescope", ur: "ہبل دوربین" },
    description: {
      en: "The Hubble Space Telescope was launched, giving us amazing photos of the universe.",
      ur: "ہبل خلائی دوربین خلا میں بھیجی گئی، جس نے ہمیں کائنات کی شاندار تصویریں فراہم کیں۔",
    },
  },
  {
    year: "1998",
    title: { en: "ISS Construction", ur: "خلائی اسٹیشن کا آغاز" },
    description: {
      en: "Construction began on the International Space Station, a giant lab in space.",
      ur: "بین الاقوامی خلائی اسٹیشن (آئی ایس ایس) کی تعمیر شروع ہوئی، جو خلا میں ایک بڑی تجربہ گاہ ہے۔",
    },
  },
  {
    year: "2012",
    title: { en: "Curiosity Rover", ur: "کیوروسٹی روور" },
    description: {
      en: "The Curiosity rover landed on Mars to see if the planet ever had life.",
      ur: "کیوروسٹی نامی روبوٹ مریخ پر اترا تاکہ یہ معلوم کیا جا سکے کہ کیا وہاں کبھی زندگی موجود تھی۔",
    },
  },
  {
    year: "2021",
    title: { en: "James Webb Telescope", ur: "جیمز ویب دوربین" },
    description: {
      en: "The most powerful space telescope ever built was launched to see the very first stars.",
      ur: "اب تک کی سب سے طاقتور خلائی دوربین خلا میں روانہ کی گئی تاکہ کائنات کے سب سے پہلے ستاروں کو دیکھا جا سکے۔",
    },
  },
];
