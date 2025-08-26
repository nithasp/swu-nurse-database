<template>
   <UModal
      :modelValue="isOpen"
      :ui="{
         container: 'items-center',
         width: 'min-w-[95%] md:min-w-[950px]',
         rounded: 'rounded-3xl',
      }"
      :initialFocus="removeAutoFocus"
   >
      <div class="p-6">
         <p class="text-primary-500 text-xl">{{ actionMode == "edit" ? "แก้ไข" : actionMode == "create" ? "เพิ่ม" : "" }}ข้อมูลการฝึกอบรม</p>
         <div class="h-[1px] bg-primary-500 mt-2 mb-8"></div>
         <form v-if="!loadingForm" class="grid grid-cols-1 tablet:grid-cols-none justify-center gap-y-3 tablet:gap-2">
            <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">ปีการศึกษา<span class="text-red-500"> *</span> :</p>
               <div class="tablet:w-[310px]">
                  <Select
                     v-model="form.educationYearId"
                     :required="true"
                     :options="educationYearList"
                     attributeValue="id"
                     attributeOption="nameTh"
                     :requireInput="{ showMessage: validator.educationYearId?.showMessage, message: validator.educationYearId?.message }"
                     :disabled="actionMode == 'view'"
                  />
               </div>
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">วันที่ได้รับการอบรม<span class="text-red-500"> *</span> :</p>
               <div class="flex items-center tablet:items-start tablet:w-[310px] flex-col tablet:flex-row gap-y-2">
                  <Datepicker
                     inputId="dateTrainingStart"
                     v-model="form.dateTrainingStart"
                     placeholder="วัน/เดือน/ปี"
                     inputHeight="h-[38px]"
                     class="w-full tablet:w-auto"
                     :requireInput="{ showMessage: validator.dateTrainingStart?.showMessage, message: validator.dateTrainingStart?.message }"
                     :disabled="actionMode == 'view'"
                  />
                  <span class="px-1.5 hidden tablet:block mt-0 tablet:mt-2">-</span>
                  <Datepicker
                     inputId="dateTrainingEnd"
                     v-model="form.dateTrainingEnd"
                     placeholder="วัน/เดือน/ปี"
                     inputHeight="h-[38px]"
                     class="w-full tablet:w-auto"
                     :requireInput="{ showMessage: validator.dateTrainingEnd?.showMessage, message: validator.dateTrainingEnd?.message }"
                     :minDate="form.dateTrainingStart"
                     :disabled="actionMode == 'view'"
                  />
               </div>
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">เวลาอบรม<span class="text-red-500"> *</span> :</p>
               <Input
                  placeholder="เวลาอบรม"
                  class="flex flex-col tablet:w-[310px]"
                  v-model="form.duration"
                  heightClass="h-[38px]"
                  :requireInput="{ showMessage: validator.duration?.showMessage, message: validator.duration?.message }"
                  :disabled="actionMode == 'view'"
                  @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'duration' })"
               />
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">หลักสูตรการอบรม<span class="text-red-500"> *</span> :</p>
               <Input
                  placeholder="หลักสูตรการอบรม"
                  class="flex flex-col tablet:w-[310px]"
                  v-model="form.course"
                  heightClass="h-[38px]"
                  :requireInput="{ showMessage: validator.course?.showMessage, message: validator.course?.message }"
                  :disabled="actionMode == 'view'"
                  @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'course' })"
               />
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">ค่าใช้จ่ายในการอบรม<span class="text-red-500"> *</span> :</p>
               <div class="tablet:w-[310px]">
                  <Select
                     v-model="form.trainingPaymentTypeId"
                     :options="trainingPaymentTypeList"
                     attributeValue="id"
                     attributeOption="name"
                     :requireInput="{ showMessage: validator.trainingPaymentTypeId?.showMessage, message: validator.trainingPaymentTypeId?.message }"
                     :disabled="actionMode == 'view'"
                  />
               </div>
            </div>
            <div v-if="form.trainingPaymentTypeId === 1" class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">จำนวนเงิน (บาท) :</p>
               <div class="tablet:w-[310px]">
                  <Input
                     v-model="form.trainingPayment"
                     placeholder="จำนวนเงิน (บาท)"
                     class="flex flex-col tablet:w-[310px]"
                     heightClass="h-[38px]"
                     type="number"
                     @paste.prevent
                     :disabled="actionMode == 'view'"
                  />
               </div>
            </div>
            <div v-if="actionMode != 'view' && form.files.length < 3" class="grid tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right tablet:mt-2.5">แนบไฟล์ :</p>
               <div>
                  <ButtonChooseFile :action="selectFile" />
                  <input type="file" accept=".xlsx, .docx, .pdf" id="input_file_training" multiple class="hidden" @change="changeFile" />
               </div>
            </div>
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
                     <UIcon v-if="actionMode != 'view'" name="i-heroicons-x-mark" class="w-5 h-5 cursor-pointer" @click="setDialogDeleteFile(true, index)" />
                  </div>
               </div>
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">ปีงบประมาณ<span class="text-red-500"> *</span> :</p>
               <div class="tablet:w-[310px]">
                  <Select
                     v-model="form.budgetYearId"
                     :options="budgetYearListList"
                     attributeValue="id"
                     attributeOption="name"
                     :requireInput="{ showMessage: validator.budgetYearId?.showMessage, message: validator.budgetYearId?.message }"
                     :disabled="actionMode == 'view'"
                  />
               </div>
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">หัวข้อการเข้าร่วมอบรมกลุ่ม<span class="text-red-500"> *</span> :</p>
               <Input
                  placeholder="หัวข้อการเข้าร่วมอบรมกลุ่ม"
                  class="flex flex-col tablet:w-[310px]"
                  v-model="form.subject"
                  heightClass="h-[38px]"
                  :requireInput="{ showMessage: validator.subject?.showMessage, message: validator.subject?.message }"
                  :disabled="actionMode == 'view'"
                  @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'subject' })"
               />
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">ประเภทการฝึกอบรม<span class="text-red-500"> *</span> :</p>
               <div class="tablet:w-[310px]">
                  <Select
                     v-model="form.trainingTypeId"
                     :options="trainingTypeList"
                     attributeValue="id"
                     attributeOption="name"
                     :requireInput="{ showMessage: validator.trainingTypeId?.showMessage, message: validator.trainingTypeId?.message }"
                     :disabled="actionMode == 'view'"
                  />
               </div>
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">สถาบัน<span class="text-red-500"> *</span> :</p>
               <Input
                  placeholder="สถาบัน"
                  class="flex flex-col tablet:w-[310px]"
                  v-model="form.institution"
                  heightClass="h-[38px]"
                  :requireInput="{ showMessage: validator.institution?.showMessage, message: validator.institution?.message }"
                  :disabled="actionMode == 'view'"
                  @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'institution' })"
               />
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">สถานที่ :</p>
               <Input placeholder="สถานที่" class="flex flex-col tablet:w-[310px]" v-model="form.location" heightClass="h-[38px]" :disabled="actionMode == 'view'" />
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[180px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">วิทยากร :</p>
               <Input placeholder="วิทยากร" class="flex flex-col tablet:w-[310px]" v-model="form.lecturer" heightClass="h-[38px]" :disabled="actionMode == 'view'" />
            </div>
            <div class="my-2">
               <p class="text-sm mb-3">ความสอดคล้องหรือการตอบสนองวิสัยทัศน์/พันธกิจ/ บทบาทหน้าที่<span class="text-red-500"> *</span> :</p>
               <div
                  class="grid grid-cols-1 sm:grid-cols-[repeat(2,150px)] md:grid-cols-[repeat(3,150px)] tablet:grid-cols-[repeat(4,150px)] gap-x-3 gap-y-3 tablet:gap-y-3.5"
               >
                  <Checkbox label="วิสัยทัศน์" v-model="form.matchGuideline.vision" :disabled="actionMode == 'view'" />
                  <Checkbox label="การพยาบาล" v-model="form.matchGuideline.nurse" :disabled="actionMode == 'view'" />
                  <Checkbox label="การเรียนการสอน" v-model="form.matchGuideline.teaching" :disabled="actionMode == 'view'" />
                  <Checkbox label="วิจัย" v-model="form.matchGuideline.research" :disabled="actionMode == 'view'" />
                  <Checkbox label="บริการวิชาการ" v-model="form.matchGuideline.academic" :disabled="actionMode == 'view'" />
                  <Checkbox label="งานประจำ" v-model="form.matchGuideline.profession" :disabled="actionMode == 'view'" />
                  <Checkbox label="การบริหาร" v-model="form.matchGuideline.management" :disabled="actionMode == 'view'" />
                  <div class="grid grid-cols-[75px_200px]">
                     <Checkbox label="อื่นๆ" v-model="form.matchGuideline.other" :disabled="actionMode == 'view'" @change="form.matchGuideline.otherRemark = ''" />
                     <Input
                        v-if="form.matchGuideline.other"
                        placeholder="อื่นๆ"
                        v-model="form.matchGuideline.otherRemark"
                        heightClass="h-[38px]"
                        :disabled="actionMode == 'view'"
                        :requireInput="{ showMessage: validatorCheckbox.otherRemark?.showMessage, message: validatorCheckbox.otherRemark?.message }"
                     />
                  </div>
               </div>
            </div>
            <div class="flex items-center mt-0.5 mb-2" v-if="validatorCheckbox.matchGuideline?.showMessage">
               <label class="text-error-500 text-sm">{{ validatorCheckbox.matchGuideline?.message }}</label>
            </div>
            <div>
               <p class="text-sm mb-1 tablet:mb-3">วัตถุประสงค์ของการฝึกอบรม (สัมมนา) ดูงาน ภายนอก<span class="text-red-500"> *</span> :</p>
               <div class="tablet:w-[550px]">
                  <Textarea
                     v-model="form.objective"
                     rows="3"
                     :requireInput="{ showMessage: validator.objective?.showMessage, message: validator.objective?.message }"
                     :disabled="actionMode == 'view'"
                     @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'objective' })"
                  />
               </div>
            </div>
            <div>
               <p class="text-sm mb-1 tablet:mb-3">หัวข้อรายละเอียดในการอบรม/สัมมนา กิจกรรมในการดูงาน<span class="text-red-500"> *</span> :</p>
               <div class="tablet:w-[550px]">
                  <Textarea
                     v-model="form.detail"
                     rows="3"
                     :requireInput="{ showMessage: validator.detail?.showMessage, message: validator.detail?.message }"
                     :disabled="actionMode == 'view'"
                     @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'detail' })"
                  />
               </div>
            </div>
            <div>
               <p class="text-sm mb-1 tablet:mb-3">สรุปเนื้อหาความรู้ที่ได้รับจากการอบรม/สัมมนาครั้งนี้<span class="text-red-500"> *</span> :</p>
               <div class="tablet:w-[550px]">
                  <Textarea
                     v-model="form.summary"
                     rows="3"
                     :requireInput="{ showMessage: validator.summary?.showMessage, message: validator.summary?.message }"
                     :disabled="actionMode == 'view'"
                     @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'summary' })"
                  />
               </div>
            </div>
            <div>
               <p class="text-sm mb-1 tablet:mb-3">การนำความรู้ที่ได้รับจากการอบรม/สัมมนาครั้งนี้ไปใช้ในการปฏิบัติงาน<span class="text-red-500"> *</span> :</p>
               <div class="tablet:w-[550px]">
                  <Textarea
                     v-model="form.apply"
                     rows="3"
                     :requireInput="{ showMessage: validator.apply?.showMessage, message: validator.apply?.message }"
                     :disabled="actionMode == 'view'"
                     @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'apply' })"
                  />
               </div>
            </div>
            <div>
               <p class="text-sm mb-1 tablet:mb-3">
                  ประเมินผลความสำเร็จของการนำความรู้ที่ได้รับจากการอบรม/สัมมนาครั้งนี้ไปใช้<span class="text-red-500"> *</span> :
               </p>
               <div class="tablet:w-[550px]">
                  <Textarea
                     v-model="form.evaluation"
                     rows="3"
                     :requireInput="{ showMessage: validator.evaluation?.showMessage, message: validator.evaluation?.message }"
                     :disabled="actionMode == 'view'"
                     @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'evaluation' })"
                  />
               </div>
            </div>
            <div>
               <p class="text-sm mb-1 tablet:mb-3">
                  แนวทางการปรับปรุงแก้ไขจากผลการประเมินความสำเร็จของการนำความรู้ที่ได้รับจากการอบรม/สัมมนาครั้งนี้ไปใช้<span class="text-red-500"> *</span> :
               </p>
               <div class="tablet:w-[550px]">
                  <Textarea
                     v-model="form.suggestion"
                     rows="3"
                     :requireInput="{ showMessage: validator.suggestion?.showMessage, message: validator.suggestion?.message }"
                     :disabled="actionMode == 'view'"
                     @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'suggestion' })"
                  />
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
import BadgeError from "~/components/badge/error";
import DialogConfirm from "~/components/dialog/confirm";
import SkeletonForm from "~/components/ui/skeleton/form";
import usePersonnelTrainingAPI from "~/service/api/personnel/training";
const { fetchPersonnelTraining, addPersonnelTraining, updatePersonnelTraining } = usePersonnelTrainingAPI;
import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchEducationYearList, fetchTrainingPaymentTypeList, fetchBudgetYearList, fetchTrainingTypeList } = useMasterDataAPI;

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
   matchGuideline: {},
   files: [],
});
const validator = ref({});
const validatorCheckbox = ref({});
const resetForm = () => {
   messageError.value = "";
   form.value = {
      educationYearId: "",
      dateTrainingStart: "",
      dateTrainingEnd: "",
      duration: "",
      course: "",
      trainingPaymentTypeId: "",
      files: [],
      filesDelete: [],
      budgetYearId: "",
      subject: "",
      trainingTypeId: "",
      institution: "",
      location: "",
      lecturer: "",
      matchGuideline: {
         vision: false,
         nurse: false,
         teaching: false,
         research: false,
         academic: false,
         profession: false,
         management: false,
         other: false,
         otherRemark: "",
      },
      objective: "",
      detail: "",
      summary: "",
      apply: "",
      evaluation: "",
      suggestion: "",
      trainingPayment: ""
   };
   validator.value = {
      educationYearId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      dateTrainingStart: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      dateTrainingEnd: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      duration: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      course: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      trainingPaymentTypeId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      budgetYearId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      subject: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      trainingTypeId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      institution: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      objective: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      detail: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      summary: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      apply: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      evaluation: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      suggestion: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
   };
   validatorCheckbox.value = {
      matchGuideline: {
         type: "checkbox",
         childKey: ["vision", "nurse", "teaching", "research", "academic", "profession", "management", "other"],
         message: "จำเป็นต้องเลือกอย่างน้อย 1 รายการ",
         showMessage: false,
      },
   };
};

