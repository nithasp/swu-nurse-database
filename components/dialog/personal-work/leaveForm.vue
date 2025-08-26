<template>
   <UModal :modelValue="isOpen" :ui="{
      container: 'items-center',
      width: 'min-w-[95%] md:min-w-[800px]',
      rounded: 'rounded-3xl',
   }" :initialFocus="removeAutoFocus">
      <div id="leaveForm" class="p-6">
         <p class="text-primary-500 text-xl">{{ actionMode == "edit" ? "แก้ไข" : actionMode == "create" ? "เพิ่ม" : ""
            }}ข้อมูลการลา</p>
         <div class="h-[1px] bg-primary-500 mt-2 mb-8"></div>
         <form v-if="!loadingForm" class="grid grid-cols-1 tablet:grid-cols-none justify-center gap-y-3 tablet:gap-2">
            <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">ประเภทการลา<span class="text-red-500"> *</span> :
               </p>
               <div class="tablet:w-[300px]">
                  <Select v-model="form.leaveTypeId" :options="leaveTypeList" attributeValue="id" attributeOption="name"
                     :requireInput="{ showMessage: validator.leaveTypeId?.showMessage, message: validator.leaveTypeId?.message }"
                     :disabled="actionMode == 'view'" />
               </div>
            </div>
            <div class="grid sm:grid-cols-[180px_1fr] gap-x-3 gap-y-1 py-2">
               <p class="text-sm tablet:text-right">ลา<span class="text-red-500"> *</span> :</p>
               <div>
                  <div class="flex gap-x-3">
                     <Radio :lists="leaveRangeType" v-model="form.leaveRangeType" :change="changeLeaveRangeType" />
                  </div>
                  <div class="flex items-center mt-2" v-if="validator.leaveRangeType?.showMessage">
                     <label class="text-error-500 text-sm">{{ validator.leaveRangeType?.message }}</label>
                  </div>
               </div>
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1"
               v-if="form.leaveRangeType">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">วันที่ลา<span class="text-red-500"> *</span> :</p>
               <Datepicker inputId="dateLeaveStart" v-model="form.dateLeaveStart" placeholder="วัน/เดือน/ปี"
                  inputHeight="h-[38px]" class="w-full tablet:w-[300px]"
                  :requireInput="{ showMessage: validator.dateLeaveStart?.showMessage, message: validator.dateLeaveStart?.message }"
                  :disabled="actionMode == 'view'" />
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1"
               v-if="form.leaveRangeType == '2' || form.leaveRangeType == '3'">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">เวลา<span class="text-red-500"> *</span> :</p>
               <div class="flex items-center tablet:items-start tablet:w-[300px] flex-col tablet:flex-row gap-y-2">
                  <!-- ครึ่งวันเช้า -->
                  <div v-if="form.leaveRangeType == '2'" id="morning-time" class="w-full">
                     <div class="block tablet:flex tablet:gap-2">
                        <div class="swu-timepicker-container">
                           <div :class="[
                              validator.timeLeaveStart?.showMessage || isSameTimeLeave() ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100 pe-9' : '',
                              'flex items-center justify-between pl-[14px] pr-4 h-[38px] cursor-pointer border border-gray-100 rounded-lg bg-white w-full tablet:w-[139px]',
                           ]" @click="isRenderTime1Display = !isRenderTime1Display">
                              <span v-if="form.timeLeaveStart" class="text-sm">
                                 {{ form.timeLeaveStart }}
                              </span>
                              <span v-else class="text-sm text-gray-100"> เวลา </span>
                              <div>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="#636466" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-clock">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                 </svg>
                              </div>
                           </div>

                           <div :class="[isRenderTime1Display ? 'active' : '', 'swu-timepicker mt-4 bg-white absolute']"
                              ref="renderTime1Elem">
                              <div class="triangle-pointer"></div>
                              <div>
                                 <div class="flex items-center gap-3 p-4">
                                    <div>{{ startHours1Formatted }}:{{ startMinutes1 == 0 ? "00" : startMinutes1 }}
                                    </div>
                                    <div>
                                       <input type="range" id="volume" name="volume" v-model="startHours1" min="8"
                                          max="12" class="block slider-input" />
                                       <input type="range" id="volume" name="volume" v-model="startMinutes1" min="0"
                                          :max="startMax1" step="30" class="block slider-input mt-6" />
                                    </div>
                                 </div>
                                 <div class="line w-full h-[1px] bg-[#80808066] mt-2"></div>
                                 <div class="text-center text-sm text-[#f26522] py-2 cursor-pointer hover:bg-[#f0f0f0]"
                                    @click="handleSelectRenderTime1">เลือก</div>
                              </div>
                           </div>
                           <div v-if="validator.timeLeaveStart?.showMessage" class="inline-block mt-2 w-[140px]">
                              <label class="text-error-500 text-sm">{{ validator.timeLeaveStart?.message }}</label>
                           </div>
                        </div>
                        <span class="mt-[6px] hidden tablet:block"> - </span>
                        <div id="renderTime2" class="swu-timepicker-container mt-2 tablet:mt-0">
                           <div :class="[
                              validator.timeLeaveEnd?.showMessage || isSameTimeLeave() ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100 pe-9' : '',
                              'flex items-center justify-between pl-[14px] pr-4 h-[38px] cursor-pointer border border-gray-100 rounded-lg bg-white w-full tablet:w-[139px]',
                           ]" @click="isRenderTime2Display = !isRenderTime2Display">
                              <span v-if="form.timeLeaveEnd" class="text-sm">
                                 {{ form.timeLeaveEnd }}
                              </span>
                              <span v-else class="text-sm text-gray-100"> เวลา </span>
                              <div>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="#636466" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-clock">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                 </svg>
                              </div>
                           </div>

                           <div :class="[isRenderTime2Display ? 'active' : '', 'swu-timepicker mt-4 bg-white absolute']"
                              ref="renderTime2Elem">
                              <div class="triangle-pointer"></div>
                              <div>
                                 <div class="flex items-center gap-3 p-4">
                                    <div>{{ startHours2Formatted }}:{{ startMinutes2 == 0 ? "00" : startMinutes2 }}
                                    </div>
                                    <div>
                                       <input type="range" id="volume" name="volume" v-model="startHours2"
                                          :min="startHours1" max="12" class="block slider-input" />
                                       <input type="range" id="volume" name="volume" v-model="startMinutes2" min="0"
                                          :max="startMax2" step="30" class="block slider-input mt-6"
                                          :disabled="disabledStartMinutes2()" />
                                    </div>
                                 </div>
                                 <div class="line w-full h-[1px] bg-[#80808066] mt-2"></div>
                                 <div class="text-center text-sm text-[#f26522] py-2 cursor-pointer hover:bg-[#f0f0f0]"
                                    @click="handleSelectRenderTime2">เลือก</div>
                              </div>
                           </div>

                           <div v-if="validator.timeLeaveEnd?.showMessage" class="mt-2">
                              <label class="text-error-500 text-sm">{{ validator.timeLeaveEnd?.message }}</label>
                           </div>
                        </div>
                     </div>
                     <div v-if="isSameTimeLeave()" class="mt-2">
                        <label class="text-error-500 text-sm">กรุณาเลือกเวลาไม่ซ้ำกัน</label>
                     </div>
                  </div>

                  <!-- ครึ่งวันบ่าย -->
                  <div v-if="form.leaveRangeType == '3'" id="afternoon-time" class="w-full">
                     <div class="block tablet:flex tablet:gap-2">
                        <div class="swu-timepicker-container">
                           <div :class="[
                              validator.timeLeaveStart?.showMessage || isSameTimeLeave() ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100 pe-9' : '',
                              'flex items-center justify-between pl-[14px] pr-4 h-[38px] cursor-pointer border border-gray-100 rounded-lg bg-white w-full tablet:w-[139px]',
                           ]" @click="isRenderTime3Display = !isRenderTime3Display">
                              <span v-if="form.timeLeaveStart" class="text-sm">
                                 {{ form.timeLeaveStart }}
                              </span>
                              <span v-else class="text-sm text-gray-100"> เวลา </span>
                              <div>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="#636466" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-clock">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                 </svg>
                              </div>
                           </div>

                           <div :class="[isRenderTime3Display ? 'active' : '', 'swu-timepicker mt-4 bg-white absolute']"
                              ref="renderTime3Elem">
                              <div class="triangle-pointer"></div>
                              <div>
                                 <div class="flex items-center gap-3 p-4">
                                    <div>{{ startHours3Formatted }}:{{ startMinutes3 == 0 ? "00" : startMinutes3 }}
                                    </div>
                                    <div>
                                       <input type="range" id="volume" name="volume" v-model="startHours3" min="13"
                                          max="16" class="block slider-input" />
                                       <input type="range" id="volume" name="volume" v-model="startMinutes3" min="0"
                                          :max="startMax3" step="30" class="block slider-input mt-6" />
                                    </div>
                                 </div>
                                 <div class="line w-full h-[1px] bg-[#80808066] mt-2"></div>
                                 <div class="text-center text-sm text-[#f26522] py-2 cursor-pointer hover:bg-[#f0f0f0]"
                                    @click="handleSelectRenderTime3">เลือก</div>
                              </div>
                           </div>

                           <div v-if="validator.timeLeaveStart?.showMessage" class="inline-block mt-2 w-[140px]">
                              <label class="text-error-500 text-sm">{{ validator.timeLeaveStart?.message }}</label>
                           </div>
                        </div>
                        <span class="mt-[6px] hidden tablet:block"> - </span>
                        <div id="renderTime2" class="swu-timepicker-container mt-2 tablet:mt-0">
                           <div :class="[
                              validator.timeLeaveEnd?.showMessage || isSameTimeLeave() ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100 pe-9' : '',
                              'flex items-center justify-between pl-[14px] pr-4 h-[38px] cursor-pointer border border-gray-100 rounded-lg bg-white  w-full tablet:w-[139px]',
                           ]" @click="isRenderTime4Display = !isRenderTime4Display">
                              <span v-if="form.timeLeaveEnd" class="text-sm">
                                 {{ form.timeLeaveEnd }}
                              </span>
                              <span v-else class="text-sm text-gray-100"> เวลา </span>
                              <div>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="#636466" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="feather feather-clock">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                 </svg>
                              </div>
                           </div>

                           <div :class="[isRenderTime4Display ? 'active' : '', 'swu-timepicker mt-4 bg-white absolute']"
                              ref="renderTime4Elem">
                              <div class="triangle-pointer"></div>
                              <div>
                                 <div class="flex items-center gap-3 p-4">
                                    <div>{{ startHours4Formatted }}:{{ startMinutes4 == 0 ? "00" : startMinutes4 }}
                                    </div>
                                    <div>
                                       <input type="range" id="volume" name="volume" v-model="startHours4"
                                          :min="startHours3" max="16" class="block slider-input" />
                                       <input type="range" id="volume" name="volume" v-model="startMinutes4" min="0"
                                          :max="startMax4" step="30" class="block slider-input mt-6"
                                          :disabled="disabledStartMinutes4()" />
                                    </div>
                                 </div>
                                 <div class="line w-full h-[1px] bg-[#80808066] mt-2"></div>
                                 <div class="text-center text-sm text-[#f26522] py-2 cursor-pointer hover:bg-[#f0f0f0]"
                                    @click="handleSelectRenderTime4">เลือก</div>
                              </div>
                           </div>

                           <div v-if="validator.timeLeaveStart?.showMessage" class="inline-block mt-2 w-[140px]">
                              <label class="text-error-500 text-sm">{{ validator.timeLeaveStart?.message }}</label>
                           </div>
                        </div>
                     </div>
                     <div v-if="isSameTimeLeave()" class="mt-2">
                        <label class="text-error-500 text-sm">กรุณาเลือกเวลาไม่ซ้ำกัน</label>
                     </div>
                  </div>
               </div>
            </div>
            <div class="grid sm:grid-cols-[180px_1fr] gap-x-3 gap-y-1" v-if="form.leaveRangeType == '1'">
               <p class="text-sm tablet:text-right mt-2">ถึงวันที่<span class="text-red-500"> *</span> :</p>
               <Datepicker inputId="dateLeaveEnd" v-model="form.dateLeaveEnd" placeholder="วัน/เดือน/ปี"
                  inputHeight="h-[38px]" class="w-full tablet:w-[300px]"
                  :requireInput="{ showMessage: validator.dateLeaveEnd?.showMessage, message: validator.dateLeaveEnd?.message }"
                  :minDate="form.dateLeaveStart" :disabled="actionMode == 'view'" />
            </div>
            <div class="grid sm:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-2">หมายเหตุ :</p>
               <div class="tablet:w-[300px]">
                  <Textarea v-model="form.remark" rows="3" :disabled="actionMode == 'view'" />
               </div>
            </div>
            <div v-if="actionMode != 'view' && form.files.length < 3"
               class="grid tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right tablet:mt-2.5">แนบไฟล์ :</p>
               <div>
                  <ButtonChooseFile :action="selectFile" />
                  <input type="file" accept=".xlsx, .docx, .pdf" id="input_file_leave" multiple class="hidden"
                     @change="changeFile" />
               </div>
            </div>
            <div class="grid tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <div>
                  <p v-if="actionMode === 'view' || form.files.length == 3"
                     class="text-sm tablet:text-right tablet:mt-2">แนบไฟล์ :</p>
               </div>
               <div class="space-y-2">
                  <div v-for="(file, index) in form.files" :key="file.fileId"
                     class="w-full tablet:w-[400px] rounded-lg bg-gray-200 px-3 py-1 h-[38px] grid justify-between items-center grid-cols-[1fr_25px] gap-x-2">
                     <p class="line-clamp-1 text-sm text-primary-500 cursor-pointer"
                        @click="openNewTab(file.link || file.url)">{{ file.filename }}</p>
                     <UIcon v-if="actionMode != 'view'" name="i-heroicons-x-mark" class="w-5 h-5 cursor-pointer"
                        @click="setDialogDeleteFile(true, index)" />
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
   <DialogConfirm :isOpen="isOpenConfirm" :setDialog="setDialogConfirm" title="บันทึกข้อมูล"
      desc="คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่" icon="success" :btnAction="fnSave" />
   <DialogConfirm :isOpen="isOpenDeleteFile" :setDialog="setDialogDeleteFile" title="ลบไฟล์"
      desc="คุณต้องการลบไฟล์นี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก" icon="danger"
      :btnAction="fnDeleteFile" />
