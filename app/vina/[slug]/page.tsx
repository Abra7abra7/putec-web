import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "../../utils/getProducts";
import { getCurrencySymbol } from "../../utils/getCurrencySymbol";
import ProductLightbox from "../../components/products/ProductLightbox";
import { getLocalization } from "../../utils/getLocalization";
import AddToCartButtonWrapper from "../../components/products/AddToCartButtonWrapper";
import Script from "next/script";

// Define a type for route params as a Promise
type AsyncParams = Promise<{ slug?: string }>;

/**
 * Note: `generateMetadata` must also treat `params` as a Promise.
 * Then "await params" to get the real slug value.
 */
export async function generateMetadata({
  params,
}: {
  params: AsyncParams;
}): Promise<Metadata> {
  const { slug } = await params; // MUST await

  if (!slug) {
    return {
      title: "Product Not Found",
      description: "No product slug provided.",
    };
  }

  // Fetch data asynchronously
  const [product, localeData] = await Promise.all([
    getProductBySlug(slug),
    getLocalization(),
  ]);

  if (!product) {
    return {
      title: "Product Not Found",
      description: `Product with slug "${slug}" does not exist.`,
    };
  }

  return {
    title: `${product.Title} - ${localeData.siteName}`,
    description: product.ShortDescription,
  };
}

/**
 * The route itself must also treat `params` as a Promise.
 */
