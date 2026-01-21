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

// Support API
export const supportApi = {
  submitTicket: (data) => axios.post(`${API}/support/tickets`, data),
  getTickets: (params = {}) => axios.get(`${API}/support/tickets`, { params }),
  getTicket: (id) => axios.get(`${API}/support/tickets/${id}`),
  closeTicket: (id) => axios.put(`${API}/support/tickets/${id}/close`)
};

// Documentation API
export const docApi = {
  // Categories
  getCategories: () => axios.get(`${API}/docs/categories`),
  getCategory: (slug) => axios.get(`${API}/docs/categories/${slug}`),
  
  // Articles
  getArticles: (params = {}) => axios.get(`${API}/docs/articles`, { params }),
  getArticle: (slug) => axios.get(`${API}/docs/articles/${slug}`),
  getFeaturedArticles: () => axios.get(`${API}/docs/featured`),
  getPopularArticles: () => axios.get(`${API}/docs/popular`),
  getRecentArticles: () => axios.get(`${API}/docs/recent`),
  
  // Search
  search: (query, filters = {}) => axios.get(`${API}/docs/search`, { 
    params: { q: query, ...filters } 
  }),
  
  // User Progress
  getProgress: (articleId) => axios.get(`${API}/docs/progress/${articleId}`),
  updateProgress: (articleId, data) => axios.post(`${API}/docs/progress/${articleId}`, data),
  getBookmarks: () => axios.get(`${API}/docs/bookmarks`),
  toggleBookmark: (articleId) => axios.post(`${API}/docs/bookmark/${articleId}`),
  getUserProgress: () => axios.get(`${API}/docs/user-progress`),
  
  // Article Feedback
  submitFeedback: (articleId, helpful) => axios.post(`${API}/docs/articles/${articleId}/feedback`, { helpful }),
  
  // Comments
  getComments: (articleId) => axios.get(`${API}/docs/articles/${articleId}/comments`),
  addComment: (articleId, content, parentId = null) => 
    axios.post(`${API}/docs/articles/${articleId}/comments`, { content, parent_id: parentId }),
  
  // External Resources
  getResources: (params = {}) => axios.get(`${API}/docs/resources`, { params }),
  
  // Learning Paths
  getPaths: () => axios.get(`${API}/docs/paths`),
  getPath: (slug) => axios.get(`${API}/docs/paths/${slug}`),
  enrollPath: (pathId) => axios.post(`${API}/docs/paths/${pathId}/enroll`),
  getPathProgress: (pathId) => axios.get(`${API}/docs/paths/${pathId}/progress`),
  updatePathProgress: (pathId, data) => axios.post(`${API}/docs/paths/${pathId}/progress`, data),
  getUserPaths: () => axios.get(`${API}/docs/user-paths`)
};

// Admin API
export const adminApi = {
  getStats: () => axios.get(`${API}/admin/stats`),
  getUsers: () => axios.get(`${API}/admin/users`),
  updateUserRole: (userId, role) => axios.put(`${API}/admin/users/${userId}/role`, { role }),
  getContacts: () => axios.get(`${API}/admin/contacts`),
  getTransactions: () => axios.get(`${API}/admin/transactions`),
  getSupportTickets: (params = {}) => axios.get(`${API}/admin/support/tickets`, { params }),
  respondToTicket: (id, response, status) => axios.put(`${API}/admin/support/tickets/${id}/respond`, { response, status })
};

// Create axios instance for direct usage
const api = axios.create({
  baseURL: API,
  withCredentials: true
});

export default api;
