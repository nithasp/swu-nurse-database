<template>
   <div id="report" class="px-1 py-2">
      <header class="md:flex md:justify-between md:items-center">
         <div class="flex items-center gap-2 pl-4 pr-6 py-2.5 rounded-xl bg-[#ffffffbf]">
            <img :src="ReportIcon1" alt="personal-work-report-icon1" class="w-8 h-8" />
            <h1 class="text-[#333] text-[20px]">รายงานบุคลากร</h1>
         </div>
         <div class="mobile:flex mobile:justify-between mobile:gap-3.5 mobile:mt-4 md:mt-0">
            <ButtonImport :items="importDropdownItems" />
            <ButtonAdd class="mt-3 mobile:mt-0" @click="handleAction('create')" />
            <input id="input_file_report" type="file" class="hidden" ref="input_file_report" @change="handleChangeFile" accept=".xlsx" />
         </div>
      </header>
      <div class="xl:grid xl:grid-cols-[1fr_auto] xl:items-center bg-white mt-5 p-[20px_17px] rounded-lg mb-[14px]">
         <div class="flex flex-wrap gap-[12px]">
            <div class="w-full xl:w-[calc(27%-6px)]">
               <p class="text-sm text-[#344054] mb-1.5">ค้นหา</p>
               <Input
                  v-model="filters.text"
                  placeholder="ค้นหา"
                  class="flex flex-col w-full text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  @keyup="handleSearchPress"
               />
            </div>

            <div class="w-full sm:w-[calc(50%-6px)] xl:w-[calc(17%-6px)]">
               <p class="text-sm text-[#344054] mb-1.5">หน่วยงาน</p>
               <USelectMenu
                  v-model="divisionIds"
                  :options="divisions"
                  placeholder="ทั้งหมด"
                  multiple
                  searchable
                  searchable-placeholder="ค้นหาหน่วยงาน"
                  value-attribute="id"
                  option-attribute="name"
                  :search-attributes="['name']"
                  :ui="{
                     base: 'h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0',
                     rounded: 'rounded-lg',
                     placeholder: 'text-gray-100',
                     icon: {
                        base: 'text-gray-500',
                     },
                  }"
                  :uiMenu="{
                     ring: 'ring-gray-100',
                     option: {
                        active: 'bg-gray-50',
                     },
                     label: 'text-sm',
                     input: 'border-gray-100 placeholder:text-gray-100',
                  }"
                  @change="handleDivision"
               >
                  <template #label>
                     <span v-if="divisionIds.length > 0" class="truncate">
                        {{ getDivisionLabel() }}
                     </span>
                  </template>
               </USelectMenu>
            </div>

            <div class="w-full sm:w-[calc(50%-6px)] xl:w-[calc(17%-6px)]">
               <p class="text-sm text-[#344054] mb-1.5">สถานภาพการปฏิบัติ</p>
               <USelectMenu
                  v-model="personnelStatusIds"
                  :options="personnelStatus"
                  placeholder="ทั้งหมด"
                  multiple
                  searchable
                  searchable-placeholder="ค้นหาหน่วยงาน"
                  value-attribute="id"
                  option-attribute="nameTh"
                  :search-attributes="['nameTh']"
                  :ui="{
                     base: 'h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0',
                     rounded: 'rounded-lg',
                     placeholder: 'text-gray-100',
                     icon: {
                        base: 'text-gray-500',
                     },
                  }"
                  :uiMenu="{
                     ring: 'ring-gray-100',
                     option: {
                        active: 'bg-gray-50',
                     },
                     label: 'text-sm',
                     input: 'border-gray-100 placeholder:text-gray-100',
                  }"
                  @change="handlePersonnelStatus"
               >
                  <template #label>
                     <span v-if="personnelStatusIds.length > 0" class="truncate">
                        {{ getPersonnelStatusLabel() }}
                     </span>
                  </template>
               </USelectMenu>
            </div>

            <div class="w-full sm:w-[calc(50%-6px)] xl:w-[calc(17%-6px)]">
               <p class="text-sm text-[#344054] mb-1.5">วันที่เริ่มงาน</p>
               <Datepicker class="text-sm" inputId="dateStartedAtSwuA" v-model="filters.dateStartedAtSwuA" :placeholder="'วัน/เดือน/ปี'" inputHeight="h-[38px]" />
            </div>

            <div class="w-full sm:w-[calc(50%-6px)] xl:w-[calc(17%-6px)]">
               <p class="text-sm text-[#344054] mb-1.5">ถึง</p>
               <Datepicker
                  class="text-sm"
                  inputId="dateStartedAtSwuB"
                  v-model="filters.dateStartedAtSwuB"
                  :placeholder="'วัน/เดือน/ปี'"
                  inputHeight="h-[38px]"
                  :minDate="filters.dateStartedAtSwuA"
               />
            </div>
         </div>

         <div class="flex gap-3 mt-3 xl:mt-0 xl:self-end">
            <ButtonSearch @click="getListTable" />
            <ButtonClear @click="resetTableData" />
         </div>
      </div>

      <div class="px-4 py-5 rounded-lg bg-white 2xl:mt-0 2xl:pt-4">
         <div class="sm:flex sm:justify-between">
            <div class="flex items-center gap-5">
               <SelectShowList :setShowList="setShowList" />
               <p class="text-gray-400 text-sm">{{ formatCurrency(total) }} รายการ</p>
            </div>
            <div class="mt-4 mobile:flex mobile:gap-3 mobile:mt-4 sm:mt-0">
               <ButtonExport @click="clickExport()" />
            </div>
         </div>
         <div class="mt-3 overflow-hidden rounded-t-[5px]">
            <UTable
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
                  { key: 'id', label: 'ลำดับ', class: 'min-w-10' },
                  {
                     key: 'fullname',
                     label: 'ชื่อ-นามสกุล (ไทย)',
                     class: 'min-w-40',
                     sortable: true,
                  },
                  {
                     key: 'fullnameEn',
                     label: 'ชื่อ-นามสกุล (อังกฤษ)',
                     class: 'min-w-40',
                  },
                  {
                     key: 'citizenId',
                     label: 'เลขประจำตัวประชาชน',
                     class: 'min-w-40 text-center',
                  },
                  {
                     key: 'age',
                     label: 'อายุบุคลากร',
                     class: 'min-w-28 text-center',
                  },
                  {
                     key: 'dateStartedAtSwu',
                     label: 'วันที่เริ่มงาน',
                     class: 'min-w-32 text-center',
                     sortable: true,
                  },
                  {
                     key: 'durationSinceStart',
                     label: 'อายุงานตามปีการศึกษา',
                     class: 'min-w-44 text-center',
                  },
                  {
                     key: 'personnelStatus',
                     label: 'สถานภาพการปฏิบัติ',
                     class: 'min-w-32 text-center',
                  },
                  {
                     key: 'agency',
                     label: 'หน่วยงาน',
                     class: 'min-w-36 text-center',
                  },
                  { key: 'actions', label: 'จัดการ', class: 'min-w-10' },
               ]"
               :rows="people"
               :loading="isLoading"
               :loading-state="{
                  icon: 'i-heroicons-arrow-path-20-solid',
                  label: 'กำลังโหลด...',
               }"
               :empty-state="{
                  icon: 'i-heroicons-circle-stack-20-solid',
                  label: 'ไม่มีข้อมูล',
               }"
               :progress="{ color: 'primary', animation: 'carousel' }"
            >
               <template #id-data="{ index }">
                  <p class="text-center">{{ filters.offset + (index + 1) }}</p>
               </template>
               <template #age-data="{ row }">
                  <p class="text-center">{{ row.age }} ปี</p>
               </template>
               <template #citizenId-data="{ row }">
                  <p class="text-center">{{ formatThaiCitizenID(row.citizenId) }}</p>
               </template>
               <template #dateStartedAtSwu-data="{ row }">
                  <p class="text-center">
                     {{
                        genTextDate({
                           date: row.dateStartedAtSwu,
                           format: "DD/MM/YYYY",
                           isBuddhistYear: false,
                        }) || "-"
                     }}
                  </p>
               </template>
               <template #durationSinceStart-data="{ row }">
                  <p class="text-center">{{ row.durationSinceStart }}</p>
               </template>
               <template #personnelStatus-data="{ row }">
                  <p class="text-center">
                     {{ row.personnelStatus }}
                  </p>
               </template>
               <template #actions-data="{ row }">
                  <MenuDropdown :menus="genMenuTable(row)" />
               </template>
            </UTable>
            <Pagination
               v-if="!isLoading && people.length > 0"
               class="mt-6"
               :total="total"
               :currentPage="filters.currentPage"
               :changePage="changePage"
               :limit="filters.max"
            />
         </div>
      </div>
      <DialogConfirm
         :isOpen="isDialogDeletePersonnelOpen"
         :setDialog="setDialogDeletePersonnel"
         title="ลบข้อมูล"
         desc="คุณต้องการลบข้อมูลนี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก"
         icon="danger"
         :btnAction="handleDeletePersonnel"
      />
      <Loading v-if="isLoading" />
   </div>
