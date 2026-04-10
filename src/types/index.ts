// ===================== 面试状态 =====================
export type InterviewStatus = 'pending' | 'filling' | 'waiting' | 'interviewing' | 'completed'

// ===================== 候选人信息 =====================
export interface CandidateInfo {
  interview_no?: string
  name?: string
  gender?: string
  birth_date?: string
  phone?: string
  wechat_id?: string
  wechat_name?: string
  hometown?: string
  ethnicity?: string
  marital_status?: string
  address?: string
  commute_type?: string
  estimated_commute_time?: string
  interview_position?: string
  expected_salary?: string
  expected_start?: string
  recruitment_source?: string
  recruitment_detail?: string
  disease_history?: string
  hobbies?: string
  self_evaluation?: string
}

export interface EducationItem {
  id?: number
  school?: string
  major?: string
  degree?: string
  is_fresh_graduate?: boolean
  start_date?: string
  end_date?: string
}

export interface WorkItem {
  id?: number
  company?: string
  position?: string
  start_date?: string
  end_date?: string
  job_content?: string
  leave_reason?: string
}

export interface FamilyItem {
  id?: number
  name?: string
  relationship?: string
  age?: string | number
  emergency_phone?: string
  company?: string
  position?: string
}

// ===================== 面试评价 =====================
export interface EvaluationForm {
  personality: string
  relationship_status: string
  job_acceptance: string
  willingness: string
  mandarin_proficiency: string
  voice_tested: string
  accept_relocation: string
  tiktok_status: string
  tiktok_detail: string
  talent_status: string
  talent_detail: string
  past_experience: string
  interviewer_evaluation: string
  other_remarks: string
}

// ===================== 候选人详情 =====================
export interface CandidateDetail {
  info: CandidateInfo
  record: {
    interview_no: string
    status: InterviewStatus
    interviewer_id?: number
  }
  education?: EducationItem[]
  work?: WorkItem[]
  family?: FamilyItem[]
  evaluation?: EvaluationForm
}