watch(
   () => props.isOpen,
   (newData) => {
      if (newData == true) {
         //master data
         getEducationYearList();
         getTrainingPaymentTypeList();
         getBudgetYearList();
         getTrainingTypeList();

         resetForm();

         if (props.id) {
            getDataById();
         }
      }
   }
);

let isMounted = true;
const getDataById = async () => {
   loadingForm.value = true;
   const res = await fetchPersonnelTraining(props.personnelId, props.id);
   loadingForm.value = false;
   if (res.code == 20000) {
      form.value = {
         ...res.responseObject,
         trainingPayment: res.responseObject.trainingPayment || ""
      };
      form.value.files = res.responseObject.files || [];
      form.value.filesDelete = [];
      isMounted = false;
   }
};

const educationYearList = ref([]);
const getEducationYearList = async () => {
   const res = await fetchEducationYearList();
   if (res.code == 20000) {
      educationYearList.value = res.responseObject.educationYearList;
   }
};

const trainingPaymentTypeList = ref([]);
const getTrainingPaymentTypeList = async () => {
   const res = await fetchTrainingPaymentTypeList();
   if (res.code == 20000) {
      trainingPaymentTypeList.value = res.responseObject.trainingPaymentTypeList;
   }
};

const budgetYearListList = ref([]);
const getBudgetYearList = async () => {
   const res = await fetchBudgetYearList();
   if (res.code == 20000) {
      budgetYearListList.value = res.responseObject.budgetYearList;
   }
};

