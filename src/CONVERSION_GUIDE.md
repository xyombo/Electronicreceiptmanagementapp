# React Web 转微信小程序转换指南

## 一、技术栈对比

| 特性 | React Web | 微信小程序 |
|------|-----------|-----------|
| 页面文件 | .tsx | .wxml, .wxss, .js, .json |
| 样式 | Tailwind CSS | WXSS (类似CSS) |
| 组件 | JSX/TSX | WXML模板语法 |
| 状态管理 | useState, useEffect | data, setData |
| 路由 | 组件切换 | wx.navigateTo, wx.switchTab |
| 图标 | lucide-react | 小程序UI库或iconfont |

## 二、项目结构转换

### React Web 结构
```
/App.tsx                      # 主应用
/components/
  ├── ReceiptList.tsx        # 票据列表
  ├── CreateReceipt.tsx      # 开具票据
  ├── ProductManagement.tsx  # 商品管理
  ├── CustomerManagement.tsx # 客户管理
  └── Profile.tsx            # 个人中心
/styles/globals.css
```

### 微信小程序结构
```
/pages/
  ├── receipt-list/          # 票据列表页
  │   ├── index.wxml
  │   ├── index.wxss
  │   ├── index.js
  │   └── index.json
  ├── create-receipt/        # 开具票据页
  ├── product-management/    # 商品管理页
  ├── customer-management/   # 客户管理页
  └── profile/               # 个人中心页
/components/                 # 自定义组件
/utils/                      # 工具函数
/app.json                    # 全局配置
/app.wxss                    # 全局样式
/app.js                      # 全局逻辑
```

## 三、核心代码转换示例

### 3.1 底部导航栏

**React (App.tsx)**
```tsx
<div className="fixed bottom-0 left-0 right-0 bg-white border-t">
  <div className="flex items-center justify-around">
    {tabs.map(tab => (
      <button onClick={() => setCurrentPage(tab.key)}>
        <Icon className="w-6 h-6" />
        <span>{tab.title}</span>
      </button>
    ))}
  </div>
</div>
```

**小程序 (app.json)**
```json
{
  "tabBar": {
    "color": "#6B7280",
    "selectedColor": "#2563EB",
    "backgroundColor": "#FFFFFF",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/receipt-list/index",
        "text": "票据",
        "iconPath": "assets/icons/receipt.png",
        "selectedIconPath": "assets/icons/receipt-active.png"
      },
      {
        "pagePath": "pages/product-management/index",
        "text": "商品",
        "iconPath": "assets/icons/product.png",
        "selectedIconPath": "assets/icons/product-active.png"
      },
      {
        "pagePath": "pages/customer-management/index",
        "text": "客户",
        "iconPath": "assets/icons/customer.png",
        "selectedIconPath": "assets/icons/customer-active.png"
      },
      {
        "pagePath": "pages/profile/index",
        "text": "我的",
        "iconPath": "assets/icons/profile.png",
        "selectedIconPath": "assets/icons/profile-active.png"
      }
    ]
  }
}
```

### 3.2 票据列表页面

**React (ReceiptList.tsx)**
```tsx
export function ReceiptList({ onCreateNew }: ReceiptListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [receipts] = useState<Receipt[]>([...]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-3">
        <input
          type="text"
          placeholder="搜索客户名称或票据编号"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* 列表内容 */}
    </div>
  );
}
```

**小程序 (pages/receipt-list/index.wxml)**
```xml
<view class="container">
  <!-- 搜索栏 -->
  <view class="search-bar">
    <input 
      type="text" 
      placeholder="搜索客户名称或票据编号"
      value="{{searchQuery}}"
      bindinput="onSearchInput"
      class="search-input"
    />
  </view>

  <!-- 票据列表 -->
  <view class="receipt-list">
    <block wx:for="{{filteredReceipts}}" wx:key="id">
      <view class="receipt-card">
        <view class="receipt-header">
          <view>
            <text class="customer-name">{{item.customerName}}</text>
            <text class="receipt-no">{{item.receiptNo}}</text>
          </view>
          <text class="receipt-date">{{item.date}}</text>
        </view>
        
        <view class="receipt-info">
          <view class="info-item">
            <text class="label">商品总数</text>
            <text class="value">{{item.totalItems}}</text>
          </view>
          <view class="info-item">
            <text class="label">总金额</text>
            <text class="value amount">¥{{item.totalAmount}}</text>
          </view>
        </view>
        
        <view class="logistics">
          <text>{{item.logistics}}</text>
        </view>
      </view>
    </block>
  </view>

  <!-- 悬浮按钮 -->
  <view class="fab" bindtap="onCreateReceipt">
    <image src="/assets/icons/plus.png" class="fab-icon" />
  </view>
</view>
```