</template>
<script setup>
import ButtonSave from "~/components/button/save";
import ButtonChooseFile from "~/components/button/chooseFile";
import ButtonCancel from "~/components/button/cancel";
import Select from "~/components/form/select";
import Datepicker from "~/components/form/datepicker";
import Timepicker from "~/components/form/timepicker";
import Textarea from "~/components/form/textarea";
import DialogConfirm from "~/components/dialog/confirm";
import SkeletonForm from "~/components/ui/skeleton/form";
import BadgeError from "~/components/badge/error";
import Radio from "~/components/form/radio";

import usePersonnelLeaveAPI from "~/service/api/personnel/leave";
const { fetchPersonnelLeave, addPersonnelLeave, updatePersonnelLeave } = usePersonnelLeaveAPI;
import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchLeaveTypeList } = useMasterDataAPI;

const props = defineProps({
   isOpen: {
      type: Boolean,
      default: true,
   },
   setDialog: Function,
   actionMode: String,
   personnelId: String,
   id: Number,
   setLoadingPage: Function,
   getListTable: Function,
});

const renderTime1Elem = ref(null);
const renderTime2Elem = ref(null);
const renderTime3Elem = ref(null);
const renderTime4Elem = ref(null);

const removeAutoFocus = ref(null);
const loadingForm = ref(false);

