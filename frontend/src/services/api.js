import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Configure axios defaults
axios.defaults.withCredentials = true;

// Projects API
export const projectsApi = {
  getAll: (params = {}) => axios.get(`${API}/projects`, { params }),
  getOne: (id) => axios.get(`${API}/projects/${id}`),
  create: (data) => axios.post(`${API}/projects`, data),
  update: (id, data) => axios.put(`${API}/projects/${id}`, data),
  delete: (id) => axios.delete(`${API}/projects/${id}`),
  getFiles: (id) => axios.get(`${API}/projects/${id}/files`),
  getFile: (projectId, filePath) => axios.get(`${API}/projects/${projectId}/file/${filePath}`),
  download: (id) => axios.get(`${API}/projects/${id}/download`, { responseType: 'blob' })
};

// Courses API
export const coursesApi = {
  getAll: (params = {}) => axios.get(`${API}/courses`, { params }),
  getOne: (id) => axios.get(`${API}/courses/${id}`),
  create: (data) => axios.post(`${API}/courses`, data),
  addLesson: (courseId, data) => axios.post(`${API}/courses/${courseId}/lessons`, data)
};

// Enrollments API
export const enrollmentsApi = {
  getAll: () => axios.get(`${API}/enrollments`),
  create: (courseId) => axios.post(`${API}/enrollments`, { course_id: courseId }),
  updateProgress: (id, progress) => axios.put(`${API}/enrollments/${id}/progress`, { progress })
};

// Purchases API
export const purchasesApi = {
  getAll: () => axios.get(`${API}/purchases`)
};

// Payments API
export const paymentsApi = {
  createOrder: (itemType, itemId) => axios.post(`${API}/payments/create-order`, { item_type: itemType, item_id: itemId }),
  verify: (data) => axios.post(`${API}/payments/verify`, data)
};

// Connections API
export const connectionsApi = {
  getAll: () => axios.get(`${API}/connections`),
  create: (receiverId, message, category) => axios.post(`${API}/connections`, { receiver_id: receiverId, message, category }),
  update: (id, status) => axios.put(`${API}/connections/${id}`, { status }),
  getMessages: (id) => axios.get(`${API}/connections/${id}/messages`),
  sendMessage: (id, content) => axios.post(`${API}/connections/${id}/messages`, { content })
};

// Contact API
export const contactApi = {
  submit: (data) => axios.post(`${API}/contact`, data)
};

// Blog API
export const blogApi = {
  getAll: (params = {}) => axios.get(`${API}/blog`, { params }),
  getOne: (id) => axios.get(`${API}/blog/${id}`),
  create: (data) => axios.post(`${API}/blog`, data)
};

// Admin API
export const adminApi = {
  getStats: () => axios.get(`${API}/admin/stats`),
  getUsers: () => axios.get(`${API}/admin/users`),
  updateUserRole: (userId, role) => axios.put(`${API}/admin/users/${userId}/role`, { role }),
  getContacts: () => axios.get(`${API}/admin/contacts`),
  getTransactions: () => axios.get(`${API}/admin/transactions`)
};

export default API;
