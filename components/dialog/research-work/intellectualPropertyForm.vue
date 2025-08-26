<template>
   <UModal
      :modelValue="isOpen"
      :ui="{
         container: 'items-center',
         width: 'min-w-[95%] tablet:min-w-[950px]',
         rounded: 'rounded-3xl',
      }"
      :initialFocus="removeAutoFocus"
   >
      <div class="p-6">
         <p class="text-primary-500 text-xl">{{ actionMode == "edit" ? "แก้ไข" : actionMode == "create" ? "เพิ่ม" : "" }}ทรัพย์สินทางปัญญา</p>
         <div class="h-[1px] bg-primary-500 mt-2 mb-8"></div>
         <form v-if="!loadingForm" class="grid grid-cols-1 tablet:grid-cols-none justify-center gap-y-3 tablet:gap-2">
            <div class="grid items-center tablet:items-start tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">วันที่ได้รับการคุ้มครอง<span class="text-red-500"> *</span> :</p>
               <div class="tablet:w-[310px]">
                  <Datepicker
                     inputId="datePublish"
                     v-model="form.datePublish"
                     placeholder="วัน/เดือน/ปี"
                     inputHeight="h-[38px]"
                     class="w-full tablet:w-auto"
                     :requireInput="{ showMessage: validator.datePublish?.showMessage, message: validator.datePublish?.message }"
                     :disabled="actionMode == 'view'"
                  />
               </div>
            </div>
            <div class="grid items-center tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right">ปีงบประมาณ :</p>
               <Input class="flex flex-col tablet:w-[310px]" heightClass="h-[38px]" disabled :value="budgetYear" />
            </div>
            <div class="grid items-center tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right">ปีการศึกษา :</p>
               <Input class="flex flex-col tablet:w-[310px]" heightClass="h-[38px]" disabled :value="educationYear" />
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">ชื่อเจ้าของผลงาน<span class="text-red-500"> *</span> :</p>
               <div class="flex gap-2 flex-wrap">
                  <Select
                     class="w-full tablet:w-[190px]"
                     v-model="form.leader.personnelType"
                     :options="personnelInExternalList"
                     attributeValue="id"
                     attributeOption="typeTh"
                     placeholder="บุคลากรภายใน/นอก"
                     :requireInput="{ showMessage: validator.personnelType?.showMessage, message: validator.personnelType?.message }"
                     :disabled="actionMode == 'view'"
                  />
                  <Select
                     class="w-full tablet:w-[140px]"
                     v-model="form.leader.prefix"
                     :options="prefixList"
                     attributeValue="id"
                     attributeOption="nameTh"
                     placeholder="คำนำหน้าชื่อ"
                     searchablePlaceholder="ค้นหาคำนำหน้าชื่อ"
                     :requireInput="{ showMessage: validator.prefix?.showMessage, message: validator.prefix?.message }"
                     :disabled="actionMode == 'view'"
                  />
                  <Select
                     v-if="showLeaderNameMaster"
                     class="w-full tablet:w-[200px]"
                     v-model="form.leader.userId"
                     :options="membersOfLeaderList"
                     attributeValue="id"
                     attributeOption="name"
                     placeholder="-- เลือก --"
                     searchablePlaceholder="ค้นหาหัวหน้าโครงการวิจัย"
                     :requireInput="{ showMessage: validator.userId?.showMessage, message: validator.userId?.message }"
                     :disabled="actionMode == 'view'"
                  />
                  <Input
                     v-else
                     v-model="form.leader.leaderName"
                     placeholder="ชื่อ"
                     class="w-full tablet:w-[200px]"
                     heightClass="h-[38px]"
                     @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'leaderName' })"
                     :requireInput="{ showMessage: validator.leaderName?.showMessage, message: validator.leaderName?.message }"
                     :disabled="actionMode == 'view'"
                  />
               </div>
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">ชื่อผู้ร่วมผลงาน :</p>
               <div class="flex gap-2 flex-wrap">
                  <Select
                     class="w-full tablet:w-[190px]"
                     v-model="form.memberTemp.personnelType"
                     :options="personnelInExternalList"
                     attributeValue="id"
                     attributeOption="typeTh"
                     placeholder="บุคลากรภายใน/นอก"
                     :requireInput="{ showMessage: validatorMember.personnelType?.showMessage, message: validatorMember.personnelType?.message }"
                     :disabled="actionMode == 'view'"
                  />
                  <Select
                     class="w-full tablet:w-[140px]"
                     v-model="form.memberTemp.positionId"
                     :options="positionList"
                     attributeValue="id"
                     attributeOption="name"
                     placeholder="คำนำหน้าชื่อ"
                     searchablePlaceholder="ค้นหาคำนำหน้าชื่อ"
                     :requireInput="{ showMessage: validatorMember.positionId?.showMessage, message: validatorMember.positionId?.message }"
                     :disabled="actionMode == 'view'"
                  />
                  <div :class="[actionMode == 'view' ? 'grid-cols-1' : 'grid-cols-[1fr_30px]', 'grid tablet:grid-cols-[200px_30px] gap-x-2 w-full tablet:w-auto']">
                     <Select
                        v-if="showMemberNameMaster"
                        class="w-full tablet:w-[200px]"
                        v-model="form.memberTemp.userId"
                        :options="membersList"
                        attributeValue="id"
                        attributeOption="name"
                        placeholder="-- เลือก --"
                        searchablePlaceholder="ค้นหาผู้ร่วมโครงการวิจัย"
                        :requireInput="{ showMessage: validatorMember.userId?.showMessage, message: validatorMember.userId?.message }"
                        :disabled="actionMode == 'view'"
                     />
                     <Input
                        v-else
                        placeholder="ชื่อ"
                        class="w-full tablet:w-[200px]"
                        heightClass="h-[38px]"
                        v-model="form.memberTemp.name"
                        :requireInput="{ showMessage: validatorMember.name?.showMessage, message: validatorMember.name?.message }"
                     />
                     <ButtonAddIcon v-if="actionMode != 'view'" class="mt-1" @click="btnAddMember" />
                  </div>
               </div>
            </div>
            <div v-for="(member, index) in form.members" :key="`${index}_member`" class="grid items-center tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right">{{ formatCurrency(index + 1) }} :</p>
               <div class="flex gap-2 flex-wrap">
                  <Input class="flex flex-col w-full tablet:w-[140px]" heightClass="h-[38px]" disabled :value="getNamePersonnelInExternal(member.personnelType)" />
                  <Select
                     class="w-full tablet:w-[140px]"
                     v-model="form.members[index].positionId"
                     :options="positionList"
                     attributeValue="id"
                     attributeOption="name"
                     placeholder="คำนำหน้าชื่อ"
                     searchablePlaceholder="ค้นหาคำนำหน้าชื่อ"
                     :disabled="actionMode == 'view'"
                  />
                  <div
                     :class="[
                        actionMode == 'view' ? 'grid-cols-1' : 'grid-cols-[1fr_30px]',
                        'grid tablet:grid-cols-[250px_30px] gap-x-2 items-center w-full tablet:w-auto',
                     ]"
                  >
                     <Input class="flex flex-col w-full tablet:w-[250px]" heightClass="h-[38px]" disabled :value="member.name" />
                     <ButtonMinusIcon v-if="actionMode != 'view'" @click="setDialogDeleteMember(true, index)" />
                  </div>
               </div>
            </div>
            <div class="grid items-center tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right">ประเภทสิ่งประดิษฐ์ <span class="text-red-500"> *</span> :</p>
               <Select
                  class="w-full tablet:w-[310px]"
                  v-model="form.fundingId"
                  :options="inventionTypeList"
                  attributeValue="id"
                  attributeOption="name"
                  placeholder="-- เลือก --"
                  searchablePlaceholder="ค้นหาประเภทสิ่งประดิษฐ์"
                  :disabled="actionMode == 'view'"
               />
            </div>
            <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-2">ชื่อผลงาน <span class="text-red-500" v-if="actionMode != 'view'"> *</span> :</p>
               <Textarea
                  v-model="form.name"
                  placeholder="ชื่อผลงาน"
                  rows="3"
                  class="tablet:w-[310px]"
                  :requireInput="{ showMessage: validator.name?.showMessage, message: validator.name?.message }"
                  :disabled="actionMode == 'view'"
                  @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'name' })"
               />
            </div>
            <div class="grid items-center tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right">เลขที่คำขอ <span class="text-red-500"> *</span> :</p>
               <Input
                  placeholder="เลขที่คำขอ"
                  class="flex flex-col tablet:w-[310px]"
                  v-model="form.contractNumber"
                  heightClass="h-[38px]"
                  :disabled="actionMode == 'view'"
                  type="number"
                  @paste.prevent
                  :isNumberOnly="true"
               />
            </div>
            <div class="grid items-center tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right">ระยะเวลาคุ้มครอง <span class="text-red-500"> *</span> :</p>
               <Input
                  placeholder="ระยะเวลาคุ้มครอง"
                  class="flex flex-col tablet:w-[310px]"
                  v-model="form.budgetSponser"
                  heightClass="h-[38px]"
                  :disabled="actionMode == 'view'"
                  type="number"
                  @paste.prevent
                  :isNumberOnly="true"
               />
            </div>
            <div v-if="actionMode != 'view' && form.files.length < 3" class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right tablet:mt-2.5">เอกสารแนบประกอบ :</p>
               <div>
                  <ButtonChooseFile :action="selectFile" />
                  <input type="file" accept=".xlsx, .docx, .pdf" id="input_file" multiple class="hidden" @change="changeFile" />
               </div>
            </div>
            <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <div>
                  <p v-if="actionMode == 'view' || form.files.length == 3" class="text-sm tablet:text-right tablet:mt-2">เอกสารแนบประกอบ :</p>
               </div>
               <div class="flex flex-wrap gap-2">
                  <div
                     v-for="(file, index) in form.files"
                     :key="file.fileId"
                     :class="[
                        actionMode == 'view' ? 'grid-cols-1' : 'grid-cols-[1fr_25px]',
                        'w-full tablet:w-[310px] rounded-lg bg-gray-200 px-3 py-1 h-[38px] grid justify-between items-center gap-x-2',
                     ]"
                  >
                     <p class="line-clamp-1 text-sm">{{ file.filename }}</p>
                     <UIcon v-if="actionMode != 'view'" name="i-heroicons-x-mark" class="w-5 h-5 cursor-pointer" @click="setDialogDeleteFile(true, index)" />
                  </div>
               </div>
            </div>

            <BadgeError v-if="messageError" :action="() => (messageError = '')" :message="messageError" />

            <div class="mt-8 flex flex-wrap gap-2 justify-center">
               <ButtonEdit type="button" v-if="actionMode == 'view'" @click="btnOpenForm('edit')" />
               <ButtonSave type="button" v-else @click="submitForm" />
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
      :isOpen="isOpenDeleteMember"
      :setDialog="setDialogDeleteMember"
      title="ลบข้อมูล"
      desc="คุณต้องการลบข้อมูลนี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก"
      icon="danger"
      :btnAction="fnDeleteMember"
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