const trainingTypeList = ref([]);
const getTrainingTypeList = async () => {
   const res = await fetchTrainingTypeList();
   if (res.code == 20000) {
      trainingTypeList.value = res.responseObject.trainingTypeList;
   }
};

const selectFile = () => {
   document.getElementById("input_file_training").click();
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
            document.getElementById("input_file_training").value = "";
         }
      }

      if (alertMaxFile) {
         const toast = useToast();
         toast.add({ title: "อัปโหลดได้ 3 ไฟล์เท่านั้น ไฟล์ที่เกินมาจะไม่ถูกอัปโหลด", color: "red" });
      }
   }
};

const messageError = ref("");
const submitForm = async () => {
   setTimeout(() => {
      const fail = validatorForm(form.value, validator.value);
      const failCheckbox = validatorFormCheckbox(form.value, validatorCheckbox.value);
      if (fail.length == 0 && failCheckbox.length == 0) {
         setDialogConfirm(true);
         messageError.value = "";
      } else {
         messageError.value = "โปรดกรอกข้อมูลให้ครบถ้วน";
      }
   }, 100);
};

const validatorFormCheckbox = (form, validator) => {
   const fail = [];
   for (const key in validator) {
      if (validator[key].type == "checkbox") {
         const isChecked = [];
         for (const checkboxKey of validator[key].childKey) {
            if (form[key][checkboxKey]) {
               isChecked.push(checkboxKey);
            }
         }
         if (isChecked.length) {
            const found = isChecked.find((val) => val == "other");
            if (found) {
               validator.otherRemark = {
                  showMessage: false,
                  message: "กรอกข้อมูลไม่ครบถ้วน",
               };
               if (!form[key].otherRemark) {
                  validator.otherRemark.showMessage = true;
                  fail.push(key);
               }
            }
            validator[key].showMessage = false;
         } else {
            fail.push(key);
            validator[key].showMessage = true;
         }
      }
   }
   return fail;
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
   const res = await addPersonnelTraining(props.personnelId, form.value);
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
   const res = await updatePersonnelTraining(props.personnelId, form.value);
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
   () => form.value.educationYearId,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "educationYearId" });
   }
);

