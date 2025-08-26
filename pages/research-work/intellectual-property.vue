<template>
   <div class="p-1.5">
      <div class="flex justify-between items-center mb-5 flex-wrap gap-y-3">
         <div class="bg-white rounded-xl px-4 py-2 flex items-center gap-x-2">
            <img :src="HeadThinkingIcon" alt="Icon" />
            <h1 class="text-xl">ทรัพย์สินทางปัญญา</h1>
         </div>
         <div class="flex items-center gap-3 flex-wrap">
            <ButtonImport :items="dropdownItems" />
            <ButtonAdd @click="btnOpenForm('create')" />
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
                  <p class="text-sm mb-1.5 text-gray-400">ปีปฏิทิน</p>
                  <SelectMulti
                     :options="recordYearList"
                     v-model="filters.recordYear"
                     optionAttribute="name"
                     searchablePlaceholder="ค้นหาปีปฏิทิน"
                     labelDefalut="ทั้งหมด"
                  />
               </div>
               <div class="w-full sm:w-[220px]">
                  <p class="text-sm mb-1.5 text-gray-400">เจ้าของงานวิจัย</p>
                  <SelectMulti
                     :options="leaderList"
                     v-model="filters.leaderId"
                     optionAttribute="name"
                     searchablePlaceholder="ค้นหาเจ้าของงานวิจัย"
                     labelDefalut="ทั้งหมด"
                  />
               </div>
               <div class="w-full sm:w-[220px]">
                  <p class="text-sm mb-1.5 text-gray-400">ประเภทสิ่งประดิษฐ์</p>
                  <SelectMulti
                     :options="inventionTypeList"
                     v-model="filters.dataTypeId"
                     optionAttribute="name"
                     searchablePlaceholder="ค้นหาประเภทสิ่งประดิษฐ์"
                     labelDefalut="ทั้งหมด"
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
               { key: 'recordYear', label: 'ปีปฏิทิน', class: 'min-w-[65px]', sortable: true },
               { key: 'leader', label: 'เจ้าของผลงาน', class: 'min-w-[200px]', sortable: true },
               { key: 'member', label: 'ผู้ร่วมผลงาน', class: 'min-w-[200px]', sortable: true },
               { key: 'name', label: 'ประเภทสิ่งประดิษฐ์', class: 'min-w-[200px]', sortable: true },
               { key: 'dataType', label: 'ชื่อผลงาน', class: 'min-w-[300px]', sortable: true },
               { key: 'actions', label: 'จัดการ', class: 'min-w-[40px]' },
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
            <template #leader-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2 leading-[1.8]">{{ row.leader }}</p>
            </template>
            <template #member-data="{ row }">
               <div v-if="row.member" class="max-w-[300px] flex gap-x-2 flex-wrap">
                  <p v-for="(val, index) in row.member" :key="`member_${index}`">
                     <span>{{ val.member }}</span>
                     <span v-if="row.member.length > 1 && index != row.member.length - 1">,</span>
                  </p>
               </div>
               <p v-else class="max-w-[200px] text-wrap line-clamp-2 leading-[1.8]">-</p>
            </template>
            <template #name-data="{ row }">
               <p class="max-w-[300px] text-wrap line-clamp-2">{{ row.name }}</p>
            </template>
            <template #dataType-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2">{{ row.dataType || "-" }}</p>
            </template>
            <template #actions-data="{ row }">
               <MenuDropdown :menus="genMenuTable(row)" />
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
   <DialogIntellectualPropertyForm
      :isOpen="isOpen"
      :setDialog="setDialog"
      :actionMode="actionMode"
      :id="intellectualPropertyId"
      :setLoadingPage="setLoadingPage"
      :getListTable="getListTable"
      :btnOpenForm="btnOpenForm"
   />
   <DialogConfirm
      :isOpen="isOpenDelete"
      :setDialog="setDialogDelete"
      title="ลบข้อมูล"
      desc="คุณต้องการลบข้อมูลนี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก"
      icon="danger"
      :btnAction="fnDelete"
   />
   <Loading v-if="isLoading" />
