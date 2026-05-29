import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Brain,
  BookOpen,
  Sparkles,
  Flower2,
  Users,
  Baby,
  Handshake,
  Layers,
  Scale,
  Sprout,
  Check,
  Star,
  Quote,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Facebook,
  Heart,
} from "lucide-react";

import heroBg from "@/assets/hero-bg.jpg";
import elianPortrait from "@/assets/elian-portrait.jpg";
import innerChild from "@/assets/inner-child.jpg";
import loveDog from "@/assets/love-dog.jpg";
import teaching from "@/assets/teaching.jpg";
import moonStars from "@/assets/moon-stars.jpg";

import { Navbar } from "@/components/site/Navbar";
import { Particles } from "@/components/site/Particles";
import { Reveal } from "@/components/site/Reveal";
import { ContactForm } from "@/components/site/ContactForm";

const WHATSAPP_URL = `https://wa.me/573132655265?text=${encodeURIComponent("Hola Eliána, me gustaría agendar una sesión de Constelaciones Familiares")}`;
const PHONE_DISPLAY = "+57 313 265 5265";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elian Angarita Julio · Psicóloga Infantil y Constelaciones Familiares" },
      {
        name: "description",
        content:
          "Psicóloga infantil, Magíster en Neuropsicología, experta en Psicopedagogía y Consteladora Familiar. Sanando vínculos, transformando vidas. Bogotá y sesiones online.",
      },
      { property: "og:title", content: "Elian Angarita Julio · Psicología y Constelaciones Familiares" },
      {
        property: "og:description",
        content: "Sanando vínculos, transformando vidas. Sesiones individuales, talleres y terapia infantil.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Elian Angarita Julio",
          jobTitle: "Psicóloga Infantil · Consteladora Familiar",
          telephone: "+573132655265",
          areaServed: "Colombia",
          description:
            "Psicóloga infantil, Magíster en Neuropsicología, experta en Psicopedagogía y Consteladora Familiar.",
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Principles />
        <UseCases />
        <Testimonials />
        <Gallery />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1280}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/85" />
      <Particles />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="inline-grid place-items-center w-20 h-20 rounded-full bg-gradient-gold text-primary-foreground font-serif text-3xl shadow-warm mb-8"
        >
          EA
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[1.05] text-balance text-foreground"
        >
          Elian Angarita Julio
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-5 text-base sm:text-lg tracking-[0.25em] uppercase text-primary"
        >
          Psicóloga Infantil · Constelaciones Familiares
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-8 font-serif italic text-2xl sm:text-3xl text-foreground/80 text-balance"
        >
          "Sanando vínculos, transformando vidas."
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#contacto"
            className="inline-flex items-center px-7 py-3.5 rounded-full bg-gradient-gold text-primary-foreground font-medium shadow-warm hover:scale-[1.03] active:scale-[0.99] transition"
          >
            Agenda tu sesión
          </a>
          <a
            href="#servicios"
            className="inline-flex items-center px-7 py-3.5 rounded-full border border-foreground/20 bg-background/40 backdrop-blur text-foreground/85 hover:bg-background/70 transition"
          >
            Conoce más
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- SOBRE MÍ ---------- */
const credentials = [
  { icon: GraduationCap, label: "Psicóloga Infantil" },
  { icon: Brain, label: "Magíster en Neuropsicología" },
  { icon: BookOpen, label: "Experta en Psicopedagogía" },
  { icon: Sparkles, label: "Consteladora Familiar Certificada" },
];

