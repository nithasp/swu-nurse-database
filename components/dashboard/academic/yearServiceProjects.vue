<template>
   <div class="flex justify-between items-center mb-5 flex-wrap gap-y-3">
      <div class="bg-white rounded-xl px-4 py-2 flex items-center gap-x-2">
         <img :src="ReportIcon" alt="Icon" />
         <h1 class="text-xl">โครงการที่ให้บริการวิชาการแต่ละปี</h1>
      </div>
      <ButtonPrint v-if="filters.year && filters.yearType && filters.yearPrevCount" id="button-print"
         @click="handlePrint" />
   </div>
   <div class="bg-white rounded-lg p-4 mb-5">
      <div class="flex items-end flex-wrap gap-y-3">
         <div class="flex items-center gap-y-3 gap-x-6 flex-wrap">
            <div class="w-full sm:w-max">
               <p class="text-sm mb-1.5 text-gray-400">ประเภทปี</p>
               <div class="flex gap-x-3">
                  <Radio :lists="yearsType" v-model="filters.yearType" />
               </div>
            </div>
            <div class="w-full sm:w-[280px]">
               <p class="text-sm mb-1.5 text-gray-400">{{ filters.yearType ? (filters.yearType == "1" ? "ปีงบประมาณ" :
                  "ปีการศึกษา") : "ปี" }}</p>
               <Select class="w-full sm:w-[260px]" v-model="filters.year"
                  :options="filters.yearType ? (filters.yearType == '1' ? budgetYearListList : educationYearList) : []"
                  attributeValue="id" attributeOption="name" placeholder="-- เลือก --" />
            </div>
            <div class="w-full sm:w-max">
               <p class="text-sm mb-1.5 text-gray-400">จำนวนปี</p>
               <div class="flex gap-x-3">
                  <Radio :lists="yearsCount" v-model="filters.yearPrevCount" />
               </div>
            </div>
         </div>
      </div>
   </div>
   <div v-if="!isLoading && filters.year && filters.yearPrevCount">
      <div class="bg-white rounded-lg p-4 mb-5">
         <BarChart idChart="yearServiceProjects" :labels="labels.sort()" :datasets="datasets" labelY="จำนวนโครงการ"
            :labelX="filters.yearType ? (filters.yearType == '1' ? 'ปีงบประมาณ' :
               'ปีการศึกษา') : 'ปี'" tooltipShow="academic-year-service-projects" />
      </div>
      <div class="bg-white rounded-lg p-4">
         <div class="flex justify-end mb-4">
            <ButtonExport id="button-export" @click="clickExport()" />
         </div>
         <UTable class="w-full" :ui="{
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
         }" :sortButton="{
            size: 'xs',
         }" :columns="columns" :loading="isLoading"
            :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'กำลังโหลด...' }"
            :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'ไม่มีข้อมูล' }"
            :progress="{ color: 'primary', animation: 'carousel' }" :rows="tableData">
            <template #name-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2">{{ row.name }}</p>
            </template>
            <template #year1-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.year1) || 0 }}</p>
            </template>
            <template #year2-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.year2) || 0 }}</p>
            </template>
            <template #year3-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.year3) || 0 }}</p>
            </template>
            <template #year4-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.year4) || 0 }}</p>
            </template>
            <template #year5-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.year5) || 0 }}</p>
            </template>
            <template #year6-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.year6) || 0 }}</p>
            </template>
            <template #total-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.total) || 0 }}</p>
            </template>
         </UTable>
      </div>
   </div>
   <EmptyStage v-else />
   <Loading v-if="isLoading" />
</template>
<script setup>
import ReportIcon from "~/assets/icons/report-circle.svg";
import BarChart from "~/components/chartjs/bar";
import Loading from "~/components/loading";
import Select from "~/components/form/select";
import Radio from "~/components/form/radio";
import ButtonExport from "~/components/button/export";
import EmptyStage from "~/components/ui/empty";
import ButtonPrint from "~/components/button/print";

import useDashboardAcademicAPI from "~/service/api/dashboard/academic";
const { fetchDashboardAcademicBudgetsourceAmountSummary } = useDashboardAcademicAPI;

const props = defineProps({
   budgetYearListList: Array,
   educationYearList: Array,
});

const filters = ref({
   year: "",
   yearType: "",
   yearPrevCount: "",
});

const tableData = ref([]);

const yearsType = [
   { value: "1", label: "ปีงบประมาณ" },
   { value: "2", label: "ปีการศึกษา" },
];

const yearsCount = [
   { value: "3", label: "3 ปีย้อนหลัง" },
   { value: "6", label: "6 ปีย้อนหลัง" },
];

const labels = ref([]);
const datasets = ref([]);
const columns = ref([]);

onMounted(() => {
   if (filters.value.year && filters.value.yearType && filters.value.yearPrevCount) {
      getDataChart();
   } else {
      isLoading.value = false;
   }
});

watch(
   () => filters.value.year,
   (newValue) => {
      setLabels(newValue, filters.value.yearPrevCount);
   }
);

watch(
   () => filters.value.yearPrevCount,
   (newValue) => {
      setLabels(filters.value.year, newValue);
   }
);

watch(
   () => [filters.value.year, filters.value.yearType, filters.value.yearPrevCount],
   () => {
      if (filters.value.year && filters.value.yearType && filters.value.yearPrevCount) {
         getDataChart();
      }
   }
);

const setLabels = (yearId, count) => {
   labels.value = [];
   const found = props.budgetYearListList.find((fields) => fields.id == yearId);
   if (found) {
      if (count) {
         for (let i = 0; i < parseInt(count); i++) {
            labels.value.push(parseInt(found.name) - i);
         }
      }
   }
};

const isLoading = ref(true);
const getDataChart = async () => {
   isLoading.value = true;
   const res = await fetchDashboardAcademicBudgetsourceAmountSummary(filters.value);
   if (res.code == 20000) {
      let { labels, years, items } = res.responseObject;
      labels.value = years;

      columns.value = [
         { key: "name", label: "แหล่งที่มาของงบประมาณ", class: "min-w-[200px]" },
         ...years.map((year, i) => ({ key: `year${i + 1}`, label: year, class: "min-w-[80px] text-center" }))
      ];

      datasets.value = items.map((item) => {
         const { label, data } = item;
         return {
            label: label,
            data: data,
            borderWidth: 1,
            backgroundColor: label === "เงินรายได้" ? "#2F7ED8" : label === "เงินแผ่นดิน" ? "#0D233A" : "#8BBC21",
            maxBarThickness: 30,
            categoryPercentage: 0.5
         }
      })

      tableData.value = items.map((i) => {
         const years = {};
         i.data.map((value, yearIndex) => {
            years[`year${yearIndex + 1}`] = value;
         });
         return {
            name: i.label,
            ...years
         };
      });

      const yearKeys = Object.keys(tableData.value[0]).filter(key => key.startsWith('year'));
      const summary = { name: "รวม", class: "!bg-primary-50" };
      yearKeys.map(yearKey => {
         summary[yearKey] = tableData.value.reduce((acc, item) => acc + item[yearKey], 0);
      });
      tableData.value.push(summary);
   }
   isLoading.value = false;
};

const clickExport = () => {
   const { yearType, year, yearPrevCount } = filters.value;
   let url = `/dashboard/academic/budgetSource/amountSummary/export?year=${year}&yearPrevCount=${yearPrevCount}&yearType=${yearType}`;

   exportFile(url, `โครงการที่ให้บริการวิชาการแต่ละปี-${dateFormExport()}`);
};

const handlePrint = () => {
   setTimeout(() => {
      window.print();
   }, 100);
};
</script>
