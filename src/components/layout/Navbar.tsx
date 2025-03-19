import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { Button } from "../ui/button";

// ... existing imports ...

export function Navbar() {
  const { language, setLanguage } = useLanguage();
  
  // ... existing code ...

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Falomi</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
            className="flex items-center space-x-2"
          >
            <span>{language === "tr" ? "🇬🇧" : "🇹🇷"}</span>
            <span>{language === "tr" ? "English" : "Türkçe"}</span>
          </Button>
          {/* ... existing buttons ... */}
        </div>
      </div>
    </nav>
  );
} 