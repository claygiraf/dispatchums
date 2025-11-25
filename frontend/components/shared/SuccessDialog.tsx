'use client';

import { useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface SuccessDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function SuccessDialog({ 
  isOpen, 
  title, 
  message, 
  onClose, 
  autoClose = true, 
  autoCloseDelay = 3000 
}: SuccessDialogProps) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-[#0A0A0A] border border-[#27272A] rounded-2xl p-8 max-w-md w-full mx-4 glass animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Success Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white text-center mb-3">
          {title}
        </h3>
        
        {/* Message */}
        <p className="text-[#9CA3AF] text-center mb-6 leading-relaxed">
          {message}
        </p>
        
        {/* Progress Bar (if auto-close) */}
        {autoClose && (
          <div className="mb-4">
            <div className="w-full bg-[#27272A] rounded-full h-1">
              <div 
                className="bg-[#1D9BF0] h-1 rounded-full animate-progress"
                style={{
                  animation: `progress ${autoCloseDelay}ms linear forwards`
                }}
              />
            </div>
          </div>
        )}
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#1D9BF0] text-white font-semibold rounded-lg hover:bg-[#1a8cd8] transition shadow-lg shadow-[#1D9BF0]/20"
        >
          Continue to Dashboard
        </button>
      </div>
      
      {/* CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-progress {
          animation: progress ${autoCloseDelay}ms linear forwards;
        }
      `}</style>
    </div>
  );
}