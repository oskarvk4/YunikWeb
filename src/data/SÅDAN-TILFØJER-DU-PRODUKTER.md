# Sådan Tilføjer Du Produkter

Åbn filen `products.json` i denne mappe og tilføj dine produkter.

---

## Tilføj et Nyt Produkt

Kopier denne skabelon og indsæt den i `products` arrayet:

```json
{
  "id": "ring-004",
  "slug": "dit-produkt-navn",
  "name": "Dit Produkt Navn",
  "price": 1299,
  "category": "rings",
  "description": "Beskrivelse af dit produkt...",
  "materials": "Materialer og plejeinstruktioner...",
  "images": ["/dit-billede.jpg", "/dit-billede-2.jpg"],
  "featured": false,
  "newArrival": true
}
```

---

## Felter Forklaret

| Felt | Beskrivelse | Eksempel |
|------|-------------|----------|
| `id` | Unikt ID (brug kategori + nummer) | `"ring-004"` |
| `slug` | URL-venligt navn (små bogstaver, bindestreger) | `"guld-signet-ring"` |
| `name` | Produktnavn som vises på siden | `"Guld Signet Ring"` |
| `price` | Pris i DKK (kun tal, ingen decimaler) | `1299` |
| `category` | En af: `rings`, `necklaces`, `earrings`, `bracelets` | `"rings"` |
| `description` | Produktbeskrivelse | `"En smuk ring..."` |
| `materials` | Materialer og pleje | `"18 karat guld..."` |
| `images` | Liste af billedstier (mindst 1, max 2 anbefales) | `["/billede.jpg"]` |
| `featured` | Vis på forsiden? `true` eller `false` | `true` |
| `newArrival` | Marker som nyhed? `true` eller `false` | `false` |

---

## Tilføj Billeder

1. Læg dine billeder i `/public/` mappen
2. Brug filnavnet som sti: `/mit-billede.jpg`

**Tips:**
- Brug firkantede billeder (1:1 ratio) for bedste resultat
- JPG eller WebP format anbefales
- Navngiv filer uden mellemrum: `guld-ring.jpg` (ikke `guld ring.jpg`)

---

## Eksempel: Tilføj en ny ring

```json
{
  "id": "ring-004",
  "slug": "diamant-solitaire",
  "name": "Diamant Solitaire",
  "price": 2499,
  "category": "rings",
  "description": "En klassisk solitaire ring med en strålende diamant. Perfekt til forlovelse eller som gave.",
  "materials": "14 karat hvidguld med 0.5 karat diamant. Konfliktfri sten.",
  "images": ["/diamant-ring-1.jpg", "/diamant-ring-2.jpg"],
  "featured": true,
  "newArrival": true
}
```

---

## Efter Ændringer

1. Gem filen
2. Kør `npm run build` i terminalen
3. Deploy igen til Netlify (drag & drop `out` mappen)

---

## Fejlfinding

**"Unexpected token" fejl:**
- Tjek at alle strenge har citationstegn: `"tekst"`
- Tjek at der er komma mellem produkter (men IKKE efter det sidste)
- Brug en JSON validator: https://jsonlint.com

**Billede vises ikke:**
- Tjek at filen ligger i `/public/` mappen
- Tjek stavning af filnavnet
- Brug `/filnavn.jpg` (start med skråstreg)
