<template>
  <div class="min-h-screen bg-background flex flex-col justify-center items-center px-6 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute -top-[10%] -right-[10%] w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-[10%] -left-[10%] w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>

    <div class="w-full max-w-md z-10">
      <div class="text-center mb-10">
        <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary-lighter rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
          <van-icon name="manager" class="text-3xl text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-800">面试官系统</h1>
        <p class="text-gray-500 text-sm mt-2">欢迎回来，请登录以继续操作</p>
      </div>

      <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-white/60">
        <van-form @submit="onSubmit" class="space-y-4">
          <van-cell-group inset class="!m-0 !bg-transparent space-y-4">
            <div class="rounded-xl overflow-hidden bg-gray-50/50 border border-gray-100">
              <van-field
                v-model="username"
                name="username"
                placeholder="请输入用户名"
                left-icon="user-o"
                :rules="[{ required: true, message: '请填写用户名' }]"
                class="!bg-transparent"
              />
            </div>
            
            <div class="rounded-xl overflow-hidden bg-gray-50/50 border border-gray-100">
              <van-field
                v-model="password"
                type="password"
                name="password"
                placeholder="请输入密码"
                left-icon="closed-eye"
                :rules="[{ required: true, message: '请填写密码' }]"
                class="!bg-transparent"
              />
            </div>
          </van-cell-group>
          <div class="pt-6">
            <van-button 
              round 
              block 
              type="primary" 
              native-type="submit" 
              :loading="loading"
              class="!bg-primary !border-primary shadow-lg shadow-primary/30 text-white font-medium h-12 text-lg"
            >
              登录
            </van-button>
          </div>
        </van-form>
      </div>
      
      <div class="text-center mt-8">
        <p class="text-xs text-gray-400">内部管理系统，未经授权请勿访问</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { showSuccessToast, showFailToast } from 'vant'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

const onSubmit = async (values: any) => {
  loading.value = true
  try {
    const res = await authStore.login(values)
    if (res.data.user.role !== 'interviewer' && res.data.user.role !== 'super_admin') {
      showFailToast('无权访问面试官端')
      authStore.logout()
      loading.value = false
      return
    }
    showSuccessToast('登录成功')
    await router.push('/')
  } catch (error: any) {
    // 错误在 api 拦截器里处理
    loading.value = false
  }
}
</script>
