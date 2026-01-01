import { motion } from 'motion/react';
import { Mic } from 'lucide-react';

interface VoiceRecordingOverlayProps {
  isVisible: boolean;
}

export function VoiceRecordingOverlay({ isVisible }: VoiceRecordingOverlayProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center"
    >
      <div className="flex flex-col items-center">
        {/* 声波动画 */}
        <div className="relative flex items-center justify-center mb-8">
          {/* 最外层波纹 */}
          <motion.div
            animate={{
              scale: [1, 2, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute w-40 h-40 rounded-full bg-blue-400"
          />
          
          {/* 外层波纹 */}
          <motion.div
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.5, 0.1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.3,
            }}
            className="absolute w-32 h-32 rounded-full bg-blue-400"
          />
          
          {/* 中层波纹 */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0.2, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.6,
            }}
            className="absolute w-24 h-24 rounded-full bg-blue-500"
          />
          
          {/* 内层波纹 */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.8, 0.3, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.9,
            }}
            className="absolute w-20 h-20 rounded-full bg-blue-500"
          />
          
          {/* 中心麦克风图标 */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center"
            style={{
              boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.6)',
            }}
          >
            <Mic className="w-12 h-12 text-white" strokeWidth={2} />
          </motion.div>
        </div>

        {/* 提示文字 */}
        <motion.div
          animate={{
            opacity: [1, 0.6, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-white text-center px-8"
        >
          <p className="text-2xl mb-3">正在倾听...</p>
          <p className="text-sm text-gray-300 opacity-90">松开结束录音</p>
        </motion.div>
      </div>
    </motion.div>
  );
}