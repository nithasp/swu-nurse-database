<template>
   <div class="p-1.5">
      <div id="tab-dashboard" class="flex gap-3 mb-5 overflow-x-auto">
         <UButton
            v-for="tab in tabs"
            :key="`${tab.id}_tab_dashboard`"
            variant="solid"
            :label="tab.label"
            block
            :class="[page == tab.id ? 'bg-primary-500' : 'bg-gray-100 hover:bg-gray-100 hover:opacity-75 text-[#333]', 'rounded-xl h-12 w-max min-w-[220px] px-8']"
            @click="page = tab.id"
         />
      </div>
      <StaffPercent v-if="page == 1" />
      <Education v-else-if="page == 2" />
      <Position v-else-if="page == 3" />
   </div>
</template>
<script setup>
import StaffPercent from "~/components/dashboard/personal/staffPercent";
import Education from "~/components/dashboard/personal/education";
import Position from "~/components/dashboard/personal/position";

const page = ref(1);

const tabs = ref([
   { id: 1, label: "จำนวนร้อยละบุคลากรที่หน่วยงานที่มีอยู่" },
   { id: 2, label: "ข้อมูลระดับวุฒิการศึกษาสายวิชาการ" },
   { id: 3, label: "ข้อมูลตำแหน่งวิชาการ" },
]);
</script>
