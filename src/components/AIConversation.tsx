import { useState, useRef } from 'react';
import { ArrowLeft, Check, Loader2, Mic, Send, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface ReceiptData {
  customerName: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  logistics: string;
  totalAmount: number;
  date: string;
}

interface ConversationMessage {
  type: 'user' | 'ai';
  content: string;
  receiptData?: ReceiptData;
}

interface AIConversationProps {
  onBack: () => void;
  onConfirm: (data: ReceiptData) => void;
  initialTranscript?: string;
}

export function AIConversation({ onBack, onConfirm, initialTranscript = '' }: AIConversationProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [currentReceiptData, setCurrentReceiptData] = useState<ReceiptData | null>(null);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 模拟AI解析初始语音
  useState(() => {
    setTimeout(() => {
      const mockData: ReceiptData = {
        customerName: '张三便利店',
        items: [
          { productName: '可口可乐', quantity: 10, unitPrice: 3.5, amount: 35 },
          { productName: '农夫山泉', quantity: 20, unitPrice: 2, amount: 40 },
        ],
        logistics: '顺丰速运',
        totalAmount: 75,
        date: '2026-01-01',
      };

      setMessages([
        {
          type: 'user',
          content: initialTranscript || '给张三便利店开票，10箱可口可乐，20箱农夫山泉，用顺丰发货',
        },
        {
          type: 'ai',
          content: '好的，我已经为您整理好开票信息，请确认：',
          receiptData: mockData,
        },
      ]);
      setCurrentReceiptData(mockData);
      setIsProcessing(false);
    }, 1500);
  });

  const handleSendMessage = () => {
    if (!userInput.trim() || isProcessing) return;

    const newMessage: ConversationMessage = {
      type: 'user',
      content: userInput,
    };

    setMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsProcessing(true);

    // 模拟AI响应
    setTimeout(() => {
      // 根据用户输入更新票据数据
      let updatedData = { ...currentReceiptData! };

      if (userInput.includes('改成') || userInput.includes('修改')) {
        if (userInput.includes('可乐') && userInput.match(/(\d+)/)) {
          const quantity = parseInt(userInput.match(/(\d+)/)![1]);
          updatedData.items[0].quantity = quantity;
          updatedData.items[0].amount = quantity * updatedData.items[0].unitPrice;
        }
        if (userInput.includes('客户') || userInput.includes('店')) {
          const nameMatch = userInput.match(/['""]([^'""]+)['""]|改成(.+店)/);
          if (nameMatch) {
            updatedData.customerName = nameMatch[1] || nameMatch[2];
          }
        }
      }

      // 重新计算总金额
      updatedData.totalAmount = updatedData.items.reduce((sum, item) => sum + item.amount, 0);

      const aiResponse: ConversationMessage = {
        type: 'ai',
        content: '好的，我已经更新了票据信息，请再次确认：',
        receiptData: updatedData,
      };

      setMessages(prev => [...prev, aiResponse]);
      setCurrentReceiptData(updatedData);
      setIsProcessing(false);
    }, 1000);
  };

  const handleConfirmReceipt = (data: ReceiptData) => {
    onConfirm(data);
  };

  const handleEditReceipt = () => {
    setUserInput('我想修改票据信息');
  };

  const handleVoicePress = () => {
    setIsVoiceRecording(true);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleVoiceRelease = () => {
    setIsVoiceRecording(false);
    // 模拟语音识别
    setTimeout(() => {
      setUserInput('把可乐改成15箱');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* 顶部导航 */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 active:scale-95 transition-transform">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-gray-900">AI 语音开票</span>
        <div className="w-10" />
      </div>

      {/* 对话区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-900 shadow-md'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap mb-1">{message.content}</p>

              {/* 显示票据数据卡片 */}
              {message.receiptData && (
                <div className="mt-3 space-y-3">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 space-y-3 border border-blue-100">
                    <div className="flex items-center justify-between pb-3 border-b border-blue-200">
                      <span className="text-xs text-blue-600">客户</span>
                      <span className="text-sm text-gray-900">{message.receiptData.customerName}</span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs text-blue-600 block mb-2">商品明细</span>
                      {message.receiptData.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-white/70 rounded-lg px-3 py-2">
                          <span className="text-gray-800">{item.productName}</span>
                          <div className="text-right flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {item.quantity} × ¥{item.unitPrice.toFixed(2)}
                            </span>
                            <span className="text-gray-900 min-w-[60px] text-right">
                              ¥{item.amount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-blue-200">
                      <span className="text-xs text-blue-600">物流</span>
                      <span className="text-sm text-gray-900">{message.receiptData.logistics}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 bg-white/70 rounded-lg px-3 py-2.5">
                      <span className="text-sm text-gray-700">合计金额</span>
                      <span className="text-xl text-blue-600">
                        ¥{message.receiptData.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* 卡片内的确认按钮 - 只在最新的票据数据上显示 */}
                  {index === messages.length - 1 && !isProcessing && (
                    <button
                      onClick={() => handleConfirmReceipt(message.receiptData!)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md mt-2"
                    >
                      <Check className="w-5 h-5" />
                      <span>确认开票</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* AI处理中指示器 */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white rounded-2xl px-4 py-3 shadow-md flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">AI 正在处理...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 底部IM聊天输入框 */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 safe-area-bottom">
        <div className="flex items-end gap-2">
          {/* 文字/语音模式切换按钮 */}
          <button
            onClick={() => setInputMode(inputMode === 'text' ? 'voice' : 'text')}
            className={`p-2.5 rounded-full transition-all active:scale-95 ${
              inputMode === 'voice' 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {inputMode === 'text' ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MessageSquare className="w-5 h-5" />
            )}
          </button>

          {/* 输入框 - 根据模式显示不同内容 */}
          {inputMode === 'text' ? (
            <div className="flex-1 relative">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="说点什么..."
                disabled={isProcessing}
                rows={1}
                className="w-full px-4 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none max-h-24"
                style={{ minHeight: '44px' }}
              />
            </div>
          ) : (
            <button
              onMouseDown={handleVoicePress}
              onMouseUp={handleVoiceRelease}
              onMouseLeave={() => isVoiceRecording && handleVoiceRelease()}
              onTouchStart={handleVoicePress}
              onTouchEnd={handleVoiceRelease}
              className={`flex-1 rounded-full py-2.5 transition-all ${
                isVoiceRecording
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {isVoiceRecording ? '松开发送' : '按住说话'}
            </button>
          )}

          {/* 发送按钮 - 仅在文字模式且有内容时显示 */}
          {inputMode === 'text' && userInput.trim() && (
            <button
              onClick={handleSendMessage}
              disabled={isProcessing}
              className="p-2.5 bg-blue-600 text-white rounded-full active:scale-95 transition-all disabled:opacity-50 shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 语音录音提示 */}
        {isVoiceRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-center"
          >
            <p className="text-sm text-red-600 flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              正在录音，松开发送
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}