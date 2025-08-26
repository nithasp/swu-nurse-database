<template>
   <UModal
      :modelValue="isOpen"
      :ui="{
         container: 'items-center',
         width: 'min-w-[95%] sm:max-w-4xl md:min-w-[800px] ',
         rounded: 'rounded-3xl',
      }"
      :initialFocus="removeAutoFocus"
   >
      <div class="p-6">
         <div class="flex items-center sm:flex-row">
            <div class="text-primary-500 text-xl">
               {{
                  openDialogMode === "edit"
                     ? "แก้ไขรายงานความก้าวหน้าการลาศึกษาต่อ"
                     : openDialogMode === "create"
                     ? "เพิ่มรายงานความก้าวหน้าการลาศึกษาต่อ"
                     : "รายงานความก้าวหน้าการลาศึกษาต่อ"
               }}
            </div>
         </div>
         <div class="h-[1px] bg-primary-500 mt-3 mb-8"></div>
         <form v-if="!isFormLoading">
            <div class="grid grid-cols-1 justify-center gap-y-2">
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>วันที่รายงาน</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>
                  <Datepicker
                     class="text-sm sm:max-w-[260px]"
                     inputId="dateReported"
                     v-model="form.dateReported"
                     :placeholder="'วัน/เดือน/ปี'"
                     inputHeight="h-[38px]"
                     :requireInput="{ showMessage: validator.dateReported?.showMessage, message: validator.dateReported?.message }"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]"></div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>ปีที่ศึกษาต่อ</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>
                  <Input
                     type="number"
                     v-model="form.educationYearLevel"
                     placeholder="ปีที่ศึกษาต่อ"
                     class="flex flex-col text-sm sm:max-w-[260px]"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :requireInput="{ showMessage: validator.educationYearLevel?.showMessage, message: validator.educationYearLevel?.message }"
                     @change="(event) => clearRequireOnChange({ value: event.target.value, key: 'educationYearLevel' })"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]"></div>

               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>หัวข้อรายงาน</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.reportTopicId"
                        :options="reportTopicList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        searchable
                        searchable-placeholder="หัวข้อรายงาน"
                        :search-attributes="['name']"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] sm:max-w-[260px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.reportTopicId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                     <div class="flex items-center mt-2" v-if="validator.reportTopicId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.reportTopicId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="้hidden grid-cols-1 items-center gap-2 sm:grid sm:grid-cols-[130px_1fr]"></div>

               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right h-full sm:pt-[13px]">
                     <span>รายละเอียด</span>
                     <span>:&nbsp;</span>
                  </p>
                  <Textarea
                     v-model="form.detail"
                     class="text-sm sm:max-w-[260px]"
                     placeholder="รายละเอียด"
                     :requireInput="{ required: true }"
                     rows="3"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>

               <div
                  v-if="(openDialogMode === 'create' || openDialogMode === 'edit') && form.files.length < 3"
                  class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]"
               >
                  <p class="text-sm text-[#333] sm:text-right sm:mt-2.5">แนบไฟล์ :</p>
                  <div class="md:whitespace-nowrap">
                     <ButtonChooseFile :action="selectFile" />
                     <input
                        type="file"
                        accept=".xlsx, .docx, .pdf"
                        id="input_file_personnel_additional_education_progress"
                        class="hidden"
                        @change="changeFile"
                        multiple
                     />
                  </div>
               </div>
               <div
                  v-if="(openDialogMode === 'create' || openDialogMode === 'edit') && form.files.length < 3"
                  class="grid grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]"
               ></div>
               <div :class="[openDialogMode === 'view' && form.files.length === 0 ? 'hidden' : 'grid', 'grid-cols-1 gap-2 sm:grid-cols-[130px_1fr]']">
                  <div><p v-if="openDialogMode === 'view' || form.files.length === 3" class="text-sm text-[#333] sm:text-right sm:mt-2.5">แนบไฟล์ :</p></div>
                  <div class="space-y-2">
                     <div
                        v-for="(file, index) in form?.files"
                        :key="file?.fileId"
                        class="w-full rounded-lg bg-gray-200 px-3 py-1 h-[38px] grid justify-between items-center grid-cols-[1fr_25px] gap-x-2 sm:max-w-[260px]"
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
            </div>
            <div class="mt-8 flex flex-wrap gap-2 justify-center">
               <!-- <ButtonEdit v-if="openDialogMode === 'view'" @click="() => setDialog(false, 'toEditMode')" /> -->
               <ButtonSave v-if="openDialogMode !== 'view'" @click="submitForm" />
               <ButtonCancel @click="setDialog(false)" ref="removeAutoFocus" />
            </div>
         </form>
         <SkeletonForm v-else :count="5" />
      </div>
   </UModal>
   <DialogConfirm
      :isOpen="isOpenDialogConfirm"
      :setDialog="setDialogConfirm"
      title="บันทึกข้อมูล"
      desc="คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่"
      icon="success"
      :btnAction="handlePersonnelEducationAdditionalProgress"
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
import Textarea from "~/components/form/textarea";
import Loading from "~/components/loading";
import ButtonSave from "~/components/button/save";
import ButtonEdit from "~/components/button/edit";
import ButtonCancel from "~/components/button/cancel";
import ButtonChooseFile from "~/components/button/chooseFile";

