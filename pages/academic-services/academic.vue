<template>
   <header class="md:flex md:justify-between md:items-center">
      <div class="flex items-center gap-2 pl-4 pr-6 py-2.5 rounded-xl bg-[#ffffffbf]">
         <img :src="academicIcon" alt="personal-work-report-icon1" class="w-8 h-8" />
         <h1 class="text-xl text-[#333]">งานบริการวิชาการ</h1>
      </div>
      <div class="mt-4 md:mt-0 flex items-center gap-3">
         <ButtonImport :items="dropdownItems" />
         <ButtonAdd @click="btnOpenForm('create', 'income')" />
         <input id="input_file_academic_import" type="file" class="hidden" ref="input_file_academic_import"
            @change="handleChangeFile" accept=".xlsx" />
      </div>
   </header>
   <div class="mt-5 mb-[14px] px-4 py-5 rounded-lg bg-white flex justify-between items-center flex-wrap">
      <div class="w-full xl:flex xl:w-10/12 xl:gap-3.5">
         <div class="xl:max-w-[280px] xl:w-full">
            <p class="text-sm text-[#344054] mb-1.5">ค้นหา</p>
            <Input v-model="filtersAcademicServices.keyword" placeholder="ค้นหา" class="flex flex-col w-full text-sm"
               heightClass="h-[38px]" placeholderColor="text-gray-100" @keyup="handleSearchPress" />
         </div>
         <div class="flex gap-3.5 mt-3.5 xl:max-w-[164px] xl:w-full xl:mt-0">
            <div class="w-full">
               <p class="text-sm text-[#344054] mb-1.5">ปีการศึกษา</p>
               <USelectMenu v-model="educationYears" :options="educationYearList" placeholder="ทั้งหมด" multiple
                  searchable searchable-placeholder="ค้นหาปีการศึกษา" value-attribute="id" option-attribute="nameTh"
                  :search-attributes="['nameTh']" :ui="{
                     base: 'h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0',
                     rounded: 'rounded-lg',
                     placeholder: 'text-gray-100',
                     icon: {
                        base: 'text-gray-500',
                     },
                  }" :uiMenu="{
                     ring: 'ring-gray-100',
                     option: {
                        active: 'bg-gray-50',
                     },
                     label: 'text-sm',
                     input: 'border-gray-100 placeholder:text-gray-100',
                  }" @change="handleEducationYear">
                  <template #label>
                     <span v-if="educationYears.length > 0" class="truncate">
                        {{ getEducationYearLabel() }}
                     </span>
                  </template>
               </USelectMenu>
            </div>
         </div>

         <div class="mt-3.5 sm:flex sm:gap-3.5 xl:w-full xl:mt-0">
            <div class="w-full sm:w-1/2 xl:max-w-[200px] xl:w-full">
               <p class="text-sm text-[#344054] mb-1.5">แหล่งที่มาของงบประมาณ</p>
               <USelectMenu v-model="budgetSourceIds" :options="budgetSourceList" placeholder="ทั้งหมด" multiple
                  searchable searchable-placeholder="ค้นหาแหล่งที่มาของงบประมาณ" value-attribute="id"
                  option-attribute="name" :search-attributes="['name']" :ui="{
                     base: 'h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0',
                     rounded: 'rounded-lg',
                     placeholder: 'text-gray-100',
                     icon: {
                        base: 'text-gray-500',
                     },
                  }" :uiMenu="{
                     ring: 'ring-gray-100',
                     option: {
                        active: 'bg-gray-50',
                     },
                     label: 'text-sm',
                     input: 'border-gray-100 placeholder:text-gray-100',
                  }" @change="handleBudgetSourceList">
                  <template #label>
                     <span v-if="budgetSourceIds.length > 0" class="truncate">
                        {{ getBudgetSourceList() }}
                     </span>
                  </template>
               </USelectMenu>
            </div>
            <div class="w-full sm:w-1/2 mt-3.5 sm:mt-0 xl:max-w-[220px] xl:w-full">
               <p class="text-sm text-[#344054] mb-1.5">ข้อมูลเจ้าของโครงการ</p>
               <USelectMenu v-model="academicServicesOwners" :options="academicServicesOwnerList" placeholder="ทั้งหมด"
                  multiple searchable searchable-placeholder="ค้นหาข้อมูลเจ้าของโครงการ" value-attribute="id"
                  option-attribute="name" :search-attributes="['name']" :ui="{
                     base: 'h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0',
                     rounded: 'rounded-lg',
                     placeholder: 'text-gray-100',
                     icon: {
                        base: 'text-gray-500',
                     },
                  }" :uiMenu="{
                     ring: 'ring-gray-100',
                     option: {
                        active: 'bg-gray-50',
                     },
                     label: 'text-sm',
                     input: 'border-gray-100 placeholder:text-gray-100',
                  }" @change="handleAcademicServicesOwner">
                  <template #label>
                     <span v-if="academicServicesOwners.length > 0" class="truncate">
                        {{ getAcademicServicesOwnerLabel() }}
                     </span>
                  </template>
               </USelectMenu>
            </div>
         </div>
      </div>

      <div class="flex justify-start gap-3 w-full mt-4 xl:mt-0 xl:w-auto xl:self-end">
         <ButtonSearch @click="getListTable" />
         <ButtonClear @click="resetTableData" />
      </div>
   </div>

   <div class="px-4 py-5 rounded-lg bg-white">
      <div class="tablet:flex tablet:justify-between">
         <div class="flex items-center gap-5">
            <SelectShowList :setShowList="setShowList" />
            <p class="text-gray-400 text-sm">{{ formatCurrency(total) }} รายการ</p>
         </div>
         <div class="mobile:flex mobile:gap-3 mt-4 tablet:mt-0">
            <ButtonExport @click="clickExport()" />
         </div>
      </div>
      <div class="mt-3 overflow-hidden rounded-t-[5px]">
         <UTable :ui="{
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
         }" :sortButton="{
            size: 'xs',
         }" :columns="[
            { key: 'id', label: 'ลำดับ' },
            {
               key: 'educationYear',
               label: 'ปีการศึกษา',
               class: 'min-w-[120px]',
            },
            {
               key: 'name',
               label: 'ชื่อโครงการ',
               class: 'min-w-[120px]',
            },

            {
               key: 'budgetSource',
               label: 'แหล่งที่มาของงบประมาณ',
               class: 'min-w-[180px]',
            },
            {
               key: 'owner',
               label: 'ข้อมูลเจ้าของโครงการ',
               class: 'min-w-[180px]',
            },
            { key: 'actions', label: 'จัดการ', class: 'min-w-10' },
         ]" :rows="academicServicesList" :loading="isLoading" :loading-state="{
               icon: 'i-heroicons-arrow-path-20-solid',
               label: 'กำลังโหลด...',
            }" :empty-state="{
               icon: 'i-heroicons-circle-stack-20-solid',
               label: 'ไม่มีข้อมูล',
            }" :progress="{ color: 'primary', animation: 'carousel' }">
            <template #id-data="{ index }">
               <p>{{ filtersAcademicServices.offset + (index + 1) }}</p>
            </template>
            <template #educationYear-data="{ row }">
               <p>{{ row.educationYear + 543 || "-" }}</p>
            </template>
            <template #actions-data="{ row }">
               <MenuDropdown :menus="genMenuTable(row)" />
            </template>
         </UTable>
         <Pagination v-if="!isLoading && academicServicesList.length > 0" class="mt-6" :total="total"
            :currentPage="filtersAcademicServices.currentPage" :changePage="changePage"
            :limit="filtersAcademicServices.max" />
      </div>
   </div>
   <AcademicServicesForm :isOpen="isDialogAcademicServicesFormOpen"
      :setDialogAcademicServicesForm="setDialogAcademicServicesForm" :actionMode="actionMode" :academicId="academicId"
      :budgetSourceType="budgetSourceType" :budgetSourceCode="budgetSourceCode" :btnOpenForm="btnOpenForm" />
   <DialogConfirm :isOpen="isDialogConfirmOpen" :setDialog="setDialogConfirm" title="ลบไฟล์"
      desc="คุณต้องการลบไฟล์นี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก" icon="danger"
      :btnAction="handleDeleteAcademicService" />
   <DialogSuccess :type="'success'" :isOpen="isOpenSubmit" v-model:show="isOpenSubmit" :setDialog="setDialogSuccess"
      title="นำเข้าข้อมูลสำเร็จ" :btnAction="fnClose" />