**小程序 (pages/receipt-list/index.js)**
```javascript
Page({
  data: {
    searchQuery: '',
    receipts: [
      {
        id: '1',
        receiptNo: 'RC20251204001',
        customerName: '张三便利店',
        date: '2025-12-04',
        totalItems: 15,
        totalAmount: 2850.50,
        logistics: '顺丰速运 SF1234567890'
      },
      // 更多数据...
    ],
    filteredReceipts: []
  },

  onLoad() {
    this.setData({
      filteredReceipts: this.data.receipts
    });
  },

  onSearchInput(e) {
    const query = e.detail.value.toLowerCase();
    const filtered = this.data.receipts.filter(receipt => 
      receipt.customerName.toLowerCase().includes(query) ||
      receipt.receiptNo.toLowerCase().includes(query)
    );
    
    this.setData({
      searchQuery: query,
      filteredReceipts: filtered
    });
  },

  onCreateReceipt() {
    wx.navigateTo({
      url: '/pages/create-receipt/index'
    });
  }
});
```

**小程序 (pages/receipt-list/index.wxss)**
```css
.container {
  min-height: 100vh;
  background-color: #F9FAFB;
}

.search-bar {
  background-color: #FFFFFF;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  background-color: #F3F4F6;
  border-radius: 8px;
}

.receipt-list {
  padding: 12px;
}

.receipt-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.receipt-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.customer-name {
  display: block;
  color: #111827;
  font-size: 16px;
  margin-bottom: 4px;
}

.receipt-no {
  display: block;
  color: #9CA3AF;
  font-size: 12px;
}

.receipt-date {
  color: #9CA3AF;
  font-size: 12px;
}

.receipt-info {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #F3F4F6;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6B7280;
  font-size: 14px;
}

.info-item .value {
  color: #111827;
}

.info-item .amount {
  color: #2563EB;
}

.logistics {
  color: #6B7280;
  font-size: 12px;
}

.fab {
  position: fixed;
  right: 24px;
  bottom: 96px;
  width: 56px;
  height: 56px;
  background-color: #2563EB;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  z-index: 20;
}

.fab-icon {
  width: 24px;
  height: 24px;
}
```

### 3.3 开具票据页面

**React (CreateReceipt.tsx)**
```tsx
const [customerPopupVisible, setCustomerPopupVisible] = useState(false);
const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

// 弹窗
{customerPopupVisible && (
  <div className="fixed inset-0 bg-black/50 z-50">
    <div className="bg-white w-full rounded-t-2xl">
      {customers.map(customer => (
        <div onClick={() => setSelectedCustomer(customer)}>
          {customer.name}
        </div>
      ))}
    </div>
  </div>
)}
```

