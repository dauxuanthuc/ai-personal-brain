import React from 'react';
import { MessageSquare, BrainCircuit, Loader2, Send, X } from 'lucide-react';

export default function ChatPanel({
  selectedSubjectName,
  chatMessages,
  isChatLoading,
  chatInput,
  onChatInputChange,
  onSend,
  onClose,
}) {
  return (
    <div className="fixed right-6 top-24 bottom-6 w-[450px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-300">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex justify-between items-center border-b border-slate-700">
        <h3 className="text-white font-bold flex items-center gap-2">
          <MessageSquare size={18} />
          Hỏi AI về {selectedSubjectName}
        </h3>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded-full transition"
        >
          <X size={20} className="text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3 custom-scrollbar bg-slate-950/50">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <BrainCircuit size={48} className="text-purple-400 mb-3 opacity-50" />
            <p className="text-slate-400 text-sm">Hãy hỏi tôi bất cứ điều gì về môn học này!</p>
            <p className="text-slate-500 text-xs mt-2">Ví dụ: "Primary Key khác Foreign Key thế nào?"</p>
          </div>
        ) : (
          chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.type === 'user' ? (
                <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl max-w-[80%] text-sm">
                  {msg.text}
                </div>
              ) : msg.type === 'error' ? (
                <div className="bg-red-900/30 border border-red-600/50 text-red-400 px-4 py-2 rounded-2xl max-w-[80%] text-sm">
                  {msg.text}
                </div>
              ) : msg.type === 'loading' ? (
                <div className="bg-slate-700/50 text-slate-300 px-4 py-2 rounded-2xl max-w-[80%] text-sm flex items-center gap-2">
                  <span className="inline-block animate-spin">⏳</span>
                  {msg.text}
                </div>
              ) : (
                <div className="bg-slate-800 text-slate-200 px-4 py-3 rounded-2xl max-w-[85%] text-sm">
                  <div className="mb-2">{msg.text}</div>
                  {msg.concepts && msg.concepts.length > 0 ? (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-slate-400 mb-2 font-bold">📚 Nguồn tham khảo:</p>
                      {msg.concepts.map((concept, i) => (
                        <div key={i} className="text-xs text-slate-400 mb-1">
                          • <span className="text-blue-400">{concept.term}</span> - {concept.source}
                        </div>
                      ))}
                    </div>
                  ) : msg.fromGeneralKnowledge && (
                    <div className="mt-3 pt-3 border-t border-yellow-700/30">
                      <p className="text-xs text-yellow-500 flex items-center gap-1">
                        ⚠️ Trả lời từ kiến thức chung (không có trong tài liệu)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {isChatLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-400 px-4 py-3 rounded-2xl flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-sm">Đang suy nghĩ...</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-800 p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={e => onChatInputChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isChatLoading && onSend()}
            placeholder="Hỏi về khái niệm, so sánh..."
            className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-xl py-2 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm placeholder-slate-500"
            disabled={isChatLoading}
          />
          <button
            onClick={onSend}
            disabled={isChatLoading || !chatInput.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-2 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">AI sẽ trả lời dựa trên tài liệu của bạn</p>
      </div>
    </div>
  );
}