</template>

<script setup>
import Input from "~/components/form/input";
import SelectShowList from "~/components/form/selectShowList";
import MenuDropdown from "~/components/form/menu";
import ButtonAdd from "~/components/button/add.vue";
import ButtonSearch from "~/components/button/search.vue";
import ButtonClear from "~/components/button/clear.vue";
import ButtonImport from "~/components/button/import";
import ButtonExport from "~/components/button/export.vue";
import Pagination from "~/components/pagination";
import AcademicServicesForm from "~/components/dialog/acedemic-services/academicServicesForm";
import academicIcon from "~/assets/icons/academic.svg";
import DialogConfirm from "~/components/dialog/confirm";

import useAcademicAPI from "~/service/api/academic";
const { fetchAcademicServicesList, fetchAcademicServicesOwnerList, deleteAcademicService } = useAcademicAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchEducationYearList, fetchBudgetSourceList } = useMasterDataAPI;

const toast = useToast();
const actionMode = ref("");
const budgetSourceType = ref("");
const budgetSourceCode = ref("");
const isLoading = ref(true);

const filtersAcademicServices = ref({
   keyword: "",
   offset: 0,
   max: 10,
   currentPage: 1,
   budgetSourceIds: "",
   educationYearIds: "",
   ownerIds: "",
});
const filtersAcademicServicesOwner = ref({
   keyword: "",
   offset: 0,
   max: -1,
});
const total = ref(0);
const academicId = ref(null);

