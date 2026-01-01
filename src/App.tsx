import { useState, useRef, useEffect } from 'react';
import { ReceiptList } from './components/ReceiptList';
import { CreateReceipt } from './components/CreateReceipt';
import { ProductManagement } from './components/ProductManagement';
import { CustomerManagement } from './components/CustomerManagement';
import { Profile } from './components/Profile';
import { AIConversation } from './components/AIConversation';
import { VoiceRecordingOverlay } from './components/VoiceRecordingOverlay';
import { Receipt, Package, Users, User, Sparkles } from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';

type Page = 'receipts' | 'create-receipt' | 'products' | 'customers' | 'profile' | 'ai-conversation';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('receipts');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const handleCreateButtonPress = () => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      // 长按触发语音录音
      isLongPressRef.current = true;
      setIsVoiceRecording(true);
      setIsVoiceMode(true);
      // 震动反馈（如果设备支持）
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms判定为长按
  };

  const handleCreateButtonRelease = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    if (isLongPressRef.current) {
      // 长按松开：进入AI处理状态（语音模式）
      setIsVoiceRecording(false);
      setIsAIProcessing(true);
      
      toast.info('AI 正在解析语音...');
      
      // 模拟AI处理延迟
      setTimeout(() => {
        setIsAIProcessing(false);
        setCurrentPage('ai-conversation');
      }, 1500);
    } else {
      // 单击：直接进入AI开票页面（非语音模式）
      setIsVoiceMode(false);
      setCurrentPage('ai-conversation');
    }

    isLongPressRef.current = false;
  };

  const handleAIConfirm = (data: any) => {
    // 创建票据
    toast.success('票据创建成功！');
    setCurrentPage('receipts');
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'receipts':
        return <ReceiptList onCreateNew={() => setCurrentPage('create-receipt')} />;
      case 'create-receipt':
        return <CreateReceipt onBack={() => setCurrentPage('receipts')} />;
      case 'ai-conversation':
        return (
          <AIConversation 
            onBack={() => setCurrentPage('receipts')} 
            onConfirm={handleAIConfirm}
            isVoiceMode={isVoiceMode}
            onManualCreate={() => setCurrentPage('create-receipt')}
          />
        );
      case 'products':
        return <ProductManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'profile':
        return <Profile />;
      default:
        return <ReceiptList onCreateNew={() => setCurrentPage('create-receipt')} />;
    }
  };

  const getActiveKey = () => {
    if (currentPage === 'create-receipt' || currentPage === 'ai-conversation') return 'receipts';
    return currentPage;
  };

  const tabs = [
    { key: 'receipts', title: '票据', icon: Receipt },
    { key: 'products', title: '商品', icon: Package },
    { key: 'customers', title: '客户', icon: Users },
    { key: 'profile', title: '我的', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面内容 */}
      <div className={currentPage === 'ai-conversation' ? '' : 'pb-16'}>
        {renderPage()}
      </div>

      {/* 语音录音遮罩层 */}
      <VoiceRecordingOverlay isVisible={isVoiceRecording} />

      {/* AI处理中提示 */}
      {isAIProcessing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center gap-3 shadow-xl">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-700">AI 正在解析语音...</p>
          </div>
        </div>
      )}

      {/* 底部导航栏 - 2.0 版本 - AI对话页面不显示 */}
      {currentPage !== 'ai-conversation' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex items-center justify-around relative">
            {/* 左侧两个标签 */}
            {tabs.slice(0, 2).map(tab => {
              const Icon = tab.icon;
              const isActive = getActiveKey() === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setCurrentPage(tab.key as Page)}
                  className="flex-1 flex flex-col items-center justify-center py-2 px-3 transition-colors"
                >
                  <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                    {tab.title}
                  </span>
                </button>
              );
            })}

            {/* 中间开票按钮 */}
            <div className="flex-1 flex items-center justify-center">
              <button
                onMouseDown={handleCreateButtonPress}
                onMouseUp={handleCreateButtonRelease}
                onMouseLeave={() => {
                  if (longPressTimerRef.current) {
                    clearTimeout(longPressTimerRef.current);
                  }
                  if (isLongPressRef.current) {
                    handleCreateButtonRelease();
                  }
                }}
                onTouchStart={handleCreateButtonPress}
                onTouchEnd={handleCreateButtonRelease}
                className="relative -mt-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl active:scale-90 transition-all flex items-center justify-center"
                style={{
                  boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5), 0 8px 10px -6px rgba(59, 130, 246, 0.4)',
                }}
              >
                <Sparkles className="w-7 h-7" />
              </button>
            </div>

            {/* 右侧两个标签 */}
            {tabs.slice(2, 4).map(tab => {
              const Icon = tab.icon;
              const isActive = getActiveKey() === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setCurrentPage(tab.key as Page)}
                  className="flex-1 flex flex-col items-center justify-center py-2 px-3 transition-colors"
                >
                  <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                    {tab.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Toast通知 */}
      <Toaster position="top-center" />
    </div>
  );
}