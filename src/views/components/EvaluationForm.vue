<template>
  <!-- 面试评价 Tab（选项按钮 + 文本输入 + 保存按钮） -->
  <div class="p-4 space-y-4">

    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <div class="text-sm font-bold text-gray-800 mb-2">1. 性格</div>
      <div class="flex flex-wrap gap-2">
        <button v-for="opt in PERSONALITY_OPTIONS" :key="opt" @click="emit('update', 'personality', opt)"
          class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
          :class="form.personality === opt ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 border-gray-200'">{{ opt }}</button>
      </div>
    </div>

    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <div class="text-sm font-bold text-gray-800 mb-2">2. 婚恋情况</div>
      <div class="flex flex-wrap gap-2">
        <button v-for="opt in RELATIONSHIP_OPTIONS" :key="opt" @click="emit('update', 'relationship_status', opt)"
          class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
          :class="form.relationship_status === opt ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 border-gray-200'">{{ opt }}</button>
      </div>
    </div>

    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <div class="text-sm font-bold text-gray-800 mb-2">3. 工作内容接受度</div>
      <div class="flex flex-wrap gap-2">
        <button v-for="opt in JOB_ACCEPTANCE_OPTIONS" :key="opt" @click="emit('update', 'job_acceptance', opt)"
          class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
          :class="form.job_acceptance === opt ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 border-gray-200'">{{ opt }}</button>
      </div>
    </div>

    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <div class="text-sm font-bold text-gray-800 mb-2">4. 意愿度</div>
      <div class="flex flex-wrap gap-2">
        <button v-for="opt in WILLINGNESS_OPTIONS" :key="opt" @click="emit('update', 'willingness', opt)"
          class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
          :class="form.willingness === opt ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 border-gray-200'">{{ opt }}</button>
      </div>
    </div>

    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <div class="text-sm font-bold text-gray-800 mb-2">5. 普通话程度</div>
      <div class="flex flex-wrap gap-2">
        <button v-for="opt in MANDARIN_OPTIONS" :key="opt" @click="emit('update', 'mandarin_proficiency', opt)"
          class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
          :class="form.mandarin_proficiency === opt ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 border-gray-200'">{{ opt }}</button>
      </div>
    </div>

    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <div class="text-sm font-bold text-gray-800 mb-2">6. 是否试音</div>
      <div class="flex flex-wrap gap-2">
        <button v-for="opt in YESNO_OPTIONS" :key="opt" @click="emit('update', 'voice_tested', opt)"
          class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
          :class="form.voice_tested === opt ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 border-gray-200'">{{ opt }}</button>
      </div>
    </div>

    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <div class="text-sm font-bold text-gray-800 mb-2">7. 是否接受外调</div>
      <div class="flex flex-wrap gap-2">
        <button v-for="opt in YESNO_OPTIONS" :key="opt" @click="emit('update', 'accept_relocation', opt)"
          class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
          :class="form.accept_relocation === opt ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 border-gray-200'">{{ opt }}</button>
      </div>
    </div>

    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <div class="text-sm font-bold text-gray-800 mb-2">8. 抖音账号情况</div>
      <div class="flex flex-wrap gap-2 mb-2">
        <button v-for="opt in TIKTOK_OPTIONS" :key="opt" @click="emit('update', 'tiktok_status', opt)"
          class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
          :class="form.tiktok_status === opt ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 border-gray-200'">{{ opt }}</button>
      </div>
      <input v-if="form.tiktok_status === '其他'"
        :value="form.tiktok_detail"
        @input="emit('update', 'tiktok_detail', ($event.target as HTMLInputElement).value)"
        type="text" placeholder="请具体说明"
        class="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none mt-1" />
    </div>

    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <div class="text-sm font-bold text-gray-800 mb-2">9. 才艺情况</div>
      <div class="flex flex-wrap gap-2 mb-2">
        <button v-for="opt in TALENT_OPTIONS" :key="opt" @click="emit('update', 'talent_status', opt)"
          class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all"
          :class="form.talent_status === opt ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 border-gray-200'">{{ opt }}</button>
      </div>
      <input v-if="form.talent_status === '其他'"
        :value="form.talent_detail"
        @input="emit('update', 'talent_detail', ($event.target as HTMLInputElement).value)"
        type="text" placeholder="请具体说明"
        class="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none mt-1" />
    </div>

    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <div class="text-sm font-bold text-gray-800 mb-2">10. 过往工作经历</div>
      <textarea :value="form.past_experience" @input="emit('update', 'past_experience', ($event.target as HTMLTextAreaElement).value)"
        rows="3" placeholder="具体描述"
        class="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none resize-none"></textarea>
    </div>

    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <div class="text-sm font-bold text-gray-800 mb-2">11. 面试对接人评价</div>
      <textarea :value="form.interviewer_evaluation" @input="emit('update', 'interviewer_evaluation', ($event.target as HTMLTextAreaElement).value)"
        rows="3" placeholder="具体评价"
        class="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none resize-none"></textarea>
    </div>

    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
      <div class="text-sm font-bold text-gray-800 mb-2">12. 其他备注</div>
      <textarea :value="form.other_remarks" @input="emit('update', 'other_remarks', ($event.target as HTMLTextAreaElement).value)"
        rows="2" placeholder="具体备注"
        class="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none resize-none"></textarea>
    </div>

    <van-button type="primary" block round @click="emit('save')" class="mt-4 mb-2 shadow-lg shadow-primary/30">
      保存当前评价
    </van-button>
  </div>
</template>

<script setup lang="ts">
import {
  PERSONALITY_OPTIONS, RELATIONSHIP_OPTIONS, JOB_ACCEPTANCE_OPTIONS,
  WILLINGNESS_OPTIONS, MANDARIN_OPTIONS, YESNO_OPTIONS,
  TIKTOK_OPTIONS, TALENT_OPTIONS
} from '../../utils/evalOptions'
import type { EvaluationForm } from '../../types'

// ===================== Props =====================
const props = defineProps<{
  form: EvaluationForm
}>()

// ===================== Emits =====================
const emit = defineEmits<{
  update: [key: keyof EvaluationForm, value: string]
  save: []
}>()
</script>
