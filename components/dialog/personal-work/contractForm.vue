<template>
   <UModal
      :modelValue="isOpen"
      :ui="{
         container: 'items-center',
         width: 'min-w-[95%] md:min-w-[800px] lg:min-w-[1060px]',
         rounded: 'rounded-3xl',
      }"
      :initialFocus="removeAutoFocus"
   >
      <div class="p-6">
         <p class="text-primary-500 text-xl">{{ actionMode == "edit" ? "แก้ไข" : actionMode == "create" ? "เพิ่ม" : "" }}ข้อมูลการต่อสัญญา</p>
         <div class="h-[1px] bg-primary-500 mt-2 mb-8"></div>
         <form v-if="!loadingForm">
            <div class="grid grid-cols-1 lg:grid-cols-2 justify-center gap-y-3 sm:gap-2">
               <div class="grid items-center tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
                  <p class="text-sm tablet:text-right">เลขที่สัญญา :</p>
                  <Input placeholder="" class="flex flex-col tablet:w-[310px]" v-model="form.contractNo" heightClass="h-[38px]" :disabled="actionMode == 'view'" />
               </div>
               <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
                  <p class="text-sm tablet:text-right mt-0 tablet:mt-2">ประเภทสัญญา<span class="text-red-500"> *</span> :</p>
                  <div class="tablet:w-[310px]">
                     <Select
                        v-model="form.contractTypeId"
                        :options="contractTypeList"
                        attributeValue="id"
                        attributeOption="name"
                        :requireInput="{ showMessage: validator.contractTypeId?.showMessage, message: validator.contractTypeId?.message }"
                        :disabled="actionMode == 'view'"
                     />
                  </div>
               </div>
               <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
                  <p class="text-sm tablet:text-right mt-0 tablet:mt-2">วันที่ทำสัญญา<span class="text-red-500"> *</span> :</p>
                  <div class="tablet:w-[310px]">
                     <Datepicker
                        inputId="dateContract"
                        v-model="form.dateContract"
                        placeholder="วัน/เดือน/ปี"
                        inputHeight="h-[38px]"
                        class="w-full sm:w-auto"
                        :requireInput="{ showMessage: validator.dateContract?.showMessage, message: validator.dateContract?.message }"
                        :disabled="actionMode == 'view'"
                     />
                  </div>
               </div>
               <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
                  <div class="tablet:flex tablet:justify-end mt-0 tablet:mt-2">
                     <Checkbox label="ยกเลิกสัญญา" v-model="form.cancelContract" @change="changeCancelContract($event)" :disabled="actionMode == 'view'" />
                     <span v-if="form.cancelContract" class="text-sm text-red-500 ps-0.5">*</span>
                     <p class="text-sm ps-0.5">:</p>
                  </div>
                  <div class="tablet:w-[310px]">
                     <Datepicker
                        inputId="dateContractCancel"
                        v-model="form.dateContractCancel"
                        placeholder="วัน/เดือน/ปี"
                        inputHeight="h-[38px]"
                        class="w-full tablet:w-auto"
                        :disabled="!form.cancelContract || actionMode == 'view'"
                        :requireInput="{ showMessage: validator.dateContractCancel?.showMessage, message: validator.dateContractCancel?.message }"
                     />
                  </div>
               </div>
               <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
                  <p class="text-sm tablet:text-right mt-0 tablet:mt-2">วันที่จ้าง<span class="text-red-500"> *</span> :</p>
                  <div class="tablet:w-[310px]">
                     <Datepicker
                        inputId="dateHired"
                        v-model="form.dateHired"
                        placeholder="วัน/เดือน/ปี"
                        inputHeight="h-[38px]"
                        class="w-full tablet:w-auto"
                        :requireInput="{ showMessage: validator.dateHired?.showMessage, message: validator.dateHired?.message }"
                        :disabled="actionMode == 'view'"
                     />
                  </div>
               </div>
               <div></div>
               <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
                  <p class="text-sm tablet:text-right mt-0 tablet:mt-2">วันที่ครบสัญญา<span class="text-red-500"> *</span> :</p>
                  <div class="tablet:w-[310px]">
                     <Datepicker
                        inputId="dateContractExpired"
                        v-model="form.dateContractExpired"
                        placeholder="วัน/เดือน/ปี"
                        inputHeight="h-[38px]"
                        class="w-full sm:w-auto"
                        :requireInput="{ showMessage: validator.dateContractExpired?.showMessage, message: validator.dateContractExpired?.message }"
                        :disabled="actionMode == 'view'"
                        :minDate="form.dateContract"
                     />
                  </div>
               </div>
               <div></div>
               <div class="grid tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
                  <div></div>
                  <div class="tablet:w-[310px] flex items-center gap-3">
                     <div class="rounded-lg bg-gray-200 px-3 h-[38px] w-14 flex justify-center items-center">
                        <p class="text-sm">{{ formatCurrency(dateCal.years) || 0 }}</p>
                     </div>
                     <p class="text-sm">ปี :</p>
                     <div class="rounded-lg bg-gray-200 px-3 h-[38px] w-14 flex justify-center items-center">
                        <p class="text-sm">{{ formatCurrency(dateCal.months) || 0 }}</p>
                     </div>
                     <p class="text-sm">เดือน</p>
                     <div class="rounded-lg bg-gray-200 px-3 h-[38px] w-14 flex justify-center items-center">
                        <p class="text-sm">{{ formatCurrency(dateCal.days) || 0 }}</p>
                     </div>
                     <p class="text-sm">วัน</p>
                  </div>
               </div>
               <div></div>
               <div class="grid tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
                  <p class="text-sm tablet:text-right mt-2">รายละเอียดสัญญา :</p>
                  <div class="tablet:w-[310px]">
                     <Textarea v-model="form.detail" rows="3" :disabled="actionMode == 'view'" />
                  </div>
               </div>
            </div>
            <div class="grid grid-cols-1 tablet:grid-cols-none gap-y-3 tablet:gap-2 mt-1">
               <div v-if="actionMode != 'view' && form.files.length < 3" class="grid tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
                  <p class="text-sm tablet:text-right tablet:mt-2.5">แนบไฟล์ :</p>
                  <div>
                     <ButtonChooseFile :action="selectFile" />
                     <input type="file" accept=".xlsx, .docx, .pdf" id="input_file_leave" multiple class="hidden" @change="changeFile" />
                  </div>
               </div>
               <div class="grid gap-2">
                  <div class="grid tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
                     <div>
                        <p v-if="actionMode == 'view' || form.files.length == 3" class="text-sm tablet:text-right tablet:mt-2">แนบไฟล์ :</p>
                     </div>
                     <div class="space-y-2">
                        <div
                           v-for="(file, index) in form.files"
                           :key="file.fileId"
                           class="w-full tablet:w-[310px] rounded-lg bg-gray-200 px-3 py-1 h-[38px] grid justify-between items-center grid-cols-[1fr_25px] gap-x-2"
                        >
                           <p class="line-clamp-1 text-sm text-primary-500 cursor-pointer" @click="openNewTab(file.link || file.url)">{{ file.filename }}</p>
                           <UIcon name="i-heroicons-x-mark" class="w-5 h-5 cursor-pointer" @click="setDialogDeleteFile(true, index)" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <BadgeError class="mt-6" v-if="messageError" :action="() => (messageError = '')" :message="messageError" />
            <div :class="[messageError ? 'mt-2' : 'mt-8', 'flex flex-wrap gap-2 justify-center']">
               <ButtonSave v-if="actionMode != 'view'" @click="submitForm" />
               <ButtonCancel @click="setDialog(false)" ref="removeAutoFocus" />
            </div>
         </form>
         <SkeletonForm v-else :count="12" />
      </div>
   </UModal>
   <DialogConfirm
      :isOpen="isOpenConfirm"
      :setDialog="setDialogConfirm"
      title="บันทึกข้อมูล"
      desc="คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่"
      icon="success"
      :btnAction="fnSave"
   />
   <DialogConfirm
      :isOpen="isOpenDeleteFile"
      :setDialog="setDialogDeleteFile"
      title="ลบไฟล์"
      desc="คุณต้องการลบไฟล์นี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก"
      icon="danger"
      :btnAction="fnDeleteFile"
   />