onMounted(() => {
   getData();
});

const genMenuTable = (row) => {
   const result = [
      [
         {
            label: "ดู",
            icon: "i-heroicons-eye",
            click: () => {
               academicId.value = row.id;
               budgetSourceCode.value = row.budgetSourceCode;
               btnOpenForm("view", budgetSourceCode.value);
            },
         },
         {
            label: "แก้ไข",
            icon: "i-heroicons-pencil-square",
            click: () => {
               academicId.value = row.id;
               budgetSourceCode.value = row.budgetSourceCode;
               btnOpenForm("edit", budgetSourceCode.value);
            },
         },
      ],
      [
         {
            label: "ลบ",
            icon: "i-heroicons-trash",
            click: () => {
               academicId.value = row.id;
               setDialogConfirm(true);
            },
         },
      ],
   ];
   return result;
};

const setShowList = (listTotal) => {
   if (filtersAcademicServices.value.max != listTotal) {
      filtersAcademicServices.value.max = listTotal;
      filtersAcademicServices.value.currentPage = 1;
      filtersAcademicServices.value.offset = 0;
      getListTable();
   }
};

const academicServicesList = ref([]);
const academicServicesOwnerList = ref([
   {
      id: "",
      name: "ทั้งหมด",
   },
]);
const educationYearList = ref([
   {
      id: "",
      nameTh: "ทั้งหมด",
   },
]);
const budgetSourceList = ref([
   {
      id: "",
      name: "ทั้งหมด",
   },
]);

const academicServicesOwners = ref([]);
const educationYears = ref([]);
const budgetSourceIds = ref([]);

const getData = () => {
   Promise.all([
      fetchAcademicServicesList(filtersAcademicServices.value),
      fetchAcademicServicesOwnerList(filtersAcademicServicesOwner.value),
      fetchEducationYearList(),
      fetchBudgetSourceList(),
   ]).then((res) => {
      if (res[0]?.code === 20000) {
         academicServicesList.value = res[0].responseObject.academicServices;
         total.value = res[0].responseObject.total;
      }
      if (res[1]?.code === 20000) {
         academicServicesOwnerList.value = res[1].responseObject.owners;
      }
      if (res[2]?.code === 20000) {
         educationYearList.value = res[2].responseObject.educationYearList;
      }
      if (res[3]?.code === 20000) {
         budgetSourceList.value = res[3].responseObject.budgetSourceList;
      }
      isLoading.value = false;
   });
};

const getListTable = async () => {
   isLoading.value = true;
   const res = await fetchAcademicServicesList(filtersAcademicServices.value);
   if (res.code === 20000) {
      academicServicesList.value = res.responseObject.academicServices;
      total.value = res.responseObject.total;
   }
   isLoading.value = false;
};

const changePage = (pageNum) => {
   filtersAcademicServices.value.currentPage = pageNum;
   filtersAcademicServices.value.offset = filtersAcademicServices.value.max * (pageNum - 1);
   getListTable();
};

const resetTableData = () => {
   filtersAcademicServices.value = {
      keyword: "",
      offset: 0,
      max: 10,
      currentPage: 1,
      budgetSourceIds: "",
      educationYearIds: "",
      ownerIds: "",
   };
   academicServicesOwners.value = [];
   educationYears.value = [];
   budgetSourceIds.value = [];
   getListTable();
};