import useIntellectualPropertyAPI from "~/service/api/researches/intellectualProperty";
const { fetchIntellectualProperty, addIntellectualProperty, updateIntellectualProperty } = useIntellectualPropertyAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchPersonnelInExternalList, fetchPrefixList, fetchPositionList, fetchMembersList, fetchFundingList, fetchInventionTypeList } = useMasterDataAPI;

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
   datePublish: "",
   leader: {},
   memberTemp: {
      userId: "",
      positionId: "",
      personnelType: "",
      name: "",
   },
   members: [],
   name: "",
   contractNumber: "",
   dateContractStart: "",
   dateContractEnd: "",
   fundingId: "",
   budgetSponser: "",
   budgetAmount: "",
   humanEthicsCertificate: "",
   files: [],
   filesDelete: [],
   publisher: "",
   impactFactorId: "",
   weight: "",
   cost: "",
   permissionIds: [],
});

const validator = ref({});
const validatorMember = ref({});

const resetForm = () => {
   messageError.value = "";
   form.value = {
      datePublish: "",
      leader: {},
      memberTemp: {
         userId: "",
         positionId: "",
         personnelType: "",
         name: "",
      },
      members: [],
      name: "",
      contractNumber: "",
      dateContractStart: "",
      dateContractEnd: "",
      fundingId: "",
      budgetSponser: "",
      budgetAmount: "",
      humanEthicsCertificate: "",
      files: [],
      filesDelete: [],
      publisher: "",
      impactFactorId: "",
      weight: "",
      cost: "",
      permissionIds: [],
   };
   validator.value = {
      datePublish: {
         showMessage: false,
         message: "จำเป็นต้องกรอก",
      },
      prefix: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
         type: "object",
         parentKey: "leader",
      },
      personnelType: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
         type: "object",
         parentKey: "leader",
      },
      name: {
         showMessage: false,
         message: "จำเป็นต้องกรอก",
      },
   };
   validatorMember.value = {
      personnelType: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
         type: "object",
         parentKey: "memberTemp",
      },
      positionId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
         type: "object",
         parentKey: "memberTemp",
      },
   };
};

