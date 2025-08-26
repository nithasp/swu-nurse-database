<template>
   <UModal
      :modelValue="isOpen"
      :ui="{
         container: 'items-center',
         width: 'min-w-[95%] tablet:min-w-[950px]',
         rounded: 'rounded-3xl',
      }"
      :initialFocus="removeAutoFocus"
   >
      <div class="p-6">
         <div class="text-primary-500 text-xl">
            {{ actionMode === "edit" ? "แก้ไขงานบริการวิชาการ" : actionMode === "create" ? "เพิ่มงานบริการวิชาการ" : "งานบริการวิชาการ" }}
         </div>
         <div class="h-[1px] bg-primary-500 mt-2 mb-8"></div>

         <div v-if="!isFormLoading">
            <div class="mb-2">
               <div class="grid items-center gap-x-3 gap-y-1 tablet:items-start" :class="getGridWidth()">
                  <div class="text-sm tablet:text-right mt-0 tablet:mt-2">
                     <span>แหล่งที่มาของงบประมาณ</span>
                  </div>
                  <div class="tablet:w-[310px]">
                     <Select
                        v-model="budgetSourceId"
                        class="w-full tablet:w-[310px]"
                        :options="budgetSourceList"
                        attributeValue="id"
                        attributeOption="name"
                        placeholder="-- เลือก --"
                        :requireInput="{ showMessage: validator.budgetSourceId?.showMessage, message: validator.budgetSourceId?.message }"
                        :disabled="actionMode === 'view' || actionMode === 'edit'"
                     />
                  </div>
               </div>
            </div>

            <div id="academic-services-form">
               <MoneyForm
                  v-if="budgetSourceId === 1 || budgetSourceId === 2"
                  :actionMode="actionMode"
                  :setDialogAcademicServicesForm="setDialogAcademicServicesForm"
                  :budgetSourceId="budgetSourceId"
                  :academicId="academicId"
                  :btnOpenForm="props.btnOpenForm"
               />
               <RegistrationFeesForm
                  v-if="budgetSourceId === 3"
                  :actionMode="actionMode"
                  :setDialogAcademicServicesForm="setDialogAcademicServicesForm"
                  :budgetSourceId="budgetSourceId"
                  :academicId="academicId"
                  :btnOpenForm="props.btnOpenForm"
               />
            </div>
         </div>
         <SkeletonForm v-else :count="12" />
      </div>
   </UModal>
</template>
<script setup>
import Select from "~/components/form/select";
import SkeletonForm from "~/components/ui/skeleton/form";
import MoneyForm from "./MoneyForm";
import RegistrationFeesForm from "./RegistrationFeesForm.vue";

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchBudgetSourceList } = useMasterDataAPI;

const props = defineProps({
   isOpen: Boolean,
   setDialogAcademicServicesForm: Function,
   btnOpenForm: Function,
   actionMode: String,
   academicId: Number,
   budgetSourceType: String,
   budgetSourceCode: String,
});

const validator = ref({});

const resetForm = () => {
   budgetSourceId.value = props.budgetSourceCode === "income" ? 1 : props.budgetSourceCode === "national" ? 2 : 3;
   validator.value = {
      budgetSourceId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
   };
};

const removeAutoFocus = ref(null);
const isFormLoading = ref(false);
const budgetSourceId = ref(null);
const budgetSourceList = ref([]);

watch(
   () => props.isOpen,
   (newData) => {
      if (newData == true) {
         resetForm();
         getData();
      }
   }
);

watch(
   () => budgetSourceId.value,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "budgetSourceId" });
   }
);

const getData = () => {
   isFormLoading.value = true;
   Promise.all([fetchBudgetSourceList()]).then((res) => {
      if (res[0]?.code === 20000) {
         budgetSourceList.value = res[0].responseObject.budgetSourceList;
      }
      isFormLoading.value = false;
   });
};

const clearRequireOnChange = (validator, options) => {
   if (validator[options.key]) {
      let isShow = null;
      if (options.value) {
         isShow = false;
      }
      validator[options.key].showMessage = isShow;
   }
};

const getGridWidth = () => {
   if (props.actionMode === "view") {
      return budgetSourceId.value === 1 || budgetSourceId.value === 2 ? "tablet:grid-cols-[305px_1fr]" : "tablet:grid-cols-[350px_1fr]";
   } else {
      return budgetSourceId.value === 1 || budgetSourceId.value === 2 ? "tablet:grid-cols-[286px_1fr]" : "tablet:grid-cols-[348px_1fr]";
   }
};
</script>
