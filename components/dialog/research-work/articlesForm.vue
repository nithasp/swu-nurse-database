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
         <p class="text-primary-500 text-xl">{{ actionMode == "edit" ? "แก้ไข" : actionMode == "create" ? "เพิ่ม" : "" }}บทความวิจัย/วิชาการ</p>
         <div class="h-[1px] bg-primary-500 mt-2 mb-8"></div>
         <form v-if="!loadingForm" class="grid grid-cols-1 tablet:grid-cols-none justify-center gap-y-3 tablet:gap-2">
            <div class="grid items-center tablet:items-start tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">ประเภทบทความ<span class="text-red-500"> *</span> :</p>
               <Select
                  class="w-full tablet:w-[310px]"
                  v-model="form.articleType"
                  :options="articleTypeList"
                  attributeValue="id"
                  attributeOption="name"
                  placeholder="ประเภทบทความ"
                  :requireInput="{ showMessage: validator.articleType?.showMessage, message: validator.articleType?.message }"
                  :disabled="actionMode == 'view'"
               />
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">วันที่ตีพิมพ์บทความ<span class="text-red-500"> *</span> :</p>
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
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">ข้อมูลผู้แต่งบทความ<span class="text-red-500"> *</span> :</p>
               <div class="flex gap-2 flex-wrap">
                  <Select
                     class="w-full tablet:w-[190px]"
                     v-model="form.author.personnelType"
                     :options="personnelInExternalList"
                     attributeValue="id"
                     attributeOption="typeTh"
                     placeholder="บุคลากรภายใน/นอก"
                     :requireInput="{ showMessage: validator.personnelType?.showMessage, message: validator.personnelType?.message }"
                     :disabled="actionMode == 'view'"
                  />
                  <Select
                     class="w-full tablet:w-[140px]"
                     v-model="form.author.prefix"
                     :options="prefixList"
                     attributeValue="id"
                     attributeOption="nameTh"
                     placeholder="คำนำหน้าชื่อ"
                     searchablePlaceholder="ค้นหาคำนำหน้าชื่อ"
                     :requireInput="{ showMessage: validator.prefix?.showMessage, message: validator.prefix?.message }"
                     :disabled="actionMode == 'view'"
                  />
                  <Select
                     v-if="showAuthorNameMaster"
                     class="w-full tablet:w-[200px]"
                     v-model="form.author.userId"
                     :options="membersOfAuthorList"
                     attributeValue="id"
                     attributeOption="name"
                     placeholder="-- เลือก --"
                     searchablePlaceholder="ค้นหาหัวหน้าโครงการวิจัย"
                     :requireInput="{ showMessage: validator.userId?.showMessage, message: validator.userId?.message }"
                     :disabled="actionMode == 'view'"
                  />
                  <Input
                     v-else
                     v-model="form.author.nameAuthor"
                     placeholder="ชื่อ"
                     class="w-full tablet:w-[200px]"
                     heightClass="h-[38px]"
                     @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'nameAuthor' })"
                     :requireInput="{ showMessage: validator.nameAuthor?.showMessage, message: validator.nameAuthor?.message }"
                     :disabled="actionMode == 'view'"
                  />
               </div>
            </div>
            <div class="grid items-center tablet:items-start tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-0 tablet:mt-2">ข้อมูลผู้ร่วมแต่งบทความ :</p>
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
                     :options="prefixList"
                     attributeValue="id"
                     attributeOption="nameTh"
                     placeholder="คำนำหน้าชื่อ"
                     searchablePlaceholder="ค้นหาคำนำหน้าชื่อ"
                     :requireInput="{ showMessage: validatorMember.positionId?.showMessage, message: validatorMember.positionId?.message }"
                     :disabled="actionMode == 'view'"
                  />
                  <!-- <Select
                     class="w-full tablet:w-[140px]"
                     v-model="form.memberTemp.positionId"
                     :options="positionList"
                     attributeValue="id"
                     attributeOption="name"
                     placeholder="คำนำหน้าชื่อ"
                     searchablePlaceholder="ค้นหาคำนำหน้าชื่อ"
                     :requireInput="{ showMessage: validatorMember.positionId?.showMessage, message: validatorMember.positionId?.message }"
                     :disabled="actionMode == 'view'"
                  /> -->
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
                        @change="(event) => clearRequireOnChange(validatorMember, { value: event.target.value, key: 'name' })"
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
                     :options="prefixList"
                     attributeValue="id"
                     attributeOption="nameTh"
                     placeholder="คำนำหน้าชื่อ"
                     searchablePlaceholder="ค้นหาคำนำหน้าชื่อ"
                     :disabled="actionMode == 'view'"
                  />
                  <!-- <Select
                     class="w-full tablet:w-[140px]"
                     v-model="form.members[index].positionId"
                     :options="positionList"
                     attributeValue="id"
                     attributeOption="name"
                     placeholder="คำนำหน้าชื่อ"
                     searchablePlaceholder="ค้นหาคำนำหน้าชื่อ"
                     :disabled="actionMode == 'view'"
                  /> -->
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
            <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right mt-2">ชื่อบทความ <span class="text-red-500" v-if="actionMode != 'view'"> *</span> :</p>
               <Input
                  placeholder="ชื่อบทความ"
                  class="flex flex-col tablet:w-[310px]"
                  v-model="form.name"
                  heightClass="h-[38px]"
                  @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'name' })"
                  :requireInput="{ showMessage: validator.name?.showMessage, message: validator.name?.message }"
                  :disabled="actionMode == 'view'"
               />
            </div>
            <div class="grid items-center tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right">แหล่งตีพิมพ์ :</p>
               <Input
                  placeholder="แหล่งตีพิมพ์"
                  class="flex flex-col tablet:w-[310px]"
                  v-model="form.publisher"
                  heightClass="h-[38px]"
                  :disabled="actionMode == 'view'"
               />
            </div>
            <div class="grid items-center tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right">ระดับฐานข้อมูลวารสารระดับชาติ และนานาชาติ ( Impact factor ) :</p>
               <Select
                  class="w-full tablet:w-[310px]"
                  v-model="form.impactFactorId"
                  :options="impactFactorList"
                  attributeValue="id"
                  attributeOption="nameTh"
                  placeholder="-- เลือก --"
                  searchablePlaceholder="ค้นหา Impact factor"
                  :disabled="actionMode == 'view'"
               />
            </div>
            <div v-if="actionMode != 'view' && form.files.length < 3" class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <p class="text-sm tablet:text-right tablet:mt-2.5">บทความ :</p>
               <div>
                  <ButtonChooseFile :action="selectFile" />
                  <input type="file" accept=".xlsx, .docx, .pdf" id="input_file_articles" multiple class="hidden" @change="changeFile" />
               </div>
            </div>
            <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
               <div>
                  <p v-if="actionMode == 'view' || form.files.length == 3" class="text-sm tablet:text-right tablet:mt-2">บทความ :</p>
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
                     <p class="line-clamp-1 text-sm text-primary-500 cursor-pointer" @click="openNewTab(file.link || file.url)">{{ file.filename }}</p>
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
import Datepicker from "~/components/form/datepicker";
import Select from "~/components/form/select";
import ButtonAddIcon from "~/components/button/addIcon";
import ButtonMinusIcon from "~/components/button/minusIcon";
import ButtonChooseFile from "~/components/button/chooseFile";
import SkeletonForm from "~/components/ui/skeleton/form";

