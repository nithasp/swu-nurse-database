<template>
   <UModal
      :modelValue="isOpen"
      :ui="{
         container: 'items-center',
         width: 'w-[95%] md:min-w-[600px]',
         rounded: 'rounded-3xl',
      }"
      :initialFocus="removeAutoFocus"
   >
      <div class="p-6">
         <p class="text-primary-500 text-xl">{{ actionMode == "edit" ? "แก้ไข" : actionMode == "create" ? "เพิ่ม" : "" }}สถานภาพบุคลากร</p>
         <div class="h-[1px] bg-primary-500 mt-2 mb-8"></div>
         <div class="grid grid-cols-1 sm:grid-cols-none justify-center gap-y-3 sm:gap-2">
            <div class="grid sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm sm:text-right mt-2">สถานภาพบุคลากร<span class="text-red-500"> *</span> :</p>
               <Input
                  placeholder="สถานภาพบุคลากร"
                  class="flex flex-col sm:w-[260px]"
                  v-model="form.nameTh"
                  heightClass="h-[38px]"
                  :requireInput="{ showMessage: validator.nameTh?.showMessage, message: validator.nameTh?.message }"
                  @change="(event) => clearRequireOnChange({ value: event.target.value, key: 'nameTh' })"
                  :disabled="actionMode == 'view'"
               />
            </div>

            <BadgeError v-if="messageError" :action="() => (messageError = '')" :message="messageError" />

            <div class="mt-8 flex flex-wrap gap-2 justify-center">
               <ButtonEdit type="button" v-if="actionMode == 'view'" @click="btnOpenForm('edit')" />
               <ButtonSave type="button" v-else @click="submitForm" />
               <ButtonCancel @click="setDialog(false)" ref="removeAutoFocus" />
            </div>
         </div>
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
</template>
<script setup>
import Input from "~/components/form/input";
import ButtonSave from "~/components/button/save";
import ButtonEdit from "~/components/button/edit";
import ButtonCancel from "~/components/button/cancel";
import BadgeError from "~/components/badge/error";
import DialogConfirm from "~/components/dialog/confirm";

import useMasterPersonnelStatusAPI from "~/service/api/masterData/personnelStatus";
const { fetchPersonnelStatus, createPersonnelStatus, updatePersonnelStatus } = useMasterPersonnelStatusAPI;

const props = defineProps({
   isOpen: Boolean,
   setDialog: Function,
   actionMode: String,
   id: Number,
   setLoadingPage: Function,
   getListTable: Function,
   btnOpenForm: Function,
});

const form = ref({
   nameTh: "",
});
const validator = ref({});
const resetForm = () => {
   messageError.value = "";
   form.value = {
      nameTh: "",
   };
   validator.value = {
      nameTh: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
   };
};

const removeAutoFocus = ref(null);

watch(
   () => props.isOpen,
   (newData) => {
      if (newData == true) {
         resetForm();
         if (props.id) {
            getDataById();
         }
      }
   }
);

const getDataById = async () => {
   const res = await fetchPersonnelStatus(props.id);
   if (res.code == 20000) {
      form.value = res.responseObject.personnelStatus;
   }
};

const isOpenConfirm = ref(false);
const setDialogConfirm = (status) => {
   isOpenConfirm.value = status;
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
      if (options.value) {
         isShow = false;
      }
      validator.value[options.key].showMessage = isShow;
   }
};

const messageError = ref("");
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
   const res = await createPersonnelStatus(form.value);
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
   const res = await updatePersonnelStatus(form.value);
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
</script>
