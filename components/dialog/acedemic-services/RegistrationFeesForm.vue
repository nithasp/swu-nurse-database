<template>
   <form v-if="!isFormLoading" class="grid grid-cols-1 tablet:grid-cols-none justify-center gap-y-3 tablet:gap-2">
      <div class="grid tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right mt-2">
            <span>ระยะเวลาในการดำเนินงานโครงการ</span>
            <span class="text-red-500">&nbsp;*</span>
            <span>&nbsp;:</span>
         </div>
         <div class="flex tablet:w-[306px] flex-col tablet:flex-row gap-y-2">
            <Datepicker v-model="form.dateStart" inputId="dateStart" placeholder="วัน/เดือน/ปี" inputHeight="h-[38px]"
               class="w-full tablet:w-auto"
               :requireInput="{ showMessage: validator.dateStart?.showMessage, message: validator.dateStart?.message }"
               :disabled="actionMode === 'view'" />
            <span class="mt-2 px-1.5 hidden tablet:block">-</span>
            <Datepicker v-model="form.dateEnd" inputId="dateEnd" placeholder="วัน/เดือน/ปี" inputHeight="h-[38px]"
               class="w-full tablet:w-auto"
               :requireInput="{ showMessage: validator.dateEnd?.showMessage, message: validator.dateEnd?.message }"
               :minDate="form.dateStart" :disabled="actionMode === 'view'" />
         </div>
      </div>

      <div class="grid items-center tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right mt-0">
            <span>ปีงบประมาณ</span>
            <span>&nbsp;:</span>
         </div>
         <Input class="flex flex-col tablet:w-[146px]" heightClass="h-[38px]" disabled :value="budgetYear" />
      </div>

      <div class="grid items-center tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right mt-0">
            <span>ปีการศึกษา</span>
            <span>&nbsp;:</span>
         </div>
         <Input class="flex flex-col tablet:w-[146px]" heightClass="h-[38px]" disabled :value="educationYear" />
      </div>

      <div class="grid tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right mt-3">
            <span>ชื่อโครงการ</span>
            <span class="text-red-500" v-if="actionMode !== 'view'">&nbsp;*</span>
            <span>&nbsp;:</span>
         </div>
         <Textarea v-model="form.name" placeholder="รายละเอียด" rows="3" class="tablet:w-[306px]"
            :requireInput="{ showMessage: validator.name?.showMessage, message: validator.name?.message }"
            :disabled="actionMode === 'view'"
            @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'name' })" />
      </div>

      <div class="grid tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right mt-2">
            <span>ข้อมูลเจ้าของโครงการ</span>
            <span class="text-red-500" v-if="actionMode !== 'view'">&nbsp;*</span>
            <span>&nbsp;:</span>
         </div>
         <Select v-model="form.ownerId" class="w-full tablet:w-[306px]" :options="personnelShortList"
            attributeValue="id" attributeOption="fullname" placeholder="-- เลือก --"
            searchablePlaceholder="ค้นหาแหล่งทุน"
            :requireInput="{ showMessage: validator.ownerId?.showMessage, message: validator.ownerId?.message }"
            :disabled="actionMode === 'view'" />
      </div>

      <div class="grid tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right mt-2">
            <span>จำนวนผู้เข้าร่วมการอบรม</span>
            <span class="text-red-500" v-if="actionMode !== 'view'">&nbsp;*</span>
            <span>&nbsp;:</span>
         </div>
         <Input v-model="form.participant" placeholder="จำนวนผู้เข้าร่วมการอบรม" class="flex flex-col tablet:w-[306px]"
            heightClass="h-[38px]" type="number"
            :requireInput="{ showMessage: validator.participant?.showMessage, message: validator.participant?.message }"
            @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'participant' })"
            @paste.prevent :disabled="actionMode === 'view'" />
      </div>

      <div class="grid items-center tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right">
            <span>รายได้ของโครงการ&nbsp;(ก่อนหักค่าใช้จ่าย)</span>
            <span>&nbsp;:</span>
         </div>
         <input type="number" :data-decimal="2" v-model="revenue" @input="(e) => genInputDecimal(e, 'revenue')"
            :onkeypress="(evt) => {
                  ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault();
               }
               " placeholder="งบประมาณที่ใช้ไป" :disabled="actionMode === 'view'"
            class="leading-[3] placeholder:text-gray-100 placeholder:h-full placeholder:text-sm rounded-lg px-[14px] w-full border border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed text-sm flex flex-col h-[38px] tablet:w-[428px]" />
      </div>

      <div class="grid items-center tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right">
            <span>จำนวนผู้ที่ได้รับทุนการศึกษา&nbsp;(คน)</span>
            <span>&nbsp;:</span>
         </div>
         <Input v-model="form.receiveEducationFundCount" placeholder="จำนวนผู้ที่ได้รับทุนการศึกษา (คน)"
            class="flex flex-col tablet:w-[306px]" heightClass="h-[38px]" type="number" @paste.prevent
            :disabled="actionMode === 'view'" />
      </div>

      <div class="grid items-center tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right">
            <span>รวมศิษย์เก่า</span>
            <span>&nbsp;:</span>
         </div>
         <div class="flex items-center gap-3">
            <Input :value="form.trainingAlumniList.length > 0 ? form.trainingAlumniList.length : '0'"
               placeholder="จำนวนผู้ที่ได้รับทุนการศึกษา (คน)" class="flex flex-col max-w-[82px] tablet:w-[306px]"
               heightClass="h-[38px]" disabled />
            <span class="text-sm">คน</span>
         </div>
      </div>

      <div class="grid items-center tablet:items-start tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right mt-2">
            <span>รายชื่อศิษย์เก่าที่เข้ารับการอบรม</span>
            <span>&nbsp;:</span>
         </div>
         <div class="grid grid-cols-[1fr_auto] w-[101%] gap-2 tablet:flex tablet:flex-wrap tablet:w-full">
            <Input class="flex flex-col tablet:w-[306px]" heightClass="h-[38px]"
               v-model="form.trainingAlumniListTemp.name" placeholder="รายชื่อศิษย์เก่า"
               :requireInput="{ showMessage: validatorTrainingAlumni.name?.showMessage, message: validatorTrainingAlumni.name?.message }"
               @change="(event) => clearRequireOnChange(validatorTrainingAlumni, { value: event.target.value, key: 'name' })"
               :disabled="actionMode === 'view'" />
            <ButtonAddIcon v-if="actionMode !== 'view'" class="mt-1" @click="addTrainingAlumni" />
         </div>
      </div>

      <div v-for="(trainingAlumni, index) in form.trainingAlumniList" :key="`trainingAlumni_${index}`"
         class="grid items-center tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div></div>
         <div class="grid grid-cols-[auto_1fr_auto] w-[101%] gap-2 tablet:flex tablet:ml-[-21px] tablet:w-full">
            <span class="mt-[7px]">{{ index + 1 }}.</span>
            <Input class="flex flex-col tablet:w-[306px]" heightClass="h-[38px]" v-model="trainingAlumni.name"
               placeholder="รายชื่อศิษย์เก่า"
               :requireInput="{ showMessage: !trainingAlumni.name, message: 'กรอกข้อมูลไม่ครบถ้วน' }"
               :disabled="actionMode === 'view'" />
            <ButtonMinusIcon v-if="actionMode !== 'view'" class="mt-1"
               @click="setDialogDeleteTrainingAlumni(true, index)" />
         </div>
      </div>

      <div class="grid tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right tablet:mt-2">
            <span>จำนวนแหล่งฝึก&nbsp;(จำนวน)</span>
            <span>&nbsp;:</span>
         </div>
         <Input v-model="form.traingingSiteCount" placeholder="รายละเอียด" class="flex flex-col tablet:w-[306px]"
            heightClass="h-[38px]" type="number" @paste.prevent :disabled="actionMode === 'view'" />
      </div>

      <div class="grid tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right tablet:mt-2">
            <span>ชื่อแหล่งฝึกภาคปฎิบัติ</span>
            <span>&nbsp;:</span>
         </div>
         <Input v-model="form.operationTrainingSiteName" placeholder="รายละเอียด" class="flex flex-col tablet:w-[306px]"
            heightClass="h-[38px]" :disabled="actionMode === 'view'" />
      </div>

      <div class="grid tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right">
            <span>ความพึงพอใจของผู้อบรมที่มีต่อรายวิชาภาคทฤษฏี&nbsp;(ค่าเฉลี่ยรวม)</span>
            <span>&nbsp;:</span>
         </div>
         <Input v-model="form.satisfactionTheoryAvg" placeholder="รายละเอียด" class="flex flex-col tablet:w-[306px]"
            heightClass="h-[38px]" :disabled="actionMode === 'view'" />
      </div>

      <div class="grid tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right">
            <span>ความพึงพอใจของผู้อบรมที่มีต่อรายวิชาภาคปฏิบัติ&nbsp;(ค่าเฉลี่ยรวม)</span>
            <span>&nbsp;:</span>
         </div>
         <Input v-model="form.satisfactionOperationAvg" placeholder="รายละเอียด" class="flex flex-col tablet:w-[306px]"
            heightClass="h-[38px]" :disabled="actionMode === 'view'" />
      </div>

      <div class="grid tablet:grid-cols-[240px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right tablet:mt-2">
            <span>ความพึงพอใจของโครงการ&nbsp;(ค่าเฉลี่ยรวม)</span>
            <span>&nbsp;:</span>
         </div>
         <Input v-model="form.satisfactionOverallAvg" placeholder="รายละเอียด" class="flex flex-col tablet:w-[306px]"
            heightClass="h-[38px]" :disabled="actionMode === 'view'" />
      </div>

      <div v-if="(props.actionMode === 'create' || props.actionMode === 'edit') && form.summaryFiles.length < 3"
         class="grid grid-cols-1 gap-2 tablet:grid-cols-[240px_1fr]">
         <p class="text-sm text-[#333] tablet:text-right tablet:mt-2.5">สรุปผลโครงการ&nbsp;:</p>
         <div class="tablet:whitespace-nowrap">
            <ButtonChooseFile :action="selectFile" />
            <input type="file" accept=".xlsx, .docx, .pdf" id="input_file_registration_fees" multiple class="hidden"
               @change="changeFile" />
         </div>
      </div>
      <div v-if="props.actionMode === 'create' || (props.actionMode === 'edit' && form.summaryFiles.length < 3)"
         class="grid grid-cols-1 gap-2 tablet:grid-cols-[240px_1fr]"></div>
      <div class="grid grid-cols-1 gap-2 tablet:grid-cols-[240px_1fr]"
         :class="[props.actionMode === 'view' && form.summaryFiles.length === 0 ? 'hidden' : 'grid', 'grid-cols-1 gap-2 tablet:grid-cols-[240px_1fr]']">
         <div>
            <p v-if="props.actionMode === 'view' || form.summaryFiles.length === 3"
               class="text-sm md:mt-2 md:text-right">สรุปผลโครงการ&nbsp;:</p>
         </div>
         <div class="space-y-2">
            <div v-for="(file, index) in form?.summaryFiles" :key="file?.fileId"
               class="w-full tablet:w-[306px] rounded-lg bg-gray-200 px-3 py-1 h-[38px] grid justify-between items-center grid-cols-[1fr_25px] gap-x-2">
               <p class="line-clamp-1 text-sm text-primary-500 cursor-pointer"
                  @click="openNewTab(file.link || file.url)">{{ file.filename }}</p>
               <UIcon v-if="props.actionMode === 'create' || props.actionMode === 'edit'" name="i-heroicons-x-mark"
                  class="w-5 h-5 cursor-pointer" @click="setDialogDeleteFile(true, file, index)" />
            </div>
         </div>
      </div>

      <BadgeError v-if="messageError" :action="() => (messageError = '')" :message="messageError" />

      <div class="mt-8 flex flex-wrap gap-2 justify-center">
         <ButtonEdit type="button" v-if="actionMode === 'view'"
            @click="props.btnOpenForm('edit', props.budgetSourceId)" />
         <ButtonSave type="button" v-else @click="submitForm" />
         <ButtonCancel @click="() => setDialogAcademicServicesForm(false)" ref="removeAutoFocus" />
      </div>
   </form>
   <SkeletonForm v-else :count="12" />
   <DialogConfirm :isOpen="isOpenConfirm" :setDialog="setDialogConfirm" title="บันทึกข้อมูล"
      desc="คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่" icon="success" :btnAction="handleAcademicServices" />
   <DialogConfirm :isOpen="isOpenDeleteTrainingAlumni" :setDialog="setDialogDeleteTrainingAlumni" title="ลบข้อมูล"
      desc="คุณต้องการลบข้อมูลนี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก" icon="danger"
      :btnAction="DeleteTrainingAlumni" />
   <DialogConfirm :isOpen="isOpenDeleteFile" :setDialog="setDialogDeleteFile" title="ลบไฟล์"
      desc="คุณต้องการลบไฟล์นี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก" icon="danger"
      :btnAction="fnDeleteFile" />
   <Loading v-if="isLoading" />
