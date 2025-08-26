<template>
   <div class="p-1.5">
      <div id="tab-dashboard" class="flex gap-3 mb-5 overflow-x-auto">
         <UButton
            v-for="tab in tabs"
            :key="`${tab.id}_tab_dashboard`"
            variant="solid"
            :label="tab.label"
            block
            :class="[page == tab.id ? 'bg-primary-500' : 'bg-gray-100 hover:bg-gray-100 hover:opacity-75 text-[#333]', 'rounded-xl h-12 w-max min-w-[220px] px-8']"
            @click="page = tab.id"
         />
      </div>
      <div v-show="page == 1">
         <ResearchPercent :recordYearList="recordYearList" :educationYearList="educationYearList" />
      </div>
      <div v-show="page == 2">
         <ComparisonByYear :recordYearList="recordYearListRefactor" :educationYearList="educationYearListRefactor"
         :personnelList="personnelListRefactor"
         :agencyList="agencyListRefactor"
         :researchList="researchList"
         />
      </div>
      <div v-show="page == 3">
         <ComparisonByField :recordYearList="recordYearListRefactor" :educationYearList="educationYearListRefactor" :researchList="researchList" />
      </div>
      <div v-show="page == 4">
         <FundingSupport :budgetYearListList="budgetYearListList" :educationYearList="educationYearList" />
      </div>
   </div>
</template>
<script setup>
import ResearchPercent from "~/components/dashboard/research/percent";
import ComparisonByYear from "~/components/dashboard/research/comparisonByYear";
import ComparisonByField from "~/components/dashboard/research/comparisonByField";
import FundingSupport from "~/components/dashboard/research/fundingSupport";

import useReportAPI from "~/service/api/report";
const { fetchPersonnelList } = useReportAPI;

import useMasterAgencyAPI from "~/service/api/masterData/agency";
const { fetchMasterAgencyList } = useMasterAgencyAPI;

import useResearchAPI from "~/service/api/researches/research";
const { fetchResearchList } = useResearchAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchBudgetYearList, fetchEducationYearList, fetchRecordYearList } = useMasterDataAPI;

const page = ref(1);

const tabs = ref([
   { id: 1, label: "จำนวน/ร้อยละของงานวิจัย" },
   { id: 2, label: "เปรียบเทียบจำนวนงานวิจัยของอาจารย์แต่ละปี" },
   { id: 3, label: "เปรียบเทียบจำนวนงานวิจัยในแต่ละสาขาวิชา" },
   { id: 4, label: "จำนวนทุนที่ได้รับการสนับสนุนจากภายใน/ภายนอกหน่วยงาน" },
]);

const filtersPersonnel = ref({
   max: -1,
   offset: 0,
   currentPage: 1,
   keyword: "",
   divisionId: "",
   personnelStatusId: "",
   dateStartedAtSwuA: "",
   dateStartedAtSwuB: "",
});


const filtersAgency = ref({
   keyword: "",
   max: -1,
   offset: 0,
   currentPage: 1,
});

const filtersResearch = ref({
   keyword: "",
   recordYear: [],
   leaderId: [],
   dataTypeId: [],
   max: -1,
   offset: 0,
   currentPage: 1,
});

onMounted(() => {
   getPersonnelList();
   getAgencyList();
   getResearchList();

   //Master Data
   getBudgetYearList();
   getEducationYearList();
   getRecordYearList();
});

const personnelList = ref([]);
const personnelListRefactor = ref([]);
const getPersonnelList = async () => {
   const res = await fetchPersonnelList(filtersPersonnel.value);
   if (res.code === 20000) {
      personnelList.value = res.responseObject.personnels;
      personnelListRefactor.value = res.responseObject.personnels.map(i => {
         return {id: i.id, name: i.fullname}
      });
   }
};


const agencyList = ref([]);
const agencyListRefactor = ref([]);
const getAgencyList = async () => {
   const res = await fetchMasterAgencyList(filtersAgency.value);
   if (res.code == 20000) {
      agencyList.value = res.responseObject.agencyList;
      agencyListRefactor.value = res.responseObject.agencyList.map(i => {
         return {id: i.id, name: i.nameTh}
      });
   }
};

const researchList = ref([]);
const getResearchList = async () => {
   const res = await fetchResearchList(filtersResearch.value);
   if (res.code == 20000) {
      researchList.value = res.responseObject.researchs;
   }
};

const budgetYearListList = ref([]);
const budgetYearListListRefactor = ref([]);
const getBudgetYearList = async () => {
   const res = await fetchBudgetYearList();
   if (res.code == 20000) {
      budgetYearListList.value = res.responseObject.budgetYearList;
      budgetYearListListRefactor.value = res.responseObject.budgetYearList.map(i => {
         return {id: i.name, name: i.name}
      });
   }
};

const educationYearList = ref([]);
const educationYearListRefactor = ref([]);
const getEducationYearList = async () => {
   const res = await fetchEducationYearList();
   if (res.code == 20000) {
      educationYearList.value = res.responseObject.educationYearList;
      educationYearListRefactor.value = res.responseObject.educationYearList.map(i => {
         return {id: i.nameTh, name: i.nameTh}
      });
   }
};

const recordYearList = ref([]);
const recordYearListRefactor = ref([]);
const getRecordYearList = async () => {
   const res = await fetchRecordYearList();
   if (res.code == 20000) {
      recordYearList.value = res.responseObject.recordYearList;
      recordYearListRefactor.value = res.responseObject.recordYearList.map(i => {
         return {id: i.name, name: i.name}
      });
   }
};
</script>
