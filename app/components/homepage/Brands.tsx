import Image from "next/image";
import { getLocalization } from "../../utils/getLocalization";

export default async function Brands() {
  const { homepage } = await getLocalization();

  if (!homepage?.brands || homepage.brands.length === 0) {
    return null; // Do not render if no brands exist
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-foreground mb-8">{homepage.brandsTitle}</h2>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 mt-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-center">
          {homepage.brands.map((brand, index) => (
            <div key={index} className="flex justify-center">
              <Image
                src={brand.logo}
                alt={brand.name || "Brand Logo"}
                width={120}
                height={60}
                className="max-h-20 max-w-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-300"
                priority={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
