<template>
   <UDropdown
      :items="menus"
      :ui="{
         width: 'min-w-[102px] max-w-[150px]',
         item: {
            active: 'bg-gray-50',
         },
      }"
   >
      <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-vertical-20-solid" />
   </UDropdown>
</template>
<script setup>
const props = defineProps({
   menus: Array,
});
</script>
