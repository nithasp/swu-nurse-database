<template>
   <div class="flex justify-between items-center mb-5 flex-wrap gap-y-3">
      <div class="bg-white rounded-xl px-4 py-2 flex items-center gap-x-2">
         <img :src="ReportIcon" alt="Icon" />
         <h1 class="text-xl">จำนวน/ร้อยละ การเปรียบเทียบงานบริการวิชาการของอาจารย์แต่ละปี</h1>
      </div>
      <ButtonPrint v-if="filters.ownerIds.length && filters.year && filters.yearPrevCount" id="button-print"
         @click="handlePrint" />
   </div>
   <div class="bg-white rounded-lg p-4 mb-5">
      <div class="flex items-end flex-wrap gap-y-3">
         <div class="flex items-center gap-y-3 gap-x-6 flex-wrap">
            <div class="w-full sm:w-[250px]">
               <p class="text-sm mb-1.5 text-gray-400">หน่วยงาน</p>
               <Select v-model="agencyIds" :options="agencyList" attributeOption="name" />
            </div>
            <div class="w-full sm:w-[250px]">
               <p class="text-sm mb-1.5 text-gray-400">รายชื่อบุคลากร</p>
               <SelectMulti :options="personnelsList" v-model="filters.ownerIds" optionAttribute="fullname"
                  searchablePlaceholder="ค้นหารายชื่อบุคลากร" labelDefalut="-- เลือก --"
                  :labelDefalutIsPlaceholder="true" />
            </div>
            <div class="w-full sm:w-max">
               <p class="text-sm mb-1.5 text-gray-400">ประเภทปี</p>
               <div class="flex gap-x-3">
                  <Radio :lists="yearsType" v-model="filters.yearType" />
               </div>
            </div>
            <div class="w-full sm:w-[175px]">
               <p class="text-sm mb-1.5 text-gray-400">{{ filters.yearType ? (filters.yearType == "budget" ?
                  "ปีงบประมาณ" : "ปีการศึกษา") : "ปี" }}</p>
               <Select v-model="filters.year"
                  :options="filters.yearType ? (filters.yearType == 'budget' ? budgetYearListList : educationYearList) : []"
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

   <div v-if="!isLoading && filters.ownerIds.length && filters.year && filters.yearPrevCount">
      <div class="bg-white rounded-lg p-4 mb-5">
         <BarChart idChart="comparisonByYear" :labels="labels.sort()" :datasets="datasets" labelY="จำนวนโครงการ"
            :labelX="filters.yearType ? (filters.yearType == 'budget' ?
               'ปีงบประมาณ' : 'ปีการศึกษา') : 'ปี'" tooltipShow="academic-comparison-by-year" :titleShow="true"
            :agencyName="agencyName" />
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
import Radio from "~/components/form/radio";
import ButtonExport from "~/components/button/export";
import EmptyStage from "~/components/ui/empty";
import SelectMulti from "~/components/form/selectMulti";
import ButtonPrint from "~/components/button/print";

import useDashboardAcademicAPI from "~/service/api/dashboard/academic";
const { fetchDashboardAcademicOwnerSummary, fetchDashboardPersonnelList } = useDashboardAcademicAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchAgencyList } = useMasterDataAPI;

defineProps({
   budgetYearListList: Array,
   educationYearList: Array,
   personnelList: Array,
   agencyList: Array,
   researchList: Array,
});

const filters = ref({
   year: "",
   yearType: "",
   yearPrevCount: "",
   ownerIds: [],
});

const agencyIds = ref("");
const agencyName = ref("");

const yearsType = [
   { value: "budget", label: "ปีงบประมาณ" },
   { value: "education", label: "ปีการศึกษา" },
];

const yearsCount = [
   { value: "3", label: "3 ปีย้อนหลัง" },
   { value: "6", label: "6 ปีย้อนหลัง" },
];

