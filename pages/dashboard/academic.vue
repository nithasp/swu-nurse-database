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
         <ComparisonByYear :budgetYearListList="budgetYearListListRefactor" :educationYearList="educationYearListRefactor" />
      </div>
      <div v-show="page == 2">
         <BudgetAllocation :budgetYearListList="budgetYearListListRefactor" />
      </div>
      <div v-show="page == 3">
         <YearServiceProjects :budgetYearListList="budgetYearListListRefactor" :educationYearList="educationYearListRefactor" />
      </div>
   </div>
</template>
<script setup>
import ComparisonByYear from "~/components/dashboard/academic/comparisonByYear";
import BudgetAllocation from "~/components/dashboard/academic/budgetAllocation";
import YearServiceProjects from "~/components/dashboard/academic/yearServiceProjects";

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchBudgetYearList, fetchEducationYearList, fetchRecordYearList } = useMasterDataAPI;

const page = ref(1);

const tabs = ref([
   { id: 1, label: "จำนวน/ร้อยละ การเปรียบเทียบงานบริการวิชาการของอาจารย์แต่ละปี" },
   { id: 2, label: "การจัดสรรงบประมาณ" },
   { id: 3, label: "โครงการที่ให้บริการวิชาการแต่ละปี" },
]);

onMounted(() => {
   //Master Data
   getBudgetYearList();
   getEducationYearList();
});

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
</script>
