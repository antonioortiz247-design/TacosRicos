'use client';

import { FormEvent, useState } from 'react';
import { getWhatsAppLink } from '@/lib/whatsapp';

const initial = {
  nombre: '',
  telefono: '',
  fecha: '',
  hora: '',
  direccion: '',
  personas: '',
  tipoServicio: '',
  extras: '',
  notas: ''
};

export function EventForm({ waPhone }: { waPhone: string }) {
  const [values, setValues] = useState(initial);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const text = `Solicitud Evento Privado\nNombre: ${values.nombre}\nTeléfono: ${values.telefono}\nFecha: ${values.fecha}\nHora: ${values.hora}\nDirección: ${values.direccion}\nPersonas: ${values.personas}\nTipo servicio: ${values.tipoServicio}\nExtras: ${values.extras}\nNotas: ${values.notas}`;
    window.location.href = getWhatsAppLink(waPhone, text);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-2 rounded-xl border border-warm-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="font-semibold">Reservar evento 🎉</h3>
      <input required placeholder="Nombre" className="w-full rounded-lg border p-2" value={values.nombre} onChange={(e) => setValues((prev) => ({ ...prev, nombre: e.target.value }))} />
      <input required placeholder="Teléfono" className="w-full rounded-lg border p-2" value={values.telefono} onChange={(e) => setValues((prev) => ({ ...prev, telefono: e.target.value }))} />
      <input required type="date" className="w-full rounded-lg border p-2" value={values.fecha} onChange={(e) => setValues((prev) => ({ ...prev, fecha: e.target.value }))} />
      <input required type="time" className="w-full rounded-lg border p-2" value={values.hora} onChange={(e) => setValues((prev) => ({ ...prev, hora: e.target.value }))} />
      <input required placeholder="Dirección" className="w-full rounded-lg border p-2" value={values.direccion} onChange={(e) => setValues((prev) => ({ ...prev, direccion: e.target.value }))} />
      <input required type="number" placeholder="Personas" className="w-full rounded-lg border p-2" value={values.personas} onChange={(e) => setValues((prev) => ({ ...prev, personas: e.target.value }))} />
      <input required placeholder="Tipo de servicio" className="w-full rounded-lg border p-2" value={values.tipoServicio} onChange={(e) => setValues((prev) => ({ ...prev, tipoServicio: e.target.value }))} />
      <input placeholder="Extras" className="w-full rounded-lg border p-2" value={values.extras} onChange={(e) => setValues((prev) => ({ ...prev, extras: e.target.value }))} />
      <textarea placeholder="Notas" className="w-full rounded-lg border p-2" value={values.notas} onChange={(e) => setValues((prev) => ({ ...prev, notas: e.target.value }))} />
      <button className="w-full rounded-lg bg-warm-500 px-3 py-2 font-semibold text-white">Enviar por WhatsApp</button>
    </form>
  );
}
