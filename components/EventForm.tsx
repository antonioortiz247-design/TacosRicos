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
      <h3 className="font-semibold">Eventos privados</h3>
      {Object.keys(initial).map((field) => (
        <input
          key={field}
          placeholder={field}
          className="w-full rounded-lg border p-2"
          value={values[field as keyof typeof initial]}
          onChange={(e) => setValues((prev) => ({ ...prev, [field]: e.target.value }))}
        />
      ))}
      <button className="w-full rounded-lg bg-warm-500 px-3 py-2 font-semibold text-white">Enviar por WhatsApp</button>
    </form>
  );
}
