<template>
   <div class="p-1.5">
      <div class="flex justify-between items-center mb-5 flex-wrap gap-y-3">
         <div class="bg-white rounded-xl px-4 py-2 flex items-center gap-x-2">
            <img :src="NotebookIcon" alt="Icon" />
            <h1 class="text-xl">บทความวิจัย/วิชาการ</h1>
         </div>
         <div class="flex items-center gap-3">
            <ButtonImport :items="dropdownItems" />
            <ButtonAdd @click="btnOpenForm('create')" />
            <input id="input_file_articles_import" type="file" class="hidden" ref="input_file_articles_import"
               @change="handleChangeFile" accept=".xlsx" />
         </div>
      </div>
      <div class="bg-white rounded-lg p-4">
         <form class="flex items-end justify-between flex-wrap gap-y-3" @submit="reloadTable">
            <div class="flex items-center gap-3 flex-wrap">
               <div class="w-full sm:w-[280px]">
                  <p class="text-sm mb-1.5 text-gray-400">ค้นหา</p>
                  <Input v-model="filters.keyword" placeholder="ค้นหา" class="flex flex-col w-full text-sm"
                     heightClass="h-[38px]" />
               </div>
               <div class="w-full sm:w-[164px]">
                  <p class="text-sm mb-1.5 text-gray-400">ปีปฏิทิน</p>
                  <SelectMulti :options="recordYearList" v-model="filters.recordYear" optionAttribute="name"
                     searchablePlaceholder="ค้นหาปีปฏิทิน" labelDefalut="ทั้งหมด" />
               </div>
               <div class="w-full sm:w-[220px]">
                  <p class="text-sm mb-1.5 text-gray-400">เจ้าของบทความ</p>
                  <SelectMulti :options="ownerList" v-model="filters.authorId" optionAttribute="name"
                     searchablePlaceholder="ค้นหาเจ้าของบทความ" labelDefalut="ทั้งหมด" />
               </div>
               <div class="w-full sm:w-[220px]">
                  <p class="text-sm mb-1.5 text-gray-400">ประเภทบทความ</p>
                  <SelectMulti :options="articleTypeList" v-model="filters.articleType" optionAttribute="name"
                     searchablePlaceholder="ค้นหาประเภทบทความ" labelDefalut="ทั้งหมด" />
               </div>
               <div class="w-full sm:w-[220px]">
                  <p class="text-sm mb-1.5 text-gray-400">ระดับฐานข้อมูลวารสาร</p>
                  <SelectMulti :options="impactFactorList" v-model="filters.dataTypeId" optionAttribute="nameTh"
                     searchablePlaceholder="ค้นหาระดับฐานข้อมูลวารสาร" labelDefalut="ทั้งหมด" />
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
            <div class="flex items-center gap-3">
               <ButtonExport @click="clickExport()" />
            </div>
         </div>
         <UTable class="w-full" :ui="{
            wrapper: 'rounded-t-lg',
            thead: 'bg-primary-50',
            th: {
               padding: 'py-3',
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
            { key: 'order', label: 'ลำดับ', class: 'min-w-[65px] text-center' },
            { key: 'recordYear', label: 'ปีปฏิทิน', class: 'min-w-[100px]' },
            { key: 'author', label: 'ชื่อเจ้าของบทความ', class: 'min-w-[200px]' },
            { key: 'member', label: 'ผู้ร่วมแต่ง', class: 'min-w-[250px]' },
            { key: 'articleType', label: 'ประเภทบทความ', class: 'min-w-[180px]' },
            { key: 'name', label: 'ชื่อบทความ', class: 'min-w-[180px]' },
            { key: 'dataType', label: 'ระดับฐานข้อมูลวารสาร', class: 'min-w-[200px]' },
            { key: 'actions', label: 'จัดการ', class: 'min-w-[40px]' },
         ]" :loading="isLoading" :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'กำลังโหลด...' }"
            :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'ไม่มีข้อมูล' }"
            :progress="{ color: 'primary', animation: 'carousel' }" :rows="tableData">
            <template #order-data="{ row }">
               <p class="text-center">{{ formatCurrency(row.order) }}</p>
            </template>
            <template #author-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2">{{ row.author }}</p>
            </template>
            <template #member-data="{ row }">
               <div v-if="row.member" class="max-w-[300px] flex gap-x-2 flex-wrap">
                  <p v-for="(val, index) in row.member" :key="`member_${index}`">
                     <span>{{ val.member }}</span>
                     <span v-if="row.member.length > 1 && index != row.member.length - 1">,</span>
                  </p>
               </div>
            </template>
            <template #articleType-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2">{{ row.articleType }}</p>
            </template>
            <template #name-data="{ row }">
               <p class="max-w-[300px] text-wrap line-clamp-2">{{ row.name }}</p>
            </template>
            <template #dataType-data="{ row }">
               <p class="max-w-[200px] text-wrap line-clamp-2">{{ row.dataType }}</p>
            </template>
            <template #actions-data="{ row }">
               <MenuDropdown :menus="genMenuTable(row)" />
            </template>
         </UTable>
      </div>
      <Pagination v-if="!isLoading && tableData.length > 0" class="mt-6" :total="total"
         :currentPage="filters.currentPage" :changePage="changePage" :limit="filters.max" />
   </div>
   <DialogArticlesForm :isOpen="isOpen" :setDialog="setDialog" :actionMode="actionMode" :id="articlesId"
      :setLoadingPage="setLoadingPage" :getListTable="getListTable" :btnOpenForm="btnOpenForm"
      :getRecordYearList="getRecordYearList" :getLeaderList="getLeaderList" />
   <DialogConfirm :isOpen="isOpenConfirm" :setDialog="setDialogConfirm" title="ลบข้อมูล"
      desc="คุณต้องการลบข้อมูลนี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก" icon="danger"
      :btnAction="fnDelete" />
   <Loading v-if="isLoading" />
