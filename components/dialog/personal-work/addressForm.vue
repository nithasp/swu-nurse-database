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
         <div class="flex items-center justify-between flex-col sm:flex-row">
            <div class="text-primary-500 text-xl">
               {{ openDialogMode === "edit" ? "แก้ไขข้อมูล" : openDialogMode === "create" ? "เพิ่มที่อยู่" : "ที่อยู่" }}
            </div>
            <div
               class="text-primary-500 text-sm border border-solid rounded-md border-[#F26522] px-6 py-2.5 mt-2 cursor-pointer sm:mt-0"
               @click="getPersonnelHistoryDetail"
            >
               คัดลอกมาจากที่อยู่ที่สามารถติดต่อได้
            </div>
         </div>
         <div class="h-[1px] bg-primary-500 mt-3 mb-8"></div>
         <form v-if="!isFormLoading">
            <div class="grid grid-cols-1 justify-center gap-y-2 sm:grid-cols-2">
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>ประเภทที่อยู่</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.addressTypeId"
                        :options="addressTypeList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.addressTypeId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                     <div class="flex items-center mt-2" v-if="validator.addressTypeId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.addressTypeId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>สถานะ</span>
                     <span>:&nbsp;</span>
                  </p>

                  <USelectMenu
                     v-model="form.enabled"
                     :options="usageStatus"
                     placeholder="-- เลือก --"
                     value-attribute="id"
                     option-attribute="name"
                     :disabled="openDialogMode === 'view'"
                     :ui="{
                        base: 'h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100',
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
                     @change="
                        () => {
                           if (form.enabled === 1) {
                              enabledStatus = true;
                           } else {
                              enabledStatus = false;
                           }
                        }
                     "
                  >
                  </USelectMenu>
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>บ้านเลขที่</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <Input
                     v-model="form.houseNo"
                     placeholder="บ้านเลขที่"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :requireInput="{ showMessage: validator.houseNo?.showMessage, message: validator.houseNo?.message }"
                     @change="(event) => clearRequireOnChange({ value: event.target.value, key: 'houseNo' })"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>หมู่ที่</span>
                     <span>:&nbsp;</span>
                  </p>

                  <Input
                     v-model="form.moo"
                     type="number"
                     placeholder="หมู่ที่"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>หมู่บ้าน</span>
                     <span>:&nbsp;</span>
                  </p>

                  <Input
                     v-model="form.village"
                     placeholder="หมู่บ้าน"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>อาคาร</span>
                     <span>:&nbsp;</span>
                  </p>

                  <Input
                     v-model="form.building"
                     placeholder="อาคาร"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>ชั้นที่</span>
                     <span>:&nbsp;</span>
                  </p>

                  <Input
                     v-model="form.floor"
                     type="number"
                     placeholder="ชั้นที่"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>เลขที่ห้อง</span>
                     <span>:&nbsp;</span>
                  </p>

                  <Input
                     v-model="form.room"
                     placeholder="เลขที่ห้อง"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>ซอย</span>
                     <span>:&nbsp;</span>
                  </p>

                  <Input
                     v-model="form.soi"
                     placeholder="ซอย"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>ถนน</span>
                     <span>:&nbsp;</span>
                  </p>

                  <Input
                     v-model="form.street"
                     placeholder="ถนน"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>

               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>จังหวัด</span>
                     <span>:&nbsp;</span>
                  </p>

                  <USelectMenu
                     v-model="form.provinceId"
                     :options="provinceCurrentAddressList"
                     placeholder="-- เลือก --"
                     value-attribute="id"
                     option-attribute="name"
                     searchable
                     searchable-placeholder="จังหวัด"
                     :search-attributes="['name']"
                     :disabled="openDialogMode === 'view'"
                     :ui="{
                        base: 'h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100',
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
                     @change="(provinceId) => getDistrictAndSubdistrictCurrentAddressList('change', provinceId)"
                  >
                  </USelectMenu>
               </div>

               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>รหัสไปรษณีย์</span>
                     <span>:&nbsp;</span>
                  </p>
                  <input
                     v-model="form.zipcode"
                     placeholder="รหัสไปรษณีย์"
                     maxlength="5"
                     @keypress="allowOnlyNumbers"
                     @input="validateInput"
                     :disabled="actionMode === 'view'"
                     class="leading-[3] placeholder:text-gray-100 placeholder:h-full placeholder:text-sm rounded-lg px-[14px] w-full border border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed text-sm flex flex-col h-[38px]"
                  />
               </div>

               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>อำเภอ/เขต</span>
                     <span>:&nbsp;</span>
                  </p>

                  <USelectMenu
                     v-model="form.districtId"
                     :options="districtCurrentAddressList"
                     placeholder="-- เลือก --"
                     value-attribute="id"
                     option-attribute="name"
                     searchable
                     searchable-placeholder="อำเภอ/เขต"
                     :search-attributes="['name']"
                     :disabled="openDialogMode === 'view'"
                     :ui="{
                        base: 'h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100',
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
                     @change="(districtId) => getSubdistrictList('change', districtId)"
                  >
                  </USelectMenu>
               </div>

               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>ตำบล/แขวง</span>
                     <span>:&nbsp;</span>
                  </p>

                  <USelectMenu
                     v-model="form.subDistrictId"
                     :options="subDistrictCurrentAddressList"
                     placeholder="-- เลือก --"
                     value-attribute="id"
                     option-attribute="name"
                     searchable
                     searchable-placeholder="ตำบล/แขวง"
                     :search-attributes="['name']"
                     :disabled="openDialogMode === 'view'"
                     :ui="{
                        base: 'h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100',
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
                     @change="
                        (subDistrictId) => {
                           form.zipcode = subDistrictCurrentAddressList.find((i) => i.id === subDistrictId)?.zipcodes;
                        }
                     "
                  >
                  </USelectMenu>
               </div>

               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>โทรศัพท์</span>
                     <span>:&nbsp;</span>
                  </p>

                  <Input
                     v-model="form.tel"
                     type="number"
                     placeholder="เลขที่"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 sm:grid-cols-[105px_1fr]">
                  <p class="text-sm text-[#333] text-left pt-2 sm:text-right">
                     <span>โทรสาร</span>
                     <span>:&nbsp;</span>
                  </p>

                  <Input
                     v-model="form.fax"
                     type="number"
                     placeholder="โทรสาร"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
            </div>
            <div class="mt-8 flex flex-wrap gap-2 justify-center">
               <ButtonEdit v-if="openDialogMode === 'view'" @click="() => setDialog(false, 'toEditMode')" />
               <ButtonSave v-else @click="submitForm" />
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
      :btnAction="handlePersonnelAddress"
   />
   <Loading v-if="isLoading" />
