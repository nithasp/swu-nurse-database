<template>
   <div class="flex justify-between items-center mb-5 flex-wrap gap-y-3">
      <div class="bg-white rounded-xl px-4 py-2 flex items-center gap-x-2">
         <img :src="ReportIcon" alt="Icon" />
         <h1 class="text-xl">รายการลา</h1>
      </div>
   </div>
   <div class="bg-white rounded-lg p-4">
      <form class="flex items-end justify-between flex-wrap gap-y-3" @submit="reloadTable">
         <div class="flex items-center gap-3 flex-wrap">
            <div class="w-full sm:w-[280px]">
               <p class="text-sm mb-1.5 text-gray-400">ค้นหา</p>
               <Input v-model="filters.keyword" placeholder="ค้นหา" class="flex flex-col w-full text-sm" heightClass="h-[38px]" />
            </div>
            <div class="w-full sm:w-[165px]">
               <p class="text-sm mb-1.5 text-gray-400">หน่วยงานทั้งหมด</p>
               <SelectMulti
                  :options="agencyList"
                  v-model="filters.agencies"
                  optionAttribute="name"
                  searchablePlaceholder="ค้นหาหน่วยงานทั้งหมด"
                  labelDefalut="ทั้งหมด"
               />
            </div>
            <div class="w-full sm:w-[165px]">
               <p class="text-sm mb-1.5 text-gray-400">ประเภทการลา</p>
               <SelectMulti
                  :options="leaveTypeList"
                  v-model="filters.leaveType"
                  optionAttribute="name"
                  searchablePlaceholder="ค้นหาประเภทการลา"
                  labelDefalut="ทั้งหมด"
               />
            </div>
            <div class="w-full sm:w-[165px]">
               <p class="text-sm mb-1.5 text-gray-400">ลาช่วงวันที่</p>
               <Datepicker inputId="dateA" v-model="filters.dateStart" placeholder="วัน/เดือน/ปี" inputHeight="h-[38px]" class="w-full tablet:w-auto" />
            </div>
            <div class="w-full sm:w-[165px]">
               <p class="text-sm mb-1.5 text-gray-400">ถึง</p>
               <Datepicker inputId="dateB" v-model="filters.dateEnd" placeholder="วัน/เดือน/ปี" inputHeight="h-[38px]" class="w-full tablet:w-auto" />
            </div>
         </div>
         <div class="flex gap-3">
            <ButtonSearch type="submit" />
            <ButtonClear @click="btnClear" />
         </div>
      </form>
   </div>
   <div v-if="!isLoading">
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
               { key: 'nameTh', label: 'ชื่อ-นามสกุล (ไทย)', class: 'min-w-[180px]' },
               { key: 'nameEn', label: 'ชื่อ-นามสกุล (อังกฤษ)', class: 'min-w-[180px]' },
               { key: 'workStartDate', label: 'วันที่เริ่มงาน', class: 'min-w-[120px]' },
               { key: 'start', label: 'วันที่ลา', class: 'min-w-[180px]' },
               { key: 'amount', label: 'จำนวนวัน/ชั่วโมงลา', class: 'min-w-[150px]' },
               { key: 'leaveType', label: 'ประเภทการลา', class: 'min-w-[150px]' },
               { key: 'agency', label: 'หน่วยงาน', class: 'min-w-[200px]' },
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
                     <p class="text-xs font-sarabun-bold" v-for="val in summary" :key="val.year">{{ val.year }}</p>
                  </div>
               </div>
            </template>
            <template #order-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.order) }}</p>
            </template>
            <template #nameTh-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2 leading-[1.8]">{{ row.nameTh || "-" }}</p>
            </template>
            <template #nameEn-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2 leading-[1.8]">{{ row.nameEn || "-" }}</p>
            </template>
            <template #workStartDate-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2">
                  {{ genTextDate({ date: row.workStartDate, format: "DD/MM/YYYY", isBuddhistYear: false }) || "-" }}
               </p>
            </template>
            <template #start-data="{ row }">
               <div class="flex gap-1">
                  <p class="max-w-[200px] text-wrap line-clamp-2">
                     {{ genTextDate({ date: row.start, format: "DD/MM/YYYY", isBuddhistYear: false }) || "-" }}
                  </p>
                  <p>-</p>
                  <p class="max-w-[200px] text-wrap line-clamp-2">
                     {{ genTextDate({ date: row.end, format: "DD/MM/YYYY", isBuddhistYear: false }) || "-" }}
                  </p>
               </div>
            </template>
            <template #amount-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2 leading-[1.8]">{{ formatCurrency(row.amount) || "-" }}</p>
            </template>
            <template #leaveType-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2 leading-[1.8]">{{ row.leaveType || "-" }}</p>
            </template>
            <template #agency-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2 leading-[1.8]">{{ row.agency || "-" }}</p>
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
import Pagination from "~/components/pagination";
import Loading from "~/components/loading";
import ButtonExport from "~/components/button/export";
import SelectMulti from "~/components/form/selectMulti";
import EmptyStage from "~/components/ui/empty";
import Input from "~/components/form/input";
import Datepicker from "~/components/form/datepicker";

import useReportsLeaveAPI from "~/service/api/reports/leave";
const { fetchPersonnelLeaveReport } = useReportsLeaveAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchAgencyList, fetchBudgetYearList, fetchEducationYearList, fetchLeaveTypeList } = useMasterDataAPI;

const filters = ref({
   agencies: [],
   leaveType: [],
   dateStart: "",
   dateEnd: "",
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
   getBudgetYearList();
   getLeaveTypeList();
   getAgencyList();
});

watch(
   () => [filters.value.agencies, filters.value.leaveType, filters.value.dateStart, filters.value.dateEnd],
   () => {
      clearPage();
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

const leaveTypeList = ref([]);
const getLeaveTypeList = async () => {
   const res = await fetchLeaveTypeList({ parent: "annualLeave" });
   if (res.code == 20000) {
      leaveTypeList.value = res.responseObject.leaveTypeList;
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
   const res = await fetchPersonnelLeaveReport(filters.value);
   console.log(res);
   if (res.code == 20000) {
      tableData.value = [];
      summary.value = res.responseObject.summary;
      for (let i = 0; i < res.responseObject.userLeave.length; i++) {
         const data = res.responseObject.userLeave[i];
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
      agencies: [],
      leaveType: [],
      dateStart: "",
      dateEnd: "",
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

   // agencies;
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