</template>

<script setup>
import Input from "~/components/form/input";
import Loading from "~/components/loading";

import ButtonAdd from "~/components/button/add.vue";
import ButtonClear from "~/components/button/clear.vue";
import ButtonImport from "~/components/button/import.vue";
import ButtonExport from "~/components/button/export.vue";
import ButtonSearch from "~/components/button/search.vue";

import Datepicker from "~/components/form/datepicker";
import Pagination from "~/components/pagination";
import SelectShowList from "~/components/form/selectShowList";
import MenuDropdown from "~/components/form/menu";
import DialogConfirm from "~/components/dialog/confirm";

import ReportIcon1 from "~/assets/images/personal-work/report/report-icon1.png";

import useReportAPI from "~/service/api/report";
const { fetchPersonnelList, deletePersonnel, fetchDownloadPersonnelTemplate } = useReportAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchAgencyList, fetchPersonnelStatusList } = useMasterDataAPI;

const toast = useToast();
const isLoading = ref(true);
const people = ref([]);
const divisions = ref([
   {
      id: "",
      name: "ทั้งหมด",
   },
]);
const personnelStatus = ref([
   {
      id: "",
      nameEn: "ทั้งหมด",
      nameTh: "ทั้งหมด",
   },
]);
const importDropdownItems = [
   [
      {
         id: "download",
         label: "ดาวน์โหลด Template",
         click: async () => {
            exportFile("/personnel/template", "รายงานบุคลากร-template");
         },
      },
      {
         id: "import",
         label: "Import",
         click: () => {
            input_file_report.value.value = null;
            input_file_report.value.click();
         },
      },
   ],
];