**小程序 (pages/create-receipt/index.wxml)**
```xml
<view class="container">
  <!-- 基本信息 -->
  <view class="card">
    <text class="card-title">基本信息</text>
    
    <!-- 客户选择 -->
    <view class="form-item">
      <text class="label">客户名称</text>
      <view class="picker" bindtap="showCustomerPicker">
        <text class="{{selectedCustomer ? 'selected' : 'placeholder'}}">
          {{selectedCustomer ? selectedCustomer.name : '请选择客户'}}
        </text>
      </view>
    </view>

    <!-- 开票日期 -->
    <view class="form-item">
      <text class="label">开票日期</text>
      <picker mode="date" value="{{receiptDate}}" bindchange="onDateChange">
        <view class="picker">
          <text>{{receiptDate}}</text>
        </view>
      </picker>
    </view>

    <!-- 收据编号 -->
    <view class="form-item">
      <text class="label">收据编号</text>
      <input type="text" value="{{receiptNo}}" disabled class="input-disabled" />
    </view>

    <!-- 物流信息 -->
    <view class="form-item">
      <text class="label">物流信息</text>
      <input 
        type="text" 
        placeholder="如：顺丰速运 SF1234567890"
        value="{{logistics}}"
        bindinput="onLogisticsInput"
        class="input"
      />
    </view>
  </view>

  <!-- 商品列表 -->
  <view class="card">
    <view class="card-header">
      <text class="card-title">商品列表</text>
      <text class="add-btn" bindtap="addItem">+ 添加商品</text>
    </view>
    
    <block wx:for="{{items}}" wx:key="id" wx:for-index="index">
      <view class="item-card">
        <view class="item-header">
          <text class="item-label">商品 #{{index + 1}}</text>
          <image 
            wx:if="{{items.length > 1}}"
            src="/assets/icons/delete.png" 
            class="delete-icon"
            bindtap="removeItem"
            data-id="{{item.id}}"
          />
        </view>
        
        <input 
          type="text" 
          placeholder="商品名称"
          value="{{item.productName}}"
          bindinput="onItemNameInput"
          data-id="{{item.id}}"
          class="input"
        />
        
        <view class="item-row">
          <input 
            type="digit" 
            placeholder="单价"
            value="{{item.unitPrice}}"
            bindinput="onItemPriceInput"
            data-id="{{item.id}}"
            class="input-small"
          />
          <input 
            type="number" 
            placeholder="数量"
            value="{{item.quantity}}"
            bindinput="onItemQuantityInput"
            data-id="{{item.id}}"
            class="input-small"
          />
          <input 
            type="text" 
            value="{{item.amount}}"
            disabled
            class="input-small input-disabled"
          />
        </view>
      </view>
    </block>
  </view>

  <!-- 总计 -->
  <view class="summary">
    <view class="summary-row">
      <text>商品总数</text>
      <text>{{totalQuantity}}</text>
    </view>
    <view class="summary-row">
      <text>总金额</text>
      <text class="amount">¥{{totalAmount}}</text>
    </view>
  </view>

  <!-- 操作按钮 -->
  <view class="button-group">
    <button class="btn-secondary" bindtap="onShare">
      分享
    </button>
    <button class="btn-primary" bindtap="onSubmit">
      开具票据
    </button>
  </view>
</view>

<!-- 客户选择弹窗 -->
<view class="modal {{customerPopupVisible ? 'show' : ''}}">
  <view class="modal-mask" bindtap="hideCustomerPicker"></view>
  <view class="modal-content">
    <view class="modal-header">
      <text class="modal-title">选择客户</text>
      <text class="modal-close" bindtap="hideCustomerPicker">✕</text>
    </view>
    <view class="customer-list">
      <block wx:for="{{customers}}" wx:key="id">
        <view class="customer-item" bindtap="selectCustomer" data-customer="{{item}}">
          <text class="customer-name">{{item.name}}</text>
          <text class="customer-phone">{{item.phone}}</text>
        </view>
      </block>
    </view>
  </view>
</view>
```

