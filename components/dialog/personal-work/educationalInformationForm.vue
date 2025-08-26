<template>
   <UModal
      :modelValue="isOpen"
      :ui="{
         container: 'items-center',
         width: 'min-w-[95%] md:min-w-[800px]',
         rounded: 'rounded-3xl',
      }"
   >
      <div class="p-6">
         <div class="flex items-center sm:flex-row">
            <div class="text-primary-500 text-xl">
               {{ openDialogMode === "edit" ? "แก้ไขข้อมูลการศึกษา" : openDialogMode === "create" ? "เพิ่มข้อมูลการศึกษา" : "ข้อมูลการศึกษา" }}
            </div>
         </div>
         <div class="h-[1px] bg-primary-500 mt-3 mb-8"></div>
         <form v-if="!isFormLoading">
            <div class="grid grid-cols-1 justify-center gap-y-2 md:grid-cols-2">
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 md:text-right">
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
                           base: `h-[38px] md:max-w-[208px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
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
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]"></div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 md:text-right">
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
                           base: `h-[38px] md:max-w-[208px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
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
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 md:text-right">
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
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] md:max-w-[208px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
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
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 md:text-right">
                     <span>สาขาวิชา</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.educationalBranchId"
                        :options="educationBranchList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] md:max-w-[208px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.educationalBranchId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                     <div class="flex items-center mt-2" v-if="validator.educationalBranchId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.educationalBranchId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 md:text-right">
                     <span>หลักสูตร</span>
                     <span>:&nbsp;</span>
                  </p>
                  <Input
                     v-model="form.course"
                     placeholder="หลักสูตร"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 md:text-right">
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
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] md:max-w-[208px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
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
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 md:text-right">
                     <span>รหัสประเทศ</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.countryId"
                        :options="countryList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="nameEn"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] md:max-w-[208px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.countryId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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

                     <div class="flex items-center mt-2" v-if="validator.countryId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.countryId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 md:text-right">
                     <span>วันที่เข้าศึกษา</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>
                  <Datepicker
                     class="text-sm"
                     inputId="dateStartEducation"
                     v-model="form.dateStartEducation"
                     :placeholder="'วัน/เดือน/ปี'"
                     inputHeight="h-[38px]"
                     :requireInput="{ showMessage: validator.dateStartEducation?.showMessage, message: validator.dateStartEducation?.message }"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 md:text-right">
                     <span>วันที่สำเร็จการศึกษา</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>
                  <Datepicker
                     class="text-sm"
                     inputId="dateFinishEducation"
                     v-model="form.dateFinishEducation"
                     :minDate="form.dateStartEducation"
                     :placeholder="'วัน/เดือน/ปี'"
                     inputHeight="h-[38px]"
                     :requireInput="{ showMessage: validator.dateFinishEducation?.showMessage, message: validator.dateFinishEducation?.message }"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 md:text-right">
                     <span>ปี พ.ศ. ที่สำเร็จการศึกษา</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.yearFinishEducationId"
                        :options="educationYearList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="nameTh"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] md:max-w-[208px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.yearFinishEducationId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                     <div class="flex items-center mt-2" v-if="validator.yearFinishEducationId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.yearFinishEducationId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 md:text-right">
                     <span>เกรดเฉลี่ย</span>
                     <span>:&nbsp;</span>
                  </p>
                  <input
                     type="number"
                     :data-decimal="2"
                     v-model="avgGrade"
                     @input="(e) => genInputDecimal(e, 'avgGrade')"
                     :onkeypress="
                        (evt) => {
                           ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault();
                        }
                     "
                     placeholder="งบประมาณที่ได้รับ"
                     :disabled="openDialogMode === 'view'"
                     class="leading-[3] placeholder:text-gray-100 placeholder:h-full placeholder:text-sm rounded-lg px-[14px] w-full border border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed text-sm flex flex-col h-[38px]"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <div class="hidden md:block"></div>
                  <Checkbox v-model="form.govCertify" label="กพ.รับรองวุฒิ" :disabled="openDialogMode === 'view'" />
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]"></div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <div class="hidden md:block"></div>
                  <Checkbox v-model="form.evaluate" label="ผ่านการตรวจสอบวุฒิจากหน่วยงาน" class="sm:whitespace-nowrap" :disabled="openDialogMode === 'view'" />
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]"></div>

               <div
                  v-if="(openDialogMode === 'create' || openDialogMode === 'edit') && form.files.length < 3"
                  class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]"
               >
                  <p class="text-sm text-[#333] md:text-right md:mt-2.5">แนบไฟล์ :</p>
                  <div class="md:whitespace-nowrap">
                     <ButtonChooseFile :action="selectFile" />
                     <input type="file" accept=".xlsx, .docx, .pdf" id="input_file_personnel_education" class="hidden" @change="changeFile" multiple />
                  </div>
               </div>
               <div
                  v-if="(openDialogMode === 'create' || openDialogMode === 'edit') && form.files.length < 3"
                  class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]"
               ></div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <div><p v-if="openDialogMode === 'view' || form.files.length === 3" class="text-sm text-[#333] md:text-right md:mt-2.5">แนบไฟล์ :</p></div>
                  <div class="space-y-2">
                     <div
                        v-for="(file, index) in form?.files"
                        :key="file?.fileId"
                        class="w-full tablet:w-[310px] rounded-lg bg-gray-200 px-3 py-1 h-[38px] grid justify-between items-center grid-cols-[1fr_25px] gap-x-2"
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
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]"></div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 md:text-right">
                     <span>หมายเหตุ</span>
                     <span>:&nbsp;</span>
                  </p>
                  <Input
                     v-model="form.remark"
                     placeholder="หมายเหตุ"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
            </div>
            <div class="mt-8 flex flex-wrap gap-2 justify-center">
               <!-- <ButtonEdit v-if="openDialogMode === 'view'" @click="() => setDialog(false, 'toEditMode')" /> -->
               <ButtonSave v-if="openDialogMode !== 'view'" @click="submitForm" />
               <ButtonCancel @click="setDialog(false)" />
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
      :btnAction="handlePersonnelCurrency"
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
import Checkbox from "~/components/form/checkbox";

