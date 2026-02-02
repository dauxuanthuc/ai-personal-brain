import React from 'react';
import { FileText, X } from 'lucide-react';

export default function DocumentListPanel({
  documents,
  onClose,
  onSelectDocument,
}) {
  return (
    <div className="fixed right-6 top-24 bottom-6 w-[400px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-300">
      <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
        <h3 className="text-blue-400 font-bold flex items-center gap-2">
          <FileText size={18} />
          Danh sách tài liệu
        </h3>
        <button
          onClick={onClose}
          className="hover:bg-slate-700 p-1 rounded-full"
        >
          <X size={20} className="text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        {documents.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            Chưa có tài liệu nào
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {documents.map(doc => (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className="bg-slate-800/50 hover:bg-slate-700 cursor-pointer p-3 rounded-lg transition border border-slate-700 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate group-hover:text-blue-300 transition">{doc.title}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {doc._count?.concepts || 0} khái niệm
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 ml-2 flex-shrink-0">
                    {new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}