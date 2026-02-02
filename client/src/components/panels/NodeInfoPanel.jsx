import React from 'react';
import { FileText, X, Trash2 } from 'lucide-react';

export default function NodeInfoPanel({
  selectedNode,
  onClose,
  onViewInDocument,
  onDeleteConcept,
  onOpenDocumentList,
}) {
  if (!selectedNode) return null;

  return (
    <div className="fixed right-6 top-24 bottom-6 w-[400px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-300">
      <div className="bg-slate-800 p-4 flex justify-between items-start border-b border-slate-700">
        <div>
          <h3 className="text-yellow-400 font-bold text-lg">{selectedNode.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-slate-700 p-1 rounded-full"
        >
          <X size={20} className="text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Định nghĩa</p>
          <p className="text-slate-300 text-sm leading-relaxed">{selectedNode.definition || 'Chưa có định nghĩa'}</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Vị trí trong tài liệu</p>
          <div className="text-sm">
            <p className="text-slate-300"><span className="text-blue-400">📄 Trang:</span> {selectedNode.page || '?'}</p>
            <p className="text-slate-300"><span className="text-blue-400">📚 Tài liệu:</span>
              <button
                onClick={onOpenDocumentList}
                className="text-blue-400 hover:text-blue-300 underline ml-1"
              >
                Xem danh sách
              </button>
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Thể loại</p>
          <span className="inline-block bg-blue-600/20 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-600/30">
            Khái niệm
          </span>
        </div>
      </div>

      <div className="bg-slate-800 p-4 border-t border-slate-700 space-y-2">
        <button
          onClick={() => onViewInDocument(selectedNode)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          <FileText size={16} />
          Xem trong tài liệu
        </button>

        <button
          onClick={() => onDeleteConcept(selectedNode.id)}
          className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 border border-red-600/30"
        >
          <Trash2 size={16} />
          Xóa khái niệm
        </button>
      </div>
    </div>
  );
}