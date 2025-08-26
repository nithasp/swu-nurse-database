<template>
   <div>
      <USelectMenu
         v-model="dropdownData"
         by="id"
         name="labels"
         :options="options"
         :option-attribute="optionAttribute"
         multiple
         searchable
         :searchable-placeholder="searchablePlaceholder || 'ค้นหา'"
         :disabled="disabled"
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
            label: `px-1 leading-[3]`,
            input: 'border-gray-100 placeholder:text-gray-100 placeholder:leading-[1.8]',
         }"
      >
         <template #label>
            <template v-if="dropdownData.length">
               <div class="text-sm truncate leading-[3]">
                  <span v-for="(label, index) of dropdownData" :key="label.id">
                     {{ index == 0 ? label[optionAttribute] : `, ${label[optionAttribute]}` }}
                  </span>
               </div>
            </template>
            <template v-else>
               <span :class="[labelDefalutIsPlaceholder ? 'text-gray-100' : '', 'text-sm truncate leading-[3]']">{{ labelDefalut }}</span>
            </template>
         </template>
         <template #option="{ option }">
            <span class="truncate leading-7 ps-1">{{ option[optionAttribute] }}</span>
         </template>
      </USelectMenu>
      <div class="flex items-center mt-2" v-if="requireInput?.showMessage">
         <label class="text-error-500 text-sm">{{ requireInput.message }}</label>
      </div>
   </div>
</template>
<script setup>
const props = defineProps({
   options: Array,
   modelValue: String | Number,
   required: Boolean,
   optionAttribute: String,
   searchablePlaceholder: String,
   labelDefalut: String,
   labelDefalutIsPlaceholder: Boolean,
   requireInput: Object,
   disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);
const dropdownData = computed({
   get: () => props.modelValue,
   set: async (labels) => {
      const promises = labels.map(async (label) => {
         if (label.id) {
            return label;
         }
      });
      const value = await Promise.all(promises);
      emit("update:modelValue", value);
   },
});
</script>
