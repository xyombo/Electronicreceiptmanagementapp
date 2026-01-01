import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Share2, ChevronRight } from 'lucide-react';

interface ReceiptItem {
  id: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  amount: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface CreateReceiptProps {
  onBack: () => void;
}

export function CreateReceipt({ onBack }: CreateReceiptProps) {
  const [customerPopupVisible, setCustomerPopupVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [receiptDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptNo] = useState(`RC${Date.now()}`);
  const [logistics, setLogistics] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: '1', productName: '', unitPrice: 0, quantity: 0, amount: 0 }
  ]);

  // 模拟客户数据
  const customers: Customer[] = [
    { id: '1', name: '张三便利店', phone: '13800138001' },
    { id: '2', name: '李四超市', phone: '13800138002' },
    { id: '3', name: '王五批发部', phone: '13800138003' }
  ];

  const handleItemChange = (id: string, field: keyof ReceiptItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'unitPrice' || field === 'quantity') {
          updated.amount = Number(updated.unitPrice) * Number(updated.quantity);
        }
        return updated;
      }
      return item;
    }));
  };

  const addNewItem = () => {
    setItems([...items, { 
      id: Date.now().toString(), 
      productName: '', 
      unitPrice: 0, 
      quantity: 0, 
      amount: 0 
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity), 0);
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onBack();
    }, 1500);
  };

  const handleShare = () => {
    alert('分享功能：在实际小程序中可通过微信分享');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* 基本信息卡片 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-gray-900 mb-4">基本信息</h3>
          
          <div className="space-y-3">
            {/* 客户名称 */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">客户名称</label>
              <div
                onClick={() => setCustomerPopupVisible(true)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between cursor-pointer"
              >
                <span className={selectedCustomer ? 'text-gray-900' : 'text-gray-400'}>
                  {selectedCustomer ? selectedCustomer.name : '请选择客户'}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* 开票日期 */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">开票日期</label>
              <input
                type="text"
                value={receiptDate}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500"
              />
            </div>

            {/* 收据编号 */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">收据编号</label>
              <input
                type="text"
                value={receiptNo}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500"
              />
            </div>

            {/* 物流信息 */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">物流信息</label>
              <input
                type="text"
                placeholder="如：顺丰速运 SF1234567890"
                value={logistics}
                onChange={(e) => setLogistics(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 商品列表卡片 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">商品列表</h3>
            <button
              onClick={addNewItem}
              className="flex items-center gap-1 text-blue-600 text-sm"
            >
              <Plus className="w-4 h-4" />
              添加商品
            </button>
          </div>
          
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">商品 #{index + 1}</span>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="商品名称"
                    value={item.productName}
                    onChange={(e) => handleItemChange(item.id, 'productName', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="单价"
                      value={item.unitPrice || ''}
                      onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="数量"
                      value={item.quantity || ''}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="金额"
                      value={item.amount.toFixed(2)}
                      readOnly
                      className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 总结栏 */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">商品总数</span>
            <span className="text-gray-900">{totalQuantity}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">总金额</span>
            <span className="text-blue-600">¥{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 pb-4">
          <button
            onClick={handleShare}
            className="flex-1 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <Share2 className="w-4 h-4" />
            分享
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            开具票据
          </button>
        </div>
      </div>

      {/* 客户选择弹窗 */}
      {customerPopupVisible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-[70vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">选择客户</h3>
                <button
                  onClick={() => setCustomerPopupVisible(false)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4">
              {customers.map(customer => (
                <div
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setCustomerPopupVisible(false);
                  }}
                  className="py-3 border-b border-gray-100 last:border-b-0 cursor-pointer active:bg-gray-50"
                >
                  <div className="text-gray-900">{customer.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{customer.phone}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast提示 */}
      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg z-50 shadow-lg">
          票据开具成功！
        </div>
      )}
    </div>
  );
}