const removeAutoFocus = ref(null);
const loadingForm = ref(false);

watch(
   () => props.isOpen,
   (newData) => {
      if (newData == true) {
         //master data
         getPersonnelInExternalList();
         getPrefixList();
         getPositionList();
         getMembersOfLeaderList();
         getMembersList();
         getInventionTypeList();

         resetForm();

         if (props.id) {
            getDataById();
         }
      }
   }
);

const personnelInExternalList = ref([]);
const getPersonnelInExternalList = async () => {
   const res = await fetchPersonnelInExternalList();
   if (res.code == 20000) {
      personnelInExternalList.value = res.responseObject.personnelList;
   }
};

const prefixList = ref([]);
const getPrefixList = async () => {
   const res = await fetchPrefixList();
   if (res.code == 20000) {
      prefixList.value = res.responseObject.prefixList;
   }
};

const positionList = ref([]);
const getPositionList = async () => {
   const res = await fetchPositionList();
   if (res.code == 20000) {
      positionList.value = res.responseObject.positionList;
   }
};

const membersOfLeaderList = ref([]);
const membersOfLeaderFilters = ref({ remove: [] });
const getMembersOfLeaderList = async () => {
   const res = await fetchMembersList(membersOfLeaderFilters.value);
   if (res.code == 20000) {
      membersOfLeaderList.value = res.responseObject.memberList;
   }
};