</template>

<script setup>
import Input from "~/components/form/input";
import ButtonSave from "~/components/button/save";
import ButtonEdit from "~/components/button/edit";
import ButtonCancel from "~/components/button/cancel";
import BadgeError from "~/components/badge/error";
import DialogConfirm from "~/components/dialog/confirm";
import Textarea from "~/components/form/textarea";
import Datepicker from "~/components/form/datepicker";
import Select from "~/components/form/select";
import ButtonAddIcon from "~/components/button/addIcon";
import ButtonMinusIcon from "~/components/button/minusIcon";
import ButtonChooseFile from "~/components/button/chooseFile";
import SkeletonForm from "~/components/ui/skeleton/form";
import Loading from "~/components/loading.vue";

import useReportAPI from "~/service/api/report";
const { fetchPersonnelShort } = useReportAPI;

import useAcademicAPI from "~/service/api/academic";
const { fetchAcademicServicesById, addAcademicServicesRegister, updateAcademicServicesRegister } = useAcademicAPI;

const toast = useToast();
const props = defineProps({
   isOpen: Boolean,
   setDialogAcademicServicesForm: Function,
   btnOpenForm: Function,
   actionMode: String,
   budgetSourceId: Number,
   academicId: Number,
});

const form = ref({
   budgetSourceId: null,
   dateStart: "",
   dateEnd: "",
   name: "",
   ownerId: null,
   participant: null,
   revenue: null,
   receiveEducationFundCount: null,
   receiveEducationFundAlumniCount: null,
   trainingAlumniList: [],
   traingingSiteCount: null,
   operationTrainingSiteName: "",
   satisfactionOperationAvg: "",
   satisfactionTheoryAvg: "",
   satisfactionOverallAvg: "",

   summaryFiles: [],
   filesDelete: [],
   trainingAlumniListTemp: {
      name: "",
   },
});