</template>

<script setup>
import Input from "~/components/form/input";
import Loading from "~/components/loading";

import ButtonSave from "~/components/button/save";
import ButtonEdit from "~/components/button/edit";
import ButtonCancel from "~/components/button/cancel";

import DialogConfirm from "~/components/dialog/confirm";

import SkeletonForm from "~/components/ui/skeleton/form";

const props = defineProps({
   isOpen: Boolean,
   setDialog: Function,
   openDialogMode: String,
   personnelId: String,
   addressId: Number,
});

import usePersonnelHistoryAPI from "~/service/api/personnelHistory";
const { fetchPersonnelHistoryDetail } = usePersonnelHistoryAPI;

import usePersonnelAddressAPI from "~/service/api/personnelAddress";
const { fetchPersonnelAddressById, addPersonnelAddress, updatePersonnelAddress } = usePersonnelAddressAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchProvinceList, fetchDistrictList, fetchSubdistrictList, fetchAddressTypeList } = useMasterDataAPI;

const toast = useToast();
const form = ref({
   enabled: null,
   addressTypeId: null,
   houseNo: "",
   moo: "",
   floor: "",
   soi: "",
   room: "",
   street: "",
   subDistrictId: null,
   districtId: null,
   provinceId: null,
   zipcode: "",
   building: "",
   village: "",
   fax: "",
   tel: "",
});
const validator = ref({
   addressTypeId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   houseNo: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
});
const resetForm = () => {
   form.value = {
      enabled: null,
      addressTypeId: null,
      houseNo: "",
      moo: "",
      floor: "",
      soi: "",
      room: "",
      street: "",
      subDistrictId: null,
      districtId: null,
      provinceId: null,
      zipcode: "",
      building: "",
      village: "",
      fax: "",
      tel: "",
   };
   provinceCurrentAddressList.value = [];
   districtCurrentAddressList.value = [];
   subDistrictCurrentAddressList.value = [];
   validator.value = {
      addressTypeId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      houseNo: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
   };
};
const usageStatus = ref([
   { id: 1, status: true, name: "ใช้งาน " },
   { id: 2, status: false, name: "ไม่ใช้งาน " },
]);
const enabledStatus = ref(0);

const addressTypeList = ref([]);
const provinceCurrentAddressList = ref([]);
const districtCurrentAddressList = ref([]);
const subDistrictCurrentAddressList = ref([]);

const isLoading = ref(false);
const isFormLoading = ref(false);
const isFirstRender = ref(true);

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
   () => form.value.addressTypeId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "addressTypeId" });
   }
);

