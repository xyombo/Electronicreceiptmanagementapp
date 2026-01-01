import { useState } from 'react';
import { User, Phone, Mail, Store, MapPin, Edit2, Save } from 'lucide-react';

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  storeName: string;
  address: string;
}

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '张老板',
    phone: '13800138000',
    email: 'zhang@example.com',
    storeName: '张氏批发部',
    address: '广东省广州市天河区中山大道123号'
  });
  const [editForm, setEditForm] = useState<UserProfile>(profile);

  const handleEdit = () => {
    setEditForm(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-end">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 text-blue-600"
            >
              <Edit2 className="w-4 h-4" />
              <span className="text-sm">编辑</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="text-sm text-gray-600 px-3 py-1"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 text-blue-600"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm">保存</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* 头像区域 */}
        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="text-gray-900">{profile.name}</div>
          <div className="text-sm text-gray-500 mt-1">{profile.storeName}</div>
        </div>

        {/* 基本信息 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-gray-900 mb-4">基本信息</h3>
          
          {!isEditing ? (
            <div className="space-y-4">
              {/* 姓名 */}
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">姓名</div>
                  <div className="text-gray-900">{profile.name}</div>
                </div>
              </div>

              {/* 手机号 */}
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">手机号</div>
                  <div className="text-gray-900">{profile.phone}</div>
                </div>
              </div>

              {/* 邮箱 */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">邮箱</div>
                  <div className="text-gray-900">{profile.email}</div>
                </div>
              </div>

              {/* 店铺名称 */}
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">店铺名称</div>
                  <div className="text-gray-900">{profile.storeName}</div>
                </div>
              </div>

              {/* 地址 */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">地址</div>
                  <div className="text-gray-900">{profile.address}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 姓名 */}
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>姓名</span>
                </label>
                <input
                  type="text"
                  placeholder="请输入姓名"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 手机号 */}
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>手机号</span>
                </label>
                <input
                  type="tel"
                  placeholder="请输入手机号"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 邮箱 */}
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>邮箱</span>
                </label>
                <input
                  type="email"
                  placeholder="请输入邮箱"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 店铺名称 */}
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Store className="w-4 h-4 text-gray-400" />
                  <span>店铺名称</span>
                </label>
                <input
                  type="text"
                  placeholder="请输入店铺名称"
                  value={editForm.storeName}
                  onChange={(e) => setEditForm({ ...editForm, storeName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 地址 */}
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>地址</span>
                </label>
                <textarea
                  placeholder="请输入地址"
                  rows={2}
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* 统计信息 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-gray-900 mb-4">数据统计</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl text-blue-600 mb-1">86</div>
              <div className="text-xs text-gray-600">总票据数</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl text-green-600 mb-1">12</div>
              <div className="text-xs text-gray-600">商品种类</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl text-orange-600 mb-1">28</div>
              <div className="text-xs text-gray-600">客户总数</div>
            </div>
          </div>
        </div>

        {/* 关于应用 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-gray-900 mb-3">关于 EasyRecept</h3>
          <div className="text-sm text-gray-600 leading-relaxed">
            EasyRecept 是一款面向中国个体经营批发零售商的电子收据产品，为用户提供快捷高效的电子收据开具、商品库存管理、电子对账等日常经营操作。
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 text-center">
            版本 1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}