const validator = ref({
   dateStart: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   dateEnd: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   name: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   ownerId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   participant: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
});

const validatorTrainingAlumni = ref({
   name: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
      type: "object",
      parentKey: "trainingAlumniListTemp",
   },
});
const resetForm = () => {
   messageError.value = "";
   form.value = {
      budgetSourceId: props.budgetSourceId,
      dateStart: "",
      dateEnd: "",
      name: "",
      ownerId: null,
      participant: null,
      revenue: null,
      receiveEducationFundCount: null,
      receiveEducationFundAlumniCount: null,
      trainingAlumniList: [],
      traingingSiteCount: null,
      operationTrainingSiteName: "",
      satisfactionOperationAvg: "",
      satisfactionTheoryAvg: "",
      satisfactionOverallAvg: "",

      summaryFiles: [],
      filesDelete: [],
      trainingAlumniListTemp: {
         name: "",
      },
   };
   validator.value = {
      dateStart: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      dateEnd: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      name: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      ownerId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      participant: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
   };

   validatorTrainingAlumni.value = {
      name: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
         type: "object",
         parentKey: "trainingAlumniListTemp",
      },
   };

   revenue.value = null;
};
const isFirstRender = ref(false);
const removeAutoFocus = ref(null);
const isLoading = ref(false);
const isFormLoading = ref(false);
const filtersPersonnelShort = ref({
   keyword: "",
   offset: 0,
   max: -1,
});