export default async function ProductPage({
  params,
}: {
  params: AsyncParams;
}) {
  // First await for the real param
  const { slug } = await params;
  if (!slug) {
    return notFound();
  }

  // Now do local file read
  const [product, localeData] = await Promise.all([
    getProductBySlug(slug),
    getLocalization(),
  ]);
  
  if (!product) {
    return notFound();
  }

  // Build SSR UI
  const priceBlock =
    product.SalePrice !== product.RegularPrice ? (
      <p className="text-xl font-bold text-red-600">
        {getCurrencySymbol(product.Currency)}
        {product.SalePrice}
        <span className="ml-2 text-gray-500 line-through">
          {getCurrencySymbol(product.Currency)}
          {product.RegularPrice}
        </span>
      </p>
    ) : (
      <p className="text-xl font-bold text-gray-900">
        {getCurrencySymbol(product.Currency)}
        {product.RegularPrice}
      </p>
    );

  // Check if this is a degustation product
  const isDegustation = product.ProductType === 'degustation';
  const isWine = product.ProductType === 'wine' || !product.ProductType; // Default to wine if no type specified

  return (
    <>
      <Script id="ld-json-breadcrumbs-vino-detail" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
            {"@type":"ListItem","position":1,"name":"Domov","item":"https://vinoputec.sk/"},
            {"@type":"ListItem","position":2,"name":"Vína","item":"https://vinoputec.sk/vina"},
            {"@type":"ListItem","position":3,"name": product.Title, "item": `https://vinoputec.sk/vina/${product.Slug}`}
          ] }) }} />
      <Script id="ld-json-product" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context":"https://schema.org","@type":"Product",
          "name": product.Title,
          "image": [product.FeatureImageURL, ...(product.ProductImageGallery||[])],
          "description": product.ShortDescription,
          "sku": product.ID,
          "gtin13": product.WineDetails?.gtin || undefined,
          "brand": {"@type":"Brand","name":"Vino Putec"},
          "offers": {
            "@type":"Offer",
            "priceCurrency": product.Currency,
            "price": product.SalePrice || product.RegularPrice,
            "availability":"https://schema.org/InStock",
            "url": `https://vinoputec.sk/vina/${product.Slug}`
          }
        }) }} />
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-foreground mb-8">{product.Title}</h1>
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 text-sm text-foreground">
              <span aria-hidden>★</span>
              <span className="font-semibold">5.0</span>
              <span className="opacity-70">(31 recenzií)</span>
            </span>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN: IMAGES */}
          <ProductLightbox images={[product.FeatureImageURL, ...product.ProductImageGallery]} />

          {/* RIGHT COLUMN: DETAILS */}
          <div>
            <p className="text-lg text-foreground-muted">{product.ShortDescription}</p>
            
            {/* Degustation specific info */}
            {isDegustation && (
              <div className="mt-4 p-4 bg-background border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.Capacity && (
                    <div>
                      <span className="font-semibold text-foreground">Kapacita:</span>
                      <p className="text-foreground-muted">{product.Capacity}</p>
                    </div>
                  )}
                  {product.Duration && (
                    <div>
                      <span className="font-semibold text-foreground">Trvanie:</span>
                      <p className="text-foreground-muted">{product.Duration}</p>
                    </div>
                  )}
                </div>
                {product.Deposit && (
                  <div className="mt-2 text-sm">
                    <span className="font-semibold text-foreground">Vratná záloha:</span>
                    <span className="text-foreground-muted ml-1">{product.Deposit}€</span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4">{priceBlock}</div>

            <div className="mt-4">
              <AddToCartButtonWrapper product={product} />
            </div>
          </div>
        </div>

        {/* Features for degustations */}
        {isDegustation && product.Features && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Zahrnuté v balíku
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {product.Features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-accent font-bold">✓</span>
                  <span className="text-foreground-muted">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Wine Details */}
        {isWine && product.WineDetails && (
          <div className="mt-10 space-y-8">
            {/* Basic Wine Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background border border-gray-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-foreground mb-4">O víne</h3>
                <div className="space-y-3">
                  {product.WineDetails.vintage && (
                    <div>
                      <span className="font-semibold text-foreground">Ročník:</span>
                      <span className="text-foreground-muted ml-2">{product.WineDetails.vintage}</span>
                    </div>
                  )}
                  {product.WineDetails.wineType && (
                    <div>
                      <span className="font-semibold text-foreground">Druh vína:</span>
                      <span className="text-foreground-muted ml-2">{product.WineDetails.wineType}</span>
                    </div>
                  )}
                  {product.WineDetails.quality && (
                    <div>
                      <span className="font-semibold text-foreground">Kvalita:</span>
                      <span className="text-foreground-muted ml-2">{product.WineDetails.quality}</span>
                    </div>
                  )}
                  {product.WineDetails.region && (
                    <div>
                      <span className="font-semibold text-foreground">Oblasť:</span>
                      <span className="text-foreground-muted ml-2">{product.WineDetails.region}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-background border border-gray-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-foreground mb-4">Charakteristika</h3>
                <div className="space-y-3">
                  {product.WineDetails.color && (
                    <div>
                      <span className="font-semibold text-foreground">Farba:</span>
                      <p className="text-foreground-muted mt-1">{product.WineDetails.color}</p>
                    </div>
                  )}
                  {product.WineDetails.aroma && (
                    <div>
                      <span className="font-semibold text-foreground">Vôňa:</span>
                      <p className="text-foreground-muted mt-1">{product.WineDetails.aroma}</p>
                    </div>
                  )}
                  {product.WineDetails.taste && (
                    <div>
                      <span className="font-semibold text-foreground">Chuť:</span>
                      <p className="text-foreground-muted mt-1">{product.WineDetails.taste}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-background border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-foreground mb-4">Technické údaje</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {product.WineDetails.alcoholContent && (
                  <div>
                    <span className="font-semibold text-foreground">Obsah alkoholu:</span>
                    <p className="text-foreground-muted">{product.WineDetails.alcoholContent}</p>
                  </div>
                )}
                {product.WineDetails.residualSugar && (
                  <div>
                    <span className="font-semibold text-foreground">Zbytkový cukor:</span>
                    <p className="text-foreground-muted">{product.WineDetails.residualSugar}</p>
                  </div>
                )}
                {product.WineDetails.sugar && (
                  <div>
                    <span className="font-semibold text-foreground">Cukor:</span>
                    <p className="text-foreground-muted">{product.WineDetails.sugar}</p>
                  </div>
                )}
                {product.WineDetails.bottleVolume && (
                  <div>
                    <span className="font-semibold text-foreground">Objem fľaše:</span>
                    <p className="text-foreground-muted">{product.WineDetails.bottleVolume}</p>
                  </div>
                )}
                {product.WineDetails.storageTemp && (
                  <div>
                    <span className="font-semibold text-foreground">Teplota skladovania:</span>
                    <p className="text-foreground-muted">{product.WineDetails.storageTemp}</p>
                  </div>
                )}
                {product.WineDetails.servingTemp && (
                  <div>
                    <span className="font-semibold text-foreground">Teplota podávania:</span>
                    <p className="text-foreground-muted">{product.WineDetails.servingTemp}</p>
                  </div>
                )}
                {product.WineDetails.batchNumber && (
                  <div>
                    <span className="font-semibold text-foreground">Výrobná dávka:</span>
                    <p className="text-foreground-muted">{product.WineDetails.batchNumber}</p>
                  </div>
                )}
                {product.WineDetails.gtin && (
                  <div>
                    <span className="font-semibold text-foreground">GTIN:</span>
                    <p className="text-foreground-muted">{product.WineDetails.gtin}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Producer Info */}
            <div className="bg-background border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-foreground mb-4">Výrobca</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.WineDetails.producer && (
                  <div>
                    <span className="font-semibold text-foreground">Vyrába:</span>
                    <p className="text-foreground-muted">{product.WineDetails.producer}</p>
                  </div>
                )}
                {product.WineDetails.bottler && (
                  <div>
                    <span className="font-semibold text-foreground">Plní:</span>
                    <p className="text-foreground-muted">{product.WineDetails.bottler}</p>
                  </div>
                )}
                {product.WineDetails.countryOfOrigin && (
                  <div>
                    <span className="font-semibold text-foreground">Krajina pôvodu:</span>
                    <p className="text-foreground-muted">{product.WineDetails.countryOfOrigin}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Warnings and Additional Info */}
            {(product.WineDetails.warnings || product.WineDetails.nutritionalInfoUrl) && (
              <div className="bg-background border border-gray-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-foreground mb-4">Dodatočné informácie</h3>
                <div className="space-y-3">
                  {product.WineDetails.warnings && (
                    <div>
                      <span className="font-semibold text-foreground">Upozornenia:</span>
                      <p className="text-foreground-muted mt-1">{product.WineDetails.warnings}</p>
                    </div>
                  )}
                  {product.WineDetails.nutritionalInfoUrl && (
                    <div>
                      <span className="font-semibold text-foreground">Nutričné hodnoty:</span>
                      <a 
                        href={product.WineDetails.nutritionalInfoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent-dark ml-2 underline"
                      >
                        Zobraziť nutričné hodnoty
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LONG DESCRIPTION */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            {isDegustation ? "O degustácii" : (localeData.labels.productDetails || "Product Details")}
          </h2>
          <p className="text-foreground-muted mt-4">{product.LongDescription}</p>
        </div>
        </div>
      </section>
    </>
  );
}