watch(
   () => form.value.dateTrainingStart,
   (newData) => {
      if (checkFormatDD_MM_YYYY(newData) && checkFormatDD_MM_YYYY(form.value.dateTrainingEnd)) {
         if (newData && form.value.dateTrainingEnd) {
            const start = new Date(genTextDate({ date: newData, oldFormat: "DD/MM/YYYY", isBuddhistYear: true }));
            const end = new Date(genTextDate({ date: form.value.dateTrainingEnd, oldFormat: "DD/MM/YYYY", isBuddhistYear: true }));
            if (start.getTime() > end.getTime()) {
               form.value.dateTrainingEnd = newData;
            }
         }
      }
      clearRequireOnChange(validator.value, { value: newData, key: "dateTrainingStart" });
   }
);

watch(
   () => form.value.dateTrainingEnd,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "dateTrainingEnd" });
   }
);

watch(
   () => form.value.budgetYearId,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "budgetYearId" });
   }
);

watch(
   () => form.value.trainingTypeId,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "trainingTypeId" });
   }
);

watch(
   () => form.value.trainingPaymentTypeId,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "trainingPaymentTypeId" });
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

watch(
   () => form.value.matchGuideline.otherRemark,
   (newData) => {
      clearRequireOnChange(validatorCheckbox.value, { value: newData, key: "otherRemark" });
   }
);
</script>