import Loading from "~/components/loading";
import SkeletonForm from "~/components/ui/skeleton/form";

import ButtonSave from "~/components/button/save";
import ButtonEdit from "~/components/button/edit";
import ButtonCancel from "~/components/button/cancel";
import ButtonChooseFile from "~/components/button/chooseFile";

import DialogConfirm from "~/components/dialog/confirm";

import usePersonnelEducationAPI from "~/service/api/personnelEducation";
const { fetchPersonnelEducationById, addPersonnelEducation, updatePersonnelEducation } = usePersonnelEducationAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const {
   fetchEducationYearList,
   fetchEducationLevelList,
   fetchEducationCertificationList,
   fetchEducationalInstitutionList,
   fetchEducationalBranchList,
   fetchCountryList,
} = useMasterDataAPI;

const toast = useToast();
const form = ref({
   educationYearId: null,
   educationLevelId: null,
   educationInstitutionId: null,
   educationCertificationId: null,
   educationalBranchId: 0,
   dateStartEducation: "",
   course: "",
   yearFinishEducationId: null,
   dateFinishEducation: "",
   govCertify: false,
   evaluate: false,
   fileId: null,
   remark: "",
   countryId: null,
   avgGrade: null,
   files: [],
   filesDelete: [],
});
const validator = ref({
   educationYearId: {
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
   educationalBranchId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   educationInstitutionId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   yearFinishEducationId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   countryId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   dateStartEducation: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   dateFinishEducation: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
});
const resetForm = () => {
   form.value = {
      educationYearId: null,
      educationLevelId: null,
      educationInstitutionId: null,
      educationCertificationId: null,
      educationalBranchId: 0,
      dateStartEducation: "",
      course: "",
      yearFinishEducationId: null,
      dateFinishEducation: "",
      govCertify: false,
      evaluate: false,
      fileId: null,
      remark: "",
      countryId: null,
      avgGrade: null,
      files: [],
      filesDelete: [],
   };
   validator.value = {
      educationYearId: {
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
      educationalBranchId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      educationInstitutionId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      yearFinishEducationId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      countryId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      dateStartEducation: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      dateFinishEducation: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
   };
   avgGrade.value = null;
};

const isLoading = ref(false);
const isFormLoading = ref(false);

const props = defineProps({
   isOpen: Boolean,
   setDialog: Function,
   openDialogMode: String,
   personnelId: String,
   userEducationId: Number,
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
   () => form.value.educationalBranchId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "educationalBranchId" });
   }
);
watch(
   () => form.value.educationInstitutionId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "educationInstitutionId" });
   }
);
watch(
   () => form.value.yearFinishEducationId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "yearFinishEducationId" });
   }
);
watch(
   () => form.value.dateStartEducation,
   (newData) => {
      if (newData && form.value.dateFinishEducation) {
         const start = new Date(genTextDate({ date: newData, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }));
         const end = new Date(genTextDate({ date: form.value.dateFinishEducation, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }));

         if (start.getTime() > end.getTime() && isFirstRender.value === false) {
            form.value.dateFinishEducation = newData;
         }
      }
      clearRequireOnChange({ value: newData, key: "dateStartEducation" });

      if (!form.value.dateFinishEducation) {
         const today = new Date();
         const currentMonth = today.getMonth() + 1;
         const currentBuddhistYear = today.getFullYear() + 543
         const newDataMonth = parseInt(newData.split("/")[1]);
         const newDataYear = parseInt(newData.split("/")[2]);

         if (newDataYear > currentBuddhistYear) {
            form.value.dateFinishEducation = newData
            setTimeout(() => {
               form.value.dateFinishEducation = ""
            }, 10)
            return
         }

         if (currentBuddhistYear === newDataYear && newDataMonth > currentMonth) {
            form.value.dateFinishEducation = newData
            setTimeout(() => {
               form.value.dateFinishEducation = ""
            }, 10)
         }
      }
   }
);

