<template>
   <div class="p-1.5">
      <div class="flex gap-3 mb-5 overflow-x-auto">
         <UButton
            v-for="tab in tabs"
            :key="`${tab.id}_tab_dashboard`"
            variant="solid"
            :label="tab.label"
            block
            :class="[page == tab.id ? 'bg-primary-500' : 'bg-gray-100 hover:bg-gray-100 hover:opacity-75 text-[#333]', 'rounded-xl h-12 w-[234px]']"
            @click="page = tab.id"
         />
      </div>
      <TrainingTable v-if="page == 1" />
      <LeaveTable v-else-if="page == 2" />
   </div>
</template>
<script setup>
import LeaveTable from "~/components/reports/leave";
import TrainingTable from "~/components/reports/training";

const page = ref(1);

const tabs = ref([
   { id: 1, label: "ข้อมูลการฝึกอบรม" },
   { id: 2, label: "การลา" },
]);
</script>
