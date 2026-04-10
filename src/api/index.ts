import axios from 'axios'
import { showFailToast } from 'vant'
import { STORAGE_KEYS } from '../utils'

const baseURL = import.meta.env.PROD
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api'

export const api = axios.create({
  baseURL,
  timeout: 10000
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code && res.code !== 200) {
      showFailToast(res.message || '请求失败')
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.token)
      localStorage.removeItem(STORAGE_KEYS.user)
      window.location.href = '/login'
    } else {
      showFailToast(error.response?.data?.message || error.message)
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (data: any) => api.post('/auth/login', data)
}

export const interviewApi = {
  getInterviewers: () => api.get('/interview/interviewers'),
  getWaiting: () => api.get('/interview/waiting'),
  getMyRecords: () => api.get('/interview/my-records'),
  getCandidateByNo: (no: string) => api.get(`/interview/candidate/${no}`),
  evaluate: (data: any) => api.post('/interview/evaluate', data),
  start: (interviewNo: string) => api.post('/interview/start', { interviewNo }),
  finish: (interviewNo: string, nextStatus: string) => api.post('/interview/finish', { interviewNo, nextStatus }),
  toggleStatus: (status: string) => api.post('/interview/toggle-status', { status })
}

export const onboardingApi = {
  getList: (params?: { keyword?: string; dateFrom?: string; dateTo?: string; page?: number; pageSize?: number }) =>
    api.get('/onboarding/admin/list', { params }),
  enable: (interviewNo: string) =>
    api.post('/onboarding/admin/enable', { interviewNo })
}
