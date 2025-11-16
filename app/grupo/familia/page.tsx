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
  date: string
  time: string
}

export default function FamiliaPage() {
  const [group, setGroup] = useState<GroupRow | null>(null)
  const [items, setItems] = useState<ItemRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)

    // 1) Traer datos del grupo "familia"
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .select('*')
      .eq('slug', 'familia')
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
        <p>No se encontró el grupo de familia.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-yellow-50 text-slate-900 px-4 py-6 flex justify-center">
      <div className="w-full max-w-md">
        <header className="mb-5">
          <p className="text-xs uppercase tracking-wide text-slate-600">
            Inauguración de apartamento
          </p>
          <h1 className="text-2xl font-semibold text-indigo-900">
            {group.title}
          </h1>
          <p className="text-sm text-slate-700 mt-1">{formatDateTime()}</p>
          <p className="text-sm text-slate-700 flex flex-col mt-1">
            <span>{group.address}</span>
            {group.map_url && (
              <a
                href={group.map_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-700 underline mt-1 w-fit"
              >
                Ver en Google Maps
              </a>
            )}
          </p>

          <p className="text-sm text-slate-700 mt-3">
            Esta lista es para <b>evitar regalos repetidos</b>. Cada quien compra{' '}
            <b>donde prefiera</b>.
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
                  className={`rounded-xl border p-3 bg-white shadow-sm flex gap-3 ${
                    selected ? 'opacity-70 border-yellow-200' : 'border-yellow-300'
                  }`}
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    {it.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={it.image_url}
                        alt={it.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-indigo-900">{it.name}</p>
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

                    <div className="mt-2">
                      <button
                        onClick={() => seleccionar(it)}
                        disabled={selected}
                        className={`text-sm px-3 py-2 rounded-lg border transition ${
                          selected
                            ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                            : 'border-yellow-500 bg-white text-indigo-900 active:scale-[0.97]'
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

        <footer className="mt-6 text-xs text-slate-600">
          * Si te equivocas, avísanos y lo corregimos manualmente 😊
        </footer>
      </div>
    </div>
  )
}
