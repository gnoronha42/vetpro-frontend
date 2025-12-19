import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order } from '../types';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, CheckCircle, Package, Truck, Filter, AlertCircle } from 'lucide-react';
import { productService } from '../services/productService';

const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'success'>('cart');
  const [processing, setProcessing] = useState(false);
  
  // New States for API
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProducts();
    } else {
      setLoading(false);
      setError('Você precisa estar logado para ver os produtos.');
    }
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err: any) {
      console.error('Erro ao buscar produtos:', err);
      // Se for erro 401, não fazer nada (o interceptor já trata)
      if (err.response?.status !== 401) {
        setError('Não foi possível carregar os produtos. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout Logic
  const handleCheckout = () => {
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toLocaleDateString('pt-BR'),
        items: [...cart],
        total: cartTotal,
        status: 'Processando',
        paymentMethod: 'Cartão de Crédito'
      };
      setOrders([newOrder, ...orders]);
      setCart([]);
      setProcessing(false);
      setCheckoutStep('success');
    }, 2000);
  };

  const categories = ['Todos', 'Medicamento', 'Nutrição', 'Acessórios', 'Higiene'];

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Marketplace Veterinário</h2>
          <p className="text-gray-500">Compre medicamentos e insumos com facilidade</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'orders' ? 'bg-teal-100 text-teal-700' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Meus Pedidos
          </button>
          <button 
            onClick={() => { setActiveTab('catalog'); setIsCartOpen(true); }}
            className="relative bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Carrinho</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Buscar produtos..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto pr-2">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle className="text-red-500 mb-2" size={48} />
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={fetchProducts}
                  className="text-teal-600 hover:underline font-medium"
                >
                  Tentar novamente
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p>Nenhum produto encontrado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    <div className="h-48 overflow-hidden bg-gray-50 flex items-center justify-center relative group">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      ) : (
                        <div className="text-gray-300">Sem imagem</div>
                      )}
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-600">
                        Estoque: {product.stock}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded uppercase tracking-wide">{product.category}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{product.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold text-gray-900">R$ {Number(product.price).toFixed(2)}</span>
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Orders View */
        <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Package size={24} className="text-teal-600"/>
            Histórico de Pedidos
          </h3>
          
          {orders.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Package size={64} className="mx-auto mb-4 opacity-20" />
              <p>Você ainda não realizou nenhum pedido.</p>
              <button onClick={() => setActiveTab('catalog')} className="mt-4 text-teal-600 hover:underline">Voltar para a loja</button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-gray-900">{order.id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          order.status === 'Processando' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Enviado' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{order.date} • {order.items.length} itens</p>
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <p className="font-bold text-lg text-gray-900">R$ {order.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-teal-600">
                    <Truck size={16} />
                    <span>Rastreio: BR{Math.floor(Math.random()*100000000)}XP</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-slide-in-right">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-teal-900 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <ShoppingCart size={20} /> 
                Seu Carrinho
              </h3>
              <button onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); }} className="p-1 hover:bg-teal-800 rounded">
                <Filter size={20} className="rotate-45" /> {/* Using rotate as X icon substitute */}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {checkoutStep === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pedido Realizado!</h3>
                  <p className="text-gray-500 mb-8">Seu pedido foi processado com sucesso. Acompanhe o status na aba "Meus Pedidos".</p>
                  <button 
                    onClick={() => { setIsCartOpen(false); setCheckoutStep('cart'); setActiveTab('orders'); }}
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-teal-700 w-full"
                  >
                    Ver Meus Pedidos
                  </button>
                </div>
              ) : checkoutStep === 'payment' ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-2">Resumo</h4>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Subtotal</span>
                      <span>R$ {cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-3">
                      <span>Frete</span>
                      <span className="text-green-600">Grátis</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                      <span>Total</span>
                      <span>R$ {cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de Entrega</label>
                      <input type="text" value="Av. Veterinária, 123 - São Paulo, SP" disabled className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pagamento</label>
                      <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 bg-teal-50 border-teal-200">
                        <CreditCard size={20} className="text-teal-600" />
                        <span className="font-medium text-gray-900">Cartão Final 4242</span>
                        <span className="ml-auto text-xs text-teal-600 font-bold">Alterar</span>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                /* Cart Items List */
                cart.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <p>Seu carrinho está vazio.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-50" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-teal-600 font-bold text-sm">R$ {Number(item.price).toFixed(2)}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm transition-all"><Minus size={14} /></button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm transition-all"><Plus size={14} /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && checkoutStep !== 'success' && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                {checkoutStep === 'cart' ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500">Total</span>
                      <span className="text-2xl font-bold text-gray-900">R$ {cartTotal.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => setCheckoutStep('payment')}
                      className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
                    >
                      Finalizar Compra
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                     <button 
                      onClick={() => setCheckoutStep('cart')}
                      className="flex-1 bg-white text-gray-700 border border-gray-300 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                    >
                      Voltar
                    </button>
                    <button 
                      onClick={handleCheckout}
                      disabled={processing}
                      className="flex-[2] bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {processing ? 'Processando...' : 'Pagar Agora'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
