# Tacos Ricos PWA

PWA mobile-first para taquería con pedidos por WhatsApp, personalización de tacos, delivery, pagos y panel del dueño.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (DB + Auth + Realtime)
- next-pwa

## Rutas principales

- `/{negocio}/menu`
- `/{negocio}/eventos`
- `/admin/dashboard`
- `/admin/orders`
- `/admin/menu`
- `/admin/settings`

## Instalación

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variables de entorno

> Seguridad: **no** subas tus keys reales al repositorio. Cárgalas solo en `.env.local` y en variables de entorno de Vercel.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_DEFAULT_BUSINESS_ID` (UUID de `businesses.id`)
- `NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG` (fallback legible; opcional)
- `MERCADO_PAGO_ACCESS_TOKEN`
- `NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY`
- `NEXT_PUBLIC_WA_PHONE`

## Deploy en Vercel

1. Crear proyecto en Vercel.
2. Cargar variables de entorno.
3. Ejecutar SQL de `supabase/schema.sql`.
4. Deploy.

## Entregable

- Menú exacto por secciones solicitadas.
- Personalización de tacos con precio dinámico.
- Carrito sin pedido mínimo.
- Delivery por zonas con dirección y referencias.
- Pago con efectivo, transferencia y tarjeta (Mercado Pago).
- Dashboard dueño y panel de pedidos.
- PWA instalable con `manifest` + `next-pwa`.