import useArticlesAPI from "~/service/api/researches/articles";
const { fetchArticle, addArticle, updateArticle } = useArticlesAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchPersonnelInExternalList, fetchPrefixList, fetchPositionList, fetchMembersList, fetchImpactFactorList, fetchArticleTypeList } = useMasterDataAPI;

const props = defineProps({
   isOpen: Boolean,
   setDialog: Function,
   actionMode: String,
   id: Number,
   setLoadingPage: Function,
   getListTable: Function,
   btnOpenForm: Function,
   getRecordYearList: Function,
   getLeaderList: Function,
});

const form = ref({
   articleType: "",
   datePublish: "",
   author: {},
   memberTemp: {
      userId: "",
      positionId: "",
      personnelType: "",
      name: "",
   },
   members: [],
   name: "",
   files: [],
   filesDelete: [],
   publisher: "",
   impactFactorId: "",
});

const validator = ref({});
const validatorMember = ref({});

const resetForm = () => {
   messageError.value = "";
   form.value = {
      articleType: "",
      datePublish: "",
      author: {},
      memberTemp: {
         userId: "",
         positionId: "",
         personnelType: "",
         name: "",
      },
      members: [],
      name: "",
      files: [],
      filesDelete: [],
      publisher: "",
      impactFactorId: "",
   };
   validator.value = {
      articleType: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      datePublish: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      prefix: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
         type: "object",
         parentKey: "author",
      },
      personnelType: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
         type: "object",
         parentKey: "author",
      },
      name: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
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
         getArticleTypeList();
         getPersonnelInExternalList();
         getPrefixList();
         getPositionList();
         getMembersOfAuthorList();
         getMembersList();
         getImpactFactorList();

         resetForm();

         if (props.id) {
            getDataById();
         }
      }
   }
);

