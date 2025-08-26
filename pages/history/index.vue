<template>
   <div class="p-1.5">
      <div class="flex justify-between items-center mb-5 flex-wrap gap-y-3">
         <div class="bg-white rounded-xl px-4 py-2 flex items-center gap-x-2">
            <img :src="HistoryIcon" alt="Icon" />
            <h1 class="text-xl">ประวัติการเข้าใช้งาน</h1>
         </div>
      </div>
      <div class="bg-white rounded-lg p-4">
         <form class="flex items-end justify-between flex-wrap gap-y-3" @submit="reloadTable">
            <div class="flex items-center gap-3 flex-wrap">
               <div class="w-full sm:w-[280px]">
                  <p class="text-sm mb-1.5 text-gray-400">ค้นหา</p>
                  <Input v-model="filters.keyword" placeholder="ค้นหา" class="flex flex-col w-full text-sm" heightClass="h-[38px]" />
               </div>
               <div class="w-full sm:w-[164px]">
                  <p class="text-sm mb-1.5 text-gray-400">ชื่อสิทธิ์ผู้ใช้งาน</p>
                  <SelectMulti
                     :options="rolesList"
                     v-model="filters.roleIds"
                     optionAttribute="name"
                     searchablePlaceholder="ค้นหาชื่อสิทธิ์ผู้ใช้งาน"
                     labelDefalut="ทั้งหมด"
                  />
               </div>
               <div class="w-full sm:w-[164px]">
                  <p class="text-sm mb-1.5 text-gray-400">เมนูที่เข้าใช้งาน</p>
                  <SelectMulti
                     :options="modulesList"
                     v-model="filters.moduleIds"
                     optionAttribute="name"
                     searchablePlaceholder="ค้นหาชื่อเมนูที่เข้าใช้งาน"
                     labelDefalut="ทั้งหมด"
                  />
               </div>
               <div class="w-full sm:w-[180px]">
                  <p class="text-sm mb-1.5 text-gray-400">วันที่และเวลาใช้งาน</p>
                  <Datepicker
                     inputId="dateA"
                     v-model="filters.dateA"
                     placeholder="วัน/เดือน/ปี"
                     inputHeight="h-[38px]"
                     class="w-full tablet:w-auto"
                     :showTime="true"
                  />
               </div>
               <div class="w-full sm:w-[180px]">
                  <p class="text-sm mb-1.5 text-gray-400">ถึง</p>
                  <Datepicker
                     inputId="dateB"
                     v-model="filters.dateB"
                     placeholder="วัน/เดือน/ปี"
                     inputHeight="h-[38px]"
                     class="w-full tablet:w-auto"
                     :showTime="true"
                  />
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
                  padding: 'py-3.5',
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
               { key: 'date', label: 'วันที่และเวลา', class: 'min-w-[160px]', sortable: true },
               { key: 'username', label: 'ชื่อล็อกอินเข้าใช้งาน', class: 'min-w-[200px]', sortable: true },
               { key: 'name', label: 'ชื่อ-นามสกุล (ไทย)', class: 'min-w-[200px]', sortable: true },
               { key: 'roleName', label: 'ชื่อสิทธิ์ผู้ใช้งาน', class: 'min-w-[180px]', sortable: true },
               { key: 'module', label: 'เมนูที่เข้าใช้งาน', class: 'min-w-[180px]', sortable: true },
               { key: 'action', label: 'กิจกรรม', class: 'min-w-[140px]', sortable: true },
               { key: 'ipAddress', label: 'IP Address', class: 'min-w-[180px]' },
            ]"
            :loading="isLoading"
            :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'กำลังโหลด...' }"
            :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'ไม่มีข้อมูล' }"
            :progress="{ color: 'primary', animation: 'carousel' }"
            :rows="tableData"
         >
            <template #date-data="{ row }">
               <p>{{ genTextDate({ date: row.dateCreated, format: "DD/MM/YYYY HH:mm:ss", isBuddhistYear: false }) || "-" }}</p>
            </template>
            <template #username-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2">{{ row.username }}</p>
            </template>
            <template #name-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2">{{ row.name }}</p>
            </template>
            <template #module-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2">{{ row.module }}</p>
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
import HistoryIcon from "~/assets/icons/history-circle.svg";
import ButtonSearch from "~/components/button/search";
import ButtonClear from "~/components/button/clear";
import SelectShowList from "~/components/form/selectShowList";
import Input from "~/components/form/input";
import Pagination from "~/components/pagination";
import Loading from "~/components/loading";
import SelectMulti from "~/components/form/selectMulti";
import Datepicker from "~/components/form/datepicker";

import useHistoryAPI from "~/service/api/history";
const { fetchHistoryList, fetchHistoryRoleList, fetchHistoryModuleList } = useHistoryAPI;

const filters = ref({
   keyword: "",
   roleIds: [],
   moduleIds: [],
   dateA: "",
   dateB: "",
   max: 10,
   offset: 0,
   currentPage: 1,
});

const tableData = ref([{ id: 1 }]);
const isLoading = ref(true);
const total = ref(null);
onMounted(() => {
   getListTable();
   //master data
   getHistoryRoleList();
   getHistoryModuleList();
});

watch(
   () => [filters.value.roleIds, filters.value.moduleIds, filters.value.dateA, filters.value.dateB],
   ([]) => {
      clearPage();
   }
);

const rolesList = ref([]);
const getHistoryRoleList = async () => {
   const res = await fetchHistoryRoleList();
   if (res.code == 20000) {
      rolesList.value = res.responseObject.roles;
   }
};

const modulesList = ref([]);
const getHistoryModuleList = async () => {
   const res = await fetchHistoryModuleList();
   if (res.code == 20000) {
      modulesList.value = res.responseObject.modules;
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
   const res = await fetchHistoryList(filters.value);
   if (res.code == 20000) {
      tableData.value = [];
      for (let i = 0; i < res.responseObject.historyList.length; i++) {
         const data = res.responseObject.historyList[i];
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
      roleIds: [],
      moduleIds: [],
      dateA: "",
      dateB: "",
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
