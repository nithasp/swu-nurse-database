<template>
   <div class="flex justify-between items-center mb-5 flex-wrap gap-y-3">
      <div class="bg-white rounded-xl px-4 py-2 flex items-center gap-x-2">
         <img :src="ReportIcon" alt="Icon" />
         <h1 class="text-xl">จำนวนทุนที่ได้รับการสนับสนุนจากภายใน / ภายนอกหน่วยงาน</h1>
      </div>
      <ButtonPrint v-if="filters.year && filters.numberOfYear" id="button-print" @click="handlePrint" />
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
                  :attributeValue="filters.yearType == '1' ? 'name' : 'nameTh'"
                  :attributeOption="filters.yearType == '1' ? 'name' : 'nameTh'" placeholder="-- เลือก --" />
            </div>
            <div class="w-full sm:w-max">
               <p class="text-sm mb-1.5 text-gray-400">จำนวนปี</p>
               <div class="flex gap-x-3">
                  <Radio :lists="yearsCount" v-model="filters.numberOfYear" />
               </div>
            </div>
         </div>
      </div>
   </div>
   <div v-if="!isLoading && filters.year && filters.numberOfYear">
      <div class="bg-white rounded-lg p-4 mb-5">
         <BarChart idChart="fundingSupport" :labels="labels" :datasets="datasets" labelY="จำนวนทุน"
            :labelX="filters.yearType ? (filters.yearType == '1' ? 'ปีงบประมาณ' : 'ปีการศึกษา') : 'ปี'"
            tooltipShow="research-funding-support" />
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
               <p class="text-center">{{ formatCurrency(row.year1) || "-" }}</p>
            </template>
            <template #year2-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.year2) || "-" }}</p>
            </template>
            <template #year3-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.year3) || "-" }}</p>
            </template>
            <template #year4-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.year4) || "-" }}</p>
            </template>
            <template #year5-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.year5) || "-" }}</p>
            </template>
            <template #year6-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.year6) || "-" }}</p>
            </template>
            <template #total-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.total) || "-" }}</p>
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

import useDashboardResearchAPI from "~/service/api/dashboard/research";
const { fetchDashboardFunding } = useDashboardResearchAPI;

defineProps({
   budgetYearListList: Array,
   educationYearList: Array,
});

const filters = ref({
   year: "",
   yearType: "",
   numberOfYear: "",
});

const yearsType = [
   { value: "1", label: "ปีงบประมาณ" },
   { value: "2", label: "ปีการศึกษา" },
];

const yearsCount = [
   { value: "1", label: "3 ปีย้อนหลัง" },
   { value: "2", label: "6 ปีย้อนหลัง" },
];

watch(
   () => [filters.value.year, filters.value.numberOfYear],
   () => {
      if (filters.value.year && filters.value.numberOfYear) {
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

const isLoading = ref(true);
onMounted(() => {
   if (filters.value.year && filters.value.numberOfYear) {
      getDataChart();
   } else {
      isLoading.value = false;
   }
});

const barsList = ["ทุนภายใน", "ทุนภายนอก"];
const tableData = ref([]);
const labels = ref([]);
const datasets = ref([]);
const columns = ref([]);

const getDataChart = async () => {
   isLoading.value = true;
   const res = await fetchDashboardFunding(filters.value);
   isLoading.value = false;
   datasets.value = [];
   tableData.value = [];
   columns.value = [];
   if (res.code == 20000) {
      let { external, internal, year, summary } = res.responseObject;
      labels.value = year;

      columns.value = [
         { key: "name", label: "รายการ", class: "min-w-[200px]" },
         ...year.map((year, i) => ({ key: `year${i + 1}`, label: year, class: "min-w-[80px] text-center" })),
         { key: "total", label: "รวม", class: "min-w-[80px] text-center" },
      ];

      const dataMap = {};
      dataMap["ทุนภายใน"] = removeCommaConvertToNumber(internal)
      dataMap["ทุนภายนอก"] = removeCommaConvertToNumber(external)
      summary = summary.map(i => i !== "-" ? parseFloat(i.replace(/,/g, '')) : 0);
      barsList.map((bar, index) => {
         const objectDatasets = {
            label: bar,
            data: dataMap[bar] || [],
            borderWidth: 1,
            backgroundColor: getColorsList(index),
            maxBarThickness: 30,
            categoryPercentage: 0.5,
            yearTypeValue: filters.value.yearType ? (filters.value.yearType == '1' ?
               'ปีงบประมาณ' : 'ปีการศึกษา') : 'ปี'
         };
         if (dataMap[bar]) {
            const totalYearTypeValue = dataMap[bar][dataMap[bar].length - 1];
            const rowData = dataMap[bar].slice(0, -1).reduce((acc, value, i) => (
               {
                  ...acc,
                  [`year${i + 1}`]: value,
                  total: totalYearTypeValue
               }),
               { name: bar }
            );
            tableData.value.push(rowData);
         }
         datasets.value.push(objectDatasets);

      });
      const formatRow = (name, data) => ({
         name,
         ...data.reduce((acc, value, i) => ({ ...acc, [`year${i + 1}`]: value }), {}),
         total: data[data.length - 1],
         class: "!bg-primary-50",
      });
      tableData.value.push(formatRow("รวม", summary));
   }
};

const removeCommaConvertToNumber = (arrItem) => {
   return arrItem.map(item => {
      if (item === "-") {
         return 0;
      }
      return parseFloat(item.replace(/,/g, ''));
   })
}

const clickExport = () => {
   const { yearType, year, numberOfYear } = filters.value;
   let url = `/dashboard/researches/funding/export?yearType=${yearType}&year=${year}&numberOfYear=${numberOfYear}`;

   exportFile(url, `จำนวนทุนที่ได้รับการสนับสนุนจากภายใน/ภายนอกหน่วยงาน-${dateFormExport()}`);
};

const handlePrint = () => {
   setTimeout(() => {
      window.print();
   }, 100);
};
</script>
