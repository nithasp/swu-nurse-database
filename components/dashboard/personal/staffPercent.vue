<template>
   <div class="flex justify-between items-center mb-5 flex-wrap gap-y-3">
      <div class="bg-white rounded-xl px-4 py-2 flex items-center gap-x-2">
         <img :src="ReportIcon" alt="Icon" />
         <h1 class="text-xl">จำนวนร้อยละบุคลากรที่หน่วยงานที่มีอยู่</h1>
      </div>
      <ButtonPrint id="button-print" @click="handlePrint"/>
   </div>
   <div class="bg-white rounded-lg p-4 mb-5">
      <BarChart v-if="!isLoading" idChart="staffPercent" :labels="['']" :datasets="datasets" labelY="จำนวนบุคลากร" labelX="หน่วยงาน" tooltipShow="personal-1" />
   </div>
   <div class="bg-white rounded-lg p-4">
      <div class="flex justify-end mb-4">
         <ButtonExport id="button-export" @click="exportFile('/dashboard/personnel/agency/export', `จำนวนร้อยละบุคลากรที่หน่วยงานที่มีอยู่-${dateFormExport()}`)" />
      </div>
      <UTable
         class="w-full"
         :ui="{
            wrapper: 'rounded-t-lg hide-height-scroll',
            thead: 'bg-primary-50',
            th: {
               padding: 'py-2.5',
               size: 'text-xs [&_span]:font-sarabun-bold',
            },
            tbody: 'border-none divide-none odd:[&_tr]:bg-white even:[&_tr]:bg-gray-50',
            td: {
               padding: 'py-2.5',
               color: 'text-black',
            },
            default: {
               sortButton: {
                  class: '[&:nth-child(2)]:[&_span]:text-primary-500 px-0 hover:bg-transparent',
               },
            },
         }"
         :sortButton="{
            size: 'xs',
         }"
         :columns="[
            { key: 'name', label: 'รายการ', class: 'min-w-[300px]' },
            { key: 'amount', label: 'จำนวน', class: 'min-w-[80px] text-center' },
            { key: 'free', label: 'ตำแหน่งว่าง', class: 'min-w-[80px] text-center' },
            { key: 'percent', label: 'ร้อยละ', class: 'min-w-[80px] text-center' },
         ]"
         :loading="isLoading"
         :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'กำลังโหลด...' }"
         :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'ไม่มีข้อมูล' }"
         :progress="{ color: 'primary', animation: 'carousel' }"
         :rows="tableData"
      >
         <template #name-data="{ row }">
            <p class="max-w-[300px] text-wrap line-clamp-2">{{ row.name }}</p>
         </template>
         <template #amount-data="{ row }">
            <p class="text-center">{{ row.amount }}</p>
         </template>
         <template #free-data="{ row }">
            <p class="text-center">{{ row.free }}</p>
         </template>
         <template #percent-data="{ row }">
            <p class="text-center">{{ row.percent }}</p>
         </template>
      </UTable>
   </div>

   <Loading v-if="isLoading" />
</template>
<script setup>
import ReportIcon from "~/assets/icons/report-circle.svg";
import BarChart from "~/components/chartjs/bar";
import Loading from "~/components/loading";
import ButtonExport from "~/components/button/export";
import ButtonPrint from "~/components/button/print";

import useDashboardPersonalAPI from "~/service/api/dashboard/personal";
const { fetchDashboardPersonnelAgency } = useDashboardPersonalAPI;

onMounted(() => {
   getDataChart();
});

const tableData = ref([]);
const datasets = ref([]);
const isLoading = ref(true);
const getDataChart = async () => {
   const res = await fetchDashboardPersonnelAgency();

   if (res.code == 20000) {
      const { label, data, free, percent } = res.responseObject;

      for (let i = 0; i < label.length; i++) {
         datasets.value.push({
            label: label[i],
            data: [data[i]],
            borderWidth: 1,
            backgroundColor: getColorsList(i),
            maxBarThickness: 30,
            categoryPercentage: 0.5,
            amount: formatCurrency(data[i]) || 0,
            free: formatCurrency(free[i]) || 0,
            percent: formatCurrency(percent[i]) || 0,
         });

         tableData.value.push({
            name: label[i],
            amount: formatCurrency(data[i]) || 0,
            free: formatCurrency(free[i]) || 0,
            percent: formatCurrency(percent[i]) || 0,
         });
      }

      if (label.length) {
         tableData.value.push({
            name: "รวม",
            amount: formatCurrency(data.reduce((acc, item) => acc + item, 0)) || 0,
            free: formatCurrency(free.reduce((acc, item) => acc + item, 0)) || 0,
            percent: `${formatCurrency(percent.reduce((acc, item) => acc + item, 0)) || 0}%`,
            class: "!bg-primary-50",
         });
      }

   }
   isLoading.value = false;
};

const handlePrint = () => {
  setTimeout(() => {
    window.print();
  }, 100);
};
</script>