</template>
<script setup>
import NotebookIcon from "~/assets/icons/notebook.svg";
import ButtonAdd from "~/components/button/add";
import ButtonSearch from "~/components/button/search";
import ButtonClear from "~/components/button/clear";
import SelectShowList from "~/components/form/selectShowList";
import Input from "~/components/form/input";
import DialogArticlesForm from "~/components/dialog/research-work/articlesForm";
import DialogConfirm from "~/components/dialog/confirm";
import Pagination from "~/components/pagination";
import MenuDropdown from "~/components/form/menu";
import Loading from "~/components/loading";
import ButtonImport from "~/components/button/import";
import ButtonExport from "~/components/button/export";
import SelectMulti from "~/components/form/selectMulti";
import useArticlesAPI from "~/service/api/researches/articles";
const { fetchArticleList, deleteArticle } = useArticlesAPI;
import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchArticleOwnerList, fetchArticleYearList, fetchArticleTypeList, fetchImpactFactorList } = useMasterDataAPI;

const filters = ref({
   keyword: "",
   recordYear: [],
   authorId: [],
   articleType: [],
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
   getDatabaseTypeList();
   getLeaderList();
   getArticleTypeList();
});

watch(
   () => [filters.value.recordYear, filters.value.authorId, filters.value.articleType, filters.value.dataTypeId],
   ([newRecordYear, newAuthorId, newArticleTypeId, newDataTypeId], [prevRecordYear, prevAuthorId, prevArticleTypeId, prevDataTypeId]) => {
      clearPage();
   }
);

const recordYearList = ref([]);
const getRecordYearList = async () => {
   const res = await fetchArticleYearList();
   if (res.code == 20000) {
      recordYearList.value = res.responseObject.recordYearList;
   }
};

const impactFactorList = ref([]);
const getDatabaseTypeList = async () => {
   const res = await fetchImpactFactorList();
   if (res.code == 20000) {
      impactFactorList.value = res.responseObject.impactFactorList;
   }
};

const ownerList = ref([]);
const getLeaderList = async () => {
   const res = await fetchArticleOwnerList();
   if (res.code == 20000) {
      ownerList.value = res.responseObject.ownerList;
   }
};

const articleTypeList = ref([]);
const getArticleTypeList = async () => {
   const res = await fetchArticleTypeList();
   if (res.code == 20000) {
      articleTypeList.value = res.responseObject.articleTypesList;
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
   const res = await fetchArticleList(filters.value);
   if (res.code == 20000) {
      tableData.value = [];
      for (let i = 0; i < res.responseObject.article.length; i++) {
         const data = res.responseObject.article[i];
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
      authorId: [],
      articleType: [],
      dataTypeId: [],
      max: 10,
      offset: 0,
      currentPage: 1,
   };
};

const isOpen = ref(false);
const setDialog = (status) => {
   isOpen.value = status;
};

const isOpenConfirm = ref(false);
const setDialogConfirm = (status) => {
   isOpenConfirm.value = status;
};

const actionMode = ref("");
const btnOpenForm = (mode) => {
   if (mode == "create") {
      articlesId.value = null;
   }
   actionMode.value = mode;
   setDialog(true);
};

const articlesId = ref(null);
const genMenuTable = (row) => {
   const result = [
      [
         {
            label: "ดู",
            icon: "i-heroicons-eye",
            click: () => {
               articlesId.value = row.id;
               btnOpenForm("view");
            },
         },
         {
            label: "แก้ไข",
            icon: "i-heroicons-pencil-square",
            click: () => {
               articlesId.value = row.id;
               btnOpenForm("edit");
            },
         },
      ],
      [
         {
            label: "ลบ",
            icon: "i-heroicons-trash",
            click: () => {
               articlesId.value = row.id;
               setDialogConfirm(true);
            },
         },
      ],
   ];
   return result;
};

const fnDelete = async () => {
   isLoading.value = true;
   const res = await deleteArticle(articlesId.value);
   if (res.code == 20000) {
      setDialogConfirm(false);
      const toast = useToast();
      toast.add({ title: res.message, color: "green" });
      await getListTable();
      getRecordYearList();
      getLeaderList();
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
         click: async () => {
            exportFile("/article/template", "บทความวิจัย-วิชาการ-template");
         },
      },
      {
         id: "import",
         label: "Import",
         click: () => {
            input_file_articles_import.value.value = null;
            input_file_articles_import.value.click();
         },
      },
   ],
];

//Import By Saral
const input_file_articles_import = ref(null);
const clickExport = () => {
   const { keyword, offset, max, recordYear, authorId, articleType, dataTypeId } = filters.value;
   let url = `/article/export?offset=${offset}&max=${max}`;

   if (keyword) {
      url += `&keyword=${keyword}`;
   }
   if (recordYear.length) {
      const names = recordYear.map((item) => item.name);
      url += `&recordYear=${names}`;
   }
   if (authorId.length) {
      const ids = authorId.map((item) => item.id);
      url += `&authorId=${ids}`;
   }
   if (articleType.length) {
      const ids = articleType.map((item) => item.id);
      url += `&articleType=${ids}`;
   }
   if (dataTypeId.length) {
      const ids = dataTypeId.map((item) => item.id);
      url += `&dataTypeId=${ids}`;
   }

   exportFile(url, `บทความวิจัย-วิชาการ-${dateFormExport()}`);
};

const handleChangeFile = async (e) => {
   isLoading.value = true;
   const res = await changeFile(e, "/article/import");
   if (res?.code === 20000) {
      btnClear();
   }
   isLoading.value = false;
};
</script>
