<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      :title="isAdmin ? '管理员工作台' : '面试官工作台'"
      class="bg-white/80 backdrop-blur-md !border-b-0 sticky top-0 z-50 shadow-sm"
      :border="false"
      safe-area-inset-top
    >
      <template #right>
        <van-icon name="setting-o" size="20" @click="handleLogout" />
      </template>
    </van-nav-bar>

    <div class="flex-1 px-4 py-4 space-y-6">
      
      <!-- 个人状态卡片 -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
            {{ user?.realName?.[0] || '?' }}
          </div>
          <div>
            <h2 class="text-base font-bold text-gray-800">{{ user?.realName }}</h2>
            <div class="flex items-center gap-1.5 mt-1">
              <template v-if="isAdmin">
                <span class="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">超级管理员</span>
              </template>
              <template v-else>
                <div class="w-2 h-2 rounded-full" :class="myStatus === 'idle' ? 'bg-green-500' : myStatus === 'interviewing' ? 'bg-red-500' : 'bg-gray-400'"></div>
                <span class="text-xs text-gray-500">{{ statusMap[myStatus] || '挂机中' }}</span>
              </template>
            </div>
          </div>
        </div>
        <!-- 接单开关：仅面试官显示 -->
        <div v-if="!isAdmin" class="flex flex-col items-end gap-2">
          <span class="text-xs text-gray-400">接单状态</span>
          <van-switch v-model="isIdle" @change="toggleStatus" size="24px" active-color="#10B981" />
        </div>
      </div>

      <!-- ===== 管理员功能区 ===== -->
      <template v-if="isAdmin">
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2 px-1">
            <span class="w-1 h-3.5 bg-primary rounded-full inline-block"></span>
            管理功能
          </h3>
          <div class="space-y-3">
            <!-- 入职对接管理入口 -->
            <div
              class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 active:scale-[0.98] transition-transform cursor-pointer"
              @click="router.push('/onboarding-admin')"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <van-icon name="records-o" size="22" class="text-green-600" />
                  </div>
                  <div>
                    <div class="font-medium text-gray-800">入职对接管理</div>
                    <div class="text-xs text-gray-400 mt-0.5">开通候选人入职登记</div>
                  </div>
                </div>
                <van-icon name="arrow" class="text-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- ===== 面试官功能区 ===== -->
      <template v-else>

        <!-- 搜索栏 -->
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
          <h3 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <van-icon name="search" class="text-primary" />
            精确搜索调取
          </h3>
          <van-field
            v-model="searchNo"
            clearable
            placeholder="输入5位面试序号 (如: Ab12C)"
            class="!bg-gray-50 !rounded-xl border border-transparent focus-within:border-primary/30 transition-colors"
            :border="false"
          >
            <template #button>
              <van-button size="small" type="primary" class="!rounded-lg !px-4" @click="handleSearch" :disabled="!searchNo">调取</van-button>
            </template>
          </van-field>
        </div>

        <!-- 当前面试中 -->
        <div v-if="currentInterview" class="mb-6">
          <h3 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2 px-1">
            <span class="w-1 h-3.5 bg-red-500 rounded-full inline-block animate-pulse"></span>
            正在面试中
          </h3>
          <div 
            class="bg-gradient-to-br from-red-50 to-white rounded-2xl p-4 shadow-sm border border-red-100 active:scale-[0.98] transition-transform"
            @click="goToDetail(currentInterview.interview_no)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                  {{ currentInterview.name?.[0] || '?' }}
                </div>
                <div>
                  <div class="font-medium text-gray-800 flex items-center gap-2">
                    {{ currentInterview.name || '未填' }}
                    <span class="text-xs font-mono bg-red-100 text-red-600 px-1.5 py-0.5 rounded">{{ currentInterview.interview_no }}</span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">{{ currentInterview.interview_position || '岗位未填写' }}</div>
                </div>
              </div>
              <div class="flex items-center gap-1 text-red-500 text-sm font-medium">
                继续面试
                <van-icon name="arrow" />
              </div>
            </div>
          </div>
        </div>

        <!-- 候考列表 -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-3 px-1">
            <h3 class="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span class="w-1 h-3.5 bg-yellow-400 rounded-full inline-block"></span>
              等待面试队列
            </h3>
            <span class="text-xs text-gray-400">共 {{ waitingList.length }} 人</span>
          </div>

          <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="min-h-[200px]">
            <div v-if="waitingList.length === 0 && !refreshing" class="py-10 text-center text-gray-400 text-sm">
              当前暂无候考求职者
            </div>
            
            <div v-else class="space-y-3">
              <div 
                v-for="item in waitingList" 
                :key="item.interview_no"
                class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 active:scale-[0.98] transition-transform"
                @click="goToDetail(item.interview_no)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                      {{ item.name?.[0] || '?' }}
                    </div>
                    <div>
                      <div class="font-medium text-gray-800 flex items-center gap-2">
                        {{ item.name || '未填' }}
                        <span class="text-xs font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">{{ item.interview_no }}</span>
                      </div>
                      <div class="text-xs text-gray-400 mt-1">{{ item.interview_position || '岗位未填写' }}</div>
                    </div>
                  </div>
                  <van-icon name="arrow" class="text-gray-300" />
                </div>
              </div>
            </div>
          </van-pull-refresh>
        </div>

      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { interviewApi } from '../api'
