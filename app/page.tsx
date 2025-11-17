'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main
      className="min-h-screen w-full flex justify-center items-center px-4"
      style={{
        backgroundImage: "url('/home-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Ajusta aquí el tamaño máximo de tu tarjeta */}
      <div className="relative w-full max-w-[480px]">

        {/* Tarjeta principal */}
        <img
          src="/home-card.png"
          alt="Invitación inauguración"
          className="w-full h-auto block"
        />

        {/* BOTONES (ajustados) */}
        {/* Botón 1 */}
        <Link
          href="/grupo/amigas"
          className="
            absolute 
            left-[12%] 
            right-[12%] 
            top-[45%]        /* Ajustar si lo quieres más arriba/abajo */
            h-[60px] 
            flex items-center justify-center
           text-black text-2xl font-semibold tracking-wide

          "
        >
          Amigas
        </Link>

        {/* Botón 2 */}
        <Link
          href="/grupo/familia"
          className="
            absolute 
            left-[12%] 
            right-[12%] 
            top-[55%]        /* Ajustar para coincidir con la barra */
            h-[60px]
            flex items-center justify-center
           text-black text-2xl font-semibold tracking-wide

          "
        >
          Familia
        </Link>

        {/* Botón 3 */}
        <Link
          href="/grupo/colegas"
          className="
            absolute 
            left-[12%] 
            right-[12%] 
            top-[66%]        /* Ajustar según necesites */
            h-[60px]
            flex items-center justify-center
           text-black text-2xl font-semibold tracking-wide

          "
        >
          Colegas
        </Link>

      </div>
    </main>
  )
}
