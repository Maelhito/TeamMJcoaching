# Graph Report - .  (2026-04-12)

## Corpus Check
- Corpus is ~10,962 words - fits in a single context window. You may not need a graph.

## Summary
- 124 nodes · 160 edges · 35 communities detected
- Extraction: 38% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 340 input · 190 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Nutrition & Lifestyle Fundamentals|Nutrition & Lifestyle Fundamentals]]
- [[_COMMUNITY_Emotional Hunger & Mind-Body|Emotional Hunger & Mind-Body]]
- [[_COMMUNITY_Restaurant & Resilience Mindset|Restaurant & Resilience Mindset]]
- [[_COMMUNITY_Module Content Rendering|Module Content Rendering]]
- [[_COMMUNITY_Brand & Programme Identity|Brand & Programme Identity]]
- [[_COMMUNITY_API Routes & Redis|API Routes & Redis]]
- [[_COMMUNITY_Coaching Content Docs|Coaching Content Docs]]
- [[_COMMUNITY_Visual Branding Assets|Visual Branding Assets]]
- [[_COMMUNITY_Module Data Access|Module Data Access]]
- [[_COMMUNITY_User Data Access|User Data Access]]
- [[_COMMUNITY_Page Components|Page Components]]
- [[_COMMUNITY_Video Zone Component|Video Zone Component]]
- [[_COMMUNITY_User Admin Script|User Admin Script]]
- [[_COMMUNITY_Globe Icon & i18n|Globe Icon & i18n]]
- [[_COMMUNITY_Window Icon & UI Assets|Window Icon & UI Assets]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_Login Page|Login Page]]
- [[_COMMUNITY_Module Card Component|Module Card Component]]
- [[_COMMUNITY_Service Worker|Service Worker]]
- [[_COMMUNITY_Notion Card Component|Notion Card Component]]
- [[_COMMUNITY_Document Zone Component|Document Zone Component]]
- [[_COMMUNITY_File Icon Asset|File Icon Asset]]
- [[_COMMUNITY_Vercel Branding|Vercel Branding]]
- [[_COMMUNITY_Next.js Branding|Next.js Branding]]
- [[_COMMUNITY_Auth Config|Auth Config]]
- [[_COMMUNITY_Next.js Type Defs|Next.js Type Defs]]
- [[_COMMUNITY_Auth Module|Auth Module]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_NextAuth Types|NextAuth Types]]
- [[_COMMUNITY_Setup Page|Setup Page]]
- [[_COMMUNITY_Upload Route|Upload Route]]
- [[_COMMUNITY_Navbar Component|Navbar Component]]
- [[_COMMUNITY_Bottom Nav Component|Bottom Nav Component]]
- [[_COMMUNITY_App Header Component|App Header Component]]
- [[_COMMUNITY_Service Worker Script|Service Worker Script]]

## God Nodes (most connected - your core abstractions)
1. `POST()` - 5 edges
2. `Module: Mission Caddie` - 5 edges
3. `Team MJ Coaching Logo` - 4 edges
4. `getRedis()` - 3 edges
5. `getRedis()` - 3 edges
6. `getModules()` - 3 edges
7. `getUsers()` - 3 edges
8. `Mission Caddie Banner` - 3 edges
9. `Alimentation` - 3 edges
10. `Time To Move` - 3 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `toEmbedUrl()`  [EXTRACTED]
  app/api/upload/route.ts → app/api/video/route.ts

## Hyperedges (group relationships)
- **Triade holistique du programme Team MJ** — concept:NEAT, concept:macronutriments, concept:mindset-guerrieres, concept:coherence-cardiaque [1.0]
- **Régulation hormonale de la faim et du poids** — concept:ghrelline, concept:leptine, concept:cortisol, concept:sommeil, concept:stress [1.0]
- **Processus intégré de gestion des écarts** — concept:regle-80-20, concept:plan-b-apres-exces, concept:zero-culpabilite, concept:mindset-guerrieres [1.0]

## Communities

### Community 0 - "Nutrition & Lifestyle Fundamentals"
Cohesion: 0.18
Nodes (18): NEAT (Non-Exercise Activity Thermogenesis), Application Azeoo, Balance énergétique, Composition de l'assiette équilibrée, Modes de cuisson et assaisonnement, Déficit calorique, Fausses croyances nutritionnelles, Glucides (+10 more)

### Community 1 - "Emotional Hunger & Mind-Body"
Cohesion: 0.3
Nodes (14): Processus 5 étapes gestion faim émotionnelle, Boîte à outils émotionnelle, Cohérence cardiaque, Cortisol, Échelle de la faim, Faim émotionnelle, Faim physique, Ghréline (+6 more)

