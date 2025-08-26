<template>
   <div>
      <USelectMenu
         :placeholder="placeholder || '-- เลือก --'"
         :options="options"
         :value-attribute="attributeValue"
         :option-attribute="attributeOption"
         :searchable="searchable"
         :searchable-placeholder="searchablePlaceholder || 'ค้นหา'"
         color="white"
         :ui="{
            base: `h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
               requireInput?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
            }`,
            rounded: 'rounded-lg',
            placeholder: `text-gray-100 [&_span]:text-sm`,
         }"
         :uiMenu="{
            ring: 'ring-gray-100',
            option: {
               base: 'leading-[1.8]',
               active: 'bg-gray-50 cursor-pointer',
            },
            label: `!leading-[3] px-1 text-sm`,
            input: 'border-gray-100 placeholder:text-gray-100',
         }"
         :required="required"
         @change="changeSelect"
         v-model="selected"
         :disabled="disabled"
      >
         <template #option="{ option }">
            <span class="truncate leading-7 ps-1">{{ option[attributeOption] }}</span>
         </template>
      </USelectMenu>
      <div class="flex items-center mt-2" v-if="requireInput?.showMessage">
         <label class="text-error-500 text-sm">{{ requireInput.message }}</label>
      </div>
   </div>
</template>
<script setup>
const props = defineProps({
   required: Boolean,
   attributeValue: String,
   attributeOption: String,
   options: Array,
   modelValue: String | Number,
   placeholder: String,
   searchablePlaceholder: String,
   searchable: Boolean,
   requireInput: Object,
   disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);
const selected = ref(props.modelValue);
watch(
   () => props.modelValue,
   (newValue) => {
      selected.value = newValue;
   }
);

const changeSelect = (value) => {
   emit("update:modelValue", value);
};
</script>
