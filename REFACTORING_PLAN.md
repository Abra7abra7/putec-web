# Next.js 15 Kompletný Refaktoring Plán

## Prehľad

Tento plán popisuje komplexný refaktoring projektu podľa najnovších Next.js 15 best practices, React Server Components patterns a moderných TypeScript konvencií.

## 🎯 Ciele Refaktoringu

1. **Performance** - Optimalizácia bundle size a load times
2. **Type Safety** - Striktnejšia TypeScript konfigurácia
3. **Code Quality** - Čistejší, udržateľnejší kód
4. **Next.js 15 Patterns** - Server Components, Server Actions, App Router best practices
5. **DX (Developer Experience)** - Lepšia štruktúra, dokumentácia

---

## 📋 Prioritné Oblasti

### 1. API Routes Refaktoring
**Priorita: HIGH | Čas: 1-2 hodiny**

#### Problémy:
- API routes používajú `.tsx` namiesto `.ts` (nevrá

cajú JSX)
- Nedostatočný error handling
- Chýba input validation
- Žiadne rate limiting

#### Riešenie:
```typescript
// app/api/wines/route.ts (nie .tsx)
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod'; // pridať zod pre validáciu

export const revalidate = 3600;

// Validačná schéma
const WineQuerySchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Input validation
    const { searchParams } = new URL(request.url);
    const params = {
      category: searchParams.get('category'),
      minPrice: searchParams.get('minPrice'),
    };
    
    const validated = WineQuerySchema.parse(params);
    
    // Business logic
    const wines = await getWines(validated);
    
    return NextResponse.json({ wines }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('[API Error]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Súbory na zmenu:
- [ ] `app/api/wines/route.tsx` → `route.ts`
- [ ] `app/api/products/route.ts` - pridať validáciu
- [ ] `app/api/checkout/route.tsx` → `route.ts`
- [ ] `app/api/stripe/*/route.tsx` → `route.ts`
- [ ] Všetky ostatné API routes

---

### 2. Server Components vs Client Components
**Priorita: HIGH | Čas: 2-3 hodiny**

#### Problémy:
- Príliš veľa Client Components ktoré by mohli byť Server Components
- Nedostatočné využitie Server Components benefits
- Duplicitné Redux Provider wrappery

#### Riešenie:

**Server Components (default):**
- Pages
- Layouts
- Statické komponenty (Hero, Footer, Header bez state)
- Data fetching komponenty

**Client Components (použiť len keď potrebné):**
- Komponenty s interakciou (onClick, onChange)
- Komponenty s hooks (useState, useEffect, useContext)
- Formuláre
- Komponenty s browser APIs

```typescript
// app/components/products/ProductCard.tsx
// ❌ PRED - Client Component bez dôvodu
"use client";
export default function ProductCard({ product }) {
  return <div>{product.title}</div>;
}

// ✅ PO - Server Component
// Odstránenie "use client" ak nie je potrebný state/interaction
export default function ProductCard({ product }: { product: Product }) {
  return <div>{product.title}</div>;
}

// Ak potrebuje interakciu, oddeliť:
// app/components/products/ProductCard.tsx (Server)
import { AddToCartButton } from './AddToCartButton';

export default function ProductCard({ product }: Props) {
  return (
    <div>
      {/* Server-rendered content */}
      <h2>{product.title}</h2>
      <p>{product.price}</p>
      {/* Client-only interaction */}
      <AddToCartButton productId={product.id} />
    </div>
  );
}
```

#### Súbory na audit:
- [ ] `app/components/products/ProductCard.tsx`
- [ ] `app/components/Hero.tsx`
- [ ] `app/components/Footer.tsx`
- [ ] `app/components/Header.tsx`
- [ ] `app/components/homepage/*`

---

### 3. Data Fetching Modernizácia
**Priorita: HIGH | Čas: 2-3 hodiny**

#### Problémy:
- Synchronné data fetching (`getLocalization()`)
- Chýbajúce error boundaries
- Nedostatočné caching stratégie

#### Riešenie:

```typescript
// app/utils/getWines.ts
import 'server-only'; // Zabezpečiť že sa použije len na serveri

export async function getWines() {
  const filePath = path.join(process.cwd(), 'configs', 'wines.json');
  const fileContents = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// V komponente:
// app/vina/page.tsx
export default async function VinaPage() {
  const wines = await getWines(); // Async!
  
  return (
    <Suspense fallback={<WineGridSkeleton />}>
      <WineGrid wines={wines} />
    </Suspense>
  );
}
```

#### Nové utility functions:
```typescript
// app/lib/data.ts
import 'server-only';
import { cache } from 'react';

// React cache pre deduplication
export const getWines = cache(async () => {
  const filePath = path.join(process.cwd(), 'configs', 'wines.json');
  const contents = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(contents);
});

export const getLocalization = cache(async (locale: string = 'sk') => {
  const filePath = path.join(process.cwd(), 'configs', `locale.${locale}.json`);
  const contents = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(contents);
});
```

---

### 4. Metadata Optimization
**Priorita: MEDIUM | Čas: 1 hodina**

#### Riešenie:

```typescript
// app/vina/[slug]/page.tsx
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const wine = await getWineBySlug(params.slug);
  
  if (!wine) {
    return {
      title: 'Víno nenájdené',
    };
  }
  
  return {
    title: `${wine.Title} | Vino Putec`,
    description: wine.ShortDescription,
    openGraph: {
      title: wine.Title,
      description: wine.ShortDescription,
      images: [wine.FeatureImageURL],
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title: wine.Title,
      description: wine.ShortDescription,
      images: [wine.FeatureImageURL],
    },
  };
}

export default async function WinePage({ params }: Props) {
  const wine = await getWineBySlug(params.slug);
  
  if (!wine) {
    notFound(); // Next.js 15 helper
  }
  
  return <WineDetails wine={wine} />;
}
```

---

### 5. Error Handling & Loading States
**Priorita: MEDIUM | Čas: 1-2 hodiny**

#### Pridať error boundaries:

```typescript
// app/vina/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>Niečo sa pokazilo!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Skúsiť znovu</button>
    </div>
  );
}

// app/vina/not-found.tsx
export default function NotFound() {
  return (
    <div className="not-found">
      <h2>Víno nenájdené</h2>
      <Link href="/vina">Späť na všetky vína</Link>
    </div>
  );
}

// app/vina/loading.tsx
export default function Loading() {
  return (
    <div className="loading-skeleton">
      <WineGridSkeleton />
    </div>
  );
}
```

---

### 6. Server Actions (namiesto API Routes)
**Priorita: MEDIUM | Čas: 2-3 hodiny**

#### Použiť Server Actions pre formy:

```typescript
// app/actions/newsletter.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const NewsletterSchema = z.object({
  email: z.string().email('Neplatný email'),
});

export async function subscribeToNewsletter(formData: FormData) {
  // Validácia
  const result = NewsletterSchema.safeParse({
    email: formData.get('email'),
  });
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }
  
  try {
    // Business logic
    await addToNewsletter(result.data.email);
    
    // Revalidate cache
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Chyba pri pridávaní do newslettera',
    };
  }
}

// Použitie v komponente:
// app/components/NewsletterForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { subscribeToNewsletter } from '@/app/actions/newsletter';

export function NewsletterForm() {
  const [state, formAction] = useFormState(subscribeToNewsletter, null);
  
  return (
    <form action={formAction}>
      <input type="email" name="email" required />
      <SubmitButton />
      {state?.success && <p>Úspešne prihlásený!</p>}
      {state?.errors && <p>{state.errors.email}</p>}
    </form>
  );
}
```

---

### 7. TypeScript Strict Mode
**Priorita: MEDIUM | Čas: 1 hodina**

#### tsconfig.json:
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "strictBindCallApply": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true
  }
}
```

---

### 8. File Structure Reorganizácia
**Priorita: LOW | Čas: 2 hodiny**

#### Nová štruktúra:
```
app/
├── (routes)/          # Page routes
│   ├── vina/
│   ├── pokladna/
│   └── ...
├── api/               # API routes
├── actions/           # Server Actions
├── components/        # Komponenty
│   ├── ui/           # Reusable UI
│   ├── features/     # Feature-specific
│   └── layout/       # Layout components
├── lib/              # Utilities, helpers
│   ├── data.ts       # Data fetching
│   ├── validation.ts # Zod schemas
│   └── utils.ts      # Helpers
├── types/            # TypeScript types
└── hooks/            # Custom hooks
```

---

### 9. Performance Optimizations
**Priorita: MEDIUM | Čas: 1-2 hodiny**

```typescript
// Dynamic imports pre large komponenty
import dynamic from 'next/dynamic';

const ProductLightbox = dynamic(
  () => import('@/components/products/ProductLightbox'),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

// Optimistic UI updates
import { useOptimistic } from 'react';

function CartItem({ item }) {
  const [optimisticQuantity, setOptimisticQuantity] = useOptimistic(
    item.quantity,
    (state, newQuantity) => newQuantity
  );
  
  async function updateQuantity(newQty) {
    setOptimisticQuantity(newQty);
    await fetch('/api/cart/update', { ... });
  }
  
  return <div>{optimisticQuantity}</div>;
}
```

---

### 10. Testing Setup
**Priorita: LOW | Čas: 2-3 hodiny**

```bash
npm install -D @testing-library/react @testing-library/jest-dom vitest
```

```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/products/ProductCard';

describe('ProductCard', () => {
  it('renders product information', () => {
    const product = { title: 'Test Wine', price: '10.00' };
    render(<ProductCard product={product} />);
    expect(screen.getByText('Test Wine')).toBeInTheDocument();
  });
});
```

---

## 📊 Implementačný Plán

### Fáza 1: Základy (1-2 dni)
1. ✅ API routes .tsx → .ts
2. ✅ Pridať error handling
3. ✅ Pridať input validation (zod)
4. ✅ Error/Loading/Not-Found pages

### Fáza 2: Components (2-3 dni)
5. ✅ Audit Client vs Server components
6. ✅ Presunúť state do Client Components
7. ✅ Async data fetching
8. ✅ Metadata optimization

### Fáza 3: Modernizácia (2-3 dni)
9. ✅ Server Actions
10. ✅ TypeScript strict mode
11. ✅ Performance optimizations
12. ✅ File structure reorganizácia

### Fáza 4: Quality & Testing (1-2 dni)
13. ✅ Testing setup
14. ✅ E2E tests
15. ✅ Documentation
16. ✅ Code review & merge

---

## 🎯 Výsledky

- **Bundle Size**: -30% očakávaná redukcia
- **Page Load**: -40% rýchlejší First Contentful Paint
- **Type Safety**: 100% type coverage
- **Maintainability**: Lepšia štruktúra, dokumentácia
- **Developer Experience**: Rýchlejší development, menej bugov

---

## 📚 Referencie

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/intro.html)

