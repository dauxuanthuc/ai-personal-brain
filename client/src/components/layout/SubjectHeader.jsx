import React, { useState } from 'react';
import { Layers, Upload, Loader2, PlusCircle, Search, Share2, Brain } from 'lucide-react';
import ShareModal from '../modals/ShareModal';

export default function SubjectHeader({
  selectedSubject,
  graphData,
  loading,
  uploadProgress,
  uploadEtaSeconds,
  uploadStatus,
  onLoadDocuments,
  onFileUpload,
  onAddConcept,
  onStartQuiz,
  searchQuery,
  onSearchQueryChange,
  searchResults,
  onSelectSearchResult,
  isSearching,
}) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  return (
    <div className="z-10 p-6 flex justify-between items-start border-b border-slate-700/40 flex-shrink-0 bg-slate-900/35 backdrop-blur-sm">
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
        <div className="flex gap-3 items-start">
          <div className="relative w-[420px] max-w-[45vw]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Tìm kiếm khái niệm, tài liệu..."
              className="w-full bg-slate-800/90 border border-slate-600 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300"
            />

            {searchQuery?.trim().length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                {isSearching ? (
                  <div className="p-3 text-sm text-slate-400">Đang tìm...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-3 text-sm text-slate-500">Không tìm thấy khái niệm phù hợp</div>
                ) : (
                  <div className="max-h-64 overflow-auto custom-scrollbar">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onSelectSearchResult(item)}
                        className="w-full text-left p-3 hover:bg-slate-800 transition border-b border-slate-800 last:border-b-0"
                      >
                        <p className="text-white font-medium truncate">{item.term}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {item.document?.title || 'Tài liệu không rõ'}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {!selectedSubject?.isShared ? (
            <>
              <button
                onClick={onStartQuiz}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition"
              >
                <Brain size={18} />
                Ôn tập
              </button>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="text-slate-300 hover:text-white px-2.5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition"
              >
                <Share2 size={18} />
                Chia sẻ
              </button>
              <button
                onClick={onAddConcept}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition"
              >
                <PlusCircle size={18} />
                Thêm khái niệm
              </button>
              <div className="flex flex-col items-stretch gap-2">
                <label className="cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_10px_24px_rgba(37,99,235,0.35)] transition">
                  {loading ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
                  <span className="text-base leading-none">＋</span>
                  {loading ? 'Đang học...' : 'Nạp tài liệu'}
                  <input type="file" className="hidden" accept=".pdf" onChange={onFileUpload} />
                </label>
                {uploadStatus !== 'idle' && (
                  <div className="w-full">
                    <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                      <span>
                        {uploadStatus === 'uploading' && `Đang tải ${uploadProgress}%`}
                        {uploadStatus === 'processing' && 'Đang xử lý...'}
                        {uploadStatus === 'done' && 'Hoàn tất'}
                        {uploadStatus === 'error' && 'Lỗi upload'}
                      </span>
                      {(uploadStatus === 'uploading' || uploadStatus === 'processing') && uploadEtaSeconds !== null && (
                        <span>~{uploadEtaSeconds}s</span>
                      )}
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-slate-400 text-sm flex items-center gap-2">
              📌 Chế độ chỉ xem - không thể chỉnh sửa
            </div>
          )}
        </div>
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        selectedSubject={selectedSubject}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}