const personnelShortList = ref([]);
const budgetYear = ref("");
const educationYear = ref("");

onMounted(() => {
   resetForm();
   getData();
});

watch(
   () => form.value.ownerId,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "ownerId" });
   }
);

watch(
   () => form.value.dateStart,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "dateStart" });
      if (newData && form.value.dateEnd) {
         const start = new Date(genTextDate({ date: newData, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }));
         const end = new Date(genTextDate({ date: form.value.dateEnd, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }));

         if (start.getTime() > end.getTime() && isFirstRender.value === false) {
            form.value.dateEnd = newData;
         }
      }
      budgetYear.value = calBudgetYear(newData);
      educationYear.value = calEducationYear(newData);

      if (!form.value.dateEnd) {
         const today = new Date();
         const currentMonth = today.getMonth() + 1;
         const currentBuddhistYear = today.getFullYear() + 543

         const newDataMonth = parseInt(newData.split("/")[1]);
         const newDataYear = parseInt(newData.split("/")[2]);

         if (newDataYear > currentBuddhistYear) {
            form.value.dateEnd = newData
            setTimeout(() => {
               form.value.dateEnd = ""
            }, 10)
            return
         }

         if (currentBuddhistYear === newDataYear && newDataMonth > currentMonth) {
            form.value.dateEnd = newData
            setTimeout(() => {
               form.value.dateEnd = ""
            }, 10)
         }
      }
   }
);