const leaveRangeType = [
   { value: "1", label: "เต็มวัน" },
   { value: "2", label: "ครึ่งวันเช้า" },
   { value: "3", label: "ครึ่งวันบ่าย" },
];

const form = ref({
   leaveTypeId: "",
   leaveRangeType: "",
   remark: "",
   dateLeaveStart: "",
   dateLeaveEnd: "",
   timeLeaveStart: "",
   timeLeaveEnd: "",

   files: [],
   leaveRangeType: "",
});
const validator = ref({});
const resetForm = () => {
   messageError.value = "";
   form.value = {
      leaveTypeId: "",

      remark: "",
      dateLeaveStart: "",
      dateLeaveEnd: "",
      timeLeaveStart: "",
      timeLeaveEnd: "",

      files: [],
      filesDelete: [],
      leaveRangeType: "",
   };
   validator.value = {
      leaveTypeId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      dateLeaveStart: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      leaveRangeType: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
   };
};
onMounted(() => {
   const renderTimeElems = [
      { elem: renderTime1Elem, display: isRenderTime1Display },
      { elem: renderTime2Elem, display: isRenderTime2Display },
      { elem: renderTime3Elem, display: isRenderTime3Display },
      { elem: renderTime4Elem, display: isRenderTime4Display },
   ];

   document.addEventListener(
      "click",
      (event) => {
         renderTimeElems.forEach(({ elem, display }) => {
            if (elem.value && !elem.value.contains(event.target)) {
               display.value = false;
            }
         });
      },
      { capture: true }
   );
});