const handleSearchPress = async (e) => {
   if (e.keyCode === 13) {
      filtersAcademicServices.value.keyword = e.target.value;
      filtersAcademicServices.value.offset = 0;
      filtersAcademicServices.value.currentPage = 1;
      await getListTable();
   }
};

const handleSelectFilter = (value, key) => {
   filtersAcademicServices.value.offset = 0;
   filtersAcademicServices.value.currentPage = 1;
   filtersAcademicServices.value[key] = value;
   getListTable();
};

const btnOpenForm = (actionModeValue, budgetSourceCodeValue) => {
   actionMode.value = actionModeValue;
   budgetSourceCode.value = budgetSourceCodeValue;

   setDialogAcademicServicesForm(true);
};

const isDialogAcademicServicesFormOpen = ref(false);
const setDialogAcademicServicesForm = async (status, type) => {
   isDialogAcademicServicesFormOpen.value = status;
   if (type === "refresh") {
      const res = await fetchAcademicServicesOwnerList(filtersAcademicServices.value);
      if (res.code === 20000) {
         academicServicesOwnerList.value = res.responseObject.owners;
         getListTable();
      }
      academicId.value = null;
   }
};
const isDialogConfirmOpen = ref(false);
const setDialogConfirm = (status, type) => {
   isDialogConfirmOpen.value = status;
   if (type === "refresh") {
      getListTable();
      academicId.value = null;
   }
};

const handleDeleteAcademicService = async () => {
   isLoading.value = true;
   const res = await deleteAcademicService(academicId?.value);
   if (res?.code === 20000) {
      toast.add({ title: res?.message, color: "green" });
      setDialogConfirm(false, "refresh");
   } else {
      toast.add({ title: res?.message, color: "red" });
   }
   isLoading.value = false;
};

const getEducationYearLabel = () => {
   return educationYearList.value
      .filter((educationYear) => educationYears.value.some((year) => year === educationYear.id))
      .map((i) => i.nameTh)
      .join(", ");
};
const handleEducationYear = () => {
   const selectedEducationYear = educationYears.value.join(",");
   handleSelectFilter(selectedEducationYear, "educationYearIds");
};

const getAcademicServicesOwnerLabel = () => {
   return academicServicesOwnerList.value
      .filter((academicServicesOwner) => academicServicesOwners.value.some((academicServicesOwnerId) => academicServicesOwnerId === academicServicesOwner.id))
      .map((i) => i.name)
      .join(", ");
};
const handleAcademicServicesOwner = () => {
   const selectedAcademicServicesOwner = academicServicesOwners.value.join(",");
   handleSelectFilter(selectedAcademicServicesOwner, "ownerIds");
};

const getBudgetSourceList = () => {
   return budgetSourceList.value
      .filter((budgetSource) => budgetSourceIds.value.some((budgetSourceId) => budgetSourceId === budgetSource.id))
      .map((i) => i.name)
      .join(", ");
};
const handleBudgetSourceList = () => {
   const selectedBudgetSourceList = budgetSourceIds.value.join(",");
   handleSelectFilter(selectedBudgetSourceList, "budgetSourceIds");
};

//Import By Saral
import DialogSuccess from "~/components/dialog/alert";
const input_file_academic_import = ref(null);
const isOpenSubmit = ref(false);
const setDialogSuccess = (status) => {
   isOpenSubmit.value = status;
};

const dropdownItems = [
   [
      {
         id: "download",
         label: "ดาวน์โหลด Template",
         click: async () => {
            exportFile("/academic/template", "งานบริการวิชาการ-template");
         },
      },
      {
         id: "import",
         label: "Import",
         click: () => {
            input_file_academic_import.value.value = null;
            input_file_academic_import.value.click();
         },
      },
   ],
];

const handleChangeFile = async (e) => {
   isLoading.value = true;
   const res = await changeFile(e, "/academic/import");
   if (res?.code === 20000) {
      resetTableData();
   }
   isLoading.value = false;
};

const clickExport = () => {
   const { keyword, offset, max, educationYearIds, budgetSourceIds, ownerIds } = filtersAcademicServices.value;
   let url = `/academic/export?offset=${offset}&max=${max}`;

   if (keyword) {
      url += `&keyword=${keyword}`;
   }
   if (educationYearIds) {
      url += `&educationYearIds=${educationYearIds}`;
   }
   if (budgetSourceIds) {
      url += `&budgetSourceIds=${budgetSourceIds}`;
   }
   if (ownerIds) {
      url += `&ownerIds=${ownerIds}`;
   }

   exportFile(url, `งานบริการวิชาการ-${dateFormExport()}`);
};
</script>