const getData = () => {
   isFormLoading.value = true;
   isFirstRender.value = true;
   Promise.all([
      props?.openDialogMode === "edit" || props?.openDialogMode === "view" ? fetchPersonnelAddressById(props.personnelId, props.addressId) : Promise.resolve(),
      fetchProvinceList(),
      fetchAddressTypeList(),
   ]).then((res) => {
      if (props?.openDialogMode === "edit" || props?.openDialogMode === "view") {
         if (res[0]?.code === 20000) {
            form.value = {
               ...res[0].responseObject,
               enabled: res[0].responseObject.enabled ? 1 : 2,
               zipcode: res[0].responseObject.zipcode ? Math.round(res[0].responseObject.zipcode) : "",
            };
         }
      }
      if (res[1]?.code === 20000) {
         provinceCurrentAddressList.value = res[1].responseObject.provinceList;
         getDistrictAndSubdistrictCurrentAddressList("fetch");
      }
      if (res[2]?.code === 20000) {
         addressTypeList.value = res[2].responseObject.addressTypeList;
      }
      isFormLoading.value = false;
      setTimeout(() => {
         isFirstRender.value = false;
      }, 100);
   });
};

const getSubdistrictList = async (type, districtId) => {
   if (type === "change") {
      form.value.zipcode = "";
   }
   const res = await fetchSubdistrictList({ districtId });
   if (res?.code === 20000) {
      subDistrictCurrentAddressList.value = res.responseObject.subDistrictList;
      form.value.subDistrictId = 0;
   }
};
const getDistrictAndSubdistrictCurrentAddressList = async (type, provinceIdValue) => {
   if (type === "fetch") {
      const provinceId = form.value.provinceId;
      const resDistrict = form.value.districtId ? await fetchDistrictList({ provinceId }) : null;
      if (resDistrict?.code === 20000) {
         const districtId = form.value.districtId;
         districtCurrentAddressList.value = provinceId ? resDistrict.responseObject.districtList : [];

         if (form.value.subDistrictId) {
            const resSubdistrict = await fetchSubdistrictList({ districtId });
            if (resSubdistrict?.code === 20000) {
               subDistrictCurrentAddressList.value = districtId ? resSubdistrict.responseObject.subDistrictList : [];
            }
         }
      }
   } else {
      form.value.zipcode = "";
      const provinceId = provinceIdValue;
      const resDistrict = await fetchDistrictList({ provinceId });
      if (resDistrict?.code === 20000) {
         districtCurrentAddressList.value = resDistrict.responseObject.districtList;
         form.value.districtId = 0;

         subDistrictCurrentAddressList.value = [];
         form.value.subDistrictId = 0;
      }
   }
};

const isOpenDialogConfirm = ref(false);
const setDialogConfirm = (status) => {
   isOpenDialogConfirm.value = status;
};

const handlePersonnelAddress = async () => {
   isLoading.value = true;
   form.value = {
      ...form.value,
      zipcode: form.value.zipcode?.toString(),
   };
   const res =
      props.openDialogMode === "create"
         ? await addPersonnelAddress(props?.personnelId, form.value)
         : await updatePersonnelAddress(props?.personnelId, props?.addressId, form.value);
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

const getPersonnelHistoryDetail = async () => {
   isLoading.value = true;
   const res = await fetchPersonnelHistoryDetail(props?.personnelId);
   if (res?.code === 20000) {
      form.value = {
         ...form.value,
         houseNo: res.responseObject.currentAddress.houseNo,
         moo: res.responseObject.currentAddress.moo,
         floor: res.responseObject.currentAddress.floor,
         village: res.responseObject.currentAddress.village,
         soi: res.responseObject.currentAddress.soi,
         room: res.responseObject.currentAddress.room,
         street: res.responseObject.currentAddress.street,
         building: res.responseObject.currentAddress.building,
         zipcode: res.responseObject.currentAddress.zipcode,
         tel: res.responseObject.currentAddress.tel,
         fax: res.responseObject.currentAddress.fax,
         districtId: res.responseObject.currentAddress.districtId,
         provinceId: res.responseObject.currentAddress.provinceId,
         subDistrictId: res.responseObject.currentAddress.subDistrictId,
      };
      getDistrictAndSubdistrictCurrentAddressList("fetch");
   } else {
      toast.add({ title: res?.message, color: "red" });
   }
   isLoading.value = false;
};

const allowOnlyNumbers = (event) => {
   const char = String.fromCharCode(event.which);
   if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
   }
};
const validateInput = () => {
   form.value.zipcode = form.value.zipcode.replace(/[^0-9]/g, "").slice(0, 5);
};
</script>