</template>
<script setup>
import Input from "~/components/form/input";
import ButtonSave from "~/components/button/save";
import ButtonChooseFile from "~/components/button/chooseFile";
import ButtonCancel from "~/components/button/cancel";
import Select from "~/components/form/select";
import Datepicker from "~/components/form/datepicker";
import Textarea from "~/components/form/textarea";
import Checkbox from "~/components/form/checkbox";
import DialogConfirm from "~/components/dialog/confirm";
import SkeletonForm from "~/components/ui/skeleton/form";
import BadgeError from "~/components/badge/error";
import usePersonnelContractAPI from "~/service/api/personnel/contract";
const { fetchPersonnelContract, addPersonnelContract, updatePersonnelContract } = usePersonnelContractAPI;
import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchContractTypeList } = useMasterDataAPI;

const props = defineProps({
   isOpen: Boolean,
   setDialog: Function,
   actionMode: String,
   personnelId: String,
   id: Number,
   setLoadingPage: Function,
   getListTable: Function,
});

const removeAutoFocus = ref(null);
const loadingForm = ref(false);

const form = ref({
   files: [],
});
const validator = ref({});
const resetForm = () => {
   messageError.value = "";
   dateCal.value = {};
   form.value = {
      contractNo: "",
      dateContract: "",
      dateHired: "",
      dateContractExpired: "",
      dateContractCancel: "",
      detail: "",
      files: [],
      filesDelete: [],
      contractTypeId: "",
      cancelContract: false,
   };
   validator.value = {
      dateHired: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      contractTypeId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      dateContract: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      dateContractExpired: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
   };
};

