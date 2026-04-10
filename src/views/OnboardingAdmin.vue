<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="入职对接管理"
      left-arrow
      class="bg-white/80 backdrop-blur-md !border-b-0 sticky top-0 z-50 shadow-sm"
      :border="false"
      safe-area-inset-top
      @click-left="router.back()"
    >
      <template #right>
        <van-icon name="setting-o" size="20" @click="handleLogout" />
      </template>
    </van-nav-bar>

    <div class="flex-1 px-4 py-4 flex flex-col gap-4">

      <!-- 搜索框 -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
        <van-field
          v-model="keyword"
          clearable
          placeholder="搜索姓名 / 手机号 / 面试序号（全局搜索）"
          class="!bg-gray-50 !rounded-xl border border-transparent focus-within:border-primary/30 transition-colors"
          :border="false"
          @update:model-value="onKeywordChange"
        >
          <template #left-icon>
            <van-icon name="search" class="text-gray-400 mr-1" />
          </template>
        </van-field>

        <!-- 日期范围提示：无搜索词时显示当前筛选范围 -->
        <div v-if="!keyword" class="mt-2 px-1 flex items-center justify-between">
          <span class="text-xs text-gray-400">
            预约入职日期：{{ dateFromLabel }} ~ {{ dateToLabel }}
          </span>
          <div class="flex items-center gap-2">
            <button
              class="text-xs px-2.5 py-1 rounded-full border transition-colors"
              :class="activeRange === 'today' ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-500'"
              @click="setRange('today')"
            >今天</button>
            <button
              class="text-xs px-2.5 py-1 rounded-full border transition-colors"
              :class="activeRange === '7d' ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-500'"
              @click="setRange('7d')"
            >近7天</button>
            <button
              class="text-xs px-2.5 py-1 rounded-full border transition-colors"
              :class="activeRange === 'all' ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-500'"
              @click="setRange('all')"
            >全部</button>
          </div>
        </div>
        <div v-else class="mt-1.5 px-1 text-xs text-primary">
          正在全局搜索「{{ keyword }}」，不限日期范围
        </div>
      </div>

      <!-- 统计标签 -->
      <div v-if="!keyword && total > 0" class="flex items-center gap-2 px-1">
        <span class="text-xs text-gray-400">共 {{ total }} 人</span>
        <span v-if="pendingCount > 0" class="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full">
          {{ pendingCount }} 人待开通
        </span>
      </div>

      <!-- 列表 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="!hasMore"
          finished-text="没有更多了"
          @load="loadMore"
        >
          <div class="space-y-3">
            <div
              v-for="item in list"
              :key="item.interview_no"
              class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50"
            >
              <!-- 头部：姓名 + 序号 + 状态标签 -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-base shrink-0">
                    {{ item.name?.[0] || '?' }}
                  </div>
                  <div>
                    <div class="font-medium text-gray-800 flex items-center gap-2 flex-wrap">
                      {{ item.name || '未填写' }}
                      <span class="text-xs font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        {{ item.interview_no }}
                      </span>
                    </div>
                    <div class="text-xs text-gray-400 mt-0.5">{{ item.interview_position || '岗位未填写' }}</div>
                  </div>
                </div>
                <van-tag
                  :type="statusTagType(item.onboarding_status)"
                  size="medium"
                  round
                  class="shrink-0"
                >
                  {{ statusLabel(item.onboarding_status) }}
                </van-tag>
              </div>

              <!-- 详情行 -->
              <div class="flex items-center gap-4 text-xs text-gray-500 mb-3 pl-13">
                <span class="flex items-center gap-1">
                  <van-icon name="phone-o" size="12" />
                  {{ item.phone || '未填' }}
                </span>
                <span v-if="item.expected_onboard_date" class="flex items-center gap-1">
                  <van-icon name="calendar-o" size="12" />
                  预约 {{ formatDate(item.expected_onboard_date) }}
                </span>
              </div>

              <!-- 开通按钮 -->
              <div v-if="item.onboarding_status === 'pending'" class="flex justify-end">
                <van-button
                  type="primary"
                  size="small"
                  round
                  :loading="enablingSet.has(item.interview_no)"
                  :disabled="enablingSet.has(item.interview_no)"
                  class="!px-5"
                  @click="handleEnable(item)"
                >
                  开通入职登记
                </van-button>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="!loading && list.length === 0" class="py-16 text-center text-gray-400 text-sm">
              <van-icon name="records-o" size="48" class="mb-3 text-gray-200" />
              <div v-if="keyword">未找到「{{ keyword }}」相关候选人</div>
              <div v-else>{{ activeRange === 'today' ? '今天' : activeRange === '7d' ? '近7天' : '' }}暂无预约入职人员</div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { onboardingApi } from '../api'
