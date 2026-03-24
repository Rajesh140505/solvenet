import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getDashboard: () => api.get('/users/dashboard')
};

export const problemsAPI = {
  getAll: (params) => api.get('/problems', { params }),
  getById: (id) => api.get(`/problems/${id}`),
  create: (data) => api.post('/problems/create', data),
  update: (id, data) => api.put(`/problems/${id}`, data),
  delete: (id) => api.delete(`/problems/${id}`),
  getArchive: (params) => api.get('/problems/archive', { params })
};

export const solutionsAPI = {
  getByProblem: (problemId) => api.get(`/solutions/problem/${problemId}`),
  getByUser: (userId) => api.get(`/solutions/user/${userId}`),
  submit: (problemId, data) => api.post(`/solutions/submit/${problemId}`, data),
  vote: (solutionId) => api.post(`/solutions/vote/${solutionId}`),
  delete: (solutionId) => api.delete(`/solutions/${solutionId}`),
  markSolved: (problemId) => api.post(`/solutions/solve/${problemId}`)
};

export const leaderboardAPI = {
  getLeaderboard: (params) => api.get('/leaderboard', { params }),
  getStats: () => api.get('/leaderboard/stats')
};

const PISTON_API = 'https://emkc.org/api/v2/piston';

const languageVersions = {
  JavaScript: { language: 'javascript', version: '18.15.0' },
  Python: { language: 'python', version: '3.10.0' },
  Java: { language: 'java', version: '15.0.2' },
  'C++': { language: 'c++', version: '10.2.0' },
  C: { language: 'c', version: '10.2.0' },
  Go: { language: 'go', version: '1.16.2' },
  Rust: { language: 'rust', version: '1.68.2' },
  TypeScript: { language: 'typescript', version: '5.0.3' },
  Ruby: { language: 'ruby', version: '3.0.1' },
  PHP: { language: 'php', version: '8.1.0' }
};

export const executeCode = async (code, language, stdin) => {
  const langConfig = languageVersions[language];
  if (!langConfig) {
    throw new Error(`Language ${language} not supported`);
  }

  const response = await axios.post(`${PISTON_API}/execute`, {
    language: langConfig.language,
    version: langConfig.version,
    files: [{ content: code }],
    stdin: stdin || '',
    args: [],
    compile_timeout: 10000,
    run_timeout: 5000
  });

  return response.data;
};

export const runTests = async (code, language, testCases) => {
  const results = [];
  
  for (const testCase of testCases) {
    try {
      const result = await executeCode(code, language, testCase.input);
      const output = result.run.output.trim();
      const expected = testCase.output.trim();
      const passed = output === expected;
      
      results.push({
        input: testCase.input,
        expected,
        actual: output,
        passed,
        error: result.run.stderr || ''
      });
    } catch (error) {
      results.push({
        input: testCase.input,
        expected: testCase.output,
        actual: '',
        passed: false,
        error: error.message
      });
    }
  }

  return results;
};

export default api;
