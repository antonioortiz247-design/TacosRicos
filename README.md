# Tacos Ricos PWA

PWA mobile-first para taquerías con menú digital, carrito, delivery, pagos, eventos privados y panel admin.

## Stack

- Next.js 14 App Router
- Tailwind CSS
- Supabase
- Zustand
- next-pwa

## Rutas

- `/{negocio}/menu`
- `/admin/dashboard`
- `/admin/orders`
- `/admin/menu`
- `/admin/settings`

## Desarrollo

```bash
npm install
npm run dev
```

## Producción (Vercel)

1. Configurar variables de entorno de `.env.example`.
2. Crear tablas con `supabase/schema.sql`.
3. Deploy en Vercel con framework Next.js.

## Funciones incluidas

- Personalización de tacos con precio dinámico.
- Delivery por zonas y pedido mínimo configurable.
- Enlace de pedido por WhatsApp.
- Evento privado por WhatsApp.
- Webhook de pagos (Mercado Pago / Stripe mapping de estado).
- Estructura SaaS multi-negocio (`businesses`, `products`, `orders`).
- Base PWA (`manifest.json`, Service Worker con `next-pwa`).
