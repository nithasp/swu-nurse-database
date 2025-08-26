<template>
   <div>
      <label v-if="label" class="pb-[6px] text-gray-500 text-sm">{{ label }}</label>
      <div class="relative">
         <div class="me-2 cursor-pointer absolute left-3 top-1/2 translate-y-[-50%]">
            <slot v-if="icon" name="icon"></slot>
         </div>
         <input
            :type="type"
            autocomplete="off"
            :id="inputId"
            :placeholder="placeholder || ''"
            :class="[
               requireInput?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100 pe-9' : '',
               icon ? 'ps-10' : '',
               type == 'picker' ? 'cursor-pointer' : '',
               heightClass ? `${heightClass}` : 'h-11',
               placeholderColor ? `placeholder:${placeholderColor}` : 'placeholder:text-gray-100',
               'text-sm leading-[3] placeholder:h-full placeholder:text-sm rounded-lg px-[14px] w-full border border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed',
            ]"
            :value="value ? value : modelValue"
            @change="
               (event) => {
                  $emit('update:modelValue', event.target.value);
               }
            "
            :disabled="disabled"
            :readonly="readonly"
            @keypress="type == 'number' ? (isNumberOnly ? inputNumberOnly($event) : inputNumberAndDotOnly($event)) : ''"
            :min="type == 'number' ? 0 : ''"
         />
         <svg
            v-if="requireInput?.showMessage"
            width="16"
            height="15"
            viewBox="0 0 16 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute top-1/2 translate-y-[-50%] right-[0.7rem]"
         >
            <path
               d="M7.99998 4.8335V7.50016M7.99998 10.1668H8.00665M14.6666 7.50016C14.6666 11.1821 11.6819 14.1668 7.99998 14.1668C4.31808 14.1668 1.33331 11.1821 1.33331 7.50016C1.33331 3.81826 4.31808 0.833496 7.99998 0.833496C11.6819 0.833496 14.6666 3.81826 14.6666 7.50016Z"
               stroke="#F04438"
               stroke-width="1.33333"
               stroke-linecap="round"
               stroke-linejoin="round"
            />
         </svg>
      </div>
      <div class="flex items-center mt-2" v-if="requireInput?.showMessage">
         <label class="text-error-500 text-sm">{{ requireInput.message }}</label>
      </div>
   </div>
</template>
<script setup>
defineProps({
   label: String,
   placeholder: String,
   type: String,
   icon: Boolean,
   modelValue: String | Number,
   requireInput: Object,
   disabled: Boolean,
   value: String,
   readonly: Boolean,
   inputId: String,
   heightClass: String,
   placeholderColor: String,
   isNumberOnly: Boolean,
});
</script>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
   -webkit-appearance: none;
   margin: 0;
}
</style>
