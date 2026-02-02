import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileText, X } from 'lucide-react';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfPanel({
  pdfFile,
  currentPage,
  onClose,
}) {
  return (
    <div className="fixed right-6 top-24 bottom-6 w-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-300">
      <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
        <div className="flex items-center gap-2 text-blue-400 font-bold"><FileText size={18} /><span>Tài liệu</span></div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">Trang {currentPage}</span>
          <button onClick={onClose} className="hover:bg-slate-700 p-1 rounded-full"><X size={20} className="text-slate-400" /></button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-slate-500/10 custom-scrollbar flex justify-center">
        <Document file={pdfFile} className="shadow-2xl">
          <Page
            pageNumber={currentPage}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            width={450}
            className="bg-white text-black shadow-lg rounded-sm overflow-hidden"
          />
        </Document>
      </div>
    </div>
  );
}