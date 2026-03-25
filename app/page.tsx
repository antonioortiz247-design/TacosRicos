import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12 lg:py-24">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-orange-200/20 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-red-200/20 blur-[100px]" />

      <section className="z-10 w-full max-w-4xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-orange-700">
              <Star size={14} className="fill-orange-700" />
              Los mejores de la zona
            </div>
            
            <h1 className="text-5xl font-black tracking-tighter text-zinc-900 md:text-7xl lg:text-8xl">
              Tacos <br />
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Rico´s
              </span>
            </h1>
            
            <p className="mt-6 text-lg font-medium leading-relaxed text-zinc-600 md:text-xl">
              Pide rápido, personaliza cada taco y disfruta del auténtico sabor directo en tu puerta. 
              <span className="hidden md:inline"> La tradición que te mereces, a un clic de distancia.</span>
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row lg:justify-start">
              <Link href="/demo/menu" className="primary-btn text-lg group">
                Explorar Menú
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/admin/login" className="secondary-btn text-lg">
                Administración
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 border-t border-zinc-100 pt-8 lg:justify-start">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-black text-zinc-900">9:30 - 15:00</span>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                  <Clock size={12} /> Horario
                </span>
              </div>
              <div className="h-8 w-px bg-zinc-100" />
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-black text-zinc-900">Local & Domicilio</span>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                  <MapPin size={12} /> Servicio
                </span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[400px] lg:max-w-none">
            <div className="animate-float relative z-10 aspect-square overflow-hidden rounded-[3rem] border-8 border-white shadow-soft-xl">
              <Image 
                src="/logotacosricos.png" 
                alt="Logo Tacos Rico´s" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-[3rem] border-2 border-orange-100" />
            <div className="absolute -top-6 -left-6 -z-10 h-full w-full rounded-[3rem] bg-orange-50" />
          </div>
        </div>
      </section>

      <footer className="mt-24 text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
        © 2026 Tacos Rico´s · El auténtico sabor mexicano
      </footer>
    </main>
  );
}