watch(
   () => props.isOpen,
   (newData) => {
      if (newData == true) {
         //master data
         getLeaveTypeList();
         resetForm();

         if (props.id) {
            getDataById();
         }
      }
   }
);

const getDataById = async () => {
   loadingForm.value = true;
   const res = await fetchPersonnelLeave(props.personnelId, props.id);
   loadingForm.value = false;
   if (res.code == 20000) {
      const data = res.responseObject;
      form.value.leaveTypeId = data.leaveTypeId;
      form.value.leaveRangeType = data.leaveRangeType?.toString();
      form.value.dateLeaveStart = data.dateLeaveStart;
      form.value.dateLeaveEnd = data.dateLeaveEnd;
      form.value.timeLeaveStart = convertToTime(data.dateLeaveStart);
      form.value.timeLeaveEnd = convertToTime(data.dateLeaveEnd);
      form.value.remark = data.remark;
      form.value.files = data.files || [];
      form.value.filesDelete = [];

      genValidator(form.value.leaveRangeType);
   }
};

const leaveTypeList = ref([]);
const getLeaveTypeList = async () => {
   const res = await fetchLeaveTypeList({ parent: "annualLeave" });
   if (res.code == 20000) {
      leaveTypeList.value = res.responseObject.leaveTypeList;
   }
};