watch(
   () => props.isOpen,
   (newData) => {
      if (newData == true) {
         //master data
         getContractTypeList();

         resetForm();

         if (props.id) {
            getDataById();
         }
      }
   }
);

const getDataById = async () => {
   loadingForm.value = true;
   const res = await fetchPersonnelContract(props.personnelId, props.id);
   loadingForm.value = false;
   if (res.code == 20000) {
      form.value = res.responseObject;
      form.value.files = res.responseObject.files || [];
      form.value.filesDelete = [];
   }
};

const contractTypeList = ref([]);
const getContractTypeList = async () => {
   const res = await fetchContractTypeList();
   if (res.code == 20000) {
      contractTypeList.value = res.responseObject.contractTypeList;
   }
};

const messageError = ref("");
const submitForm = async () => {
   setTimeout(() => {
      const fail = validatorForm(form.value, validator.value);
      if (fail.length == 0) {
         setDialogConfirm(true);
         messageError.value = "";
      } else {
         messageError.value = "โปรดกรอกข้อมูลให้ครบถ้วน";
      }
   }, 100);
};

const isOpenConfirm = ref(false);
const setDialogConfirm = (status) => {
   isOpenConfirm.value = status;
};

const isOpenDeleteFile = ref(false);
let indexFile = null;
const setDialogDeleteFile = (status, index) => {
   isOpenDeleteFile.value = status;
   if (index > -1) {
      indexFile = index;
   }
};

const fnDeleteFile = () => {
   if (indexFile > -1) {
      const dataFile = form.value.files[indexFile];
      form.value.filesDelete.push({ ...dataFile });
      form.value.files.splice(indexFile, 1);
   }
   setDialogDeleteFile(false);
};

const selectFile = () => {
   document.getElementById("input_file_leave").click();
};

