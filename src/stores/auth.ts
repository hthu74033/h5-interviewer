import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '../api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('interviewer_token') || '')
  const user = ref(JSON.parse(localStorage.getItem('interviewer_user') || 'null'))

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('interviewer_token', newToken)
  }

  const setUser = (newUser: any) => {
    user.value = newUser
    localStorage.setItem('interviewer_user', JSON.stringify(newUser))
  }

  const login = async (data: any) => {
    const res: any = await authApi.login(data)
    setToken(res.data.token)
    setUser(res.data.user)
    return res
  }

  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('interviewer_token')
    localStorage.removeItem('interviewer_user')
  }

  return { token, user, setToken, setUser, login, logout }
})
