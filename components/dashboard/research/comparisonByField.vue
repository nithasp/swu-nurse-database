<template>
   <div class="flex justify-between items-center mb-5 flex-wrap gap-y-3">
      <div class="bg-white rounded-xl px-4 py-2 flex items-center gap-x-2">
         <img :src="ReportIcon" alt="Icon" />
         <h1 class="text-xl">เปรียบเทียบจำนวนงานวิจัยในแต่ละสาขาวิชา</h1>
      </div>
      <ButtonPrint id="button-print" @click="handlePrint" />
   </div>
   <div class="bg-white rounded-lg p-4 mb-5">
      <div class="flex items-end flex-wrap gap-y-3">
         <div class="flex items-center gap-y-3 gap-x-6 flex-wrap">
            <div class="w-full sm:w-[250px]">
               <p class="text-sm mb-1.5 text-gray-400">งานวิจัย</p>
               <SelectMulti :options="researchList" v-model="filters.researches" optionAttribute="name"
                  searchablePlaceholder="ค้นหารายชื่องานวิจัย" labelDefalut="-- เลือก --"
                  :labelDefalutIsPlaceholder="true" />
            </div>
            <div class="w-full sm:w-max">
               <p class="text-sm mb-1.5 text-gray-400">ประเภทปี</p>
               <div class="flex gap-x-3">
                  <Radio :lists="yearsType" v-model="filters.yearType" />
               </div>
            </div>
            <div class="w-full sm:w-[280px]">
               <p class="text-sm mb-1.5 text-gray-400">{{ filters.yearType ? (filters.yearType == "1" ? "ปีปฏิทิน" :
                  "ปีการศึกษา") : "ปี" }}</p>
               <Select class="w-full sm:w-[260px]" v-model="filters.year"
                  :options="filters.yearType ? (filters.yearType == '1' ? recordYearList : educationYearList) : []"
                  attributeValue="id" attributeOption="name" placeholder="-- เลือก --" />
            </div>
            <div class="w-full sm:w-max">
               <p class="text-sm mb-1.5 text-gray-400">จำนวนปี</p>
               <div class="flex gap-x-3">
                  <Radio :lists="numberOfYear" v-model="filters.numberOfYear" />
               </div>
            </div>
         </div>
      </div>
   </div>
   <div v-if="!isLoading && filters.researches.length && filters.year && filters.yearType && filters.numberOfYear">
      <div class="bg-white rounded-lg p-4 mb-5">
         <BarChart idChart="comparisonByField" :labels="labels.sort()" :datasets="datasets" labelY="จำนวนชิ้นผลงาน"
            :labelX="filters.yearType ? (filters.yearType == '1' ?
               'ปีปฏิทิน' : 'ปีการศึกษา') : 'ปี'" tooltipShow="research-comparison-by-field" />
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
               <p class="text-center">{{ row.total }}</p>
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
import SelectMulti from "~/components/form/selectMulti";
import Radio from "~/components/form/radio";
import ButtonExport from "~/components/button/export";
import EmptyStage from "~/components/ui/empty";
import ButtonPrint from "~/components/button/print";

import useDashboardResearchAPI from "~/service/api/dashboard/research";
const { fetchDashboardAgency } = useDashboardResearchAPI;

const props = defineProps({
   recordYearList: Array,
   educationYearList: Array,
   researchList: Array
});

const filters = ref({
   researches: [],
   year: "",
   yearType: "",
   numberOfYear: "",
});
const yearsType = ref([
   { value: "1", label: "ปีปฏิทิน" },
   { value: "2", label: "ปีการศึกษา" },
]);
const numberOfYear = ref([
   { value: "1", label: "3 ปีย้อนหลัง" },
   { value: "2", label: "6 ปีย้อนหลัง" },
]);

watch(
   () => [filters.value.researches, filters.value.year, filters.value.yearType, filters.value.numberOfYear],
   () => {
      if (filters.value.researches.length && filters.value.year && filters.value.yearType && filters.value.numberOfYear) {
         getDataChart();
      }
   }
);

watch(
   () => filters.value.yearType,
   (newValue) => {
      filters.value.year = "";
   }
);

onMounted(() => {
   if (filters.value.researches.length && filters.value.year && filters.value.yearType && filters.value.numberOfYear) {
      getDataChart();
   } else {
      isLoading.value = false;
   }
});

const isLoading = ref(true);
const tableData = ref([]);
const labels = ref([]);
const datasets = ref([]);
const columns = ref([]);

const getDataChart = async () => {
   isLoading.value = true;
   const res = await fetchDashboardAgency(filters.value);
   datasets.value = [];
   tableData.value = [];
   columns.value = [];
   if (res.code == 20000) {
      const { label, datas, years, summary, percent } = res.responseObject;
      labels.value = years;

      columns.value = [
         { key: "name", label: "รายการ", class: "min-w-[200px]" },
         ...years.map((year, i) => ({ key: `year${i + 1}`, label: year, class: "min-w-[80px] text-center" })),
         { key: "total", label: "", class: "min-w-[80px] text-center" },
      ];

      label.map((i, index) => {
         const objectDatasets = {
            label: i,
            data: datas[index] || [],
            borderWidth: 1,
            backgroundColor: getColorsList(index),
            maxBarThickness: 30,
            categoryPercentage: 0.5,
            yearTypeValue: filters.value.yearType ? (filters.value.yearType == '1' ? 'ปีปฏิทิน' : 'ปีการศึกษา') : 'ปี'
         };

         const dataItem = datas[index];
         const rowData = {
            name: i
         }
         years.map((year, yearIndex) => {
            rowData[`year${yearIndex + 1}`] = dataItem[yearIndex];
         });
         tableData.value.push(rowData);
         datasets.value.push(objectDatasets);
      });

      const formatRow = (name, data) => ({
         name,
         ...data.reduce((acc, value, i) => ({ ...acc, [`year${i + 1}`]: value }), {}),
         total: `${name === "ร้อยละ" ? data.reduce((acc, item) => acc + item, 0) + "%" : data[data.length - 1]}`,
         class: "!bg-primary-50",
      });
      tableData.value.push(formatRow("รวม", summary));
      tableData.value.push(formatRow("ร้อยละ", percent));
   }
   isLoading.value = false;
};

const clickExport = () => {
   const { researches, yearType, year, numberOfYear } = filters.value;
   let url = `/dashboard/researches/agency/export?yearType=${yearType}&year=${year}&numberOfYear=${numberOfYear}`;

   if (researches.length) {
      const ids = researches.map((item) => item.id);
      url += `&researches=${ids}`;
   }
   
   exportFile(url, `เปรียบเทียบจำนวนงานวิจัยในแต่ละสาขาวิชา-${dateFormExport()}`);
};

const handlePrint = () => {
   setTimeout(() => {
      window.print();
   }, 100);
};
</script>
