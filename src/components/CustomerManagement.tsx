import { useState } from 'react';
import { Search, Phone, Plus, ArrowLeft } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  totalTransactions: number;
  totalAmount: number;
}

interface Transaction {
  id: string;
  receiptNo: string;
  date: string;
  amount: number;
  itemCount: number;
}

export function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  // 模拟客户数据
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: '张三便利店',
      phone: '13800138001',
      totalTransactions: 15,
      totalAmount: 45680.50
    },
    {
      id: '2',
      name: '李四超市',
      phone: '13800138002',
      totalTransactions: 28,
      totalAmount: 128900.00
    },
    {
      id: '3',
      name: '王五批发部',
      phone: '13800138003',
      totalTransactions: 42,
      totalAmount: 256780.75
    }
  ]);

  // 模拟成交记录
  const transactions: Record<string, Transaction[]> = {
    '1': [
      { id: '1', receiptNo: 'RC20251204001', date: '2025-12-04', amount: 2850.50, itemCount: 15 },
      { id: '2', receiptNo: 'RC20251201001', date: '2025-12-01', amount: 3680.00, itemCount: 20 },
      { id: '3', receiptNo: 'RC20251128001', date: '2025-11-28', amount: 4150.00, itemCount: 18 }
    ],
    '2': [
      { id: '4', receiptNo: 'RC20251203002', date: '2025-12-03', amount: 5680.00, itemCount: 28 },
      { id: '5', receiptNo: 'RC20251130002', date: '2025-11-30', amount: 6200.00, itemCount: 32 }
    ],
    '3': [
      { id: '6', receiptNo: 'RC20251202003', date: '2025-12-02', amount: 8920.75, itemCount: 42 },
      { id: '7', receiptNo: 'RC20251129003', date: '2025-11-29', amount: 9500.00, itemCount: 45 }
    ]
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const handleSubmit = () => {
    if (formData.name && formData.phone) {
      setCustomers([...customers, { 
        ...formData, 
        id: Date.now().toString(),
        totalTransactions: 0,
        totalAmount: 0
      }]);
      setShowAddPopup(false);
      setFormData({ name: '', phone: '' });
    }
  };

  const openDetailPopup = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailPopup(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 搜索栏 */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索客户名称或电话"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 客户列表 */}
      <div className="p-3 space-y-3">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Phone className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>暂无客户记录</p>
          </div>
        ) : (
          filteredCustomers.map(customer => (
            <div
              key={customer.id}
              onClick={() => openDetailPopup(customer)}
              className="bg-white rounded-xl p-4 shadow-sm cursor-pointer active:bg-gray-50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-gray-900 mb-1">{customer.name}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Phone className="w-3 h-3" />
                    <span>{customer.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-500 mb-1">成交次数</div>
                  <div className="text-gray-900">{customer.totalTransactions}次</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">累计金额</div>
                  <div className="text-blue-600">¥{customer.totalAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 悬浮添加客户按钮 */}
      <button
        onClick={() => setShowAddPopup(true)}
        className="fixed right-6 bottom-24 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center z-20"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* 添加客户弹窗 */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">添加客户</h3>
                <button
                  onClick={() => setShowAddPopup(false)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">客户名称</label>
                <input
                  type="text"
                  placeholder="请输入客户名称"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">联系电话</label>
                <input
                  type="tel"
                  placeholder="请输入联系电话"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddPopup(false)}
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

      {/* 客户详情弹窗 */}
      {showDetailPopup && selectedCustomer && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setShowDetailPopup(false)}
              className="text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h3 className="text-gray-900">客户详情</h3>
          </div>

          <div className="p-3 space-y-3">
            {/* 客户基本信息 */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h4 className="text-gray-900 mb-3">基本信息</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">客户名称</span>
                  <span className="text-gray-900">{selectedCustomer.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">联系电话</span>
                  <span className="text-gray-900">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">成交次数</span>
                  <span className="text-gray-900">{selectedCustomer.totalTransactions}次</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">累计金额</span>
                  <span className="text-blue-600">¥{selectedCustomer.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* 成交记录 */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h4 className="text-gray-900 mb-3">成交记录</h4>
              <div className="space-y-3">
                {transactions[selectedCustomer.id]?.map(transaction => (
                  <div key={transaction.id} className="pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm text-gray-900 mb-1">{transaction.receiptNo}</div>
                        <div className="text-xs text-gray-500">{transaction.date}</div>
                      </div>
                      <div className="text-blue-600">¥{transaction.amount.toFixed(2)}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      商品数量：{transaction.itemCount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
