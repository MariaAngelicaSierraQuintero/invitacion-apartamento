'use client'

import Link from 'next/link'

export default function Home() {
  const azul = '#001b3d'
  const dorado = '#F7DA82'

  return (
    <main
      className="min-h-screen flex justify-center items-stretch"
      style={{ backgroundColor: azul }}
    >
      <div
        className="w-full max-w-md flex flex-col justify-between px-6 pb-8 pt-10"
        style={{
          backgroundImage: "url('/grand-opening.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
      >
        {/* Capa para que el texto de abajo se lea mejor */}
        <div className="flex-1 flex flex-col justify-end bg-gradient-to-b from-transparent via-[#001b3d88] to-[#001b3d] -mx-6 -mb-8 px-6 pb-8 pt-24">
          <section className="space-y-3">
            <h1
              className="text-2xl font-semibold"
              style={{ color: dorado }}
            >
              Nuevo hogar, nuevas historias 🏡
            </h1>

            <p className="text-sm text-slate-100">
              Empiezo una nueva etapa de vida y quiero compartirla contigo.
              Elige el grupo que te corresponde para ver la fecha, la
              dirección y la lista de regalos.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/grupo/amigas"
                className="w-full text-center text-sm font-semibold py-2 rounded-full border transition active:scale-[0.97]"
                style={{
                  borderColor: dorado,
                  color: dorado,
                }}
              >
                Amigas
              </Link>

              <Link
                href="/grupo/familia"
                className="w-full text-center text-sm font-semibold py-2 rounded-full border transition active:scale-[0.97]"
                style={{
                  borderColor: dorado,
                  color: dorado,
                }}
              >
                Familia
              </Link>

              <Link
                href="/grupo/colegas"
                className="w-full text-center text-sm font-semibold py-2 rounded-full border transition active:scale-[0.97]"
                style={{
                  borderColor: dorado,
                  color: dorado,
                }}
              >
                Colegas
              </Link>
            </div>

            <div className="mt-5 text-xs space-y-1">
              <p style={{ color: dorado }}>
                📝 La lista de regalos es solo para evitar repetidos. Cada
                persona puede comprar donde prefiera.
              </p>
              <p className="text-[11px] text-slate-100">
                🎁 Si un regalo aparece como “Ya seleccionado”, es porque
                alguien más ya lo eligió.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
