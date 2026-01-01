import { useState } from 'react';
import { Search, Edit2, Package, AlertCircle, Plus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  unitPrice: number;
  supplier: string;
  stockInDate: string;
  productionDate: string;
  shelfLife: string;
  quantity: number;
}

export function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    unitPrice: 0,
    supplier: '',
    stockInDate: '',
    productionDate: '',
    shelfLife: '',
    quantity: 0
  });

  // 模拟数据
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: '康师傅方便面',
      unitPrice: 3.5,
      supplier: '康师傅集团',
      stockInDate: '2025-12-01',
      productionDate: '2025-11-15',
      shelfLife: '180天',
      quantity: 500
    },
    {
      id: '2',
      name: '可口可乐500ml',
      unitPrice: 3.0,
      supplier: '可口可乐公司',
      stockInDate: '2025-12-02',
      productionDate: '2025-11-20',
      shelfLife: '12个月',
      quantity: 300
    },
    {
      id: '3',
      name: '旺旺雪饼',
      unitPrice: 5.5,
      supplier: '旺旺集团',
      stockInDate: '2025-11-28',
      productionDate: '2025-11-10',
      shelfLife: '6个月',
      quantity: 80
    }
  ]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...formData, id: editingProduct.id } : p));
    } else {
      setProducts([...products, { ...formData, id: Date.now().toString() }]);
    }
    setShowAddPopup(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      unitPrice: 0,
      supplier: '',
      stockInDate: '',
      productionDate: '',
      shelfLife: '',
      quantity: 0
    });
  };

  const openEditPopup = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowAddPopup(true);
  };

  const openAddPopup = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      unitPrice: 0,
      supplier: '',
      stockInDate: '',
      productionDate: '',
      shelfLife: '',
      quantity: 0
    });
    setShowAddPopup(true);
  };

  const isLowStock = (quantity: number) => quantity < 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 搜索栏 */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索商品名称或供货商"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 商品列表 */}
      <div className="p-3 space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>暂无商品记录</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-900">{product.name}</span>
                    {isLowStock(product.quantity) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-xs border border-orange-200">
                        <AlertCircle className="w-3 h-3" />
                        库存不足
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">供货商：{product.supplier}</div>
                </div>
                <button
                  onClick={() => openEditPopup(product)}
                  className="text-blue-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">单价：</span>
                  <span className="text-blue-600">¥{product.unitPrice.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-500">库存：</span>
                  <span className={isLowStock(product.quantity) ? 'text-orange-600' : 'text-gray-900'}>
                    {product.quantity}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">入库日期：</span>
                  <span className="text-gray-900">{product.stockInDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">生产日期：</span>
                  <span className="text-gray-900">{product.productionDate}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">保质期：</span>
                  <span className="text-gray-900">{product.shelfLife}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 悬浮添加商品按钮 */}
      <button
        onClick={openAddPopup}
        className="fixed right-6 bottom-24 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center z-20"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* 添加/编辑弹窗 */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">{editingProduct ? '编辑商品' : '添加商品'}</h3>
                <button
                  onClick={() => {
                    setShowAddPopup(false);
                    setEditingProduct(null);
                  }}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">商品名称</label>
                <input
                  type="text"
                  placeholder="请输入商品名称"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">单价</label>
                <input
                  type="number"
                  placeholder="请输入单价"
                  value={formData.unitPrice || ''}
                  onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">供货商</label>
                <input
                  type="text"
                  placeholder="请输入供货商"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">入库日期</label>
                <input
                  type="date"
                  value={formData.stockInDate}
                  onChange={(e) => setFormData({ ...formData, stockInDate: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">生产日期</label>
                <input
                  type="date"
                  value={formData.productionDate}
                  onChange={(e) => setFormData({ ...formData, productionDate: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">保质期</label>
                <input
                  type="text"
                  placeholder="如：180天、12个月"
                  value={formData.shelfLife}
                  onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">数量</label>
                <input
                  type="number"
                  placeholder="请输入数量"
                  value={formData.quantity || ''}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddPopup(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:scale-95 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
