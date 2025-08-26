<template>
   <URadio
      v-for="list of lists"
      :key="list.value"
      :value="modelValue"
      :checked="modelValue === list.value"
      v-bind="list"
      :ui="{ inner: 'ms-2', label: 'w-max text-gray-400', border: 'border-gray-100' }"
      @change="
         (event) => {
            $emit('update:modelValue', event);
            change ? change(event) : '';
         }
      "
   />
</template>
<script setup>
defineProps({
   lists: Array,
   modelValue: String | Number,
   change: Function,
});
</script>
