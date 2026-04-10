<template>
  <!-- 面试者登记信息 Tab（只读展示：个人资料、教育背景、工作经历、家庭成员） -->
  <div class="p-4 space-y-4">

    <!-- 个人资料 -->
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <h3 class="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        <div class="w-1 h-3 bg-primary rounded-full"></div>个人资料
      </h3>
      <div class="grid grid-cols-2 gap-y-5 gap-x-3">
        <div
          v-for="field in basicFields"
          :key="field.key"
          :class="['disease_history', 'hobbies', 'self_evaluation'].includes(field.key) ? 'col-span-2' : ''"
        >
          <div class="text-xs text-gray-400 mb-1 shrink-0">{{ field.label }}</div>
          <div class="text-sm font-medium text-gray-800 leading-snug break-words">{{ getField(field.key) || '-' }}</div>
        </div>
      </div>
    </div>

    <!-- 教育背景 -->
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <h3 class="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        <div class="w-1 h-3 bg-primary rounded-full"></div>教育背景
      </h3>
      <div v-if="!education?.length" class="text-gray-400 text-sm text-center py-2">未填写教育背景</div>
      <div v-else class="space-y-3">
        <div v-for="(edu, i) in education" :key="i" class="bg-gray-50 rounded-xl p-3 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-12 h-12 bg-blue-100/50 rounded-bl-full -z-10"></div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">{{ edu.degree }}</span>
            <span v-if="edu.is_fresh_graduate" class="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded">应届生</span>
          </div>
          <div class="font-bold text-gray-800 text-sm mb-1">{{ edu.school }}</div>
          <div class="text-sm text-gray-600 mb-1">{{ edu.major }}</div>
          <div class="text-xs text-gray-400">{{ edu.start_date }} ~ {{ edu.end_date }}</div>
        </div>
      </div>
    </div>

    <!-- 工作经历 -->
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <h3 class="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        <div class="w-1 h-3 bg-primary rounded-full"></div>工作经历
      </h3>
      <div v-if="!work?.length" class="text-gray-400 text-sm text-center py-2">无工作经历</div>
      <div v-else class="space-y-3">
        <div v-for="(w, i) in work" :key="i" class="bg-gray-50 rounded-xl p-3">
          <div class="font-bold text-gray-800 text-sm mb-2">{{ w.company }}</div>
          <div class="text-xs text-primary bg-primary/5 inline-block px-2 py-1 rounded mb-2">{{ w.start_date }} ~ {{ w.end_date }}</div>
          <div class="text-sm text-gray-600 leading-relaxed mb-2">{{ w.job_content }}</div>
          <div class="text-xs text-gray-500 flex items-center gap-1">
            <van-icon name="info-o" /> 离职原因：{{ w.leave_reason }}
          </div>
        </div>
      </div>
    </div>

    <!-- 家庭成员 -->
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <h3 class="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        <div class="w-1 h-3 bg-primary rounded-full"></div>家庭成员
      </h3>
      <div v-if="!family?.length" class="text-gray-400 text-sm text-center py-2">未填写家庭成员</div>
      <div v-else class="space-y-3">
        <div v-for="(f, i) in family" :key="i" class="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
          <div class="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 text-sm font-bold shrink-0">
            {{ f.name?.[0] }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-bold text-gray-800 text-sm truncate">
              {{ f.name }}
              <span class="text-gray-400 text-xs font-normal ml-1">({{ f.relationship }}, {{ f.age }}岁)</span>
            </div>
            <div class="text-xs text-gray-500 truncate mt-0.5">{{ f.company }} · {{ f.position }}</div>
          </div>
          <a :href="'tel:' + f.emergency_phone" class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shrink-0 active:bg-primary/10 shadow-sm border border-gray-100">
            <van-icon name="phone-o" size="14" />
          </a>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { getCandidateField } from '../../utils'
import type { CandidateInfo, EducationItem, WorkItem, FamilyItem } from '../../types'

// ===================== Props =====================
const props = defineProps<{
  info: CandidateInfo
  education?: EducationItem[]
  work?: WorkItem[]
  family?: FamilyItem[]
}>()

// 个人资料字段配置
const basicFields = [
  { key: 'recruitment_source', label: '招聘来源' }, { key: 'recruitment_detail', label: '来源明细' },
  { key: 'gender', label: '性别' }, { key: 'birth_date', label: '出生日期' }, { key: 'age', label: '年龄' },
  { key: 'phone', label: '联系电话' }, { key: 'wechat_name', label: '微信名' },
  { key: 'wechat_id', label: '微信号' }, { key: 'hometown', label: '祖籍' },
  { key: 'ethnicity', label: '民族' }, { key: 'marital_status', label: '婚姻状况' },
  { key: 'address', label: '现住址' }, { key: 'commute_type', label: '通勤方式' },
  { key: 'estimated_commute_time', label: '通勤时间' },
  { key: 'expected_salary', label: '期望薪资' }, { key: 'expected_start', label: '预计到岗' },
  { key: 'disease_history', label: '重大病史' }, { key: 'hobbies', label: '兴趣爱好' },
  { key: 'self_evaluation', label: '自我评价' },
]

function getField(key: string): string {
  return getCandidateField(props.info, key)
}
</script>