const membersList = ref([]);
const membersFilters = ref({ remove: [] });
const getMembersList = async (leaderUserId) => {
   let removeId = [...membersFilters.value.remove];
   if (leaderUserId) {
      removeId.push(leaderUserId);
   }
   const res = await fetchMembersList({ remove: removeId });
   if (res.code == 20000) {
      membersList.value = res.responseObject.memberList;
   }
};

const inventionTypeList = ref([]);
const getInventionTypeList = async () => {
   const res = await fetchInventionTypeList();
   if (res.code == 20000) {
      inventionTypeList.value = res.responseObject.inventionTypeList;
   }
};

const getDataById = async () => {
   loadingForm.value = true;
   const res = await fetchIntellectualProperty(props.id);
   loadingForm.value = false;
   if (res.code == 20000) {
      const {
         datePublish,
         leader,
         name,
         contractNumber,
         dateContractStart,
         dateContractEnd,
         funding,
         budgetSponser,
         budgetAmount,
         humanEthicsCertificate,
         publisher,
         impactFactor,
         weight,
         cost,
         files,
         members,
      } = res.responseObject.researches;
      form.value.datePublish = datePublish;
      form.value.leader = {
         userId: leader.user?.id,
         prefix: leader.prefix?.id,
         personnelType: leader.personnelType?.id,
         leaderName: leader.user?.name,
      };
      form.value.name = name;
      form.value.contractNumber = contractNumber;
      form.value.dateContractStart = dateContractStart;
      form.value.dateContractEnd = dateContractEnd;
      form.value.fundingId = funding.id;
      form.value.budgetSponser = budgetSponser;
      form.value.budgetAmount = budgetAmount || "";
      form.value.humanEthicsCertificate = humanEthicsCertificate;
      form.value.publisher = publisher;
      form.value.impactFactorId = impactFactor.id;
      form.value.weight = weight || "";
      form.value.cost = cost || "";
      form.value.files = files || [];
      form.value.filesDelete = [];

      for (const member of members) {
         form.value.members.push({
            userId: member.user.id,
            positionId: member.position.id,
            personnelType: member.personnelType.id,
            name: getNameMembers(member.user.id, member.user.name),
         });
      }

      showLeaderNameMaster.value = checkExternal(leader.personnelType?.id);
   }
};

