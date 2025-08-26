<template>
   <UCheckbox
      color="primary"
      :label="label"
      @change="changeCheckbox"
      :model-value="checkedValue"
      :ui="{
         form: `${!disabled ? 'cursor-pointer' : ''} select-none`,
         label: `${!disabled ? 'cursor-pointer' : ''} select-none`,
         border: 'border-gray-100',
      }"
      :disabled="disabled"
   />
</template>
<script setup>
const props = defineProps({
   label: String,
   modelValue: Boolean,
   disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);
const checkedValue = ref(props.modelValue);
watch(
   () => props.modelValue,
   (newValue) => {
      checkedValue.value = newValue;
   }
);

const changeCheckbox = (value) => {
   emit("update:modelValue", value);
};
</script>
