import { useState } from 'react';
import { Search, Package, DollarSign, Truck } from 'lucide-react';

interface Receipt {
  id: string;
  receiptNo: string;
  customerName: string;
  date: string;
  totalItems: number;
  totalAmount: number;
  logistics: string;
}

interface ReceiptListProps {
  onCreateNew: () => void;
}

export function ReceiptList({ onCreateNew }: ReceiptListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // 模拟数据
  const [receipts] = useState<Receipt[]>([
    {
      id: '1',
      receiptNo: 'RC20251204001',
      customerName: '张三便利店',
      date: '2025-12-04',
      totalItems: 15,
      totalAmount: 2850.50,
      logistics: '顺丰速运 SF1234567890'
    },
    {
      id: '2',
      receiptNo: 'RC20251203002',
      customerName: '李四超市',
      date: '2025-12-03',
      totalItems: 28,
      totalAmount: 5680.00,
      logistics: '中通快递 ZT9876543210'
    },
    {
      id: '3',
      receiptNo: 'RC20251202003',
      customerName: '王五批发部',
      date: '2025-12-02',
      totalItems: 42,
      totalAmount: 8920.75,
      logistics: '圆通速递 YT5555666677'
    }
  ]);

  const filteredReceipts = receipts.filter(receipt =>
    receipt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    receipt.receiptNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 搜索栏 */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索客户名称或票据编号"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 票据列表 */}
      <div className="p-3 space-y-3">
        {filteredReceipts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>暂无票据记录</p>
          </div>
        ) : (
          filteredReceipts.map(receipt => (
            <div key={receipt.id} className="bg-white rounded-xl p-4 shadow-sm">
              {/* 客户名称和日期 */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-gray-900 mb-1">{receipt.customerName}</div>
                  <div className="text-xs text-gray-500">{receipt.receiptNo}</div>
                </div>
                <span className="text-xs text-gray-500">{receipt.date}</span>
              </div>

              {/* 商品信息 */}
              <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="w-4 h-4" />
                  <span className="text-sm">商品总数</span>
                  <span className="text-sm text-gray-900">{receipt.totalItems}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">总金额</span>
                  <span className="text-sm text-blue-600">¥{receipt.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* 物流信息 */}
              <div className="flex items-center gap-2 text-gray-600">
                <Truck className="w-4 h-4" />
                <span className="text-xs">{receipt.logistics}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 悬浮开具票据按钮 */}
      {/* 已移除 - 2.0版本中按钮移至底部导航中间 */}
    </div>
  );
}