const btnAddMember = () => {
   setTimeout(async () => {
      if (showMemberNameMaster.value) {
         delete validatorMember.value.name;
         validatorMember.value = {
            ...validatorMember.value,
            userId: {
               showMessage: false,
               message: "จำเป็นต้องเลือก",
               type: "object",
               parentKey: "memberTemp",
            },
         };
      } else {
         delete validatorMember.value.userId;
         validatorMember.value = {
            ...validatorMember.value,
            name: {
               showMessage: false,
               message: "จำเป็นต้องกรอก",
               type: "object",
               parentKey: "memberTemp",
            },
         };
      }

      const fail = validatorForm(form.value, validatorMember.value);
      if (fail.length == 0) {
         form.value.memberTemp.name = await getNameMembers(form.value.memberTemp?.userId, form.value.memberTemp?.name);
         form.value.members.push(form.value.memberTemp);
         form.value.memberTemp = {
            userId: "",
            positionId: "",
            personnelType: "",
            name: "",
         };
         setTimeout(() => {
            const removeId = form.value.members.map((item) => item.userId);
            membersFilters.value.remove = removeId;
            getMembersList(form.value.leader.userId);
            membersOfLeaderFilters.value.remove = removeId;
            getMembersOfLeaderList();
         }, 300);
      }
   }, 100);
};

const isOpenConfirm = ref(false);
const setDialogConfirm = (status) => {
   isOpenConfirm.value = status;
};

const isOpenDeleteMember = ref(false);
let indexMember = null;
const setDialogDeleteMember = (status, index) => {
   isOpenDeleteMember.value = status;
   if (index > -1) {
      indexMember = index;
   }
};

const isOpenDeleteFile = ref(false);
let indexFile = null;
const setDialogDeleteFile = (status, index) => {
   isOpenDeleteFile.value = status;
   if (index > -1) {
      indexFile = index;
   }
};