**小程序 (pages/create-receipt/index.js)**
```javascript
Page({
  data: {
    customerPopupVisible: false,
    selectedCustomer: null,
    receiptDate: '',
    receiptNo: '',
    logistics: '',
    items: [
      { id: '1', productName: '', unitPrice: 0, quantity: 0, amount: 0 }
    ],
    customers: [
      { id: '1', name: '张三便利店', phone: '13800138001' },
      { id: '2', name: '李四超市', phone: '13800138002' },
      { id: '3', name: '王五批发部', phone: '13800138003' }
    ],
    totalQuantity: 0,
    totalAmount: 0
  },

  onLoad() {
    const today = new Date().toISOString().split('T')[0];
    const receiptNo = `RC${Date.now()}`;
    this.setData({
      receiptDate: today,
      receiptNo: receiptNo
    });
  },

  showCustomerPicker() {
    this.setData({ customerPopupVisible: true });
  },

  hideCustomerPicker() {
    this.setData({ customerPopupVisible: false });
  },

  selectCustomer(e) {
    const customer = e.currentTarget.dataset.customer;
    this.setData({
      selectedCustomer: customer,
      customerPopupVisible: false
    });
  },

  onDateChange(e) {
    this.setData({ receiptDate: e.detail.value });
  },

  onLogisticsInput(e) {
    this.setData({ logistics: e.detail.value });
  },

  addItem() {
    const newItem = {
      id: Date.now().toString(),
      productName: '',
      unitPrice: 0,
      quantity: 0,
      amount: 0
    };
    this.setData({
      items: [...this.data.items, newItem]
    });
  },

  removeItem(e) {
    const id = e.currentTarget.dataset.id;
    if (this.data.items.length > 1) {
      const items = this.data.items.filter(item => item.id !== id);
      this.setData({ items });
      this.calculateTotal();
    }
  },

  onItemNameInput(e) {
    const id = e.currentTarget.dataset.id;
    const value = e.detail.value;
    this.updateItem(id, 'productName', value);
  },

  onItemPriceInput(e) {
    const id = e.currentTarget.dataset.id;
    const value = parseFloat(e.detail.value) || 0;
    this.updateItem(id, 'unitPrice', value);
  },

  onItemQuantityInput(e) {
    const id = e.currentTarget.dataset.id;
    const value = parseInt(e.detail.value) || 0;
    this.updateItem(id, 'quantity', value);
  },

  updateItem(id, field, value) {
    const items = this.data.items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'unitPrice' || field === 'quantity') {
          updated.amount = updated.unitPrice * updated.quantity;
        }
        return updated;
      }
      return item;
    });
    this.setData({ items });
    this.calculateTotal();
  },

  calculateTotal() {
    const totalQuantity = this.data.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = this.data.items.reduce((sum, item) => sum + item.amount, 0);
    this.setData({ totalQuantity, totalAmount: totalAmount.toFixed(2) });
  },

  onShare() {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  },

  onSubmit() {
    // 验证数据
    if (!this.data.selectedCustomer) {
      wx.showToast({
        title: '请选择客户',
        icon: 'none'
      });
      return;
    }

    // 保存数据到数据库或云存储
    wx.showToast({
      title: '票据开具成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    });
  }
});
```

## 四、Tailwind CSS 转 WXSS 对照表

| Tailwind | WXSS |
|----------|------|
| `bg-white` | `background-color: #FFFFFF;` |
| `text-gray-900` | `color: #111827;` |
| `rounded-xl` | `border-radius: 12px;` |
| `p-4` | `padding: 16px;` |
| `mb-3` | `margin-bottom: 12px;` |
| `flex` | `display: flex;` |
| `items-center` | `align-items: center;` |
| `justify-between` | `justify-content: space-between;` |
| `shadow-sm` | `box-shadow: 0 1px 3px rgba(0,0,0,0.1);` |
| `fixed bottom-0` | `position: fixed; bottom: 0;` |
| `w-full` | `width: 100%;` |
| `gap-3` | `gap: 12px;` (Flexbox) |

## 五、关键差异与注意事项

### 5.1 数据绑定
- React: `value={searchQuery}` / `{item.name}`
- 小程序: `value="{{searchQuery}}"` / `{{item.name}}`

### 5.2 事件处理
- React: `onClick={handleClick}` / `onChange={(e) => ...}`
- 小程序: `bindtap="handleClick"` / `bindinput="handleInput"`

### 5.3 条件渲染
- React: `{condition && <div>...</div>}` / `{condition ? <A/> : <B/>}`
- 小程序: `<view wx:if="{{condition}}">...</view>` / `<view wx:if="{{condition}}" wx:else>...</view>`

### 5.4 列表渲染
- React: `{items.map(item => <div key={item.id}>...)}`
- 小程序: `<block wx:for="{{items}}" wx:key="id">...</block>`

### 5.5 样式处理
- React: `className="bg-white rounded-xl p-4"`
- 小程序: `class="card"` + 在WXSS中定义样式

### 5.6 路由导航
- React: `setCurrentPage('receipts')`
- 小程序: `wx.navigateTo({ url: '/pages/receipt-list/index' })`

### 5.7 弹窗处理
- React: 条件渲染 `{visible && <div>...</div>}`
- 小程序: 使用 `<modal>` 组件或自定义弹窗 + CSS动画

### 5.8 图标处理
- React: lucide-react组件
- 小程序: 图片文件或 iconfont

