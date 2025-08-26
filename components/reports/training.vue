<template>
   <div class="flex justify-between items-center mb-5 flex-wrap gap-y-3">
      <div class="bg-white rounded-xl px-4 py-2 flex items-center gap-x-2">
         <img :src="ReportIcon" alt="Icon" />
         <h1 class="text-xl">ข้อมูลการฝึกอบรม</h1>
      </div>
   </div>
   <div class="bg-white rounded-lg p-4">
      <form class="flex items-end justify-between flex-wrap gap-y-3" @submit="reloadTable">
         <div class="flex items-center gap-y-3 gap-x-6 flex-wrap">
            <div class="w-full sm:w-[280px]">
               <p class="text-sm mb-1.5 text-gray-400">หน่วยงานที่ปฏิบัติงาน</p>
               <SelectMulti
                  :options="agencyList"
                  v-model="filters.agencyId"
                  optionAttribute="name"
                  searchablePlaceholder="ค้นหาหน่วยงานที่ปฏิบัติงาน"
                  labelDefalut="ทั้งหมด"
               />
            </div>
            <div class="w-full sm:w-[180px]">
               <p class="text-sm mb-1.5 text-gray-400">ประเภทการฝึกอบรม</p>
               <SelectMulti
                  :options="trainingTypeList"
                  v-model="filters.trainingTypeId"
                  optionAttribute="name"
                  searchablePlaceholder="ค้นหาประเภทการฝึกอบรม"
                  labelDefalut="ทั้งหมด"
               />
            </div>
            <div class="w-full sm:w-max">
               <p class="text-sm mb-1.5 text-gray-400">ประเภทปี</p>
               <div class="flex gap-x-3">
                  <Radio :lists="yearsType" v-model="filters.yearType" />
               </div>
            </div>
            <div class="w-full sm:w-[164px]">
               <p class="text-sm mb-1.5 text-gray-400">{{ filters.yearType ? (filters.yearType == "1" ? "ปีงบประมาณ" : "ปีการศึกษา") : "ปี" }}</p>
               <Select
                  class="w-full sm:w-[164px]"
                  v-model="filters.year"
                  :options="filters.yearType ? (filters.yearType == '1' ? budgetYearListList : educationYearList) : []"
                  :attributeValue="filters.yearType == '1' ? 'name' : 'nameTh'"
                  :attributeOption="filters.yearType == '1' ? 'name' : 'nameTh'"
                  placeholder="-- เลือก --"
               />
            </div>
            <div class="w-full sm:w-max">
               <p class="text-sm mb-1.5 text-gray-400">จำนวนปี</p>
               <div class="flex gap-x-3">
                  <Radio :lists="yearsCount" v-model="filters.numberOfYears" />
               </div>
            </div>
         </div>
         <div class="flex gap-3">
            <ButtonSearch type="submit" />
            <ButtonClear @click="btnClear" />
         </div>
      </form>
   </div>
   <div v-if="!isLoading && filters.year && filters.numberOfYears">
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
               { key: 'prefix', label: 'คำนำหน้า', class: 'min-w-[120px]' },
               { key: 'firstName', label: 'ชื่อ', class: 'min-w-[150px]' },
               { key: 'lastName', label: 'นามสกุล', class: 'min-w-[150px]' },
               { key: 'position', label: 'ตำแหน่ง', class: 'min-w-[150px]' },
               { key: 'academicPosition', label: 'ตำแหน่งทางวิชาการ', class: 'min-w-[200px]' },
               { key: 'educationCert', label: 'วุฒิ', class: 'min-w-[200px]' },
               { key: 'dateTrainingStart', label: 'วันเริ่มปฏิบัติการ', class: 'min-w-[150px]' },
               { key: 'trainingStatistics', label: '', class: summary.length == 6 ? 'min-w-[300px]' : 'min-w-[180px]' },
            ]"
            :loading="isLoading"
            :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'กำลังโหลด...' }"
            :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'ไม่มีข้อมูล' }"
            :progress="{ color: 'primary', animation: 'carousel' }"
            :rows="tableData"
         >
            <template #trainingStatistics-header="{ row }">
               <div class="text-center">
                  <p class="text-xs font-sarabun-bold mb-1">สถิติการฝึกอบรม</p>
                  <div class="flex justify-around">
                     <p class="text-xs font-sarabun-bold" v-for="val in [...summary].reverse()" :key="val.year">{{ val.year }}</p>
                  </div>
               </div>
            </template>
            <template #order-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.order) }}</p>
            </template>
            <template #prefix-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2 leading-[1.8]">{{ row.prefix }}</p>
            </template>
            <template #firstName-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2 leading-[1.8]">{{ row.firstName }}</p>
            </template>
            <template #lastName-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2 leading-[1.8]">{{ row.lastName }}</p>
            </template>
            <template #position-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2 leading-[1.8]">{{ row.position }}</p>
            </template>
            <template #educationCert-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2 leading-[1.8]">{{ row.educationCert }}</p>
            </template>
            <template #academicPosition-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2 leading-[1.8]">{{ row.academicPosition }}</p>
            </template>
            <template #dateTrainingStart-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2">
                  {{ genTextDate({ date: row.dateTrainingStart, format: "DD/MM/YYYY", isBuddhistYear: false }) || "-" }}
               </p>
            </template>
            <template #trainingStatistics-data="{ row }">
               <div class="flex justify-around">
                  <p class="text-sm" v-for="val in [...row.trainingStatistics].reverse()" :key="`trainingStatistics-${val.val}`">
                     {{ formatCurrency(val.amount) || 0 }}
                  </p>
               </div>
            </template>
         </UTable>
      </div>
      <Pagination v-if="tableData.length > 0" class="mt-6" :total="total" :currentPage="filters.currentPage" :changePage="changePage" :limit="filters.max" />
   </div>

   <EmptyStage v-else />
   <Loading v-if="isLoading" />