const changeFile = async (e) => {
   if (e.target.files.length) {
      props.setLoadingPage(true);

      let alertMaxFile = false;
      for (let i = 0; i < e.target.files.length; i++) {
         if (form.value.files.length == 3) {
            props.setLoadingPage(false);
            alertMaxFile = true;
            break;
         }

         const res = await uploadFile(e.target.files[i]);
         if (res) {
            form.value.files.push({ fileId: res.fileId, add: true, delete: false, filename: res.fileName, link: res.url });
         }
         if (e.target.files.length - 1 == i) {
            props.setLoadingPage(false);
            document.getElementById("input_file_leave").value = "";
         }
      }

      if (alertMaxFile) {
         const toast = useToast();
         toast.add({ title: "อัปโหลดได้ 3 ไฟล์เท่านั้น ไฟล์ที่เกินมาจะไม่ถูกอัปโหลด", color: "red" });
      }
   }
};

const fnSave = async () => {
   messageError.value = "";
   if (props.id) {
      fnUpdate();
   } else {
      fnCreate();
   }
};

const fnCreate = async () => {
   props.setLoadingPage(true);
   const res = await addPersonnelContract(props.personnelId, form.value);
   if (res.code == 20000) {
      props.getListTable();
      const toast = useToast();
      toast.add({ title: res.message, color: "green" });
      setDialogConfirm(false);
      props.setDialog(false);
   } else {
      messageError.value = res.message;
      setDialogConfirm(false);
   }
   props.setLoadingPage(false);
};

const fnUpdate = async () => {
   props.setLoadingPage(true);
   form.value.id = props.id;
   const res = await updatePersonnelContract(props.personnelId, form.value);
   if (res.code == 20000) {
      props.getListTable();
      const toast = useToast();
      toast.add({ title: res.message, color: "green" });
      setDialogConfirm(false);
      props.setDialog(false);
   } else {
      messageError.value = res.message;
      setDialogConfirm(false);
   }
   props.setLoadingPage(false);
};

watch(
   () => form.value.dateHired,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "dateHired" });
   }
);

const dateCal = ref({});
watch(
   () => form.value.dateContract,
   (newData) => {
      if (newData && form.value.dateContractExpired) {
         dateCal.value = diffDate(form.value.dateContractExpired, newData);
      }

      if (checkFormatDD_MM_YYYY(newData) && checkFormatDD_MM_YYYY(form.value.dateContractExpired)) {
         if (newData && form.value.dateContractExpired) {
            const start = new Date(genTextDate({ date: newData, oldFormat: "DD/MM/YYYY", isBuddhistYear: true }));
            const end = new Date(genTextDate({ date: form.value.dateContractExpired, oldFormat: "DD/MM/YYYY", isBuddhistYear: true }));
            if (start.getTime() > end.getTime()) {
               form.value.dateContractExpired = newData;
            }
         }
      }
      clearRequireOnChange(validator.value, { value: newData, key: "dateContract" });
   }
);

watch(
   () => form.value.dateContractExpired,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "dateContractExpired" });
      if (newData && form.value.dateContract) {
         dateCal.value = diffDate(newData, form.value.dateContract);
      }
   }
);

watch(
   () => form.value.contractTypeId,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "contractTypeId" });
   }
);

watch(
   () => form.value.dateContractCancel,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "dateContractCancel" });
   }
);

const clearRequireOnChange = (validator, options) => {
   if (validator[options.key]) {
      let isShow = null;
      if (options.value) {
         isShow = false;
      }
      validator[options.key].showMessage = isShow;
   }
};

const changeCancelContract = (checked) => {
   if (checked) {
      validator.value = {
         ...validator.value,
         dateContractCancel: {
            showMessage: false,
            message: "กรอกข้อมูลไม่ครบถ้วน",
         },
      };
   } else {
      delete validator.value.dateContractCancel;
      form.value.dateContractCancel = "";
   }
};
</script>
