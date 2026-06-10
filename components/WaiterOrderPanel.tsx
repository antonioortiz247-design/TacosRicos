'use client';

import { useMemo, useState } from 'react';
import { Check, Minus, Plus, Send, Trash2, UserRound } from 'lucide-react';
import { createOrder } from '@/lib/actions';
import { calculateTacoPrice } from '@/lib/pricing';
import { CartItem, Product, TacoConfig } from '@/lib/types';

const sectionTitles: Record<Product['category'], string> = {
  tacos: '🌮 Tacos',
  especialidades: '🌯 Especialidades',
  viernes: '🍤 Viernes',
  miercoles: '🥔 Miércoles',
  jueves: '🐟 Jueves'
};

const proteinOptions = ['Barriga', 'Suadero', 'Pechuga', 'Longaniza', 'Chile relleno', 'Campechano', 'Chorizo argentino', 'Chuleta'];

const PRODUCT_IMAGE_FILE_NAMES: Partial<Record<string, string>> = {
  Barriga: 'TacodeBarriga.jpg',
  Suadero: 'TacodeSuadero.png',
  Pechuga: 'TacodePechuga.jpg',
  Longaniza: 'TacodeLonganiza.jpg',
  'Chile Relleno': 'TacodeChile.jpg',
  Campechanos: 'TacoCampechano.jpg',
  'Chorizo Argentino': 'TacoArgentino.jpg',
  Chuleta: 'TacodeChuleta.jpg',
  Burrito: 'TacodePechuga.png',
  Gringas: 'TacodeSuadero.png'
};

function getProductImageUrl(product?: Product | null): string | undefined {
  if (!product) return undefined;
  if (product.imageUrl?.trim()) return product.imageUrl;
  const fileName = PRODUCT_IMAGE_FILE_NAMES[product.name]?.trim();
  if (!fileName) return undefined;
  return fileName.startsWith('/') ? fileName : `/${fileName}`;
}

function getItemImageUrl(item: CartItem): string | undefined {
  const candidate = (item as any)?.imageUrl;
  if (typeof candidate === 'string' && candidate.trim()) return candidate;
  const fileName = PRODUCT_IMAGE_FILE_NAMES[item.productName]?.trim();
  if (!fileName) return undefined;
  return fileName.startsWith('/') ? fileName : `/${fileName}`;
}

function formatItemConfig(config?: TacoConfig) {
  if (!config) return 'Sin observaciones';
  const notes = config.notes?.trim();
  const base = config.protein ? config.protein : `${config.tortilla} · ${config.extras.join(', ') || 'sin extras'}`;
  return notes ? `${base} · Obs: ${notes}` : base;
}

function getWaiterStorageKey(businessId: string) {
  return `tu-restaurante-waiter:${businessId}`;
}

