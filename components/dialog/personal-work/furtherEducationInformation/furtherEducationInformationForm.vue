<template>
   <UModal
      :modelValue="isOpen"
      :ui="{
         container: 'items-center',
         width: 'min-w-[95%] sm:max-w-4xl md:min-w-[800px] ',
         rounded: 'rounded-3xl',
      }"
   >
      <div class="p-6">
         <div class="flex items-center sm:flex-row">
            <div class="text-primary-500 text-xl">
               {{ openDialogMode === "edit" ? "แก้ไขข้อมูลการศึกษาต่อ" : openDialogMode === "create" ? "เพิ่มข้อมูลการศึกษาต่อ" : "ข้อมูลการศึกษาต่อ" }}
            </div>
         </div>
         <div class="h-[1px] bg-primary-500 mt-3 mb-8"></div>
         <form v-if="!isFormLoading">
            <div class="grid grid-cols-1 justify-center gap-y-2 lg:grid-cols-2">
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>ปีการศึกษา</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.educationYearId"
                        :options="educationYearList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="nameTh"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] lg:max-w-[286px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.educationYearId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
                           }`,
                           rounded: 'rounded-lg',
                           placeholder: 'text-gray-100',
                        }"
                        :uiMenu="{
                           ring: 'ring-gray-100',
                           option: {
                              active: 'bg-gray-50',
                           },
                           label: 'text-sm',
                           input: 'border-gray-100 placeholder:text-gray-100',
                        }"
                     >
                     </USelectMenu>
                     <div class="flex items-center mt-2" v-if="validator.educationYearId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.educationYearId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]"></div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>เลขที่สัญญา</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>
                  <Input
                     v-model="form.contractNumber"
                     placeholder="เลขที่สัญญา"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :requireInput="{ showMessage: validator.contractNumber?.showMessage, message: validator.contractNumber?.message }"
                     @change="(event) => clearRequireOnChange({ value: event.target.value, key: 'contractNumber' })"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>ประเภทการลา</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.leaveTypeId"
                        :options="leaveTypeList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] lg:max-w-[286px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.leaveTypeId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
                           }`,
                           rounded: 'rounded-lg',
                           placeholder: 'text-gray-100',
                        }"
                        :uiMenu="{
                           ring: 'ring-gray-100',
                           option: {
                              active: 'bg-gray-50',
                           },
                           label: 'text-sm',
                           input: 'border-gray-100 placeholder:text-gray-100',
                        }"
                     >
                     </USelectMenu>
                     <div class="flex items-center mt-2" v-if="validator.leaveTypeId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.leaveTypeId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>ระดับการศึกษา</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.educationLevelId"
                        :options="educationLevelList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] lg:max-w-[286px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.educationLevelId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
                           }`,
                           rounded: 'rounded-lg',
                           placeholder: 'text-gray-100',
                        }"
                        :uiMenu="{
                           ring: 'ring-gray-100',
                           option: {
                              active: 'bg-gray-50',
                           },
                           label: 'text-sm',
                           input: 'border-gray-100 placeholder:text-gray-100',
                        }"
                     >
                     </USelectMenu>
                     <div class="flex items-center mt-2" v-if="validator.educationLevelId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.educationLevelId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>วุฒิการศึกษา</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.educationCertificationId"
                        :options="educationCertificationList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        searchable
                        searchable-placeholder="วุฒิการศึกษา"
                        :search-attributes="['name']"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] lg:max-w-[286px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.educationCertificationId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
                           }`,
                           rounded: 'rounded-lg',
                           placeholder: 'text-gray-100',
                        }"
                        :uiMenu="{
                           ring: 'ring-gray-100',
                           option: {
                              active: 'bg-gray-50',
                           },
                           label: 'text-sm',
                           input: 'border-gray-100 placeholder:text-gray-100',
                        }"
                     >
                     </USelectMenu>
                     <div class="flex items-center mt-2" v-if="validator.educationCertificationId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.educationCertificationId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>หลักสูตร</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>
                  <Input
                     v-model="form.course"
                     placeholder="หลักสูตร"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :requireInput="{ showMessage: validator.course?.showMessage, message: validator.course?.message }"
                     @change="(event) => clearRequireOnChange({ value: event.target.value, key: 'course' })"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>สถาบันการศึกษา</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.educationInstitutionId"
                        :options="educationalInstitutionList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="nameTh"
                        searchable
                        searchable-placeholder="สถาบันการศึกษา"
                        :search-attributes="['nameTh']"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] lg:max-w-[286px] lg:max-w-[286px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.educationInstitutionId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
                           }`,
                           rounded: 'rounded-lg',
                           placeholder: 'text-gray-100',
                        }"
                        :uiMenu="{
                           ring: 'ring-gray-100',
                           option: {
                              active: 'bg-gray-50',
                           },
                           label: 'text-sm',
                           input: 'border-gray-100 placeholder:text-gray-100',
                        }"
                     >
                     </USelectMenu>
                     <div class="flex items-center mt-2" v-if="validator.educationInstitutionId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.educationInstitutionId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>ช่วงวันที่ลาศึกษา</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>
                  <div class="flex gap-[6px]">
                     <Datepicker
                        class="text-sm"
                        inputId="dateLeaveEducationStart"
                        v-model="form.dateLeaveEducationStart"
                        :placeholder="'วัน/เดือน/ปี'"
                        inputHeight="h-[38px]"
                        :requireInput="{ showMessage: validator.dateLeaveEducationStart?.showMessage, message: validator.dateLeaveEducationStart?.message }"
                        :disabled="openDialogMode === 'view'"
                     />
                     <span class="mt-2">-</span>
                     <Datepicker
                        class="text-sm"
                        inputId="dateLeaveEducationEnd"
                        v-model="form.dateLeaveEducationEnd"
                        :minDate="form.dateLeaveEducationStart"
                        :placeholder="'วัน/เดือน/ปี'"
                        inputHeight="h-[38px]"
                        :requireInput="{ showMessage: validator.dateLeaveEducationEnd?.showMessage, message: validator.dateLeaveEducationEnd?.message }"
                        :disabled="openDialogMode === 'view'"
                     />
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]"></div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>การดำเนินการ</span>
                     <span>:&nbsp;</span>
                  </p>
                  <Input
                     v-model="form.implementation"
                     placeholder="การดำเนินการ"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]"></div>

               <div
                  v-if="(openDialogMode === 'create' || openDialogMode === 'edit') && form.files.length < 3"
                  class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]"
               >
                  <p class="text-sm text-[#333] sm:text-right md:mt-2.5">แนบไฟล์ :</p>
                  <div class="md:whitespace-nowrap">
                     <ButtonChooseFile :action="selectFile" />
                     <input type="file" accept=".xlsx, .docx, .pdf" id="input_file_personnel_additional_education" class="hidden" @change="changeFile" multiple />
                  </div>
               </div>
               <div
                  v-if="(openDialogMode === 'create' || openDialogMode === 'edit') && form.files.length < 3"
                  class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]"
               ></div>
               <div :class="[openDialogMode === 'view' && form.files.length === 0 ? 'hidden' : 'grid', 'grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]']">
                  <div>
                     <p v-if="openDialogMode === 'view' || form.files.length === 3" class="text-sm text-[#333] sm:text-right sm:mt-2.5">แนบไฟล์ :</p>
                  </div>
                  <div class="space-y-2">
                     <div
                        v-for="(file, index) in form?.files"
                        :key="file?.fileId"
                        class="w-full rounded-lg bg-gray-200 px-3 py-1 h-[38px] grid justify-between items-center grid-cols-[1fr_25px] gap-x-2"
                     >
                        <p class="line-clamp-1 text-sm text-primary-500 cursor-pointer" @click="openNewTab(file.link || file.url)">{{ file.filename }}</p>
                        <UIcon
                           v-if="openDialogMode === 'create' || openDialogMode === 'edit'"
                           name="i-heroicons-x-mark"
                           class="w-5 h-5 cursor-pointer"
                           @click="setDialogDeleteFile(true, file, index)"
                        />
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]"></div>
            </div>
            <div class="mt-8 flex flex-wrap gap-2 justify-center">
               <!-- <ButtonEdit v-if="openDialogMode === 'view'" @click="() => setDialog(false, 'toEditMode')" /> -->
               <ButtonSave v-if="openDialogMode !== 'view'" @click="submitForm" />
               <ButtonCancel @click="setDialog(false)" />
            </div>
            <div class="mt-4" v-if="openDialogMode === 'edit' || openDialogMode === 'view'">
               <DialogfurtherEducationInformationReport
                  :personnelId="props?.personnelId"
                  :educationAdditionalId="props?.educationAdditionalId"
                  :educationAdditionalIdDefault="props?.educationAdditionalIdDefault"
                  :mode="props?.openDialogMode"
               />
            </div>
         </form>
         <SkeletonForm v-else :count="12" />
      </div>
   </UModal>
   <DialogConfirm
      :isOpen="isOpenDialogConfirm"
      :setDialog="setDialogConfirm"
      title="บันทึกข้อมูล"
      desc="คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่"
      icon="success"
      :btnAction="handlePersonnelEducationAdditional"
   />
   <DialogConfirm
      :isOpen="isOpenDeleteFile"
      :setDialog="setDialogDeleteFile"
      title="ลบไฟล์"
      desc="คุณต้องการลบไฟล์นี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก"
      icon="danger"
      :btnAction="fnDeleteFile"
   />
   <Loading v-if="isLoading" />
</template>

<script setup>
import Input from "~/components/form/input";
import Datepicker from "~/components/form/datepicker";

import Loading from "~/components/loading";

import ButtonSave from "~/components/button/save";
import ButtonEdit from "~/components/button/edit";
import ButtonCancel from "~/components/button/cancel";
import ButtonChooseFile from "~/components/button/chooseFile";

import SkeletonForm from "~/components/ui/skeleton/form";

import DialogConfirm from "~/components/dialog/confirm";
import DialogfurtherEducationInformationReport from "~/components/personal-work/report/furtherEducationInformation/furtherEducationInformationReport";

import usePersonnelEducationAdditionalAPI from "~/service/api/personnelEducationAdditional";
const { fetchPersonnelEducationAdditionalById, addPersonnelEducationAdditional, updatePersonnelEducationAdditional } = usePersonnelEducationAdditionalAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchEducationYearList, fetchEducationLevelList, fetchEducationCertificationList, fetchEducationalInstitutionList, fetchLeaveTypeList } = useMasterDataAPI;

const toast = useToast();
const form = ref({
   educationYearId: null,
   contractNumber: "",
   educationLevelId: null,
   course: "",
   dateLeaveEducationStart: "",
   dateLeaveEducationEnd: "",
   implementation: "",
   leaveTypeId: null,
   educationCertificationId: null,
   educationInstitutionId: null,
   files: [],
   filesDelete: [],
});
const validator = ref({
   educationYearId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   contractNumber: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   leaveTypeId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   educationLevelId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   educationCertificationId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   course: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   educationInstitutionId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   dateLeaveEducationStart: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   dateLeaveEducationEnd: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
});
const resetForm = () => {
   form.value = {
      educationYearId: null,
      contractNumber: "",
      educationLevelId: null,
      course: "",
      dateLeaveEducationStart: "",
      dateLeaveEducationEnd: "",
      implementation: "",
      leaveTypeId: null,
      educationCertificationId: null,
      educationInstitutionId: null,
      files: [],
      filesDelete: [],
   };
   validator.value = {
      educationYearId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      contractNumber: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      leaveTypeId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      educationLevelId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      educationCertificationId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      course: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      educationInstitutionId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      dateLeaveEducationStart: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      dateLeaveEducationEnd: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
   };
};

const isLoading = ref(false);
const isFormLoading = ref(false);

const props = defineProps({
   isOpen: Boolean,
   setDialog: Function,
   openDialogMode: String,
   personnelId: String,
   educationAdditionalId: Number,
   educationAdditionalIdDefault: Number,
});

watch(
   () => props.isOpen,
   (newData) => {
      if (newData === true) {
         resetForm();
         getData();
      }
   }
);
watch(
   () => form.value.educationYearId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "educationYearId" });
   }
);
watch(
   () => form.value.leaveTypeId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "leaveTypeId" });
   }
);
watch(
   () => form.value.educationLevelId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "educationLevelId" });
   }
);
watch(
   () => form.value.educationCertificationId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "educationCertificationId" });
   }
);
watch(
   () => form.value.educationInstitutionId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "educationInstitutionId" });
   }
);
watch(
   () => form.value.dateLeaveEducationStart,
   (newData) => {
      if (newData && form.value.dateLeaveEducationEnd) {
         const start = new Date(genTextDate({ date: newData, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }));
         const end = new Date(genTextDate({ date: form.value.dateLeaveEducationEnd, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }));

         if (start.getTime() > end.getTime() && isFirstRender.value === false) {
            form.value.dateLeaveEducationEnd = newData;
         }
      }
      clearRequireOnChange({ value: newData, key: "dateLeaveEducationStart" });

      if (!form.value.dateLeaveEducationEnd) {
         const today = new Date();
         const currentMonth = today.getMonth() + 1;
         const currentBuddhistYear = today.getFullYear() + 543
         const newDataMonth = parseInt(newData.split("/")[1]);
         const newDataYear = parseInt(newData.split("/")[2]);

         if (newDataYear > currentBuddhistYear) {
            form.value.dateLeaveEducationEnd = newData
            setTimeout(() => {
               form.value.dateLeaveEducationEnd = ""
            }, 10)
            return
         }

         if (currentBuddhistYear === newDataYear && newDataMonth > currentMonth) {
            form.value.dateLeaveEducationEnd = newData
            setTimeout(() => {
               form.value.dateLeaveEducationEnd = ""
            }, 10)
         }
      }
   }
);

watch(
   () => form.value.dateLeaveEducationEnd,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "dateLeaveEducationEnd" });
   }
);

const isFirstRender = ref(false);
const firstRenderTimeOut = ref(null);

const educationYearList = ref([]);
const educationLevelList = ref([]);
const educationCertificationList = ref([]);
const educationalInstitutionList = ref([]);
const leaveTypeList = ref([]);

const getData = () => {
   isFirstRender.value = true;
   isFormLoading.value = true;
   clearTimeout(firstRenderTimeOut.value);

   Promise.all([
      props?.openDialogMode === "edit" || props?.openDialogMode === "view"
         ? fetchPersonnelEducationAdditionalById(props?.personnelId, props?.educationAdditionalId)
         : Promise.resolve(),
      fetchEducationYearList(),
      fetchEducationLevelList(),
      fetchEducationCertificationList(),
      fetchEducationalInstitutionList(),
      fetchLeaveTypeList({ parent: "educationalLeave" }),
   ]).then((res) => {
      if (props?.openDialogMode === "edit" || props?.openDialogMode === "view") {
         if (res[0]?.code === 20000) {
            form.value = {
               ...res[0]?.responseObject,
               filesDelete: [],
            };
         }
      }
      if (res[1]?.code === 20000) {
         educationYearList.value = res[1].responseObject.educationYearList;
      }
      if (res[2]?.code === 20000) {
         educationLevelList.value = res[2].responseObject.educationLevelList;
      }
      if (res[3]?.code === 20000) {
         educationCertificationList.value = res[3].responseObject.educationCertificationList;
      }
      if (res[4]?.code === 20000) {
         educationalInstitutionList.value = res[4].responseObject.educationalInstitutionList;
      }
      if (res[5]?.code === 20000) {
         leaveTypeList.value = res[5].responseObject.leaveTypeList;
      }
      isFormLoading.value = false;
      firstRenderTimeOut.value = setTimeout(() => {
         isFirstRender.value = false;
      }, 100);
   });
};

const isOpenDialogConfirm = ref(false);
const setDialogConfirm = (status) => {
   isOpenDialogConfirm.value = status;
};

const handlePersonnelEducationAdditional = async () => {
   isLoading.value = true;
   const res =
      props.openDialogMode === "create"
         ? await addPersonnelEducationAdditional(props?.personnelId, form.value)
         : await updatePersonnelEducationAdditional(props?.personnelId, props?.educationAdditionalId, form.value);
   if (res?.code === 20000) {
      setDialogConfirm(false);
      props.setDialog(false, "refresh");
      toast.add({ title: res?.message, color: "green" });
   } else {
      toast.add({ title: res?.message, color: "red" });
   }
   isLoading.value = false;
};

const submitForm = () => {
   const fail = validatorForm(form.value, validator.value);
   if (fail.length == 0) {
      setDialogConfirm(true);
   }
};
const clearRequireOnChange = (options) => {
   if (validator.value[options.key]) {
      let isShow = null;
      if (options.type == "array") {
         if (options.value.length > 0) {
            isShow = false;
         }
      } else {
         if (options.value) {
            isShow = false;
         }
      }
      validator.value[options.key].showMessage = isShow;
   }
};

const isOpenDeleteFile = ref(false);
const fileItem = ref(null);
const setDialogDeleteFile = (status, file, fileIndex) => {
   isOpenDeleteFile.value = status;
   fileItem.value = { ...file, fileIndex };
};

const fnDeleteFile = () => {
   form.value.files.splice(fileItem.value?.fileIndex, 1);
   form.value.filesDelete.push({ fileId: fileItem.value?.fileId, add: false, delete: true });
   setDialogDeleteFile(false);
};

const selectFile = () => {
   document.getElementById("input_file_personnel_additional_education").click();
};

const changeFile = async (e) => {
   if (e.target.files.length) {
      isLoading.value = true;
      for (let i = 0; i < e.target.files.length; i++) {
         if (form.value.files.length >= 3) {
            isLoading.value = false;
            toast.add({ title: "อัปโหลดได้ 3 ไฟล์เท่านั้น ไฟล์ที่เกินมาจะไม่ถูกอัปโหลด", color: "red" });
            return;
         }
         const res = await uploadFile(e.target.files[i]);
         if (res) {
            form.value.files.push({ fileId: res.fileId, add: true, delete: false, filename: res.fileName, link: res.url });
         }
         if (e.target.files.length - 1 == i) {
            isLoading.value = false;
            document.getElementById("input_file_personnel_additional_education").value = "";
         }
      }
   }
};
</script>
