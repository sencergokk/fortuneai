export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} FortuneAI. Tüm hakları saklıdır.
        </p>
        <div className="flex gap-4">
          <a
            href="#"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Kullanım Şartları
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Gizlilik Politikası
          </a>
        </div>
      </div>
    </footer>
  );
} 