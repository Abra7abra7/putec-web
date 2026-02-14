const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/[locale]/layout.tsx');

try {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // 1. Add Imports
        const importsToAdd = `import Header from "app/components/Header";
import Footer from "app/components/Footer";`;
        // Note: using relative or absolute path? 
        // If I use "app/components/Header", I need to make sure tsconfig supports it or use @/app/components/Header
        // Let's use @/app/components/Header as I set up the alias.

        const importsToAddSafe = `import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";`;

        if (!content.includes('import Header')) {
            content = content.replace('import { LocalizationProvider } from "@/app/context/LocalizationContext";', `import { LocalizationProvider } from "@/app/context/LocalizationContext";\n${importsToAddSafe}`);
        }

        // 2. Add Components to JSX
        // Structure:
        // <Providers>
        //   <Header />
        //   {children}
        //   <Footer />
        //   <Toaster ... />
        // </Providers>

        if (!content.includes('<Header />')) {
            content = content.replace('{children}', `<Header />\n            {children}`);
        }

        if (!content.includes('<Footer />')) {
            content = content.replace('<Toaster', `<Footer />\n            <Toaster`);
        }

        fs.writeFileSync(filePath, content);
        console.log("Successfully updated layout.tsx with Header and Footer.");
    } else {
        console.error("File not found at:", filePath);
    }
} catch (e) {
    console.error("Error:", e);
}
