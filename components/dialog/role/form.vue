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
         <p class="text-primary-500 text-xl">{{ actionMode == "edit" ? "แก้ไข" : actionMode == "create" ? "เพิ่ม" : "" }}สิทธิ์ผู้ใช้งาน</p>
         <div class="h-[1px] bg-primary-500 mt-2 mb-8"></div>
         <form class="grid grid-cols-1 sm:grid-cols-none justify-center gap-y-3 sm:gap-2">
            <div class="grid sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm sm:text-right mt-2">สถานะใช้งาน<span class="text-red-500"> *</span> :</p>
               <Select
                  class="w-[260px]"
                  v-model="form.enabled"
                  :options="status"
                  attributeValue="value"
                  attributeOption="name"
                  :searchable="false"
                  :requireInput="{ showMessage: validator.enabled?.showMessage, message: validator.enabled?.message }"
                  :disabled="actionMode == 'view'"
               />
            </div>
            <div class="grid sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm sm:text-right mt-2">ชื่อสิทธิ์ผู้ใช้งาน<span class="text-red-500"> *</span> :</p>
               <Input
                  placeholder="ชื่อสิทธิ์ผู้ใช้งาน"
                  class="flex flex-col sm:w-[260px]"
                  v-model="form.name"
                  heightClass="h-[38px]"
                  :requireInput="{ showMessage: validator.name?.showMessage, message: validator.name?.message }"
                  @change="(event) => clearRequireOnChange({ value: event.target.value, key: 'name' })"
                  :disabled="actionMode == 'view'"
               />
            </div>
            <div class="grid sm:grid-cols-[150px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm sm:text-right mt-2">สิทธิ์การเข้าใช้งาน<span class="text-red-500"> *</span> :</p>
               <SelectMulti
                  class="w-[260px]"
                  :options="permissionList"
                  v-model="form.permissionIds"
                  optionAttribute="name"
                  searchablePlaceholder="ค้นหาสิทธิ์การเข้าใช้งาน"
                  labelDefalut="-- เลือก --"
                  :labelDefalutIsPlaceholder="true"
                  :requireInput="{ showMessage: validator.permissionIds?.showMessage, message: validator.permissionIds?.message }"
                  :disabled="actionMode == 'view'"
               />
            </div>

            <BadgeError v-if="messageError" :action="() => (messageError = '')" :message="messageError" />

            <div class="mt-8 flex flex-wrap gap-2 justify-center">
               <ButtonEdit type="button" v-if="actionMode == 'view'" @click="btnOpenForm('edit')" />
               <ButtonSave type="button" v-else @click="submitForm" />
               <ButtonCancel @click="setDialog(false)" ref="removeAutoFocus" />
            </div>
         </form>
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
import SelectMulti from "~/components/form/selectMulti";
import Select from "~/components/form/select";
import useRoleAPI from "~/service/api/role";
const { fetchRole, addRole, updateRole } = useRoleAPI;

const props = defineProps({
   isOpen: Boolean,
   setDialog: Function,
   actionMode: String,
   permissionList: Array,
   id: Number,
   setLoadingPage: Function,
   getListTable: Function,
   btnOpenForm: Function,
});

const form = ref({
   name: "",
   enabled: "",
   permissionIds: [],
});
const validator = ref({});
const resetForm = () => {
   messageError.value = "";
   form.value = {
      name: "",
      enabled: "",
      permissionIds: [],
   };
   validator.value = {
      name: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      enabled: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      permissionIds: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
         type: "array",
      },
   };
};

const status = [
   {
      value: "1",
      name: "ใช้งาน",
   },
   {
      value: "0",
      name: "ไม่ใช้งาน",
   },
];

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
   const res = await fetchRole(props.id);
   if (res.code == 20000) {
      const { name, enabled, permissions } = res.responseObject.role;
      form.value.name = name;
      form.value.enabled = enabled ? "1" : "0";
      form.value.permissionIds = permissions;
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

watch(
   () => form.value.enabled,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "enabled" });
   }
);

watch(
   () => form.value.permissionIds,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "permissionIds", type: "array" });
   }
);

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
   const res = await addRole(form.value);
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
   const res = await updateRole(form.value);
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
