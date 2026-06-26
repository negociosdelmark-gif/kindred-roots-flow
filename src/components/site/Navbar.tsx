import { useEffect, useRef, useState } from "react";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#servicios", label: "Servicios" },
  { href: "#principios", label: "Principios" },
  { href: "#galeria", label: "Galería" },
  { href: "#contacto", label: "Contacto" },
];

const AMBIENT_TRACK =
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1718e49cce.mp3?filename=relaxing-mountains-rivers-streams-running-water-18178.mp3";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    try {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.volume = 0.25;
        await audioRef.current.play();
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/60 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <audio ref={audioRef} src={AMBIENT_TRACK} loop preload="none" />
      <nav className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        <a href="#inicio" className="flex items-center gap-2 group" aria-label="Inicio">
          <span className="grid place-items-center w-10 h-10 rounded-full bg-gradient-gold text-primary-foreground font-serif text-lg shadow-soft group-hover:scale-105 transition-transform">
            EA
          </span>
          <span className="hidden sm:block font-serif text-lg leading-tight">
            Dra. Eliana Angarita
            <span className="block text-[10px] tracking-[0.18em] uppercase text-muted-foreground font-sans">
              Psicóloga Clínica · Consteladora
            </span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-foreground/80 hover:text-primary transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMusic}
            aria-label={playing ? "Pausar música ambiental" : "Reproducir música ambiental"}
            className="rounded-full"
          >
            {playing ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <a
            href="#contacto"
            className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-gold text-primary-foreground text-sm font-medium shadow-soft hover:shadow-warm transition-shadow"
          >
            Agendar sesión
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden mx-6 mt-3 rounded-2xl border border-border bg-card shadow-soft p-5 animate-in fade-in slide-in-from-top-2">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block text-base text-foreground/85 hover:text-primary"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center items-center px-5 py-2.5 rounded-full bg-gradient-gold text-primary-foreground text-sm font-medium shadow-soft"
              >
                Agendar sesión
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