function About() {
  return (
    <section id="sobre-mi" className="relative py-24 sm:py-32 bg-gradient-warm">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-14 items-center">
        <Reveal className="order-2 lg:order-1">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Sobre mí</p>
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight text-balance">
            Acompañando tu proceso de sanación
          </h2>
          <p className="mt-6 text-foreground/75 leading-relaxed">
            Soy <strong className="text-foreground">Elian Angarita Julio</strong>, psicóloga infantil
            con maestría en neuropsicología y experta en psicopedagogía. Mi misión es guiarte en el
            descubrimiento y sanación de los patrones transgeneracionales que influyen en tu vida
            actual.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            {credentials.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl bg-card/70 backdrop-blur border border-border/60 px-4 py-3 shadow-soft"
              >
                <span className="grid place-items-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>

          <figure className="mt-10 overflow-hidden rounded-3xl shadow-warm group">
            <img
              src={teaching}
              alt="Dos niñas jugando en la playa al atardecer"
              loading="lazy"
              width={1280}
              height={1024}
              className="w-full h-64 object-cover group-hover:scale-[1.04] transition-transform duration-700"
            />
            <figcaption className="bg-card/90 backdrop-blur px-5 py-3 font-serif italic text-foreground/80">
              "Enseñar es acompañar con amor."
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.15} className="order-1 lg:order-2">
          <div className="relative max-w-md mx-auto">
            <div className="absolute -inset-4 bg-gradient-gold rounded-[2rem] opacity-30 blur-2xl" />
            <img
              src={elianPortrait}
              alt="Retrato de Elian Angarita Julio"
              width={1024}
              height={1280}
              loading="lazy"
              className="relative rounded-[2rem] shadow-warm w-full object-cover aspect-[4/5]"
            />
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl px-5 py-4 shadow-soft hidden sm:block">
              <p className="font-serif italic text-foreground/80">"Tu mereces vivir en paz"</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- SERVICIOS ---------- */
const services = [
  {
    icon: Flower2,
    title: "Sesiones Individuales",
    desc: "Trabajo personalizado en consultorio para abordar tus conflictos específicos.",
  },
  {
    icon: Users,
    title: "Talleres Grupales",
    desc: "Experiencia vivencial en grupo donde exploramos juntos tus vínculos familiares.",
  },
  {
    icon: Baby,
    title: "Terapia Infantil",
    desc: "Acompañamiento especializado para niños y adolescentes.",
  },
];

const steps = [
  { n: "01", title: "Entrevista previa", desc: "Conversación inicial de 30 minutos." },
  { n: "02", title: "Representación", desc: "Mapeo espacial del sistema familiar." },
  { n: "03", title: "Movimiento sanador", desc: "Proceso guiado con presencia y respeto." },
  { n: "04", title: "Integración", desc: "Cierre, seguimiento y acompañamiento posterior." },
];

function Services() {
  return (
    <section id="servicios" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Servicios</p>
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight text-balance">
            Constelaciones Familiares
          </h2>
          <p className="mt-4 text-lg text-foreground/75 italic font-serif">
            Una herramienta poderosa para sanar vínculos invisibles.
          </p>
          <p className="mt-6 text-foreground/75 leading-relaxed">
            Las constelaciones familiares son una técnica terapéutica desarrollada por Bert
            Hellinger que nos permite identificar y sanar dinámicas familiares ocultas y patrones
            transgeneracionales que afectan nuestro bienestar emocional y nuestras relaciones.
          </p>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <article className="h-full rounded-3xl bg-card border border-border/60 p-8 shadow-soft hover:shadow-warm transition-shadow group">
                <span className="grid place-items-center w-14 h-14 rounded-2xl bg-gradient-gold text-primary-foreground shadow-soft group-hover:scale-105 transition-transform">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-foreground/70 leading-relaxed">{desc}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <figure className="overflow-hidden rounded-3xl shadow-warm group">
              <img
                src={innerChild}
                alt="Niño sentado al borde del mar al atardecer"
                width={1024}
                height={1280}
                loading="lazy"
                className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <figcaption className="bg-card/90 backdrop-blur px-5 py-3 font-serif italic">
                "Sanar tu niño interior."
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.15}>
            <h3 className="font-serif text-3xl sm:text-4xl">¿Cómo funciona?</h3>
            <ol className="mt-8 space-y-5">
              {steps.map((s) => (
                <li key={s.n} className="flex gap-5">
                  <span className="font-serif text-3xl text-primary leading-none w-12 shrink-0">
                    {s.n}
                  </span>
                  <div>
                    <h4 className="font-medium">{s.title}</h4>
                    <p className="text-foreground/65 mt-1">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- PRINCIPIOS ---------- */
const principles = [
  {
    icon: Handshake,
    title: "Pertenencia",
    desc: "Todos tienen derecho a pertenecer al sistema familiar.",
  },
  {
    icon: Layers,
    title: "Jerarquía",
    desc: "Cada miembro ocupa su lugar natural en el sistema.",
  },
  {
    icon: Scale,
    title: "Equilibrio",
    desc: "Balance entre el dar y el recibir en las relaciones.",
  },
  {
    icon: Sprout,
    title: "Sanación",
    desc: "Reconocer para liberar patrones transgeneracionales.",
  },
];

function Principles() {
  return (
    <section id="principios" className="relative py-24 sm:py-32 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Órdenes del amor</p>
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight text-balance">
            Los pilares de las constelaciones
          </h2>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {principles.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <article className="h-full rounded-3xl bg-card/80 backdrop-blur border border-border/50 p-7 shadow-soft hover:-translate-y-1 hover:shadow-warm transition">
                <span className="grid place-items-center w-12 h-12 rounded-2xl bg-accent/40 text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-serif text-2xl">{title}</h3>
                <p className="mt-2 text-foreground/70 leading-relaxed text-sm">{desc}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <figure className="overflow-hidden rounded-3xl shadow-warm group max-w-5xl mx-auto">
            <img
              src={loveDog}
              alt="Niño abrazando con ternura a un perro"
              width={1024}
              height={1280}
              loading="lazy"
              className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <figcaption className="bg-card/90 backdrop-blur px-6 py-4 font-serif italic text-center text-foreground/80">
              "Él solo quiere amor, comprensión y seguridad."
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- USOS ---------- */
const uses = [
  "Conflictos familiares y de pareja",
  "Patrones repetitivos de fracaso",
  "Depresión, ansiedad, miedos inexplicables",
  "Dificultades en la crianza",
  "Traumas transgeneracionales",
  "Bloqueos laborales o económicos",
  "Enfermedades psicosomáticas",
  "Duelos no resueltos",
];

function UseCases() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Indicaciones</p>
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight text-balance">
            ¿Cuándo recomendar Constelaciones?
          </h2>
        </Reveal>

        <ul className="mt-12 grid sm:grid-cols-2 gap-4">
          {uses.map((u, i) => (
            <Reveal key={u} delay={i * 0.05}>
              <li className="flex items-start gap-3 rounded-2xl bg-card border border-border/60 px-5 py-4 shadow-soft">
                <span className="grid place-items-center w-7 h-7 rounded-full bg-accent/50 text-accent-foreground shrink-0 mt-0.5">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-foreground/80">{u}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- TESTIMONIOS ---------- */
const testimonials = [
  {
    name: "María C.",
    role: "Bogotá",
    text: "El proceso con Elian transformó la relación con mi madre. Hoy hay paz donde antes solo había dolor.",
  },
  {
    name: "Andrés P.",
    role: "Online",
    text: "Llegué con una ansiedad que no entendía. Las constelaciones me mostraron una historia familiar que llevaba sin saberlo.",
  },
  {
    name: "Laura M.",
    role: "Medellín",
    text: "El acompañamiento con mi hijo fue cálido, profesional y profundo. Nos devolvió la armonía en casa.",
  },
];

function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-warm">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Historias</p>
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight text-balance">
            Historias de transformación
          </h2>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <article className="h-full rounded-3xl bg-card border border-border/60 p-8 shadow-soft">
                <Quote className="h-7 w-7 text-primary/70" />
                <p className="mt-4 text-foreground/80 leading-relaxed italic">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="grid place-items-center w-11 h-11 rounded-full bg-gradient-gold text-primary-foreground font-serif">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- GALERÍA ---------- */
const gallery = [
  { src: innerChild, quote: "Sanar tu niño interior", className: "row-span-2" },
  { src: loveDog, quote: "Él solo quiere amor, comprensión y seguridad", className: "" },
  { src: teaching, quote: "Enseñar es acompañar con amor", className: "" },
  { src: moonStars, quote: "Enseñar es encender estrellas", className: "row-span-2" },
];

function Gallery() {
  return (
    <section id="galeria" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Inspiración</p>
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight text-balance">
            Frases que abrazan el alma
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 auto-rows-[220px] gap-4">
          {gallery.map((g, i) => (
            <Reveal key={i} delay={i * 0.08} className={g.className}>
              <figure className="relative h-full overflow-hidden rounded-3xl shadow-soft group">
                <img
                  src={g.src}
                  alt={g.quote}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent opacity-70 group-hover:opacity-95 transition-opacity" />
                <figcaption className="absolute bottom-0 inset-x-0 p-5 text-background font-serif italic text-lg translate-y-2 group-hover:translate-y-0 transition-transform">
                  "{g.quote}"
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- BLOG ---------- */
const posts = [
  {
    title: "¿Qué son las constelaciones familiares?",
    desc: "Una introducción a esta poderosa herramienta terapéutica desarrollada por Bert Hellinger.",
  },
  {
    title: "Sanando al niño interior",
    desc: "Cómo reconocer y abrazar las heridas de la infancia para vivir con plenitud.",
  },
  {
    title: "Patrones transgeneracionales",
    desc: "Cuando lo que cargamos no es nuestro: identificar lealtades invisibles.",
  },
];

function Blog() {
  return (
    <section className="py-24 sm:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Recursos</p>
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight text-balance">
            Recursos para tu crecimiento
          </h2>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <article className="h-full rounded-3xl bg-card border border-border/60 overflow-hidden shadow-soft hover:shadow-warm transition group">
                <div className="h-44 bg-gradient-gold relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(1_0_0_/0.3),transparent_60%)]" />
                </div>
                <div className="p-7">
                  <h3 className="font-serif text-xl leading-snug group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-foreground/70 text-sm leading-relaxed">{p.desc}</p>
                  <span className="mt-5 inline-block text-sm font-medium text-primary">
                    Próximamente →
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CONTACTO ---------- */
function Contact() {
  return (
    <section id="contacto" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-sunset opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-14">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Contacto</p>
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight text-balance">
            Comienza tu proceso de sanación
          </h2>
          <p className="mt-4 text-lg text-foreground/75">Estoy aquí para acompañarte.</p>

          <ul className="mt-10 space-y-4">
            <li>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl bg-card/80 backdrop-blur border border-border/60 px-5 py-4 shadow-soft hover:shadow-warm transition"
              >
                <span className="grid place-items-center w-12 h-12 rounded-full bg-accent text-accent-foreground">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">WhatsApp</p>
                  <p className="font-medium">{PHONE_DISPLAY}</p>
                </div>
              </a>
            </li>
            <li>
              <div className="flex items-center gap-4 rounded-2xl bg-card/80 backdrop-blur border border-border/60 px-5 py-4 shadow-soft">
                <span className="grid place-items-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Email</p>
                  <p className="font-medium">contacto@elianangarita.com</p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex items-center gap-4 rounded-2xl bg-card/80 backdrop-blur border border-border/60 px-5 py-4 shadow-soft">
                <span className="grid place-items-center w-12 h-12 rounded-full bg-primary/15 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Ubicación</p>
                  <p className="font-medium">Bogotá, Colombia · Sesiones online</p>
                </div>
              </div>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="rounded-3xl bg-card border border-border/60 p-8 sm:p-10 shadow-warm">
            <h3 className="font-serif text-2xl">Escríbeme</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Cuéntame brevemente cómo puedo acompañarte.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-11 h-11 rounded-full bg-gradient-gold text-primary-foreground font-serif">
              EA
            </span>
            <p className="font-serif text-xl">Elian Angarita Julio</p>
          </div>
          <p className="mt-4 text-background/70 text-sm leading-relaxed max-w-xs">
            Psicóloga infantil · Magíster en Neuropsicología · Consteladora Familiar.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-background/60 mb-4">Enlaces</p>
          <ul className="space-y-2 text-background/80 text-sm">
            <li><a href="#sobre-mi" className="hover:text-primary transition">Sobre mí</a></li>
            <li><a href="#servicios" className="hover:text-primary transition">Servicios</a></li>
            <li><a href="#principios" className="hover:text-primary transition">Principios</a></li>
            <li><a href="#contacto" className="hover:text-primary transition">Contacto</a></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-background/60 mb-4">Sígueme</p>
          <div className="flex gap-3">
            <a aria-label="Instagram" href="#" className="grid place-items-center w-10 h-10 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition">
              <Instagram className="h-4 w-4" />
            </a>
            <a aria-label="Facebook" href="#" className="grid place-items-center w-10 h-10 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition">
              <Facebook className="h-4 w-4" />
            </a>
            <a aria-label="WhatsApp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="grid place-items-center w-10 h-10 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition">
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-background/15 mx-auto max-w-7xl px-6 flex flex-col sm:flex-row gap-3 items-center justify-between text-sm text-background/60">
        <p>© 2026 Elian Angarita Julio. Todos los derechos reservados.</p>
        <p className="flex items-center gap-1.5 font-serif italic">
          Tu mereces vivir en paz <Heart className="h-4 w-4 text-primary fill-current" />
        </p>
      </div>
    </footer>
  );
}

/* ---------- WhatsApp flotante ---------- */
function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid place-items-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-warm hover:scale-110 active:scale-95 transition-transform"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366]/40 -z-10" />
    </a>
  );
}
