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
    <form onSubmit={onSubmit} className="surface-card space-y-3 p-5">
      <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">Reservar evento 🎉</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">Completa tus datos y te responderemos por WhatsApp para confirmar detalles.</p>

      <div className="grid gap-2 sm:grid-cols-2">
        <input required placeholder="Nombre" className="input-field" value={values.nombre} onChange={(e) => setValues((prev) => ({ ...prev, nombre: e.target.value }))} />
        <input required placeholder="Teléfono" className="input-field" value={values.telefono} onChange={(e) => setValues((prev) => ({ ...prev, telefono: e.target.value }))} />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <input required type="date" className="input-field" value={values.fecha} onChange={(e) => setValues((prev) => ({ ...prev, fecha: e.target.value }))} />
        <input required type="time" className="input-field" value={values.hora} onChange={(e) => setValues((prev) => ({ ...prev, hora: e.target.value }))} />
      </div>

      <input required placeholder="Dirección" className="input-field" value={values.direccion} onChange={(e) => setValues((prev) => ({ ...prev, direccion: e.target.value }))} />

      <div className="grid gap-2 sm:grid-cols-2">
        <input required type="number" placeholder="Personas" className="input-field" value={values.personas} onChange={(e) => setValues((prev) => ({ ...prev, personas: e.target.value }))} />
        <input required placeholder="Tipo de servicio" className="input-field" value={values.tipoServicio} onChange={(e) => setValues((prev) => ({ ...prev, tipoServicio: e.target.value }))} />
      </div>

      <input placeholder="Extras" className="input-field" value={values.extras} onChange={(e) => setValues((prev) => ({ ...prev, extras: e.target.value }))} />
      <textarea placeholder="Notas" className="input-field min-h-28 resize-none" value={values.notas} onChange={(e) => setValues((prev) => ({ ...prev, notas: e.target.value }))} />
      <button className="primary-btn w-full">Enviar por WhatsApp</button>
    </form>
  );
}
