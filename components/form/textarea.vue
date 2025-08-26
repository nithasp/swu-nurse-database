<template>
   <div>
      <textarea
         autocomplete="off"
         :placeholder="placeholder || ''"
         :class="[
            requireInput?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : '',
            'text-sm resize-none rounded-lg placeholder:text-gray-100 placeholder:text-sm px-[14px] w-full py-[10px] border border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed',
         ]"
         :value="modelValue"
         @change="
            (event) => {
               $emit('update:modelValue', event.target.value);
            }
         "
         :disabled="disabled"
         :rows="rows"
      >
      </textarea>
      <div class="flex items-center" v-if="requireInput?.showMessage">
         <label class="text-error-500 text-sm">{{ requireInput.message }}</label>
      </div>
   </div>
</template>
<script setup>
defineProps({
   placeholder: String,
   modelValue: String,
   requireInput: Object,
   disabled: Boolean,
   rows: String,
});
</script>
