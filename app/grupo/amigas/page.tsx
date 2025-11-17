'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

const DORADO = '#d4b761'

type ItemRow = {
  item_id: string
  name: string
  description: string | null
  image_url: string | null
  selection_id: string | null
  selected_by: string | null
  selected_at: string | null
}

export default function AmigasPage() {
  const [items, setItems] = useState<ItemRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('v_items_with_status')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setItems((data || []) as ItemRow[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const seleccionar = async (item: ItemRow) => {
    if (item.selection_id) return

    const ok = confirm('¿Quieres seleccionar este regalo?')
    if (!ok) return

    const nombre = (prompt('Tu nombre o familia (opcional)') || 'Invitado').trim()

    const { error } = await supabase
      .from('selections')
      .insert({ item_id: item.item_id, selected_by: nombre })

    if (error) {
      alert('Este regalo ya fue seleccionado por otra persona.')
      return
    }

    load()
  }

  return (
    <main className="relative min-h-screen w-full flex justify-center px-4 py-6">
      {/* Fondo fijo igual al de la home */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url('/home-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Contenido centrado (tarjeta + lista) */}
      <div className="w-full max-w-[480px] flex flex-col items-stretch gap-8 pb-10">
        {/* Tarjeta principal (como la tenías) */}
        <div className="relative w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/tarjeta-amigas.png"
            alt="Invitación amigas"
            className="w-full h-auto block"
          />

          <a
            href="https://maps.app.goo.gl/L96kErubJ4JBC2h78"
            target="_blank"
            className="
              absolute left-[12%] right-[12%] top-[69%] h-14
              flex items-center justify-center
              text-black text-lg font-semibold
            "
          >
            Ver en el mapa
          </a>
        </div>

        {/* Lista de regalos en un panel, sin tocar el fondo */}
        <section
          className="rounded-2xl p-5 mb-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
        >
          <h2
            className="text-center text-2xl font-bold mb-4"
            style={{ color: DORADO }}
          >
            Lista de regalos
          </h2>

          <p className="text-base text-slate-100 text-center mb-5 leading-relaxed font-medium">
  La lista es solo para evitar regalos repetidos. <br />
  Cada quien puede comprar donde prefiera.
</p>


          {loading ? (
            <p className="text-white text-center">Cargando...</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const seleccionado = !!item.selection_id

                return (
                  <li
                    key={item.item_id}
                    className="flex gap-4 p-4 rounded-xl"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: `1px solid ${DORADO}`,
                    }}
                  >
                    {/* Imagen grande */}
                    <div className="w-40 h-40 rounded-xl overflow-hidden shrink-0 bg-black/50">
                      {item.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Info del regalo */}
                    <div className="flex-1 text-white">
                      <p
                        className="text-lg font-semibold"
                        style={{ color: DORADO }}
                      >
                        {item.name}
                      </p>

                      {item.description && (
                        <p className="text-sm text-white/80">
                          {item.description}
                        </p>
                      )}

                      {!seleccionado ? (
                        <button
                          onClick={() => seleccionar(item)}
                          className="w-full mt-2 py-2 rounded-full text-black font-bold text-xs"
                          style={{ backgroundColor: DORADO }}
                        >
                          Seleccionar
                        </button>
                      ) : (
                        <p className="mt-2 text-xs text-slate-300">
                          Ya seleccionado
                          {item.selected_by ? ` por ${item.selected_by}` : ''}.
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