export function WaiterOrderPanel({
  products,
  businessId,
  businessName,
  waiters
}: {
  products: Product[];
  businessId: string;
  businessName: string;
  waiters: string[];
}) {
  const [selectedWaiter, setSelectedWaiter] = useState(() => {
    if (typeof window === 'undefined') return waiters[0] ?? '';
    return window.localStorage.getItem(getWaiterStorageKey(businessId)) || waiters[0] || '';
  });
  const [tableReference, setTableReference] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [tortilla, setTortilla] = useState<TacoConfig['tortilla']>('maiz');
  const [extras, setExtras] = useState<TacoConfig['extras']>([]);
  const [protein, setProtein] = useState(proteinOptions[0]);
  const [itemNotes, setItemNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const groupedProducts = useMemo(
    () =>
      Object.keys(sectionTitles).map((key) => ({
        key: key as Product['category'],
        label: sectionTitles[key as Product['category']],
        items: products.filter((product) => product.active && product.category === key && (product.stock === undefined || product.stock > 0))
      })),
    [products]
  );

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const canSubmit = selectedWaiter.trim().length > 0 && tableReference.trim().length > 0 && items.length > 0 && !isSubmitting;
  const canSelectProtein = selectedProduct?.category === 'especialidades' && (selectedProduct.name === 'Burrito' || selectedProduct.name === 'Gringas');
  const unitPrice = selectedProduct
    ? canSelectProtein
      ? selectedProduct.price
      : calculateTacoPrice({ tortilla, extras, notes: itemNotes }, selectedProduct.price)
    : 0;

  const resetItemForm = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setTortilla('maiz');
    setExtras([]);
    setProtein(proteinOptions[0]);
    setItemNotes('');
  };

  const handleSelectWaiter = (waiter: string) => {
    setSelectedWaiter(waiter);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getWaiterStorageKey(businessId), waiter);
    }
  };

  const handleAddItem = () => {
    if (!selectedProduct) return;

    const config: TacoConfig = {
      tortilla: canSelectProtein ? 'maiz' : tortilla,
      extras: canSelectProtein ? [] : extras,
      protein: canSelectProtein ? protein : undefined,
      notes: itemNotes.trim() || undefined
    };

    const subtotal = unitPrice * quantity;
    const imageUrl = getProductImageUrl(selectedProduct);
    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity,
        config,
        unitPrice,
        subtotal,
        imageUrl
      }
    ]);
    resetItemForm();
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    const result = await createOrder({
      businessId,
      items,
      total: subtotal,
      deliveryType: 'dine_in',
      address: tableReference.trim(),
      address_references: [`Mesero: ${selectedWaiter}`, orderNotes.trim()].filter(Boolean).join(' · '),
      paymentMethod: 'cash'
    });

    if (result.success) {
      alert('Comanda enviada a cocina.');
      setItems([]);
      setTableReference('');
      setOrderNotes('');
    } else {
      alert(result.error || 'No se pudo enviar la comanda.');
    }

    setIsSubmitting(false);
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.8fr)]">
      <div className="space-y-4">
        <div className="surface-card p-4">
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Toma de comandas</h2>
          <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Solo este apartado envía pedidos del local a cocina para {businessName}. El menú público conserva el flujo normal por WhatsApp.
          </p>
        </div>

        {groupedProducts.map((group) =>
          group.items.length > 0 ? (
            <section key={group.key} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="section-title text-lg sm:text-xl">{group.label}</h3>
                <span className="pill bg-amber-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200">{group.items.length}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="surface-card flex items-center justify-between gap-3 p-4 text-left transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {getProductImageUrl(product) ? (
                        <img
                          src={getProductImageUrl(product)}
                          alt={product.name}
                          className="h-12 w-12 shrink-0 rounded-xl border border-zinc-100 object-cover dark:border-zinc-800"
                        />
                      ) : (
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-zinc-100 bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/70">
                          Sin
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">{product.name}</p>
                        {product.description ? <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{product.description}</p> : null}
                      </div>
                    </div>
                    <span className="shrink-0 text-xl font-black text-orange-600 dark:text-orange-400">${product.price}</span>
                  </button>
                ))}
              </div>
            </section>
          ) : null
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-[92px] lg:self-start">
        <div className="surface-card space-y-3 p-4">
          <div className="flex items-center gap-2">
            <UserRound className="text-orange-600" size={20} />
            <h3 className="section-title">Mesero</h3>
          </div>
          <select value={selectedWaiter} onChange={(event) => handleSelectWaiter(event.target.value)} className="input-field" aria-label="Seleccionar mesero">
            {waiters.map((waiter) => (
              <option key={waiter} value={waiter}>
                {waiter}
              </option>
            ))}
          </select>
          <input value={tableReference} onChange={(event) => setTableReference(event.target.value)} placeholder="Mesa, barra o cliente" className="input-field" />
          <textarea value={orderNotes} onChange={(event) => setOrderNotes(event.target.value)} placeholder="Notas generales de la orden" className="input-field min-h-20 resize-none" />
        </div>

        <div className="surface-card space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h3 className="section-title">Comanda</h3>
            <span className="pill bg-amber-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200">{items.length} items</span>
          </div>

          {items.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-200 p-4 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              Agrega productos para enviar la comanda a cocina.
            </p>
          ) : (
            <ul className="max-h-80 space-y-2 overflow-auto pr-1">
              {items.map((item) => (
                <li key={item.id} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      {getItemImageUrl(item) ? (
                        <img
                          src={getItemImageUrl(item)}
                          alt={item.productName}
                          className="h-10 w-10 shrink-0 rounded-xl border border-zinc-100 object-cover dark:border-zinc-800"
                        />
                      ) : (
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-zinc-100 bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/70">
                          Sin
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-black text-zinc-900 dark:text-zinc-100">
                          {item.quantity}× {item.productName}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">{formatItemConfig(item.config)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-orange-600 dark:text-orange-400">${item.subtotal}</p>
                      <button onClick={() => setItems((current) => current.filter((currentItem) => currentItem.id !== item.id))} className="mt-1 text-xs font-bold text-rose-600">
                        <Trash2 size={13} className="inline" /> Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/70">
            <p className="flex justify-between text-base font-black text-zinc-900 dark:text-zinc-100">
              <span>Total</span>
              <span>${subtotal}</span>
            </p>
          </div>

          <button onClick={handleSubmit} disabled={!canSubmit} className={`primary-btn w-full justify-center ${canSubmit ? '' : 'pointer-events-none bg-slate-400 hover:bg-slate-400'}`}>
            <Send size={18} /> {isSubmitting ? 'Enviando...' : 'Enviar comanda a cocina'}
          </button>
          {!selectedWaiter ? <p className="text-xs text-amber-600">Selecciona el usuario/mesero que toma la orden.</p> : null}
          {!tableReference.trim() ? <p className="text-xs text-amber-600">Indica mesa, barra o nombre del cliente.</p> : null}
        </div>
      </aside>

      {selectedProduct ? (
        <div className="fixed inset-0 z-30 grid place-items-end bg-slate-950/50 p-2 sm:place-items-center">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">{selectedProduct.name}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Agrega observaciones específicas para este producto.</p>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-200">Cantidad</label>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="secondary-btn px-3 py-2">
                    <Minus size={16} />
                  </button>
                  <span className="min-w-10 text-center text-lg font-black">{quantity}</span>
                  <button onClick={() => setQuantity((value) => value + 1)} className="secondary-btn px-3 py-2">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {!canSelectProtein ? (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-200">Tortilla</label>
                    <div className="mt-2 flex gap-2">
                      {(['maiz', 'harina'] as const).map((option) => (
                        <button
                          key={option}
                          onClick={() => setTortilla(option)}
                          className={`secondary-btn px-3 py-1.5 capitalize ${tortilla === option ? 'border-orange-300 bg-amber-100 text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/15 dark:text-orange-200' : ''}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-200">Extras</label>
                    <div className="mt-2 flex gap-2">
                      {(['queso', 'papas'] as const).map((extra) => (
                        <button
                          key={extra}
                          onClick={() => setExtras((current) => (current.includes(extra) ? current.filter((item) => item !== extra) : [...current, extra]))}
                          className={`secondary-btn px-3 py-1.5 capitalize ${extras.includes(extra) ? 'border-orange-300 bg-amber-100 text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/15 dark:text-orange-200' : ''}`}
                        >
                          {extra}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200">Ingrediente</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {proteinOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => setProtein(option)}
                        className={`secondary-btn px-3 py-1.5 ${protein === option ? 'border-orange-300 bg-amber-100 text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/15 dark:text-orange-200' : ''}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <textarea value={itemNotes} onChange={(event) => setItemNotes(event.target.value)} placeholder="Observaciones del producto (sin cebolla, bien dorado, etc.)" className="input-field min-h-24 resize-none" />
            </div>

            <div className="mt-5 flex items-center justify-between gap-2">
              <span className="text-lg font-bold text-orange-700 dark:text-amber-200">${unitPrice * quantity}</span>
              <div className="flex items-center gap-2">
                <button onClick={resetItemForm} className="secondary-btn px-3 py-2 text-sm">
                  Cerrar
                </button>
                <button onClick={handleAddItem} className="primary-btn px-3 py-2 text-sm">
                  <Check size={16} /> Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
