"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { fortuneTypes } from "@/types";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserNav } from "@/components/UserNav";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  
  const routes = Object.values(fortuneTypes);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <MobileNav routes={routes} pathname={pathname} />
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Falomi</span>
          </Link>
        </div>
        <nav className="hidden md:flex md:gap-6 md:text-sm md:font-medium">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={`transition-colors hover:text-foreground/80 ${
                pathname === route.path
                  ? "text-foreground"
                  : "text-foreground/60"
              }`}
            >
              {route.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {!isLoading && (
            <>
              {user ? (
                <UserNav />
              ) : (
                <AuthModal triggerText="Giriş Yap" />
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function MobileNav({
  routes,
  pathname,
}: {
  routes: (typeof fortuneTypes)[keyof typeof fortuneTypes][];
  pathname: string;
}) {
  const { user } = useAuth();
  
  return (
    <div className="px-2 py-4">
      <Link href="/" className="flex items-center space-x-2 pb-4">
        <span className="text-xl font-bold">Falomi</span>
      </Link>
      <div className="flex flex-col space-y-3">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={`transition-colors hover:text-foreground/80 ${
              pathname === route.path ? "text-foreground" : "text-foreground/60"
            }`}
          >
            {route.name}
          </Link>
        ))}
        
        <div className="pt-4">
          {!user ? (
            <AuthModal 
              triggerText="Giriş Yap / Kayıt Ol" 
              triggerVariant="outline" 
              className="w-full"
            />
          ) : (
            <div className="text-sm text-muted-foreground">
              {user.email} olarak giriş yapıldı
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 