import DialogConfirm from "~/components/dialog/confirm";

import SkeletonForm from "~/components/ui/skeleton/form";

import usePersonnelEducationAdditionalProgressAPI from "~/service/api/personnelEducationAdditionalProgress";
const { fetchPersonnelEducationAdditionalProgressById, addPersonnelEducationAdditionalProgress, updatePersonnelEducationAdditionalProgress } =
   usePersonnelEducationAdditionalProgressAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchEducationYearList, fetchReportTopicList } = useMasterDataAPI;

const props = defineProps({
   isOpen: Boolean,
   setDialog: Function,
   actionMode: String,
   openDialogMode: String,
   personnelId: String,
   educationAdditionalId: Number,
   educationAdditionalIdDefault: Number,
});

const toast = useToast();
const form = ref({
   educationAdditionalId: null,
   educationYearLevel: "",
   //educationYearId: null,
   dateReported: "",
   reportTopicId: null,
   detail: "",
   files: [],
   filesDelete: [],
});
const validator = ref({
   dateReported: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   educationYearLevel: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   // educationYearId: {
   //    showMessage: false,
   //    message: "จำเป็นต้องเลือก",
   // },
   reportTopicId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
});
const resetForm = () => {
   form.value = {
      educationAdditionalId: props?.educationAdditionalId,
      educationYearLevel: "",
      //educationYearId: null,
      dateReported: "",
      reportTopicId: null,
      detail: "",
      files: [],
      filesDelete: [],
   };
   validator.value = {
      dateReported: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      educationYearLevel: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      // educationYearId: {
      //    showMessage: false,
      //    message: "จำเป็นต้องเลือก",
      // },
      reportTopicId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
   };
   educationAdditionalIdDefault.value = props?.educationAdditionalIdDefault;
};

const isLoading = ref(false);
const isFormLoading = ref(false);
const educationAdditionalIdDefault = ref(null);

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
   () => form.value.dateReported,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "dateReported" });
   }
);
// watch(
//    () => form.value.educationYearId,
//    (newData) => {
//       clearRequireOnChange({ value: newData, key: "educationYearId" });
//    }
// );
watch(
   () => form.value.reportTopicId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "reportTopicId" });
   }
);

const removeAutoFocus = ref(null);
const educationYearList = ref([]);
const reportTopicList = ref([]);

const getData = () => {
   isFormLoading.value = true;
   Promise.all([
      props?.openDialogMode === "edit" || props?.openDialogMode === "view"
         ? fetchPersonnelEducationAdditionalProgressById(props?.personnelId, props?.educationAdditionalId)
         : Promise.resolve(),
      fetchEducationYearList(),
      fetchReportTopicList(),
   ]).then((res) => {
      if (props.openDialogMode === "edit" || props?.openDialogMode === "view") {
         if (res[0]?.code === 20000) {
            form.value = {
               ...res[0]?.responseObject,
               educationYearLevel: res[0].responseObject.educationYearLevel ? res[0].responseObject.educationYearLevel : "",
               filesDelete: [],
            };
         }
      }
      if (res[1]?.code === 20000) {
         educationYearList.value = res[1].responseObject.educationYearList;
      }
      if (res[2]?.code === 20000) {
         reportTopicList.value = res[2].responseObject.reportTopicList;
      }
      isFormLoading.value = false;
   });
};

const isOpenDialogConfirm = ref(false);
const setDialogConfirm = (status) => {
   isOpenDialogConfirm.value = status;
};

const handlePersonnelEducationAdditionalProgress = async () => {
   isLoading.value = true;
   if (props?.openDialogMode === "create") {
      form.value = {
         ...form.value,
         educationAdditionalId: educationAdditionalIdDefault.value,
      };
   }
   const res =
      props?.openDialogMode === "create"
         ? await addPersonnelEducationAdditionalProgress(props?.personnelId, form.value)
         : await updatePersonnelEducationAdditionalProgress(props?.personnelId, props?.educationAdditionalId, form.value);
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
   document.getElementById("input_file_personnel_additional_education_progress").click();
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
            document.getElementById("input_file_personnel_additional_education_progress").value = "";
         }
      }
   }
};
</script>