const submitForm = () => {
   setTimeout(() => {
      if (showLeaderNameMaster.value) {
         delete validator.value.leaderName;
         validator.value = {
            ...validator.value,
            userId: {
               showMessage: false,
               message: "จำเป็นต้องเลือก",
               type: "object",
               parentKey: "leader",
            },
         };
      } else {
         delete validator.value.userId;
         validator.value = {
            ...validator.value,
            leaderName: {
               showMessage: false,
               message: "จำเป็นต้องกรอก",
               type: "object",
               parentKey: "leader",
            },
         };
      }
      const fail = validatorForm(form.value, validator.value);
      if (fail.length == 0) {
         setDialogConfirm(true);
      }
   }, 100);
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
   const res = await addIntellectualProperty(form.value);
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
   const res = await updateIntellectualProperty(form.value);
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

const selectFile = () => {
   document.getElementById("input_file").click();
};

const changeFile = async (e) => {
   if (e.target.files.length) {
      props.setLoadingPage(true);

      for (let i = 0; i < e.target.files.length; i++) {
         const res = await uploadFile(e.target.files[i]);
         if (res) {
            form.value.files.push({ fileId: res.fileId, add: true, delete: false, filename: res.fileName });
         }
         if (e.target.files.length - 1 == i) {
            props.setLoadingPage(false);
            document.getElementById("input_file").value = "";
         }
      }
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

const fnDeleteMember = () => {
   if (indexMember > -1) {
      form.value.members.splice(indexMember, 1);
      setDialogDeleteMember(false);

      setTimeout(() => {
         const removeId = form.value.members.map((item) => item.userId);
         membersFilters.value.remove = removeId;
         getMembersList(form.value.leader.userId);
         membersOfLeaderFilters.value.remove = removeId;
         getMembersOfLeaderList();
      }, 300);
   }
};

const getNamePersonnelInExternal = (id) => {
   let result = "";
   const found = personnelInExternalList.value.find((fields) => fields.id == id);
   if (found) {
      result = found.typeTh;
   }
   return result;
};

const getNameMembers = (id, name) => {
   let result = "";
   if (name) {
      result = name;
   } else {
      const found = membersList.value.find((fields) => fields.id == id);
      if (found) {
         result = found.name;
      }
   }
   return result;
};

const budgetYear = ref("");
const educationYear = ref("");
watch(
   () => form.value.datePublish,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "datePublish" });
      budgetYear.value = calBudgetYear(newData);
      educationYear.value = calEducationYear(newData);
   }
);

const showLeaderNameMaster = ref(true);
watch(
   () => form.value.leader.personnelType,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "personnelType" });
      showLeaderNameMaster.value = checkExternal(newData);
   }
);

watch(
   () => form.value.leader.prefix,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "prefix" });
   }
);

watch(
   () => form.value.leader.userId,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "userId" });
      if (newData == form.value.memberTemp.userId) {
         form.value.memberTemp.userId = "";
      }
      getMembersList(newData);
   }
);

watch(
   () => form.value.memberTemp.userId,
   (newData) => {
      clearRequireOnChange(validatorMember.value, { value: newData, key: "userId" });
   }
);

watch(
   () => form.value.memberTemp.positionId,
   (newData) => {
      clearRequireOnChange(validatorMember.value, { value: newData, key: "positionId" });
   }
);

watch(
   () => form.value.memberTemp.name,
   (newData) => {
      clearRequireOnChange(validatorMember.value, { value: newData, key: "name" });
   }
);

const showMemberNameMaster = ref(true);
watch(
   () => form.value.memberTemp.personnelType,
   (newData) => {
      clearRequireOnChange(validatorMember.value, { value: newData, key: "personnelType" });
      showMemberNameMaster.value = checkExternal(newData);
   }
);

watch(
   () => form.value.dateContractStart,
   (newData) => {
      if (newData && form.value.dateContractEnd) {
         const start = new Date(genTextDate({ date: newData, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }));
         const end = new Date(genTextDate({ date: form.value.dateContractEnd, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }));
         if (start.getTime() > end.getTime()) {
            form.value.dateContractEnd = newData;
         }
      }
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

const checkExternal = (id) => {
   let result = true;
   const found = personnelInExternalList.value.find((key) => key.id === id);
   if (found && found.code == "external") {
      result = false;
   }
   return result;
};
</script>