const validatorLeaveForm = (form, validator) => {
   const fail = [];
   for (const key in validator) {
      if (validator[key].showMessage == true) {
         fail.push(key);
         validator[key].showMessage = true;
      } else {
         if (!form[key]) {
            fail.push(key);
            validator[key].showMessage = true;
         } else {
            if (key == "timeLeaveStart" || key == "timeLeaveEnd") {
               const time = parseInt(form[key].replace(":", ""));
               if (form.leaveRangeType == "2" && (time < 800 || time > 1200)) {
                  fail.push(key);
                  validator[key].showMessage = true;
                  validator[key].message = "เวลาไม่ถูกต้อง";
                  return;
               } else if (form.leaveRangeType == "3" && (time < 1300 || time > 1630)) {
                  fail.push(key);
                  validator[key].showMessage = true;
                  validator[key].message = "เวลาไม่ถูกต้อง";
                  return;
               }
            }

            if (key == "timeLeaveStart") {
               const timeStart = parseInt(form[key].replace(":", ""));
               const timeEnd = parseInt(form.timeLeaveEnd.replace(":", ""));

               if (timeStart > timeEnd) {
                  fail.push(key);
                  validator[key].showMessage = true;
                  validator[key].message = "เวลาไม่ถูกต้อง";

                  fail.push("timeLeaveEnd");
                  validator["timeLeaveEnd"].showMessage = true;
                  validator["timeLeaveEnd"].message = "เวลาไม่ถูกต้อง";
               }
            }
         }
      }
   }
   return fail;
};