watch(
   () => [filters.value.ownerIds, filters.value.year, filters.value.yearPrevCount],
   () => {
      if (filters.value.ownerIds.length && filters.value.year && filters.value.yearPrevCount) {
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
   //Master Data
   getAgencyList();
   if (filters.value.ownerIds.length && filters.value.year && filters.value.yearPrevCount) {
      getDataChart();
   } else {
      isLoading.value = false;
   }
});

const labels = ref([]);
const datasets = ref([]);
const columns = ref([]);
const tableData = ref([]);
const isLoading = ref(true);

const getDataChart = async () => {
   isLoading.value = true;
   const res = await fetchDashboardAcademicOwnerSummary(filters.value);
   if (res.code == 20000) {
      let { years, items } = res.responseObject;;
      labels.value = years;

      columns.value = [
         { key: "name", label: "ชื่อ-สกุล", class: "min-w-[200px]" },
         ...years.map((year, i) => ({ key: `year${i + 1}`, label: year, class: "min-w-[80px] text-center" })),
         { key: "total", label: "", class: "min-w-[200px] font-bold" },
      ];

      datasets.value = items.map((item, index) => {
         const { label, data } = item;
         return {
            label: label,
            data: data,
            borderWidth: 1,
            backgroundColor: getColorsList(index),
            categoryPercentage: 0.5,
            yearTypeValue: filters.value.yearType ? (filters.value.yearType == 'budget' ?
               'ปีงบประมาณ' : 'ปีการศึกษา') : 'ปี'
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
      const summary = { name: "รวม", class: "!bg-primary-50", total: 0 };
      yearKeys.map(yearKey => {
         summary[yearKey] = tableData.value.reduce((acc, item) => acc + item[yearKey], 0);
      });

      // Total
      const keys = Object.keys(summary);
      const totalSum = keys
         .filter(key => key.startsWith('year'))
         .reduce((acc, key) => acc + summary[key], 0);
      summary.total = totalSum

      //  Percent
      let percentages = keys
         .filter(key => key.startsWith('year'))
         .reduce((acc, key) => {
            acc[key] = summary[key] * 100 / summary.total;
            return acc;
         }, {});

      const totalSumPercentages = keys
         .filter(key => key.startsWith('year'))
         .reduce((acc, key) => acc + percentages[key], 0);

      percentages = {
         name: "ร้อยละ", class: "!bg-primary-50",
         total: formatCurrency(totalSumPercentages) ? formatCurrency(totalSumPercentages) + '%' : 0 + '%',
         ...percentages
      }

      percentages = Object.keys(percentages).reduce((acc, key) => {
         if (key.startsWith('year')) {
            acc[key] = formatCurrency(percentages[key], 2);
         } else {
            acc[key] = percentages[key];
         }
         return acc;
      }, {});

      tableData.value.push(summary, percentages);
   }
   isLoading.value = false;
};

const agencyList = ref([]);
const getAgencyList = async () => {
   const res = await fetchAgencyList();
   if (res.code == 20000) {
      agencyList.value = res.responseObject.agencyList;
   }
};

const personnelsList = ref([]);
const getDashboardPersonnelList = async (agencyIds) => {
   const res = await fetchDashboardPersonnelList({ agencyIds });
   if (res.code == 20000) {
      personnelsList.value = res.responseObject.personnels;
   }
};

watch(
   () => agencyIds.value,
   (newValue) => {
      if (newValue.id) {
         filters.value.ownerIds = [];
         getDashboardPersonnelList(newValue.id);
         agencyName.value = newValue.name;
      }
   }
);


const clickExport = () => {
   const { year, yearType, yearPrevCount, ownerIds } = filters.value;
   let url = `/dashboard/academic/owner/summary/export?yearType=${yearType}&year=${year}&yearPrevCount=${yearPrevCount}`;

   if (ownerIds.length) {
      const ids = ownerIds.map((item) => item.id);
      url += `&ownerIds=${ids}`;
   }

   exportFile(url, `จำนวน/ร้อยละ-การเปรียบเทียบงานบริการวิชาการของอาจารย์แต่ละปี-${dateFormExport()}`);
};

const handlePrint = () => {
   setTimeout(() => {
      window.print();
   }, 100);
};
</script>