import { showToast, showSuccessToast, showConfirmDialog } from 'vant'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const isAdmin = computed(() => user.value?.role === 'super_admin')

const myStatus = ref('offline')
const isIdle = computed({
  get: () => myStatus.value === 'idle',
  set: () => {} // controlled by toggleStatus
})

const statusMap: Record<string, string> = {
  idle: '空闲中',
  offline: '挂机中',
  interviewing: '面试中'
}

const searchNo = ref('')
const waitingList = ref<any[]>([])
const currentInterview = ref<any>(null)
const refreshing = ref(false)

const handleSearch = () => {
  if (searchNo.value.length !== 5) {
    showToast('请输入5位长度的序号')
    return
  }
  goToDetail(searchNo.value)
}

const toggleStatus = async (checked: boolean) => {
  const targetStatus = checked ? 'idle' : 'offline'
  try {
    await interviewApi.toggleStatus(targetStatus)
    myStatus.value = targetStatus
    showSuccessToast(checked ? '已开始接单' : '已挂机')
  } catch (error) {
    //
  }
}

const fetchMyStatus = async () => {
  try {
    const res: any = await interviewApi.getInterviewers()
    const me = res.data?.find((iv: any) => iv.username === user.value?.username)
    if (me) myStatus.value = me.interviewer_status
  } catch (e) {
    //
  }
}

const loadWaiting = async () => {
  try {
    const res: any = await interviewApi.getWaiting()
    waitingList.value = res.data || []
  } catch (e) {
    //
  }
}

const loadCurrentInterview = async () => {
  try {
    const res: any = await interviewApi.getMyRecords()
    const records: any[] = res.data?.list || res.data || []
    currentInterview.value = records.find((r: any) => r.status === 'interviewing') || null
  } catch (e) {
    //
  }

  // fallback：接口无数据时，从 localStorage 恢复正在进行的面试
  if (!currentInterview.value) {
    const savedNo = localStorage.getItem('current_interview_no')
    if (savedNo) {
      try {
        const res: any = await interviewApi.getCandidateByNo(savedNo)
        const data = res.data
        if (data?.record?.status === 'interviewing') {
          currentInterview.value = {
            interview_no: data.record.interview_no,
            name: data.info?.name,
            interview_position: data.info?.interview_position
          }
        } else {
          // 该面试已结束，清除过期的本地记录
          localStorage.removeItem('current_interview_no')
        }
      } catch (e) {
        //
      }
    }
  }
}

const onRefresh = async () => {
  refreshing.value = true
  await Promise.all([fetchMyStatus(), loadWaiting(), loadCurrentInterview()])
  refreshing.value = false
  showToast('已刷新')
}

const goToDetail = (no: string) => {
  router.push(`/candidate/${no}`)
}

const handleLogout = () => {
  showConfirmDialog({
    title: '退出登录',
    message: '确定要退出当前账号吗？',
  }).then(() => {
    authStore.logout()
    router.push('/login')
  }).catch(() => {})
}

let timer: any
onMounted(() => {
  fetchMyStatus()
  loadWaiting()
  loadCurrentInterview()
  timer = setInterval(() => {
    loadWaiting()
    loadCurrentInterview()
  }, 15000) // Poll every 15s
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
