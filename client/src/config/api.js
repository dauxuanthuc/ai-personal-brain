export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://aiinterviewcoach.id.vn';
export const API_URL = `${API_BASE_URL}/api`;

export const toAbsoluteUrl = (path) => {
  if (!path) return path;
  return path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const uploadsUrl = (filename) => {
  if (!filename) return filename;
  if (filename.startsWith('http')) return filename;
  const normalized = filename.replace(/^\/+/, '');
  if (normalized.startsWith('uploads/')) {
    return `${API_BASE_URL}/${normalized}`;
  }
  return `${API_BASE_URL}/uploads/${normalized}`;
};