## 六、推荐使用的小程序UI库

为了加快开发速度，建议使用以下UI库：

1. **Vant Weapp** (推荐)
   - 官网: https://vant-contrib.gitee.io/vant-weapp/
   - 特点: 组件丰富，文档完善，适合商业项目

2. **WeUI**
   - 官网: https://weui.io/
   - 特点: 微信官方设计，风格统一

3. **ColorUI**
   - 特点: 样式美观，配色丰富

## 七、使用Vant Weapp快速实现

安装Vant Weapp后，可以快速实现组件：

**搜索框**
```xml
<van-search 
  value="{{searchQuery}}" 
  placeholder="搜索客户名称或票据编号"
  bind:change="onSearchChange"
/>
```

**卡片**
```xml
<van-cell-group>
  <van-cell title="{{item.customerName}}" value="{{item.date}}" />
</van-cell-group>
```

**弹窗**
```xml
<van-popup show="{{visible}}" position="bottom" bind:close="onClose">
  <van-picker columns="{{customers}}" bind:confirm="onConfirm" />
</van-popup>
```

**按钮**
```xml
<van-button type="primary" block bind:click="onSubmit">
  开具票据
</van-button>
```

## 八、数据持久化方案

### 本地存储
```javascript
// 保存数据
wx.setStorageSync('receipts', receipts);

// 读取数据
const receipts = wx.getStorageSync('receipts') || [];
```

### 云开发 (推荐)
```javascript
// 初始化云开发
wx.cloud.init({
  env: 'your-env-id'
});

const db = wx.cloud.database();

// 添加票据
db.collection('receipts').add({
  data: {
    receiptNo: 'RC001',
    customerName: '张三',
    // ...
  }
});

// 查询票据
db.collection('receipts')
  .where({
    customerName: '张三'
  })
  .get()
  .then(res => {
    console.log(res.data);
  });
```

## 九、转换步骤总结

1. **创建小程序项目**
   ```bash
   # 使用微信开发者工具创建新项目
   ```

2. **配置app.json**
   - 设置页面路径
   - 配置tabBar
   - 设置窗口样式

3. **创建页面**
   - 每个React组件对应一个小程序页面
   - 使用右键"新建Page"自动生成4个文件

4. **转换HTML结构**
   - div → view
   - input → input
   - button → button
   - img → image

5. **转换样式**
   - 将Tailwind类转换为WXSS
   - 使用rpx作为响应式单位（1rpx = 0.5px）

6. **转换逻辑**
   - useState → data + setData
   - useEffect → 生命周期函数
   - 事件处理函数适配

7. **测试功能**
   - 页面跳转
   - 数据绑定
   - 交互效果

8. **优化性能**
   - 图片压缩
   - 代码分包
   - 按需加载

## 十、完整示例对比

### React完整组件
```tsx
import { useState } from 'react';

export function ReceiptList({ onCreateNew }) {
  const [receipts, setReceipts] = useState([]);
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {receipts.map(receipt => (
        <div key={receipt.id} className="bg-white p-4">
          <p>{receipt.customerName}</p>
        </div>
      ))}
      <button onClick={onCreateNew}>添加</button>
    </div>
  );
}
```

### 小程序完整页面
```xml
<!-- index.wxml -->
<view class="container">
  <block wx:for="{{receipts}}" wx:key="id">
    <view class="card">
      <text>{{item.customerName}}</text>
    </view>
  </block>
  <button bindtap="onCreateNew">添加</button>
</view>
```

```javascript
// index.js
Page({
  data: {
    receipts: []
  },
  
  onLoad() {
    // 加载数据
  },
  
  onCreateNew() {
    wx.navigateTo({
      url: '/pages/create-receipt/index'
    });
  }
});
```

```css
/* index.wxss */
.container {
  background-color: #F9FAFB;
  min-height: 100vh;
}

.card {
  background-color: #FFFFFF;
  padding: 16px;
}
```

---

## 需要帮助？

如果在转换过程中遇到问题，可以：
1. 查看微信小程序官方文档: https://developers.weixin.qq.com/miniprogram/dev/
2. 参考Vant Weapp示例: https://vant-contrib.gitee.io/vant-weapp/
3. 搜索具体问题的解决方案

祝开发顺利！🎉
