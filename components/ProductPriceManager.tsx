'use client';

import { useState, useMemo } from 'react';
import { updateProductPrice, seedProducts, createProduct } from '@/lib/actions';
import { Product, ProductCategory } from '@/lib/types';
import { Save, Loader2, DollarSign, CheckCircle2, Search, Filter, Tag, PlusCircle, X } from 'lucide-react';

export function ProductPriceManager({ products: initialProducts, businessId }: { products: Product[], businessId?: string }) {
  const [products, setProducts] = useState(initialProducts);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [searchTerm, setSearchBar] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isSeeding, setIsSeeding] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: 'tacos' as ProductCategory,
    description: ''
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;
    setIsAdding(true);
    try {
      const result = await createProduct({
        ...newProduct,
        businessId
      });
      if (result.success) {
        setProducts(prev => [...prev, result.product as any]);
        setIsAdding(false);
        setNewProduct({ name: '', price: 0, category: 'tacos', description: '' });
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsAdding(false);
    }
  };

  const handleSeed = async () => {
    console.log('Iniciando importación para businessId:', businessId);
    if (!businessId) {
      alert('Error: ID de negocio no encontrado. Revisa tus variables de entorno.');
      return;
    }
    setIsSeeding(true);
    try {
      const result = await seedProducts(businessId);
      console.log('Resultado de seed:', result);
      if (result.success) {
        alert('¡Menú importado con éxito! La página se recargará.');
        window.location.reload();
      } else {
        alert('Error al importar el menú: ' + result.error);
      }
    } catch (error) {
      console.error('Error en handleSeed:', error);
      alert('Error de conexión al intentar importar');
    } finally {
      setIsSeeding(false);
    }
  };

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats);
  }, [products]);

  const handlePriceChange = (id: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price: isNaN(price) ? 0 : price } : p));
  };

  const handleSave = async (id: string, price: number) => {
    if (price < 0) {
      alert('El precio no puede ser negativo');
      return;
    }
    
    setUpdatingId(id);
    setSuccessId(null);
    try {
      const result = await updateProductPrice(id, price);
      if (result.success) {
        setSuccessId(id);
        setTimeout(() => setSuccessId(null), 3000);
      } else {
        alert(`Error al actualizar el precio: ${result.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error inesperado de conexión');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const categoryLabels: Record<string, string> = {
    tacos: 'Tacos',
    especialidades: 'Especialidades',
    viernes: 'Viernes',
    miercoles: 'Miércoles',
    jueves: 'Jueves'
  };

  return (
    <section className="rounded-2xl border border-warm-100 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-warm-50 bg-warm-50/30 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
              <DollarSign size={22} className="text-emerald-600" />
              Editor de Precios
            </h2>
            <p className="text-sm text-zinc-500 mt-1">Actualiza los precios de tu menú en tiempo real</p>
          </div>
          <div className="flex items-center gap-2">
            {products.length === 0 && (
              <button 
                onClick={handleSeed}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSeeding ? <Loader2 className="animate-spin" size={16} /> : <PlusCircle size={16} />}
                Importar Menú Base
              </button>
            )}
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="inline-flex items-center gap-2 rounded-xl bg-warm-600 px-4 py-2 text-xs font-bold text-white hover:bg-warm-700"
            >
              {isAdding ? <X size={16} /> : <PlusCircle size={16} />}
              {isAdding ? 'Cerrar' : 'Añadir Producto'}
            </button>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
              {products.length} productos
            </span>
          </div>
        </div>
        
        {isAdding && (
          <form onSubmit={handleAddProduct} className="mb-6 rounded-xl border border-warm-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-800">
            <h3 className="mb-3 text-sm font-bold text-zinc-800 dark:text-zinc-200">Nuevo Producto</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <input 
                required
                placeholder="Nombre del producto"
                value={newProduct.name}
                onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                className="rounded-lg border border-warm-100 bg-warm-50/30 px-3 py-2 text-sm focus:border-warm-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input 
                required
                type="number"
                placeholder="Precio"
                value={newProduct.price || ''}
                onChange={e => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                className="rounded-lg border border-warm-100 bg-warm-50/30 px-3 py-2 text-sm focus:border-warm-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
              />
              <select
                value={newProduct.category}
                onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
                className="rounded-lg border border-warm-100 bg-warm-50/30 px-3 py-2 text-sm focus:border-warm-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="tacos">Tacos</option>
                <option value="especialidades">Especialidades</option>
                <option value="viernes">Viernes</option>
                <option value="miercoles">Miércoles</option>
                <option value="jueves">Jueves</option>
              </select>
              <button 
                type="submit"
                disabled={isAdding && !newProduct.name}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                Guardar Nuevo Producto
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchBar(e.target.value)}
              className="w-full rounded-xl border border-warm-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-warm-200 bg-white py-2.5 pl-10 pr-10 text-sm focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{categoryLabels[cat] || cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        <table className="w-full text-left text-sm border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm text-zinc-500 dark:bg-zinc-900/95">
            <tr>
              <th className="border-b border-warm-50 px-6 py-4 font-semibold dark:border-zinc-800">Producto</th>
              <th className="border-b border-warm-50 px-6 py-4 font-semibold text-right dark:border-zinc-800">Precio ($)</th>
              <th className="border-b border-warm-50 px-6 py-4 font-semibold text-center dark:border-zinc-800">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-50 dark:divide-zinc-800">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="group hover:bg-warm-50/30 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-warm-700 dark:group-hover:text-warm-400 transition-colors">
                      {product.name}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-zinc-400 mt-0.5">
                      <Tag size={10} />
                      {categoryLabels[product.category] || product.category}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center rounded-xl border-2 border-warm-100 bg-white focus-within:border-warm-500 focus-within:ring-2 focus-within:ring-warm-500/20 dark:border-zinc-700 dark:bg-zinc-800 transition-all shadow-sm">
                    <span className="pl-3 text-zinc-400 font-medium">$</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={product.price}
                      onChange={(e) => handlePriceChange(product.id, e.target.value)}
                      className="w-20 bg-transparent py-2 pr-3 text-right text-sm font-black text-zinc-900 focus:outline-none dark:text-zinc-100"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleSave(product.id, product.price)}
                    disabled={updatingId === product.id}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl min-w-[100px] px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 ${
                      successId === product.id
                        ? 'bg-emerald-500 text-white shadow-emerald-200'
                        : updatingId === product.id
                        ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        : 'bg-warm-600 text-white hover:bg-warm-700 hover:shadow-md'
                    }`}
                  >
                    {successId === product.id ? (
                      <CheckCircle2 size={16} />
                    ) : updatingId === product.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    <span>{successId === product.id ? 'OK' : updatingId === product.id ? '...' : 'Guardar'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-400">
            <div className="rounded-full bg-warm-50 p-4 mb-4 dark:bg-zinc-800">
              <Search size={32} className="text-zinc-300" />
            </div>
            <p className="text-sm font-medium">No se encontraron productos</p>
            {products.length === 0 ? (
              <div className="mt-4 max-w-xs mx-auto">
                <p className="text-xs mb-4">Parece que tu menú aún no está en la base de datos. ¿Quieres importar el menú predeterminado?</p>
                <button 
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-warm-600 px-4 py-3 text-sm font-bold text-white hover:bg-warm-700 disabled:opacity-50"
                >
                  {isSeeding ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
                  Importar Menú Base
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs mt-1">Prueba con otros filtros o términos de búsqueda</p>
                <button 
                  onClick={() => { setSearchBar(''); setCategoryFilter('all'); }}
                  className="mt-4 text-xs font-bold text-warm-600 hover:underline"
                >
                  Limpiar filtros
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