import { showSuccessToast, showConfirmDialog, showFailToast } from 'vant'

const router = useRouter()
const authStore = useAuthStore()

const keyword = ref('')
const list = ref<any[]>([])
const loading = ref(false)
const refreshing = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = 20
const total = ref(0)

// 正在开通中的序号集合（防重复点击）
const enablingSet = reactive(new Set<string>())

// 日期范围：默认近7天
type RangeKey = 'today' | '7d' | 'all'
const activeRange = ref<RangeKey>('7d')

const getDateRange = (range: RangeKey): { dateFrom: string | undefined; dateTo: string | undefined } => {
  const today = new Date()
  const toStr = (d: Date) => d.toISOString().slice(0, 10)
  if (range === 'today') {
    const s = toStr(today)
    return { dateFrom: s, dateTo: s }
  }
  if (range === '7d') {
    const from = new Date(today)
    from.setDate(today.getDate() - 6)
    return { dateFrom: toStr(from), dateTo: toStr(today) }
  }
  return { dateFrom: undefined, dateTo: undefined }
}

const dateFromLabel = computed(() => getDateRange(activeRange.value).dateFrom || '—')
const dateToLabel = computed(() => getDateRange(activeRange.value).dateTo || '—')

const pendingCount = computed(() => list.value.filter(i => i.onboarding_status === 'pending').length)

const setRange = (r: RangeKey) => {
  activeRange.value = r
  resetAndLoad()
}

let debounceTimer: any = null

const onKeywordChange = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    resetAndLoad()
  }, 300)
}

const resetAndLoad = () => {
  list.value = []
  page.value = 1
  hasMore.value = true
  total.value = 0
  loading.value = false
  loadMore()
}

const loadMore = async () => {
  if (!hasMore.value || loading.value) return
  loading.value = true
  try {
    const { dateFrom, dateTo } = keyword.value ? { dateFrom: undefined, dateTo: undefined } : getDateRange(activeRange.value)
    const res: any = await onboardingApi.getList({
      keyword: keyword.value || undefined,
      dateFrom,
      dateTo,
      page: page.value,
      pageSize
    })
    const items: any[] = res.data?.list || res.data || []
    total.value = res.data?.total ?? total.value
    list.value.push(...items)
    if (list.value.length >= total.value || items.length < pageSize) {
      hasMore.value = false
    } else {
      page.value++
    }
  } catch (e) {
    hasMore.value = false
  } finally {
    loading.value = false
  }
}

const onRefresh = async () => {
  refreshing.value = true
  list.value = []
  page.value = 1
  hasMore.value = true
  total.value = 0
  loading.value = false
  await loadMore()
  refreshing.value = false
  showSuccessToast('已刷新')
}

const handleEnable = async (item: any) => {
  try {
    await showConfirmDialog({
      title: '确认开通入职登记',
      message: `确定为「${item.name}」(${item.interview_no}) 开通入职登记吗？`
    })
  } catch {
    return
  }

  enablingSet.add(item.interview_no)
  try {
    await onboardingApi.enable(item.interview_no)
    const target = list.value.find(i => i.interview_no === item.interview_no)
    if (target) target.onboarding_status = 'enabled'
    showSuccessToast('开通成功')
  } catch (e: any) {
    showFailToast(e?.message || '开通失败')
  } finally {
    enablingSet.delete(item.interview_no)
  }
}

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: '未开通',
    enabled: '待填写',
    completed: '已完成'
  }
  return map[status] || status
}

const statusTagType = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' => {
  const map: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
    pending: 'danger',
    enabled: 'warning',
    completed: 'success'
  }
  return map[status] || 'default'
}

const formatDate = (val: string) => {
  if (!val) return ''
  return val.slice(0, 10)
}

const handleLogout = () => {
  showConfirmDialog({
    title: '退出登录',
    message: '确定要退出当前账号吗？'
  }).then(() => {
    authStore.logout()
    router.push('/login')
  }).catch(() => {})
}

onMounted(() => {
  resetAndLoad()
})
</script>
