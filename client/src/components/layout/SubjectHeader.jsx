import React from 'react';
import { Layers, Upload, Loader2 } from 'lucide-react';

export default function SubjectHeader({
  selectedSubject,
  graphData,
  loading,
  onLoadDocuments,
  onFileUpload,
}) {
  return (
    <div className="z-10 p-6 flex justify-between items-start border-b border-slate-800/50 flex-shrink-0">
      <div>
        {selectedSubject ? (
          <div className="animate-in slide-in-from-left-4">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-3">
              {selectedSubject.name}
            </h2>
            <p
              className="text-slate-400 text-sm mt-1 flex items-center gap-2 cursor-pointer hover:text-blue-300 transition"
              onClick={() => onLoadDocuments(selectedSubject.id)}
            >
              <Layers size={14} />
              <span className="hover:underline">{graphData.nodes.filter(n => n.type === 'Source').length} Tài liệu</span> • {graphData.nodes.filter(n => n.type === 'Concept').length} Khái niệm
            </p>
          </div>
        ) : (
          <h2 className="text-2xl font-bold text-slate-500">Vui lòng chọn môn học</h2>
        )}
      </div>

      {selectedSubject && (
        <div>
          <label className="cursor-pointer bg-white text-slate-900 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all transform hover:scale-105 active:scale-95">
            {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
            {loading ? 'Đang học...' : 'Nạp thêm tài liệu'}
            <input type="file" className="hidden" accept=".pdf" onChange={onFileUpload} />
          </label>
        </div>
      )}
    </div>
  );
}