### Community 2 - "Restaurant & Resilience Mindset"
Cohesion: 0.31
Nodes (10): 10 réflexes au restaurant, Choix alimentaires par type de restaurant, Mindset des Guerrières, Plan B après excès, Règle 80/20, Repas sociaux (chez soi / chez les autres), Gestion des sorties restaurants, Zéro culpabilité (+2 more)

### Community 3 - "Module Content Rendering"
Cohesion: 0.36
Nodes (5): getModuleDocument(), getModuleVideo(), getRedis(), processInline(), renderMarkdown()

### Community 4 - "Brand & Programme Identity"
Cohesion: 0.36
Nodes (8): Mission Caddie Banner, Team MJ Coaching, #TimeTomove Campaign, Module: Mission Caddie, Programme 16 Semaines, Alimentation, Courses (Grocery Shopping), Etiquettes (Food Labels)

### Community 5 - "API Routes & Redis"
Cohesion: 0.53
Nodes (3): getRedis(), POST(), toEmbedUrl()

### Community 6 - "Coaching Content Docs"
Cohesion: 0.4
Nodes (6): Programme 16 semaines, Team MJ Coaching, README.md, Guide de démarrage (Module 1 - compressé), Fiche Équivalences Alimentaires (Module 4), Rationale: approche holistique nutrition+sport+mindset

### Community 7 - "Visual Branding Assets"
Cohesion: 0.6
Nodes (5): Team MJ Coaching, Time To Move, Dark Background with Red Color Scheme, Team MJ Coaching Logo, Raised Fist with Flame Icon

### Community 8 - "Module Data Access"
Cohesion: 0.83
Nodes (3): getCategories(), getModuleBySlug(), getModules()

### Community 9 - "User Data Access"
Cohesion: 0.83
Nodes (3): getUserByEmail(), getUserById(), getUsers()

### Community 10 - "Page Components"
Cohesion: 0.67
Nodes (1): Page()

### Community 11 - "Video Zone Component"
Cohesion: 1.0
Nodes (2): handleKeyDown(), handleSave()

### Community 12 - "User Admin Script"
Cohesion: 1.0
Nodes (2): ask(), main()

### Community 13 - "Globe Icon & i18n"
Cohesion: 0.67
Nodes (3): Globe / World Icon, Internationalization (i18n), Public Static Assets

### Community 14 - "Window Icon & UI Assets"
Cohesion: 0.67
Nodes (3): Browser Window Icon, Next.js Public Assets, UI Icon Set

### Community 15 - "Root Layout"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Login Page"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Module Card Component"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Service Worker"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Notion Card Component"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Document Zone Component"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "File Icon Asset"
Cohesion: 1.0
Nodes (1): File / Document Icon (SVG)

### Community 22 - "Vercel Branding"
Cohesion: 1.0
Nodes (1): Vercel Logo

### Community 23 - "Next.js Branding"
Cohesion: 1.0
Nodes (1): Next.js

### Community 24 - "Auth Config"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Next.js Type Defs"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Auth Module"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Next.js Config"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "NextAuth Types"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Setup Page"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Upload Route"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Navbar Component"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Bottom Nav Component"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "App Header Component"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Service Worker Script"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **6 isolated node(s):** `Programme 16 Semaines`, `Dark Background with Red Color Scheme`, `Internationalization (i18n)`, `Public Static Assets`, `UI Icon Set` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Root Layout`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login Page`** (2 nodes): `page.tsx`, `handleSubmit()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module Card Component`** (2 nodes): `ModuleCard.tsx`, `ModuleCard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Service Worker`** (2 nodes): `ServiceWorkerRegistration.tsx`, `ServiceWorkerRegistration()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Notion Card Component`** (2 nodes): `NotionCard.tsx`, `NotionCard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Document Zone Component`** (2 nodes): `ModuleDocumentZone.tsx`, `handleFileChange()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `File Icon Asset`** (1 nodes): `File / Document Icon (SVG)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vercel Branding`** (1 nodes): `Vercel Logo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Branding`** (1 nodes): `Next.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Config`** (1 nodes): `auth.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Type Defs`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Module`** (1 nodes): `auth.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Config`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `NextAuth Types`** (1 nodes): `next-auth.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Setup Page`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Upload Route`** (1 nodes): `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Navbar Component`** (1 nodes): `Navbar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Bottom Nav Component`** (1 nodes): `BottomNav.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Header Component`** (1 nodes): `AppHeader.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Service Worker Script`** (1 nodes): `sw.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `Programme 16 Semaines`, `Dark Background with Red Color Scheme`, `Internationalization (i18n)` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._