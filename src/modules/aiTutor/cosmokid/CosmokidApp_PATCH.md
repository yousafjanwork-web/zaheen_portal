# CosmokidApp.tsx — How to create it

Take your original `App.tsx` and make these 5 changes:

## Change 1 — Logo import (line 2)
```
// FROM:
import logo from "../src/images/logo.png";

// TO:
import logo from "../../assets/images/logo.png";
```

## Change 2 — Add config import (after existing imports)
```
import { cosmoApi } from "./config";
```

## Change 3 — Rename the function
```
// FROM:
export default function App() {

// TO:
export default function CosmokidApp() {
```

## Change 4 — Fix AI chat fetch (in AIAssistant component, ~line 850)
```
// FROM:
const res = await fetch("/api/chat", {

// TO:
const res = await fetch(cosmoApi("/api/chat"), {
```

## Change 5 — Fix all component/data imports
```
// FROM:
import { cn } from "./lib/utils";
import { PLANETS, ... } from "./data/spaceData";
import { Starfield } from "./components/Starfield";
import { SolarSystemView } from "./components/SolarSystemView";
import { translations, Language } from "./lib/translations";

// These stay the same — they already use relative paths that work
// as long as CosmokidApp.tsx is placed in src/cosmokid/
```

## Save as
`src/cosmokid/CosmokidApp.tsx`
