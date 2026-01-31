import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, BookOpen, BrainCircuit, FileText, Layers, LogOut, User } from 'lucide-react';

export default function Dashboard({ user, onLogout, onReturnToApp }) {
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalDocuments: 0,
    totalConcepts: 0
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const subjectsRes = await api.get('/subjects');
      setSubjects(subjectsRes.data);

      // Tính toán thống kê
      let totalDocs = 0;
      let totalConcepts = 0;

      for (const subject of subjectsRes.data) {
        totalDocs += subject._count?.documents || 0;
        
        // Lấy graph data để đếm concepts
        try {
          const graphRes = await api.get(`/subjects/${subject.id}/graph`);
          totalConcepts += graphRes.data.nodes.filter(n => n.type === 'Concept').length;
        } catch (e) {
          console.error("Lỗi load graph:", e);
        }
      }

      setStats({
        totalSubjects: subjectsRes.data.length,
        totalDocuments: totalDocs,
        totalConcepts: totalConcepts
      });
    } catch (error) {
      console.error("Lỗi load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#020617]">
        <div className="text-white text-center">
          <BrainCircuit size={48} className="mx-auto mb-4 animate-pulse" />
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b] text-white">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BrainCircuit size={28} />
            </div>
            <h1 className="text-2xl font-bold">My Brain Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
              <User size={18} className="text-blue-400" />
              <span className="text-sm">{user?.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg hover:bg-red-900/20 transition"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Subjects Card */}
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-1">Môn học</p>
                <h3 className="text-4xl font-black text-white">{stats.totalSubjects}</h3>
              </div>
              <div className="bg-blue-600/30 p-3 rounded-lg">
                <BookOpen size={32} className="text-blue-400" />
              </div>
            </div>
            <p className="text-blue-300/70 text-sm">Tổng số môn học đang quản lý</p>
          </div>

          {/* Documents Card */}
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-purple-400 text-sm font-bold uppercase tracking-wider mb-1">Tài liệu</p>
                <h3 className="text-4xl font-black text-white">{stats.totalDocuments}</h3>
              </div>
              <div className="bg-purple-600/30 p-3 rounded-lg">
                <FileText size={32} className="text-purple-400" />
              </div>
            </div>
            <p className="text-purple-300/70 text-sm">Tổng số tài liệu đã upload</p>
          </div>

          {/* Concepts Card */}
          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-emerald-500/20 transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-1">Khái niệm</p>
                <h3 className="text-4xl font-black text-white">{stats.totalConcepts}</h3>
              </div>
              <div className="bg-emerald-600/30 p-3 rounded-lg">
                <Layers size={32} className="text-emerald-400" />
              </div>
            </div>
            <p className="text-emerald-300/70 text-sm">Tổng số khái niệm được trích xuất</p>
          </div>
        </div>

        {/* Subjects Overview */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <BarChart3 className="text-blue-400" />
            Danh sách môn học
          </h2>

          {subjects.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto mb-4 text-slate-500 opacity-50" />
              <p className="text-slate-400">Chưa có môn học nào. Hãy tạo môn học mới!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map(subject => (
                <div
                  key={subject.id}
                  onClick={onReturnToApp}
                  className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl p-4 transition cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition truncate">
                      {subject.name}
                    </h3>
                    <span className="bg-blue-600/30 text-blue-300 text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2">
                      {subject._count?.documents || 0} file
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Được tạo: {new Date(subject.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500/50 transition cursor-pointer group">
            <div className="bg-blue-600/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600/40 transition">
              <BookOpen size={32} className="text-blue-400" />
            </div>
            <h3 className="font-bold mb-2">Quản lý môn học</h3>
            <p className="text-slate-400 text-sm mb-4">Tạo, sửa hoặc xóa môn học</p>
            <button 
              onClick={onReturnToApp}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold transition text-sm w-full"
            >
              Quay lại ứng dụng
            </button>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center hover:border-purple-500/50 transition cursor-pointer group">
            <div className="bg-purple-600/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600/40 transition">
              <FileText size={32} className="text-purple-400" />
            </div>
            <h3 className="font-bold mb-2">Tài liệu của tôi</h3>
            <p className="text-slate-400 text-sm mb-4">Xem và quản lý tất cả tài liệu</p>
            <button 
              onClick={onReturnToApp}
              className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg font-bold transition text-sm w-full"
            >
              Quay lại ứng dụng
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20 py-8 px-6 text-center text-slate-400 text-sm">
        <p>© 2026 AI Personal Brain. Nền tảng quản lý tri thức cá nhân.</p>
      </footer>
    </div>
  );
}