</template>
<script setup>
import ReportIcon from "~/assets/icons/report-circle.svg";
import ButtonSearch from "~/components/button/search";
import ButtonClear from "~/components/button/clear";
import SelectShowList from "~/components/form/selectShowList";
import Radio from "~/components/form/radio";
import Pagination from "~/components/pagination";
import Loading from "~/components/loading";
import ButtonExport from "~/components/button/export";
import SelectMulti from "~/components/form/selectMulti";
import Select from "~/components/form/select";
import EmptyStage from "~/components/ui/empty";

import useReportsTrainingAPI from "~/service/api/reports/training";
const { fetchPersonnelTrainingReport } = useReportsTrainingAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchAgencyList, fetchBudgetYearList, fetchEducationYearList, fetchTrainingTypeList } = useMasterDataAPI;

const filters = ref({
   agencyId: [],
   trainingTypeId: [],
   yearType: "",
   year: "",
   numberOfYears: "",
   max: 10,
   offset: 0,
   currentPage: 1,
});

const yearsType = [
   { value: "1", label: "ปีงบประมาณ" },
   { value: "2", label: "ปีการศึกษา" },
];

const yearsCount = [
   { value: "1", label: "3 ปีย้อนหลัง" },
   { value: "2", label: "6 ปีย้อนหลัง" },
];

const tableData = ref([]);
const isLoading = ref(true);
const total = ref(null);
onMounted(() => {
   if (filters.value.year && filters.value.numberOfYears) {
      getListTable();
   } else {
      isLoading.value = false;
   }
   //master data
   getRecordYearList();
   getBudgetYearList();
   getTrainingTypeList();
   getAgencyList();
});

watch(
   () => [filters.value.agencyId, filters.value.trainingTypeId, filters.value.year, filters.value.numberOfYears],
   () => {
      if (filters.value.year && filters.value.numberOfYears) {
         clearPage();
      }
   }
);

watch(
   () => filters.value.yearType,
   (newValue) => {
      filters.value.year = "";
   }
);

const agencyList = ref([]);
const getAgencyList = async () => {
   const res = await fetchAgencyList();
   if (res.code == 20000) {
      agencyList.value = res.responseObject.agencyList;
   }
};

const educationYearList = ref([]);
const getRecordYearList = async () => {
   const res = await fetchEducationYearList();
   if (res.code == 20000) {
      educationYearList.value = res.responseObject.educationYearList;
   }
};

const budgetYearListList = ref([]);
const getBudgetYearList = async () => {
   const res = await fetchBudgetYearList();
   if (res.code == 20000) {
      budgetYearListList.value = res.responseObject.budgetYearList;
   }
};

const trainingTypeList = ref([]);
const getTrainingTypeList = async () => {
   const res = await fetchTrainingTypeList();
   if (res.code == 20000) {
      trainingTypeList.value = res.responseObject.trainingTypeList;
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

const summary = ref([]);
const getListTable = async () => {
   const res = await fetchPersonnelTrainingReport(filters.value);
   if (res.code == 20000) {
      tableData.value = [];
      summary.value = res.responseObject.summary;
      for (let i = 0; i < res.responseObject.userTrainingList.length; i++) {
         const data = res.responseObject.userTrainingList[i];
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
      agencyId: [],
      trainingTypeId: [],
      yearType: "",
      year: "",
      numberOfYears: "",
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

//Import By Saral
import DialogSuccess from "~/components/dialog/alert";
const setDialogSuccess = (status) => {
   isOpenSubmit.value = status;
};

const clickExport = () => {
   const recordYearId = filters.value.recordYear.map((item) => item.id);
   const textbookOwnerId = filters.value.textbookOwner.map((item) => item.id);
   const params = new URLSearchParams();
   if (filters.keyword) params.append("keyword", filters.keyword);
   if (recordYearId.length) params.append("recordYear", `[${recordYearId}]`);
   if (textbookOwnerId.length) params.append("textbookOwner", `[${textbookOwnerId}]`);
   params.append("offset", 0);
   params.append("max", -1);

   // agencyId;
   // trainingTypeId;
   // yearType;
   // year;
   // numberOfYears;

   const url = `/personnel/report/export?${params.toString()}`;
   exportFile(url, "textbook");
};

const fnClose = async () => {
   await setDialogSuccess(false);
};
</script>
