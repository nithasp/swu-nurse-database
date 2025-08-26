<template>
   <div class="p-1.5">
      <div class="flex justify-between items-center mb-5 flex-wrap gap-y-3">
         <div class="bg-white rounded-xl px-4 py-2 flex items-center gap-x-2">
            <img :src="ReportIcon" alt="Icon" />
            <h1 class="text-xl">งานโครงงานบริการวิชาการที่บูรณาการกับการเรียนการสอน/งานวิจัย</h1>
         </div>
      </div>
      <div class="bg-white rounded-lg p-4">
         <form class="flex items-end justify-between flex-wrap gap-y-3" @submit="reloadTable">
            <div class="flex items-center gap-3 flex-wrap">
               <div class="w-full sm:w-[280px]">
                  <p class="text-sm mb-1.5 text-gray-400">ปีการศึกษา</p>
                  <SelectMulti
                     :options="educationYearList"
                     v-model="filters.educationYear"
                     optionAttribute="nameTh"
                     searchablePlaceholder="ค้นหาปีการศึกษา"
                     labelDefalut="ทั้งหมด"
                  />
               </div>
               <div class="w-full sm:w-[280px]">
                  <p class="text-sm mb-1.5 text-gray-400">ชื่อโครงการ-เจ้าของโครงการ</p>
                  <Input v-model="filters.keyword" placeholder="ชื่อโครงการ-เจ้าของโครงการ" class="flex flex-col w-full text-sm" heightClass="h-[38px]" />
               </div>
            </div>
            <div class="flex gap-3">
               <ButtonSearch type="submit" />
               <ButtonClear @click="btnClear" />
            </div>
         </form>
      </div>
      <div class="bg-white rounded-lg p-4 mt-4">
         <div class="flex justify-between items-center mb-4 flex-wrap gap-3">
            <div class="flex gap-3 items-center">
               <SelectShowList :setShowList="setShowList" />
               <p class="text-gray-400 text-sm">{{ formatCurrency(total) }} รายการ</p>
            </div>
            <div class="flex items-center gap-3 flex-wrap">
               <ButtonExport />
            </div>
         </div>
         <UTable
            class="w-full"
            :ui="{
               wrapper: 'rounded-t-lg',
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
               { key: 'order', label: 'ลำดับ', class: 'min-w-[65px] text-center' },
               { key: 'educationYear', label: 'ปีการศึกษา', class: 'min-w-[120px]', sortable: true },
               { key: 'name', label: 'ชื่อโครงการ', class: 'min-w-[200px]', sortable: true },
               { key: 'owner', label: 'เจ้าของโครงการ', class: 'min-w-[200px]', sortable: true },
               { key: 'teachingIntegration', label: 'การบูรณาการการเรียนการสอน', class: 'min-w-[300px]', sortable: true },
               { key: 'suggestion', label: 'การบูรณาการการทำนุบำรุงศิลปะวัฒนธรรม', class: 'min-w-[300px]', sortable: true },
               { key: 'researchIntefration', label: 'การบูรณาการงานวิจัย', class: 'min-w-[200px]', sortable: true },
            ]"
            :loading="isLoading"
            :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'กำลังโหลด...' }"
            :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'ไม่มีข้อมูล' }"
            :progress="{ color: 'primary', animation: 'carousel' }"
            :rows="tableData"
         >
            <template #order-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.order) }}</p>
            </template>
            <template #name-data="{ row }">
               <p class="max-w-[300px] text-wrap line-clamp-2">{{ row.name }}</p>
            </template>
            <template #teachingIntegration-data="{ row }">
               <p class="max-w-[300px] text-wrap line-clamp-2">{{ row.teachingIntegration || "-" }}</p>
            </template>
            <template #suggestion-data="{ row }">
               <p class="max-w-[300px] text-wrap line-clamp-2">{{ row.suggestion || "-" }}</p>
            </template>
            <template #researchIntefration-data="{ row }">
               <p class="max-w-[300px] text-wrap line-clamp-2">{{ row.researchIntefration || "-" }}</p>
            </template>
         </UTable>
      </div>
      <Pagination
         v-if="!isLoading && tableData.length > 0"
         class="mt-6"
         :total="total"
         :currentPage="filters.currentPage"
         :changePage="changePage"
         :limit="filters.max"
      />
   </div>
   <Loading v-if="isLoading" />
</template>
<script setup>
import ReportIcon from "~/assets/icons/report-circle.svg";
import ButtonSearch from "~/components/button/search";
import ButtonClear from "~/components/button/clear";
import SelectShowList from "~/components/form/selectShowList";
import Input from "~/components/form/input";
import Pagination from "~/components/pagination";
import Loading from "~/components/loading";
import ButtonExport from "~/components/button/export";
import SelectMulti from "~/components/form/selectMulti";

import useReportsAcademicAPI from "~/service/api/reports/academic";
const { fetchAcademicList } = useReportsAcademicAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchEducationYearList } = useMasterDataAPI;

const filters = ref({
   keyword: "",
   educationYear: [],
   max: 10,
   offset: 0,
   currentPage: 1,
});

const tableData = ref([]);
const isLoading = ref(true);
const total = ref(null);
onMounted(() => {
   getListTable();
   //master data
   getRecordYearList();
});

watch(
   () => [filters.value.educationYear],
   () => {
      clearPage();
   }
);

const educationYearList = ref([]);
const getRecordYearList = async () => {
   const res = await fetchEducationYearList();
   if (res.code == 20000) {
      educationYearList.value = res.responseObject.educationYearList;
   }
};

const reloadTable = (e) => {
   e.preventDefault();
   clearPage();
};

const clearPage = () => {
   filters.value.currentPage = 1;
   filters.value.offset = 0;
   getListTable();
};

const getListTable = async () => {
   const res = await fetchAcademicList(filters.value);
   if (res.code == 20000) {
      tableData.value = [];
      for (let i = 0; i < res.responseObject.academicServiceList.length; i++) {
         const data = res.responseObject.academicServiceList[i];
         data.order = filters.value.offset + (i + 1);
         tableData.value.push(data);
      }
      total.value = res.responseObject.total;
   }
   isLoading.value = false;
};

const setShowList = (listTotal) => {
   if (filters.value.max != listTotal) {
      filters.value.max = listTotal;
      clearPage();
   }
};

const btnClear = () => {
   filters.value = {
      keyword: "",
      educationYear: [],
      max: 10,
      offset: 0,
      currentPage: 1,
   };
   getListTable();
};

const changePage = (pageNum) => {
   filters.value.currentPage = pageNum;
   filters.value.offset = filters.value.max * (pageNum - 1);
   getListTable();
};
</script>