const messageError = ref("");
const submitForm = async () => {
   setTimeout(() => {
      const fail = validatorLeaveForm(form.value, validator.value);
      if (fail.length == 0 && !isSameTimeLeave()) {
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
   const res = await addPersonnelLeave(props.personnelId, form.value);
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
   const res = await updatePersonnelLeave(props.personnelId, form.value);
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
   () => form.value.leaveTypeId,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "leaveTypeId" });
   }
);

watch(
   () => form.value.dateLeaveStart,
   (newData) => {
      if (checkFormatDD_MM_YYYY(newData) && checkFormatDD_MM_YYYY(form.value.dateLeaveEnd)) {
         if (newData && form.value.dateLeaveEnd) {
            const start = new Date(genTextDate({ date: newData, oldFormat: "DD/MM/YYYY", isBuddhistYear: true }));
            const end = new Date(genTextDate({ date: form.value.dateLeaveEnd, oldFormat: "DD/MM/YYYY", isBuddhistYear: true }));
            if (start.getTime() > end.getTime()) {
               form.value.dateLeaveEnd = newData;
            }
         }
      }
      if (checkFormatDD_MM_YYYY(newData)) {
         //เลือกลาเป็น "ครึ่งวันเช้า" หรือ "ครึ่งวันบ่าย" จะเท่ากันเลย เพราะหน้า ui จะไม่แสดง end
         if (form.value.leaveRangeType == "2" || form.value.leaveRangeType == "3") {
            form.value.dateLeaveEnd = newData;
         }
      }
      clearRequireOnChange(validator.value, { value: newData, key: "dateLeaveStart" });
   }
);

watch(
   () => form.value.dateLeaveEnd,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "dateLeaveEnd" });
   }
);

const changeLeaveRangeType = (value) => {
   genValidator(value);

   isRenderTime1Display.value = false;
   isRenderTime2Display.value = false;
   isRenderTime3Display.value = false;
   isRenderTime4Display.value = false;

   form.value.dateLeaveStart = ""
   form.value.dateLeaveEnd = ""

   if (form.value.leaveRangeType == "2") {
      startHours1.value = 8;
      startMinutes1.value = 0;
      startMax1.value = 30;

      startHours2.value = 8;
      startMinutes2.value = 0;
      startMax2.value = 30;
   }

   if (form.value.leaveRangeType == "3") {
      startHours3.value = 13;
      startMinutes3.value = 0;
      startMax3.value = 30;

      startHours4.value = 13;
      startMinutes4.value = 0;
      startMax4.value = 30;
   }

   setTimeout(() => {
      form.value.timeLeaveStart = "";
      form.value.timeLeaveEnd = "";
   }, 10)


   clearRequireOnChange(validator.value, { value, key: "leaveRangeType" });
};