</template>
<script setup>
import HeadThinkingIcon from "~/assets/icons/head-thinking.svg";
import ButtonAdd from "~/components/button/add";
import ButtonSearch from "~/components/button/search";
import ButtonClear from "~/components/button/clear";
import SelectShowList from "~/components/form/selectShowList";
import Input from "~/components/form/input";
import DialogIntellectualPropertyForm from "~/components/dialog/research-work/intellectualPropertyForm";
import DialogConfirm from "~/components/dialog/confirm";
import Pagination from "~/components/pagination";
import MenuDropdown from "~/components/form/menu";
import Loading from "~/components/loading";
import ButtonImport from "~/components/button/import";
import ButtonExport from "~/components/button/export";
import SelectMulti from "~/components/form/selectMulti";

import useIntellectualPropertyAPI from "~/service/api/researches/intellectualProperty";
const { fetchIntellectualPropertyList, deleteIntellectualProperty } = useIntellectualPropertyAPI;
import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchLeaderList, fetchRecordYearList, fetchInventionTypeList } = useMasterDataAPI;

const filters = ref({
   keyword: "",
   recordYear: [],
   leaderId: [],
   dataTypeId: [],
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
   getInventionTypeList();
   getLeaderList();
});

watch(
   () => [filters.value.recordYear, filters.value.leaderId, filters.value.dataTypeId],
   ([newRecordYear, newLeaderId, newDataTypeId], [prevRecordYear, prevLeaderId, prevDataTypeId]) => {
      clearPage();
   }
);

const recordYearList = ref([]);
const getRecordYearList = async () => {
   const res = await fetchRecordYearList();
   if (res.code == 20000) {
      recordYearList.value = res.responseObject.recordYearList;
   }
};

const inventionTypeList = ref([]);
const getInventionTypeList = async () => {
   const res = await fetchInventionTypeList();
   if (res.code == 20000) {
      inventionTypeList.value = res.responseObject.inventionTypeList;
   }
};

const leaderList = ref([]);
const getLeaderList = async () => {
   const res = await fetchLeaderList();
   if (res.code == 20000) {
      leaderList.value = res.responseObject.leaderList;
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
   const res = await fetchIntellectualPropertyList(filters.value);
   if (res.code == 20000) {
      tableData.value = [];
      for (let i = 0; i < res.responseObject.researchs.length; i++) {
         const data = res.responseObject.researchs[i];
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
      recordYear: [],
      leaderId: [],
      dataTypeId: [],
      max: 10,
      offset: 0,
      currentPage: 1,
   };
   getListTable();
};

const isOpen = ref(false);
const setDialog = (status) => {
   isOpen.value = status;
};

const isOpenDelete = ref(false);
const setDialogDelete = (status) => {
   isOpenDelete.value = status;
};

const actionMode = ref("");
const btnOpenForm = (mode) => {
   if (mode == "create") {
      intellectualPropertyId.value = null;
   }
   actionMode.value = mode;
   setDialog(true);
};

const intellectualPropertyId = ref(null);
const genMenuTable = (row) => {
   const result = [
      [
         {
            label: "ดู",
            icon: "i-heroicons-eye",
            click: () => {
               intellectualPropertyId.value = row.id;
               btnOpenForm("view");
            },
         },
         {
            label: "งานทะเบียน",
            icon: "i-heroicons-pencil-square",
            click: () => {
               intellectualPropertyId.value = row.id;
               btnOpenForm("edit");
            },
         },
      ],
      [
         {
            label: "ลบ",
            icon: "i-heroicons-trash",
            click: () => {
               intellectualPropertyId.value = row.id;
               setDialogDelete(true);
            },
         },
      ],
   ];
   return result;
};

const fnDelete = async () => {
   isLoading.value = true;
   const res = await deleteIntellectualProperty(intellectualPropertyId.value);
   if (res.code == 20000) {
      setDialogDelete(false);
      const toast = useToast();
      toast.add({ title: res.message, color: "green" });
      await getListTable();
   }
   isLoading.value = false;
};

const changePage = (pageNum) => {
   filters.value.currentPage = pageNum;
   filters.value.offset = filters.value.max * (pageNum - 1);
   getListTable();
};

const setLoadingPage = (status) => {
   isLoading.value = status;
};

const dropdownItems = [
   [
      {
         id: "download",
         label: "ดาวน์โหลด Template",
         click: () => {
            console.log("ดาวน์โหลด Template");
         },
      },
      {
         id: "import",
         label: "Import",
         click: () => {
            console.log("Import");
         },
      },
   ],
];
</script>
