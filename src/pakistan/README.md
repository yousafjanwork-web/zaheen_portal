# Discover Pakistan — Module

Ye folder aapke "Discover Pakistan" React app ka clean, self-contained module hai
(sirf woh files jo actual app use karta hai — purane admin-template ke unused
pages/CSS/gulp files nikaal diye gaye hain).

## 1. Folder copy karein

Is poore `DiscoverPakistanModule` folder ko apne doosre React project ke
`src/` ke andar copy karein, e.g.:

```
your-project/
  src/
    modules/
      DiscoverPakistanModule/   <- ye poora folder yahan paste karein
```

## 2. Dependencies install karein

Apne project ki root mein ye run karein:

```bash
npm install react-router-dom framer-motion howler clsx tailwind-merge zustand lucide-react
npm install -D @types/howler
```

> Note: Ye module TypeScript (`.tsx`) files use karta hai. Agar aapka project
> plain JavaScript (`.jsx`) hai, TypeScript support enable karna hoga
> (Vite: `npm install -D typescript` — Vite automatically `.tsx` handle kar
> leta hai; CRA: TypeScript ke bina `.tsx` files nahi chalengi). Agar aap
> chahte hain to main files ko `.jsx` mein convert bhi kar sakta hoon — bata dein.

## 3. Tailwind CSS

Ye module **Tailwind CSS v4** syntax use karta hai (`discover-pakistan.css`
mein `@import "tailwindcss";` aur `@theme { ... }` block). Agar aapke project
mein already Tailwind v4 hai, bas is CSS file ko import kar dein:

```ts
import "./modules/DiscoverPakistanModule/discover-pakistan.css";
```

Agar aapke project mein Tailwind v3 (ya Tailwind bilkul nahi) hai, to:
- Ya to Tailwind v4 install karein (`npm install -D tailwindcss @tailwindcss/vite`), ya
- Mujhe bata dein, main `@theme` colors ko `tailwind.config.js` ke `theme.extend`
  format mein convert kar dunga taake ye v3 ke saath bhi chal jaye.

## 4. Component use karna

**Case A — aapke project mein already `react-router-dom` / `<BrowserRouter>` hai:**
Router ko duplicate na karein, embeddable version use karein:

```tsx
import { DiscoverPakistanApp } from "./modules/DiscoverPakistanModule/DiscoverPakistan";

// apni existing <Routes> ke andar, ek route/page ke taur par:
<Route path="/discover-pakistan/*" element={<DiscoverPakistanApp />} />
```

**Case B — aapke project mein koi router nahi hai (sirf isi module ko poori
app ke taur par chalana hai):**

```tsx
import DiscoverPakistan from "./modules/DiscoverPakistanModule/DiscoverPakistan";

function App() {
  return <DiscoverPakistan />;
}
```

⚠️ Agar aap Case A use kar rahe hain, module ke andar ke routes (`/`, `/map`,
`/heroes` waghera) absolute paths hain — ye aapke existing routes se clash
kar sakte hain. Agar clash ho, bata dein, main inhe relative/nested routes
mein convert kar dunga taake ye `/discover-pakistan/map` jaisi sub-paths
par chalein.

## Folder contents

| Folder | Purpose |
|---|---|
| `DiscoverPakistan.tsx` | Main entry component (default export + `DiscoverPakistanApp`) |
| `pages/` | Har screen (Home, Map, Province, Quiz, Heroes, etc.) |
| `components/` | Reusable UI, layout aur map components |
| `store/` | Zustand state (progress/XP/badges — localStorage key: `discover-pakistan-save`) |
| `data/` | Static content (provinces, heroes, animals, foods, symbols) |
| `types/` | Shared TypeScript types |
| `utils/` | Audio/sound-effects helper, class-name helper |
| `assets/images/` | Sirf woh images jo app actually use karta hai (~121MB) |
| `discover-pakistan.css` | Tailwind v4 theme + custom animations |

## Notes

- State apne aap `localStorage` mein `discover-pakistan-save` key ke andar
  save hota hai — kisi clash ka khatra nahi jab tak aapke doosre project
  mein wahi key na ho.
- Sound effects Web Audio API se generate hote hain — koi extra audio file
  ki zaroorat nahi.
- Agar chahte hain ke ye ek proper installable **npm package** ban jaye
  (dusre React projects mein `npm install` karke use ho sake), wo bhi
  bana sakta hoon — bata dein.