const filters = ref({
   max: 10,
   offset: 0,
   currentPage: 1,
   keyword: "",
   divisionId: "",
   personnelStatusId: "",
   dateStartedAtSwuA: "",
   dateStartedAtSwuB: "",
});
const total = ref(0);
const divisionIds = ref([]);
const personnelStatusIds = ref([]);
const personnelId = ref(0);

onMounted(() => {
   getData();
});

watch(
   () => filters.value.dateStartedAtSwuA,
   (newData) => {
      if (newData && filters.value.dateStartedAtSwuB) {
         const start = new Date(genTextDate({ date: newData, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }));
         const end = new Date(genTextDate({ date: filters.value.dateStartedAtSwuB, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }));
         if (start.getTime() > end.getTime()) {
            filters.value.dateStartedAtSwuB = newData;
         }
      }

      if (!filters.value.dateStartedAtSwuB) {
         const today = new Date();
         const currentMonth = today.getMonth() + 1;
         const currentBuddhistYear = today.getFullYear() + 543;
         const newDataMonth = parseInt(newData.split("/")[1]);
         const newDataYear = parseInt(newData.split("/")[2]);

         if (newDataYear > currentBuddhistYear) {
            filters.value.dateStartedAtSwuB = newData;
            setTimeout(() => {
               filters.value.dateStartedAtSwuB = "";
            }, 10);
            return;
         }

         if (currentBuddhistYear === newDataYear && newDataMonth > currentMonth) {
            filters.value.dateStartedAtSwuB = newData;
            setTimeout(() => {
               filters.value.dateStartedAtSwuB = "";
            }, 10);
         }
      }
      getListTable();
   }
);

watch(
   () => filters.value.dateStartedAtSwuB,
   () => {
      getListTable();
   }
);

const genMenuTable = (row) => {
   const result = [
      [
         {
            label: "ดู",
            icon: "i-heroicons-eye",
            click: () => {
               handleAction("view", row.id);
            },
         },
         {
            label: "งานทะเบียน",
            icon: "i-heroicons-pencil-square",
            click: () => {
               handleAction("edit", row.id);
            },
         },
      ],
      [
         {
            label: "ลบ",
            icon: "i-heroicons-trash",
            click: () => {
               personnelId.value = row.id;
               setDialogDeletePersonnel(true);
            },
         },
      ],
   ];
   return result;
};

const handleAction = (type, id) => {
   navigateTo({
      path: `/personal-work/report/${type}`,
      query: { id },
   });
};

const setShowList = (listTotal) => {
   if (filters.value.max != listTotal) {
      filters.value.max = listTotal;
      filters.value.currentPage = 1;
      filters.value.offset = 0;
      getListTable();
   }
};