watch(
   () => form.value.dateFinishEducation,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "dateFinishEducation" });
   }
);

watch(
   () => form.value.countryId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "countryId" });
   }
);

const isFirstRender = ref(false);
const firstRenderTimeOut = ref(null);

const educationYearList = ref([]);
const educationLevelList = ref([]);
const educationCertificationList = ref([]);
const educationalInstitutionList = ref([]);
const educationBranchList = ref([]);
const countryList = ref([]);

const getData = () => {
   isFirstRender.value = true;
   isFormLoading.value = true;
   clearTimeout(firstRenderTimeOut.value);

   Promise.all([
      props?.openDialogMode === "edit" || props?.openDialogMode === "view"
         ? fetchPersonnelEducationById(props?.personnelId, props?.userEducationId)
         : Promise.resolve(),
      fetchEducationYearList(),
      fetchEducationLevelList(),
      fetchEducationCertificationList(),
      fetchEducationalInstitutionList(),
      fetchEducationalBranchList(),
      fetchCountryList(),
   ]).then((res) => {
      if (props?.openDialogMode === "edit" || props?.openDialogMode === "view") {
         if (res[0]?.code === 20000) {
            form.value = {
               ...res[0]?.responseObject,
               filesDelete: [],
            };
            avgGrade.value = form.value.avgGrade ? form.value.avgGrade : "";
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
         educationBranchList.value = res[5].responseObject.educationalBranchList;
      }
      if (res[6]?.code === 20000) {
         countryList.value = res[6].responseObject.countryList;
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

const handlePersonnelCurrency = async () => {
   isLoading.value = true;
   form.value = {
      ...form.value,
      avgGrade: avgGrade.value,
   };
   const res =
      props.openDialogMode === "create"
         ? await addPersonnelEducation(props?.personnelId, form.value)
         : await updatePersonnelEducation(props?.personnelId, props?.userEducationId, form.value);
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
   document.getElementById("input_file_personnel_education").click();
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
            document.getElementById("input_file_personnel_education").value = "";
         }
      }
   }
};

const avgGrade = ref("");
const genInputDecimal = (event, type) => {
   const ele = event.target;
   const decimal = parseInt(ele.getAttribute("data-decimal")) || 0;
   const val = ele.value;

   if (!isNaN(decimal)) {
      if (decimal > 0) {
         const splitVal = val.split(".");
         if (val && type === "avgGrade") {
            avgGrade.value = parseFloat(avgGrade.value.toFixed(2));
         }
         if (splitVal.length === 2 && splitVal[1].length > decimal) {
            ele.value = splitVal[0] + "." + splitVal[1].substring(0, decimal);
         }
      } else if (decimal === 0) {
         const splitVal = val.split(".");
         if (splitVal.length > 1) {
            ele.value = splitVal[0];
         }
      }
   }
};
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
   -webkit-appearance: none;
   margin: 0;
}
</style>
