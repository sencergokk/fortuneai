"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, Stars, Star } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { fortuneTypes } from "@/types";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserNav } from "@/components/UserNav";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

// Navbar için animasyon varyantları
const navbarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 }
};

export function Navbar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  
  const routes = Object.values(fortuneTypes);

  return (
    <motion.header 
      className="sticky top-0 z-40 w-full border-b border-pink-200/30 dark:border-pink-900/20 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60"
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      {/* Top decorative border */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-fuchsia-500/30 via-violet-500 to-fuchsia-500/30" />
      
      <div className="container flex h-16 items-center justify-between relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-10 text-fuchsia-400/10 dark:text-fuchsia-400/5 text-2xl">✨</div>
        
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden border-pink-200 dark:border-pink-900/30 hover:bg-pink-50 dark:hover:bg-pink-900/20">
                <Menu className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 border-r border-pink-200 dark:border-pink-900/30 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md">
              <MobileNav routes={routes} pathname={pathname} />
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2 relative group">
            <div className="absolute -inset-x-4 -inset-y-2 rounded-lg bg-gradient-to-r from-pink-100/10 to-violet-100/10 dark:from-pink-900/10 dark:to-violet-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-violet-600 group-hover:from-fuchsia-600 group-hover:to-violet-700 transition-all duration-300">
              <Sparkles className="h-5 w-5 inline-block mr-1 text-pink-500" /> Falomi
            </span>
          </Link>
        </div>
        
        <motion.nav 
          className="hidden md:flex md:gap-6 md:text-sm md:font-medium"
          variants={navbarVariants}
        >
          {routes.map((route, index) => (
            <motion.div key={route.path} variants={itemVariants} custom={index}>
              <Link
                href={route.path}
                className={`relative group transition-colors hover:text-foreground/80 ${
                  pathname === route.path
                    ? "text-fuchsia-600 dark:text-fuchsia-400 font-semibold"
                    : "text-foreground/60"
                }`}
              >
                <div className="absolute -inset-x-3 -inset-y-2 rounded-md bg-pink-50 dark:bg-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">{route.name}</span>
                {pathname === route.path && (
                  <motion.div 
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-full"
                    layoutId="navUnderline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </motion.nav>
        
        <motion.div 
          className="flex items-center gap-3"
          variants={navbarVariants}
        >
          <motion.div variants={itemVariants}>
            <ThemeToggle />
          </motion.div>
          
          {!isLoading && (
            <motion.div variants={itemVariants}>
              {user ? (
                <UserNav />
              ) : (
                <AuthModal 
                  triggerText="Giriş Yap" 
                  className="bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 text-white transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-fuchsia-500/20"
                />
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.header>
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
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-violet-600">
          <Sparkles className="h-5 w-5 inline-block mr-1 text-pink-500" /> Falomi
        </span>
      </Link>
      
      <div className="flex flex-col space-y-4 mt-2">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={cn(
              "transition-all duration-300 hover:translate-x-1 flex items-center gap-2 py-1 px-2 rounded-md",
              pathname === route.path 
                ? "text-fuchsia-600 dark:text-fuchsia-400 bg-pink-50 dark:bg-pink-900/20 font-medium" 
                : "text-foreground/60 hover:text-foreground/80"
            )}
          >
            <div className="text-lg opacity-80">
              {route.icon}
            </div>
            {route.name}
            {pathname === route.path && <Star className="h-3 w-3 ml-auto text-violet-500" />}
          </Link>
        ))}
        
        <div className="border-t border-pink-100 dark:border-pink-900/20 pt-4 mt-2">
          {!user ? (
            <AuthModal 
              triggerText="Giriş Yap / Kayıt Ol" 
              triggerVariant="outline" 
              className="w-full bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 text-white transition-all duration-300"
            />
          ) : (
            <div className="text-sm bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/30 dark:to-purple-900/30 p-3 rounded-lg border border-pink-200/50 dark:border-pink-900/20">
              <div className="flex items-center gap-2">
                <Stars className="h-4 w-4 text-fuchsia-500" />
                <span className="font-medium">Giriş yapıldı</span>
              </div>
              <p className="text-muted-foreground mt-1 ml-6">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 