const getData = () => {
   Promise.all([fetchPersonnelList(filters.value), fetchAgencyList(), fetchPersonnelStatusList()]).then((res) => {
      if (res[0]?.code === 20000) {
         people.value = res[0].responseObject.personnels;
         total.value = res[0].responseObject.total;
      }
      if (res[1]?.code === 20000) {
         divisions.value = res[1].responseObject.agencyList;
      }
      if (res[2]?.code === 20000) {
         personnelStatus.value = res[2].responseObject.personnelStatusList;
      }

      isLoading.value = false;
   });
};

const getListTable = async () => {
   isLoading.value = true;
   const res = await fetchPersonnelList(filters.value);
   if (res.code === 20000) {
      people.value = res.responseObject.personnels;
      total.value = res.responseObject.total;
   }
   isLoading.value = false;
};

const changePage = (pageNum) => {
   filters.value.currentPage = pageNum;
   filters.value.offset = filters.value.max * (pageNum - 1);
   getListTable();
};

const resetTableData = () => {
   filters.value = {
      max: 10,
      offset: 0,
      currentPage: 1,
      keyword: "",
      agencyIds: "",
      personnelStatusIds: "",
      dateStartedAtSwuA: "",
      dateStartedAtSwuB: "",
   };
   divisionIds.value = [];
   personnelStatusIds.value = [];
   getListTable();
};

const handleSearchPress = async (e) => {
   if (e.keyCode === 13) {
      filters.value.keyword = e.target.value;
      filters.value.offset = 0;
      filters.value.currentPage = 1;
      await getListTable();
   }
};

const handleSelectFilter = (value, key) => {
   filters.value.offset = 0;
   filters.value.currentPage = 1;
   filters.value[key] = value;
   getListTable();
};

const getDivisionLabel = () => {
   return divisions.value
      .filter((division) => divisionIds.value.some((divisionValue) => divisionValue === division.id))
      .map((i) => i.name)
      .join(", ");
};
const handleDivision = () => {
   const selectedDivisionId = divisionIds.value.join(",");
   handleSelectFilter(selectedDivisionId, "agencyIds");
};

const getPersonnelStatusLabel = () => {
   return personnelStatus.value
      .filter((personnelStatus) => personnelStatusIds.value.some((personnelStatusIdsValue) => personnelStatusIdsValue === personnelStatus.id))
      .map((i) => i.nameTh)
      .join(", ");
};

const handlePersonnelStatus = () => {
   const selectedPersonnelStatusId = personnelStatusIds.value.join(",");
   handleSelectFilter(selectedPersonnelStatusId, "personnelStatusIds");
};

const isDialogDeletePersonnelOpen = ref(false);
const setDialogDeletePersonnel = (status) => {
   isDialogDeletePersonnelOpen.value = status;
};
const handleDeletePersonnel = async () => {
   isLoading.value = true;
   const res = await deletePersonnel(personnelId.value);
   if (res?.code === 20000) {
      toast.add({ title: res?.message, color: "green" });
      getListTable();
      setDialogDeletePersonnel(false);
   } else {
      toast.add({ title: res?.message, color: "red" });
   }
};

//Import By Saral
const input_file_report = ref(null);
const handleChangeFile = async (e) => {
   isLoading.value = true;
   const res = await changeFile(e, "/personnel/import");
   if (res?.code === 20000) {
      resetTableData();
   }
   isLoading.value = false;
};

const clickExport = () => {
   const { keyword, offset, max, agencyIds, personnelStatusIds, dateStartedAtSwuA, dateStartedAtSwuB } = filters.value;
   let url = `/personnel/export?offset=${offset}&max=${max}`;

   if (keyword) {
      url += `&keyword=${keyword}`;
   }
   if (agencyIds) {
      url += `&agencyIds=${agencyIds}`;
   }
   if (personnelStatusIds) {
      url += `&personnelStatusIds=${personnelStatusIds}`;
   }
   if (dateStartedAtSwuA) {
      url += `&dateStartedAtSwuA=${encodeURIComponent(
         genTextDate({
            date: dateStartedAtSwuA,
            format: "YYYY-MM-DDTHH:mm:ssZ",
            oldFormat: "DD-MM-YYYY",
            isBuddhistYear: true,
         })
      )}`;
   }
   if (dateStartedAtSwuB) {
      url += `&dateStartedAtSwuB=${encodeURIComponent(
         genTextDate({
            date: dateStartedAtSwuB,
            format: "YYYY-MM-DDTHH:mm:ssZ",
            oldFormat: "DD-MM-YYYY",
            isBuddhistYear: true,
         })
      )}`;
   }

   exportFile(url, `รายงานบุคลากร-${dateFormExport()}`);
};
</script>