watch(
   () => form.value.dateEnd,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "dateEnd" });
   }
);

const getData = () => {
   isFirstRender.value = true;
   isFormLoading.value = true;

   Promise.all([
      props?.actionMode === "edit" || props?.actionMode === "view" ? fetchAcademicServicesById(props.academicId) : Promise.resolve(),
      fetchPersonnelShort(filtersPersonnelShort.value),
   ]).then((res) => {
      if (props?.actionMode === "edit" || props?.actionMode === "view") {
         if (res[0]?.code === 20000) {
            form.value = {
               ...res[0].responseObject.academic,
               participant: res[0].responseObject.academic.participant ? res[0].responseObject.academic.participant : "",
               receiveEducationFundCount: res[0].responseObject.academic.receiveEducationFundCount ? res[0].responseObject.academic.receiveEducationFundCount : "",
               traingingSiteCount: res[0].responseObject.academic.traingingSiteCount ? res[0].responseObject.academic.traingingSiteCount : "",
               filesDelete: [],
               trainingAlumniListTemp: {
                  name: "",
               },
            };
            revenue.value = form.value.revenue ? form.value.revenue : "";
         }
      }
      if (res[1]?.code === 20000) {
         personnelShortList.value = res[1].responseObject.personnels;
      }
      isFormLoading.value = false;
      setTimeout(() => {
         isFirstRender.value = false;
      }, 100);
   });
};

const addTrainingAlumni = () => {
   setTimeout(async () => {
      const fail = validatorForm(form.value, validatorTrainingAlumni.value);
      if (fail.length == 0) {
         form.value.trainingAlumniList.push(form.value.trainingAlumniListTemp);
         form.value.trainingAlumniListTemp = {
            name: "",
         };
      }
   }, 100);
};