const articleTypeList = ref([]);
const getArticleTypeList = async () => {
   const res = await fetchArticleTypeList();
   if (res.code == 20000) {
      articleTypeList.value = res.responseObject.articleTypesList;
   }
};

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

const membersOfAuthorList = ref([]);
const membersOfAuthorFilters = ref({ remove: [] });
const getMembersOfAuthorList = async () => {
   const res = await fetchMembersList(membersOfAuthorFilters.value);
   if (res.code == 20000) {
      membersOfAuthorList.value = res.responseObject.memberList;
   }
};

const membersList = ref([]);
const membersFilters = ref({ remove: [] });
const getMembersList = async (authorUserId) => {
   let removeId = [...membersFilters.value.remove];
   if (authorUserId) {
      removeId.push(authorUserId);
   }
   const res = await fetchMembersList({ remove: removeId });
   if (res.code == 20000) {
      membersList.value = res.responseObject.memberList;
   }
};

const impactFactorList = ref([]);
const getImpactFactorList = async () => {
   const res = await fetchImpactFactorList();
   if (res.code == 20000) {
      impactFactorList.value = res.responseObject.impactFactorList;
   }
};

const getDataById = async () => {
   loadingForm.value = true;
   const res = await fetchArticle(props.id);
   loadingForm.value = false;
   if (res.code == 20000) {
      const { articleType, datePublish, author, members, name, files, publisher, impactFactor } = res.responseObject.article;
      form.value.articleType = articleType.id;
      form.value.datePublish = datePublish;
      form.value.author = {
         userId: author.user?.id,
         prefix: author.prefix?.id,
         personnelType: author.personnelType?.id,
         nameAuthor: author.user?.name,
      };
      form.value.name = name;
      form.value.publisher = publisher;
      form.value.impactFactorId = impactFactor.id;
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

      showAuthorNameMaster.value = checkExternal(author.personnelType?.id);
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
               message: "กรอกข้อมูลไม่ครบถ้วน",
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
            getMembersList(form.value.author.userId);
            membersOfAuthorFilters.value.remove = removeId;
            getMembersOfAuthorList();
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
      if (showAuthorNameMaster.value) {
         delete validator.value.nameAuthor;
         validator.value = {
            ...validator.value,
            userId: {
               showMessage: false,
               message: "จำเป็นต้องเลือก",
               type: "object",
               parentKey: "author",
            },
         };
      } else {
         delete validator.value.userId;
         validator.value = {
            ...validator.value,
            nameAuthor: {
               showMessage: false,
               message: "กรอกข้อมูลไม่ครบถ้วน",
               type: "object",
               parentKey: "author",
            },
         };
      }
      const fail = validatorForm(form.value, validator.value);
      if (fail.length == 0) {
         setDialogConfirm(true);
         messageError.value = "";
      } else {
         messageError.value = "โปรดกรอกข้อมูลให้ครบถ้วน";
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
   const res = await addArticle(form.value);
   if (res.code == 20000) {
      props.getListTable();
      props.getRecordYearList();
      props.getLeaderList();
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
   const res = await updateArticle(form.value);
   if (res.code == 20000) {
      props.getListTable();
      props.getRecordYearList();
      props.getLeaderList();
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
   document.getElementById("input_file_articles").click();
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
            document.getElementById("input_file_articles").value = "";
         }
      }

      if (alertMaxFile) {
         const toast = useToast();
         toast.add({ title: "อัปโหลดได้ 3 ไฟล์เท่านั้น ไฟล์ที่เกินมาจะไม่ถูกอัปโหลด", color: "red" });
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
         getMembersList(form.value.author.userId);
         membersOfAuthorFilters.value.remove = removeId;
         getMembersOfAuthorList();
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

const showAuthorNameMaster = ref(true);
watch(
   () => form.value.author.personnelType,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "personnelType" });
      showAuthorNameMaster.value = checkExternal(newData);
   }
);

watch(
   () => form.value.author.prefix,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "prefix" });
   }
);

watch(
   () => form.value.author.userId,
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
   () => form.value.articleType,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "articleType" });
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
