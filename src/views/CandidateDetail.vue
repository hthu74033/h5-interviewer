<template>
  <div class="min-h-screen bg-background flex flex-col pb-20">
    <van-nav-bar
      title="求职者详情"
      left-arrow
      @click-left="router.back()"
      class="bg-white/80 backdrop-blur-md !border-b-0 sticky top-0 z-50 shadow-sm"
      :border="false"
      safe-area-inset-top
    />

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <van-loading type="spinner" color="#3B82F6" />
    </div>

    <div v-else-if="candidateData" class="flex-1">
      <!-- 头部信息 -->
      <div class="bg-white p-5 shadow-sm border-b border-gray-100/50">
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary-lighter rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/20 shrink-0">
            {{ candidateData.info.name?.[0] || '?' }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-800 truncate">{{ candidateData.info.name }}</h2>
              <span
                class="text-xs px-2 py-1 rounded-md shrink-0"
                :class="{
                  'bg-yellow-50 text-yellow-600': candidateData.record.status === 'waiting',
                  'bg-red-50 text-red-600': candidateData.record.status === 'interviewing',
                  'bg-green-50 text-green-600': candidateData.record.status === 'completed'
                }"
              >
                {{ statusText(candidateData.record.status) }}
              </span>
            </div>
            <div class="text-sm text-gray-500 mt-1 truncate">{{ candidateData.info.interview_position }}</div>
            <div class="text-xs font-mono bg-gray-50 text-gray-500 px-2 py-1 rounded inline-block mt-2">
              序号: {{ candidateData.info.interview_no }}
            </div>
          </div>
        </div>
      </div>

      <!-- 详情 Tabs -->
      <van-tabs v-model:active="activeTab" sticky offset-top="46" color="#3B82F6" swipeable class="mt-2">

        <!-- 面试者登记信息 -->
        <van-tab title="面试者登记信息" name="registration">
          <CandidateInfo
            :info="candidateData.info"
            :education="candidateData.education"
            :work="candidateData.work"
            :family="candidateData.family"
          />
        </van-tab>

        <!-- 面试评价（仅开始后可填/查看） -->
        <van-tab title="面试评价" name="evaluation" v-if="candidateData.record.status !== 'waiting'">
          <EvaluationForm
            :form="evalForm"
            @update="(key, val) => (evalForm[key] = val)"
            @save="saveEvaluation(true)"
          />
        </van-tab>

      </van-tabs>
    </div>

    <div v-else class="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <van-icon name="warning-o" size="48" class="text-gray-300 mb-4" />
      <p class="text-gray-500">未找到该求职者信息</p>
      <van-button type="primary" plain size="small" class="mt-4" @click="router.back()">返回</van-button>
    </div>

    <!-- 底部操作栏 -->
    <van-action-bar v-if="candidateData" class="border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe px-2 h-16">
      <template v-if="candidateData.record.status === 'waiting'">
        <van-action-bar-button
          type="primary"
          text="开始面试"
          @click="handleStart"
          :loading="actionLoading"
          class="!rounded-xl !mx-2 !bg-primary !border-primary shadow-lg shadow-primary/30 font-medium"
        />
      </template>
      <template v-else-if="candidateData.record.status === 'interviewing'">
        <van-action-bar-button
          color="#10B981"
          text="面试完成 (接单)"
          @click="handleFinish('idle')"
          :loading="actionLoading"
          class="!rounded-xl !ml-2 !mr-1 shadow-lg shadow-emerald-500/30 font-medium text-sm"
        />
        <van-action-bar-button
          color="#6B7280"
          text="面试完成 (挂机)"
          @click="handleFinish('offline')"
          :loading="actionLoading"
          class="!rounded-xl !mr-2 !ml-1 shadow-lg shadow-gray-500/30 font-medium text-sm"
        />
      </template>
      <template v-else>
        <van-action-bar-button disabled text="面试已结束" class="!rounded-xl !mx-2" />
      </template>
    </van-action-bar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { interviewApi } from '../api'
import { showSuccessToast, showFailToast, showConfirmDialog } from 'vant'
import CandidateInfo from './components/CandidateInfo.vue'
import EvaluationForm from './components/EvaluationForm.vue'
import { statusText, STORAGE_KEYS } from '../utils'
import type { CandidateDetail, EvaluationForm as EvalFormType } from '../types'

const route = useRoute()
const router = useRouter()

const no = route.params.no as string
const loading = ref(true)
const candidateData = ref<CandidateDetail | null>(null)
const evalForm = reactive<EvalFormType>({
  personality: '', relationship_status: '', job_acceptance: '', willingness: '',
  mandarin_proficiency: '', voice_tested: '', accept_relocation: '',
  tiktok_status: '', tiktok_detail: '', talent_status: '', talent_detail: '',
  past_experience: '', interviewer_evaluation: '', other_remarks: ''
})
const activeTab = ref('registration')
const actionLoading = ref(false)

const loadData = async () => {
  try {
    const res: any = await interviewApi.getCandidateByNo(no)
    candidateData.value = res.data
    if (res.data.evaluation) {
      Object.assign(evalForm, res.data.evaluation)
    }
  } catch (e: any) {
    showFailToast(e?.message || '加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleStart = async () => {
  showConfirmDialog({
    title: '开始面试',
    message: '确认开始与该求职者面试吗？'
  }).then(async () => {
    actionLoading.value = true
    try {
      await interviewApi.start(candidateData.value!.record.interview_no)
      candidateData.value!.record.status = 'interviewing'
      localStorage.setItem(STORAGE_KEYS.currentInterviewNo, candidateData.value!.record.interview_no)
      showSuccessToast('面试已开始')
    } catch (e: any) {
      showFailToast(e?.message || '操作失败，请重试')
    } finally {
      actionLoading.value = false
    }
  }).catch(() => {})
}

const saveEvaluation = async (showMsg = false) => {
  try {
    await interviewApi.evaluate({
      interviewNo: candidateData.value!.record.interview_no,
      evalData: { ...evalForm }
    })
    if (showMsg) showSuccessToast('评价已保存')
  } catch (e: any) {
    if (showMsg) showFailToast(e?.message || '保存评价失败')
  }
}

const handleFinish = async (nextStatus: string) => {
  const text = nextStatus === 'idle' ? '接单' : '挂机'
  showConfirmDialog({
    title: '完成面试',
    message: `确认结束面试？结束后您将进入【${text}】状态`
  }).then(async () => {
    actionLoading.value = true
    try {
      await saveEvaluation(false) // 自动保存评价
      await interviewApi.finish(candidateData.value!.record.interview_no, nextStatus)
      candidateData.value!.record.status = 'completed'
      localStorage.removeItem(STORAGE_KEYS.currentInterviewNo)
      showSuccessToast('面试已完成')
      setTimeout(() => { router.back() }, 1000)
    } catch (e: any) {
      showFailToast(e?.message || '操作失败，请重试')
    } finally {
      actionLoading.value = false
    }
  }).catch(() => {})
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.pb-safe {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