const handleAcademicServices = async () => {
   isLoading.value = true;
   form.value = {
      ...form.value,
      revenue: revenue.value,
   };
   const res = props.actionMode === "create" ? await addAcademicServicesRegister(form.value) : await updateAcademicServicesRegister(props?.academicId, form.value);
   if (res?.code === 20000) {
      setDialogConfirm(false);
      props.setDialogAcademicServicesForm(false, "refresh");
      toast.add({ title: res?.message, color: "green" });
   } else {
      toast.add({ title: res?.message, color: "red" });
   }
   isLoading.value = false;
};

const isOpenConfirm = ref(false);
const setDialogConfirm = (status) => {
   isOpenConfirm.value = status;
};

const isOpenDeleteTrainingAlumni = ref(false);
let indexTrainingAlumni = null;
const setDialogDeleteTrainingAlumni = (status, index) => {
   isOpenDeleteTrainingAlumni.value = status;
   indexTrainingAlumni = index;
};
const DeleteTrainingAlumni = () => {
   form.value.trainingAlumniList.splice(indexTrainingAlumni, 1);
   setDialogDeleteTrainingAlumni(false, null);
};

const submitForm = () => {
   setTimeout(() => {
      const fail = validatorForm(form.value, validator.value);

      if (form.value.trainingAlumniList.length > 0) {
         const checkTrainingAlumniList = form.value.trainingAlumniList.map((i) => Object.values(i).every((i) => i)).every((x) => x);
         if (!checkTrainingAlumniList) {
            fail.push("trainingAlumniList");
         }
      }

      if (fail.length == 0) {
         setDialogConfirm(true);
         messageError.value = "";
      } else {
         messageError.value = "กรุณากรอกข้อมูลให้ครบถ้วน";
      }
   }, 100);
};

const messageError = ref("");

const clearRequireOnChange = (validator, options) => {
   if (validator[options.key]) {
      let isShow = null;
      if (options.value) {
         isShow = false;
      }
      validator[options.key].showMessage = isShow;
   }
};

const isOpenDeleteFile = ref(false);
const fileItem = ref(null);
const setDialogDeleteFile = (status, file, fileIndex) => {
   isOpenDeleteFile.value = status;
   fileItem.value = { ...file, fileIndex };
};

const fnDeleteFile = () => {
   form.value.summaryFiles.splice(fileItem.value?.fileIndex, 1);
   form.value.filesDelete.push({ fileId: fileItem.value?.fileId, add: false, delete: true });
   setDialogDeleteFile(false);
};

const selectFile = () => {
   document.getElementById("input_file_registration_fees").click();
};

const changeFile = async (e) => {
   if (e.target.files.length) {
      isLoading.value = true;
      for (let i = 0; i < e.target.files.length; i++) {
         if (form.value.summaryFiles.length === 3) {
            isLoading.value = false;
            toast.add({ title: "อัปโหลดได้ 3 ไฟล์เท่านั้น ไฟล์ที่เกินมาจะไม่ถูกอัปโหลด", color: "red" });
            return;
         }
         const res = await uploadFile(e.target.files[i]);
         if (res) {
            form.value.summaryFiles.push({ fileId: res.fileId, add: true, delete: false, filename: res.fileName, link: res.url });
         }
         if (e.target.files.length - 1 == i) {
            isLoading.value = false;
            document.getElementById("input_file_registration_fees").value = "";
         }
      }
   }
};

const revenue = ref("");
const genInputDecimal = (event, type) => {
   const ele = event.target;
   const decimal = parseInt(ele.getAttribute("data-decimal")) || 0;
   const val = ele.value;

   if (!isNaN(decimal)) {
      if (decimal > 0) {
         const splitVal = val.split(".");
         if (val && type === "revenue") {
            revenue.value = parseFloat(revenue.value.toFixed(2));
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