const genValidator = (leaveRangeType) => {
   if (leaveRangeType == "1") {
      delete validator.value.timeLeaveStart;
      delete validator.value.timeLeaveEnd;
      validator.value = {
         ...validator.value,
         dateLeaveEnd: {
            showMessage: false,
            message: "กรอกข้อมูลไม่ครบถ้วน",
         },
      };
   } else if (leaveRangeType == "2" || leaveRangeType == "3") {
      delete validator.value.dateLeaveEnd;
      validator.value = {
         ...validator.value,
         timeLeaveStart: {
            showMessage: false,
            message: "กรอกข้อมูลไม่ครบถ้วน",
         },
         timeLeaveEnd: {
            showMessage: false,
            message: "กรอกข้อมูลไม่ครบถ้วน",
         },
      };
   }
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

const startHours1 = ref(8);
const startMinutes1 = ref(0);
const startMax1 = ref(30);

const startHours2 = ref(8);
const startMinutes2 = ref(0);
const startMax2 = ref(30);

const isRenderTime1Display = ref(false);
const isRenderTime2Display = ref(false);

watch(
   () => [startHours1.value, startMinutes1.value],
   ([newStartHours1, newStartMinutes1], [oldStartHours1, oldStartMinutes1]) => {
      if (renderTime1() > renderTime2()) {
         startHours2.value = startHours1.value;
         startMinutes2.value = startMinutes1.value;
      }

      if (renderTime1() >= "12:00") {
         startHours1.value = 12;
         startMinutes1.value = 0;
         startMax1.value = 0;

         startHours2.value = 12;
         startMinutes2.value = 0;
         startMax2.value = 0;
      } else {
         startMax1.value = 30;

         if (renderTime2() < "12:00") {
            startMax2.value = 30;
         }
      }

      form.value.timeLeaveStart = renderTime1();
      clearRequireOnChange(validator.value, { value: form.value.timeLeaveStart, key: "timeLeaveStart" });
   }
);

watch(
   () => [startHours2.value, startMinutes2.value],
   ([newStartHours2, newStartMinutes2], [oldStartHours2, oldStartMinutes2]) => {
      if (renderTime2() < "12:00") {
         startMax2.value = 30;

         if (startHours1.value == startHours2.value && startMinutes1.value == 30) {
            startMinutes2.value = 30;
         }
      }

      if (renderTime2() >= "12:00") {
         startHours2.value = 12;
         startMinutes2.value = 0;
         startMax2.value = 0;
      }
      form.value.timeLeaveEnd = renderTime2();
      clearRequireOnChange(validator.value, { value: form.value.timeLeaveEnd, key: "timeLeaveEnd" });
   }
);

const convertToTime = (datetime) => {
   const date = new Date(datetime);
   const hours = date.getHours().toString().padStart(2, "0");
   const minutes = date.getMinutes().toString().padStart(2, "0");
   return `${hours}:${minutes}`;
};

const startHours1Formatted = computed(() => {
   return startHours1.value < 10 ? `0${startHours1.value}` : `${startHours1.value}`;
});
const renderTime1 = () => {
   return `${startHours1Formatted.value}:${startMinutes1.value == 0 ? "00" : startMinutes1.value}`;
};

const startHours2Formatted = computed(() => {
   return startHours2.value < 10 ? `0${startHours2.value}` : `${startHours2.value}`;
});
const renderTime2 = () => {
   return `${startHours2Formatted.value}:${startMinutes2.value == 0 ? "00" : startMinutes2.value}`;
};

const disabledStartMinutes2 = () => {
   if (startHours1.value == startHours2.value) {
      if (startMinutes1.value == 30) {
         return true;
      }
   } else {
      return false;
   }
};

const handleSelectRenderTime1 = () => {
   form.value.timeLeaveStart = `${startHours1Formatted.value}:${startMinutes1.value == 0 ? "00" : startMinutes1.value}`;
   isRenderTime1Display.value = false;
   clearRequireOnChange(validator.value, { value: form.value.timeLeaveStart, key: "timeLeaveStart" });
};
const handleSelectRenderTime2 = () => {
   form.value.timeLeaveEnd = `${startHours2Formatted.value}:${startMinutes2.value == 0 ? "00" : startMinutes2.value}`;
   isRenderTime2Display.value = false;
   clearRequireOnChange(validator.value, { value: form.value.timeLeaveStart, key: "timeLeaveEnd" });
};

const startHours3 = ref(13);
const startMinutes3 = ref(0);
const startMax3 = ref(30);

const startHours4 = ref(13);
const startMinutes4 = ref(0);
const startMax4 = ref(30);

const isRenderTime3Display = ref(false);
const isRenderTime4Display = ref(false);

watch(
   () => [startHours3.value, startMinutes3.value],
   ([newStartHours3, newStartMinutes3], [oldStartHours3, oldStartMinutes3]) => {
      if (renderTime3() > renderTime4()) {
         startHours4.value = startHours3.value;
         startMinutes4.value = startMinutes3.value;
      }
      if (renderTime3() >= "16:30") {
         startHours3.value = 16;
         startMinutes3.value = 30;
         startMax3.value = 30;

         startHours4.value = 16;
         startMinutes4.value = 30;
         startMax4.value = 30;
      } else {
         startMax3.value = 30;
         if (renderTime4() < "16:30") {
            startMax4.value = 30;
         }
      }

      form.value.timeLeaveStart = renderTime3();
      clearRequireOnChange(validator.value, { value: form.value.timeLeaveStart, key: "timeLeaveStart" });
   }
);

watch(
   () => [startHours4.value, startMinutes4.value],
   ([newStartHours4, newStartMinutes4], [oldStartHours4, oldStartMinutes4]) => {
      if (renderTime4() < "16:30") {
         startMax4.value = 30;

         if (startHours3.value == startHours4.value && startMinutes3.value == 30) {
            startMinutes4.value = 30;
         }
      }

      if (renderTime4() >= "16:30") {
         startHours4.value = 16;
         startMinutes4.value = 30;
         startMax4.value = 30;
      }

      form.value.timeLeaveEnd = renderTime4();
      clearRequireOnChange(validator.value, { value: form.value.timeLeaveStart, key: "timeLeaveEnd" });
   }
);

const startHours3Formatted = computed(() => {
   return startHours3.value < 10 ? `0${startHours3.value}` : `${startHours3.value}`;
});
const renderTime3 = () => {
   return `${startHours3Formatted.value}:${startMinutes3.value == 0 ? "00" : startMinutes3.value}`;
};

const startHours4Formatted = computed(() => {
   return startHours4.value < 10 ? `0${startHours4.value}` : `${startHours4.value}`;
});
const renderTime4 = () => {
   return `${startHours4Formatted.value}:${startMinutes4.value == 0 ? "00" : startMinutes4.value}`;
};

const disabledStartMinutes4 = () => {
   if (startHours3.value == startHours4.value) {
      if (startMinutes3.value == 30) {
         return true;
      }
   } else {
      return false;
   }
};

const handleSelectRenderTime3 = () => {
   form.value.timeLeaveStart = `${startHours3Formatted.value}:${startMinutes3.value == 0 ? "00" : startMinutes3.value}`;
   isRenderTime3Display.value = false;
   clearRequireOnChange(validator.value, { value: form.value.timeLeaveStart, key: "timeLeaveStart" });
};
const handleSelectRenderTime4 = () => {
   form.value.timeLeaveEnd = `${startHours4Formatted.value}:${startMinutes4.value == 0 ? "00" : startMinutes4.value}`;
   isRenderTime4Display.value = false;
   clearRequireOnChange(validator.value, { value: form.value.timeLeaveStart, key: "timeLeaveEnd" });
};

const isSameTimeLeave = () => {
   if (form.value.timeLeaveStart && form.value.timeLeaveEnd
      && form.value.timeLeaveStart == form.value.timeLeaveEnd
      && form.value.timeLeaveStart !== "00:00" && form.value.timeLeaveEnd !== "00:00"
   ) {
      return true;
   }
   return false;
}
</script>

<style scoped lang="scss">
.triangle-pointer {
   position: absolute;
   top: -10px;
   left: 15px;
   width: 0;
   height: 0;
   border-left: 7px solid transparent;
   border-right: 7px solid transparent;
   border-bottom: 10px solid white;
}

.triangle-pointer::before {
   content: "";
   position: absolute;
   top: 1px;
   left: -7px;
   width: 0;
   height: 0;
   border-left: 7px solid transparent;
   border-right: 7px solid transparent;
   border-bottom: 6px solid rgba(0, 0, 0, 0.15);
   z-index: -1;
   filter: blur(2px);
}

.slider-input {
   -webkit-appearance: none;
   height: 1px;
   background: gray;
   outline: none;
   opacity: 0.5;
   -webkit-transition: 0.2s;
   transition: opacity 0.2s;
}

.slider-input:hover {
   opacity: 1;
}

.slider-input::-webkit-slider-thumb {
   -webkit-appearance: none;
   appearance: none;
   width: 14px;
   height: 14px;
   background: #fff;
   border: 1px solid gray;
   cursor: pointer;
   border-radius: 0.2rem;
}

.slider-input::-moz-range-thumb {
   width: 14px;
   height: 14px;
   background: #fff;
   border: 1px solid gray;
   cursor: pointer;
   border-radius: 0.2rem;
}

.swu-timepicker {
   transform: translateY(5%);
   opacity: 0;
   visibility: hidden;
   transition: 0.4s;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

   &.active {
      transform: translateY(0%);
      opacity: 1;
      visibility: visible;
   }
}
</style>