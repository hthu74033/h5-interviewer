// ===================== 日期/年龄计算 =====================
import type { EvaluationForm } from '../types'

/** localStorage key 常量 */
export const STORAGE_KEYS = {
  token: 'interviewer_token',
  user: 'interviewer_user',
  currentInterviewNo: 'current_interview_no',
} as const

/** 计算年龄 */
export function calculateAge(birthDateStr: string): string {
  if (!birthDateStr) return ''
  const birth = new Date(birthDateStr)
  if (isNaN(birth.getTime())) return ''
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age + ' 岁'
}

/** 格式化为 YYYY-MM-DD */
export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ===================== 字段映射 =====================

/** 获取候选人信息字段值（含类型映射） */
export function getCandidateField(info: any, key: string): string {
  if (key === 'age') return calculateAge(info?.birth_date)
  if (key === 'birth_date') return formatDate(info?.birth_date)
  const val = info?.[key]
  const maps: Record<string, Record<string, string>> = {
    gender: { male: '男', female: '女' },
    marital_status: { married: '已婚', single: '未婚', divorced: '离异', widowed: '丧偶' }
  }
  return maps[key]?.[val] || val || ''
}

// ===================== 状态映射 =====================

/** 面试状态文字 */
export function statusText(status: string): string {
  const map: Record<string, string> = {
    pending: '未填写',
    filling: '填写中',
    waiting: '等待面试',
    interviewing: '面试中',
    completed: '已完成'
  }
  return map[status] || status
}

// ===================== 评价默认值 =====================

/** 返回 EvaluationForm 的初始空值（工厂函数） */
export function defaultEvalForm(): EvaluationForm {
  return {
    personality: '', relationship_status: '', job_acceptance: '', willingness: '',
    mandarin_proficiency: '', voice_tested: '', accept_relocation: '',
    tiktok_status: '', tiktok_detail: '', talent_status: '', talent_detail: '',
    past_experience: '', interviewer_evaluation: '', other_remarks: '',
  }
}

