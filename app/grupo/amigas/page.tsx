'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

type ItemRow = {
  item_id: string
  name: string
  description: string | null
  image_url: string | null
  selection_id: string | null
  selected_by: string | null
  selected_at: string | null
}

type GroupRow = {
  id: string
  slug: string
  title: string
  address: string
  map_url: string | null
  date: string    // 'YYYY-MM-DD'
  time: string    // 'HH:MM:SS'
}

export default function AmigasPage() {
  const [group, setGroup] = useState<GroupRow | null>(null)
  const [items, setItems] = useState<ItemRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)

    // 1) Traer datos del grupo "amigas"
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .select('*')
      .eq('slug', 'amigas')
      .maybeSingle()

    if (groupError || !groupData) {
      console.error('Error cargando grupo', groupError)
      setLoading(false)
      return
    }

    setGroup(groupData as GroupRow)

    // 2) Traer lista de regalos (global)
    const { data: itemsData, error: itemsError } = await supabase
      .from('v_items_with_status')
      .select('*')
      .order('name', { ascending: true })

    if (itemsError) {
      console.error('Error cargando items', itemsError)
      setLoading(false)
      return
    }

    setItems((itemsData || []) as ItemRow[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const seleccionar = async (item: ItemRow) => {
    if (item.selection_id) return

    const seguro = confirm(
      '¿Seguro que quieres seleccionar este regalo? No podrás cambiarlo.'
    )
    if (!seguro) return

    const nombre =
      (prompt('Tu nombre o familia (opcional)') || 'Invitado').trim()

    const { error } = await supabase
      .from('selections')
      .insert({ item_id: item.item_id, selected_by: nombre })

    if (error) {
      // 23505 = alguien lo seleccionó justo antes (unique constraint)
      if ((error as any).code === '23505') {
        alert('¡Ups! Alguien lo seleccionó un segundo antes. Elige otro 🙂')
      } else {
        console.error('Error al seleccionar', error)
        alert('No se pudo seleccionar. Intenta de nuevo.')
      }
      return
    }

    await load()
  }

  const formatDateTime = () => {
    if (!group) return ''
    const d = new Date(`${group.date}T${group.time}`)
    const fecha = d.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    const hora = d.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    })
    return `${fecha} · ${hora}`
  }

  if (loading && !group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <p>Cargando grupo...</p>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <p>No se encontró el grupo de amigas.</p>
      </div>
    )
  }

   return (
    <div className="min-h-screen bg-[#f7f1e8] text-slate-900 px-4 py-6 flex justify-center">
      <div className="w-full max-w-md">
        <header className="mb-5">
          <p className="text-xs uppercase tracking-[0.15em] text-[#b08950]">
            Inauguración de apartamento
          </p>
          <h1 className="text-2xl font-semibold text-[#1e3a8a]">
            {group.title}
          </h1>
          <p className="text-sm text-slate-700 mt-1">
            {formatDateTime()}
          </p>
          <p className="text-sm text-slate-700 flex flex-col mt-1">
            <span>{group.address}</span>
            {group.map_url && (
              <a
                href={group.map_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#1e3a8a] underline mt-1 w-fit"
              >
                Ver ubicación en Google Maps
              </a>
            )}
          </p>

          <p className="text-sm text-slate-700 mt-4">
            Empiezo una nueva etapa de vida y me hace mucha ilusión que me
            acompañes. 💛
          </p>
          <p className="text-xs text-slate-600 mt-1">
            La lista es solo para <b>evitar regalos repetidos</b>. 
            Cada quien puede elegir <b>dónde comprarlo</b>.
          </p>
        </header>

        {loading ? (
          <p className="text-sm text-slate-700">Cargando regalos...</p>
        ) : (
          <ul className="space-y-3">
            {items.map((it) => {
              const selected = !!it.selection_id

              return (
                <li
                  key={it.item_id}
                  className={`rounded-2xl border p-3 bg-white shadow-sm flex gap-3 ${
                    selected ? 'opacity-60 border-[#e4d3b7]' : 'border-[#d8b97a]'
                  }`}
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#f1e5d4] flex-shrink-0">
                    {it.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={it.image_url}
                        alt={it.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-medium text-[#1e3a8a]">
                        {it.name}
                      </p>
                      {it.description && (
                        <p className="text-sm text-slate-700">
                          {it.description}
                        </p>
                      )}
                      {selected && (
                        <p className="mt-1 text-xs text-slate-600">
                          Seleccionado
                          {it.selected_by ? ` por ${it.selected_by}` : ''}.
                        </p>
                      )}
                    </div>

                    <div className="mt-2">
                      <button
                        onClick={() => seleccionar(it)}
                        disabled={selected}
                        className={`text-sm px-3 py-2 rounded-full border transition w-full ${
                          selected
                            ? 'cursor-not-allowed border-[#e4d3b7] bg-[#f5eee3] text-slate-500'
                            : 'border-[#d4af37] bg-white text-[#1e3a8a] active:scale-[0.97]'
                        }`}
                      >
                        {selected ? 'Ya seleccionado' : 'Seleccionar'}
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <footer className="mt-6 text-[11px] text-slate-600 text-center">
          Si te equivocas al elegir algo, me puedes escribir y lo actualizamos 🤍
        </footer>
      </div>
    </div>
  )
}
