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
         <div class="flex items-center sm:flex-row">
            <div class="text-primary-500 text-xl">
               {{
                  openDialogMode === "edit"
                     ? "แก้ไขข้อมูลการถือครองอัตราปัจจุบัน"
                     : openDialogMode === "create"
                     ? "เพิ่มข้อมูลการถือครองอัตราปัจจุบัน"
                     : "ข้อมูลการถือครองอัตราปัจจุบัน"
               }}
            </div>
         </div>
         <div class="h-[1px] bg-primary-500 mt-3 mb-8"></div>
         <form v-if="!isFormLoading">
            <div class="grid grid-cols-1 justify-center gap-y-2 md:grid-cols-2">
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]">
                  <p class="text-sm text-[#333] text-left mt-2 md:text-right">
                     <span>เลขอัตรา</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div class="flex gap-2">
                     <div>
                        <USelectMenu
                           v-model="form.currencyId"
                           :options="currencyList"
                           placeholder="-- เลือก --"
                           value-attribute="id"
                           option-attribute="no"
                           :disabled="openDialogMode === 'view'"
                           :ui="{
                              base: `h-[38px] md:max-w-[100px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                                 validator.currencyId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                        <div class="flex items-center mt-2" v-if="validator.currencyId?.showMessage">
                           <label class="text-error-500 text-sm">{{ validator.currencyId?.message }}</label>
                        </div>
                     </div>
                     <Input
                        v-model="form.currencyNumber"
                        type="number"
                        placeholder="เลขอัตรา"
                        class="flex flex-col text-sm w-full whitespace-nowrap"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :requireInput="{ showMessage: validator.currencyNumber?.showMessage, message: validator.currencyNumber?.message }"
                        @change="(event) => clearRequireOnChange({ value: event.target.value, key: 'currencyNumber' })"
                        :disabled="openDialogMode === 'view'"
                     />
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]">
                  <p class="text-sm text-[#333] text-left mt-2 md:text-right">
                     <span>ประเภทอัตรา</span>
                     <span>:&nbsp;</span>
                  </p>

                  <Input
                     v-model="form.currencyType"
                     placeholder="เลขอัตรา"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]">
                  <p class="text-sm text-[#333] text-left mt-2 md:text-right">
                     <span>งบประมาณที่ใช้</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.budgetTypeId"
                        :options="budgetTypeList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] md:max-w-[219px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.budgetTypeId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                     <div class="flex items-center mt-2" v-if="validator.budgetTypeId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.budgetTypeId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]">
                  <p class="text-sm text-[#333] text-left mt-2 md:text-right">
                     <span>สังกัด</span>
                     <span>:&nbsp;</span>
                  </p>

                  <USelectMenu
                     v-model="form.divisionId"
                     :options="divisionList"
                     placeholder="-- เลือก --"
                     value-attribute="id"
                     option-attribute="name"
                     :disabled="openDialogMode === 'view'"
                     :ui="{
                        base: 'h-[38px] md:max-w-[219px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100',
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
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]">
                  <p class="text-sm text-[#333] text-left mt-2 md:text-right">
                     <span>ตำแหน่งงาน</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.positionId"
                        :options="positionList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        searchable
                        searchable-placeholder="ตำแหน่งงาน"
                        :search-attributes="['name']"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] md:max-w-[219px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.positionId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                     <div class="flex items-center mt-2" v-if="validator.positionId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.positionId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]">
                  <p class="text-sm text-[#333] text-left mt-2 md:text-right">
                     <span>ตำแหน่งทางวิชาการ</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.academicPositionId"
                        :options="academicPositionList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        searchable
                        searchable-placeholder="ตำแหน่งทางวิชาการ"
                        :search-attributes="['name']"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] md:max-w-[219px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.academicPositionId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                     <div class="flex items-center mt-2" v-if="validator.academicPositionId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.academicPositionId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]">
                  <p class="text-sm text-[#333] text-left mt-2 md:text-right">
                     <span>งาน</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.workBranchId"
                        :options="workBranchList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        searchable
                        searchable-placeholder="งาน"
                        :search-attributes="['name']"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] md:max-w-[219px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.workBranchId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                     <div class="flex items-center mt-2" v-if="validator.workBranchId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.workBranchId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]">
                  <p class="text-sm text-[#333] text-left mt-2 md:text-right">
                     <span>วันที่บรรจุ</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <Datepicker
                     class="text-sm"
                     v-model="form.placementDate"
                     inputId="startDate"
                     :placeholder="'วัน/เดือน/ปี'"
                     inputHeight="h-[38px]"
                     :requireInput="{ showMessage: validator.placementDate?.showMessage, message: validator.placementDate?.message }"
                     :disabled="openDialogMode === 'view'"
                  />
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]">
                  <p class="text-sm text-[#333] text-left mt-2 md:text-right">
                     <span>หน่วยงานที่ปฏิบัติงาน</span>
                     <span class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div>
                     <USelectMenu
                        v-model="form.agencyId"
                        :options="agencyList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        searchable
                        searchable-placeholder="หน่วยงานที่ปฏิบัติงาน"
                        :search-attributes="['name']"
                        :disabled="openDialogMode === 'view'"
                        :ui="{
                           base: `h-[38px] md:max-w-[219px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.agencyId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                     <div class="flex items-center mt-2" v-if="validator.agencyId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.agencyId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]">
                  <p class="text-sm text-[#333] text-left mt-2 md:text-right">
                     <span>ระดับ&nbsp;/&nbsp;ชั้น</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div class="flex items-start gap-[10px]">
                     <Input
                        v-model="form.currentLevel"
                        placeholder="ระดับ"
                        class="flex flex-col text-sm w-full"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="openDialogMode === 'view'"
                     />
                     <span class="mt-[5px]">/</span>
                     <Input
                        v-model="form.maxLevel"
                        placeholder="ชั้น"
                        class="flex flex-col text-sm w-full"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="openDialogMode === 'view'"
                     />
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]">
                  <p class="text-sm text-[#333] text-left mt-2 md:text-right">
                     <span>ค่าประสบการณ์</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div class="flex items-center gap-[10px]">
                     <div class="w-11/12">
                        <input
                           type="number"
                           :data-decimal="2"
                           v-model="experienceCompensation"
                           @input="(e) => genInputDecimal(e, 'experienceCompensation')"
                           :onkeypress="
                              (evt) => {
                                 ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault();
                              }
                           "
                           placeholder="ค่าประสบการณ์"
                           :disabled="openDialogMode === 'view'"
                           class="leading-[3] placeholder:text-gray-100 placeholder:h-full placeholder:text-sm rounded-lg px-[14px] w-full border border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed text-sm flex flex-col h-[38px]"
                        />
                     </div>
                     <span class="text-sm">บาท</span>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]">
                  <p class="text-sm text-[#333] text-left mt-2 md:text-right">
                     <span>ค่าตอบแทนพิเศษ</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div class="flex items-center gap-[10px]">
                     <div class="w-11/12">
                        <input
                           type="number"
                           :data-decimal="2"
                           v-model="specialCompensation"
                           @input="(e) => genInputDecimal(e, 'specialCompensation')"
                           :onkeypress="
                              (evt) => {
                                 ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault();
                              }
                           "
                           placeholder="ค่าตอบแทนพิเศษ"
                           :disabled="openDialogMode === 'view'"
                           class="leading-[3] placeholder:text-gray-100 placeholder:h-full placeholder:text-sm rounded-lg px-[14px] w-full border border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed text-sm flex flex-col h-[38px]"
                        />
                     </div>
                     <span class="text-sm">บาท</span>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]">
                  <p class="text-sm text-[#333] text-left mt-2 md:text-right">
                     <span>เงินเดือน</span>
                     <span>:&nbsp;</span>
                  </p>

                  <div class="flex items-center gap-[10px]">
                     <div class="w-11/12">
                        <input
                           type="number"
                           :data-decimal="2"
                           v-model="salary"
                           @input="(e) => genInputDecimal(e, 'salary')"
                           :onkeypress="
                              (evt) => {
                                 ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault();
                              }
                           "
                           placeholder="เงินเดือน"
                           :disabled="openDialogMode === 'view'"
                           class="leading-[3] placeholder:text-gray-100 placeholder:h-full placeholder:text-sm rounded-lg px-[14px] w-full border border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed text-sm flex flex-col h-[38px]"
                        />
                     </div>
                     <span class="text-sm">บาท</span>
                  </div>
               </div>
               <div class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]"></div>
               <div
                  v-if="(openDialogMode === 'create' || openDialogMode === 'edit') && form.files.length < 3"
                  class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]"
               >
                  <p class="text-sm text-[#333] md:text-right md:mt-2.5">แนบไฟล์ :</p>
                  <div class="md:whitespace-nowrap">
                     <ButtonChooseFile :action="selectFile" />
                     <input type="file" accept=".xlsx, .docx, .pdf" id="input_file_currency" class="hidden" @change="changeFile" multiple />
                  </div>
               </div>
               <div
                  v-if="(openDialogMode === 'create' || openDialogMode === 'edit') && form.files.length < 3"
                  class="grid grid-cols-1 gap-2 md:grid-cols-[149px_1fr]"
               ></div>
               <div :class="[openDialogMode === 'view' && form.files.length === 0 ? 'hidden' : 'grid', 'grid-cols-1 gap-2 sm:grid-cols-[149px_1fr]']">
                  <div><p v-if="openDialogMode === 'view' || form.files.length === 3" class="text-sm text-[#333] md:text-right md:mt-2.5">แนบไฟล์ :</p></div>
                  <div class="space-y-2">
                     <div
                        v-for="(file, index) in form?.files"
                        :key="file?.fileId"
                        class="w-full tablet:w-[310px] rounded-lg bg-gray-200 px-3 py-1 h-[38px] grid justify-between items-center grid-cols-[1fr_25px] gap-x-2"
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
      :btnAction="handlePersonnelCurrency"
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
import Loading from "~/components/loading";
import ButtonSave from "~/components/button/save";
import ButtonEdit from "~/components/button/edit";
import ButtonCancel from "~/components/button/cancel";
import DialogConfirm from "~/components/dialog/confirm";
import ButtonChooseFile from "~/components/button/chooseFile";
import SkeletonForm from "~/components/ui/skeleton/form";

import usePersonnelCurrencyAPI from "~/service/api/personnelCurrency";
const { fetchPersonnelCurrencyById, addPersonnelCurrency, updatePersonnelCurrency } = usePersonnelCurrencyAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchCurrencyList, fetchBudgetTypeList, fetchPositionList, fetchAgencyList, fetchWorkBranchList, fetchAcademicPositionList, fetchDivisionList } =
   useMasterDataAPI;

const toast = useToast();
const form = ref({
   currencyId: null,
   currencyNumber: null,
   budgetTypeId: null,
   positionId: null,
   workBranchId: null,
   agencyId: null,
   salary: null,
   experienceCompensation: null,
   specialCompensation: null,
   currencyType: "",
   divisionId: null,
   academicPositionId: null,
   placementDate: "",
   currentLevel: null,
   maxLevel: null,
   files: [],
   filesDelete: [],
});
const validator = ref({
   currencyId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   currencyNumber: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   budgetTypeId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   academicPositionId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   placementDate: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   positionId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   workBranchId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   agencyId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
});
const resetForm = () => {
   form.value = {
      currencyId: null,
      currencyNumber: null,
      budgetTypeId: null,
      positionId: null,
      workBranchId: null,
      agencyId: null,
      salary: null,
      experienceCompensation: null,
      specialCompensation: null,
      currencyType: "",
      divisionId: null,
      academicPositionId: null,
      placementDate: "",
      currentLevel: null,
      maxLevel: null,
      files: [],
      filesDelete: [],
   };
   validator.value = {
      currencyId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      currencyNumber: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      budgetTypeId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      academicPositionId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      placementDate: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      positionId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      workBranchId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      agencyId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
   };
   experienceCompensation.value = null;
   specialCompensation.value = null;
   salary.value = null;
};

const currencyList = ref([]);
const budgetTypeList = ref([]);
const positionList = ref([]);
const agencyList = ref([]);
const workBranchList = ref([]);
const academicPositionList = ref([]);
const divisionList = ref([]);

const isLoading = ref(false);
const isFormLoading = ref(false);

const props = defineProps({
   isOpen: Boolean,
   setDialog: Function,
   openDialogMode: String,
   personnelId: String,
   currencyId: Number,
});

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
   () => form.value.currencyId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "currencyId" });
   }
);
watch(
   () => form.value.budgetTypeId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "budgetTypeId" });
   }
);
watch(
   () => form.value.academicPositionId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "academicPositionId" });
   }
);
watch(
   () => form.value.placementDate,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "placementDate" });
   }
);
watch(
   () => form.value.positionId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "positionId" });
   }
);
watch(
   () => form.value.workBranchId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "workBranchId" });
   }
);
watch(
   () => form.value.agencyId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "agencyId" });
   }
);

const getData = () => {
   isFormLoading.value = true;
   Promise.all([
      props?.openDialogMode === "edit" || props?.openDialogMode === "view" ? fetchPersonnelCurrencyById(props.personnelId, props.currencyId) : Promise.resolve(),
      fetchCurrencyList(),
      fetchBudgetTypeList(),
      fetchPositionList(),
      fetchAgencyList(),
      fetchWorkBranchList(),
      fetchAcademicPositionList(),
      fetchDivisionList(),
   ]).then((res) => {
      if (props?.openDialogMode === "edit" || props?.openDialogMode === "view") {
         if (res[0]?.code === 20000) {
            form.value = {
               ...res[0]?.responseObject,
               currencyNumber: res[0].responseObject.currencyNumber === "0" || !res[0].responseObject.currencyNumber ? "" : res[0].responseObject.currencyNumber,
               currentLevel: res[0].responseObject.currentLevel ? res[0].responseObject.currentLevel : "",
               maxLevel: res[0].responseObject.maxLevel ? res[0].responseObject.maxLevel : "",
               filesDelete: [],
            };
            experienceCompensation.value = form.value.experienceCompensation ? form.value.experienceCompensation : "";
            specialCompensation.value = form.value.specialCompensation ? form.value.specialCompensation : "";
            salary.value = form.value.salary ? form.value.salary : "";
         }
      }
      if (res[1]?.code === 20000) {
         currencyList.value = res[1].responseObject.currencyList;
      }
      if (res[2]?.code === 20000) {
         budgetTypeList.value = res[2].responseObject.budgetTypeList;
      }
      if (res[3]?.code === 20000) {
         positionList.value = res[3].responseObject.positionList;
      }
      if (res[4]?.code === 20000) {
         agencyList.value = res[4].responseObject.agencyList;
      }
      if (res[5]?.code === 20000) {
         workBranchList.value = res[5].responseObject.workBranchList;
      }
      if (res[6]?.code === 20000) {
         academicPositionList.value = res[6].responseObject.academicPositionList;
      }
      if (res[7]?.code === 20000) {
         divisionList.value = res[7].responseObject.divisionList;
      }
      isFormLoading.value = false;
   });
};

const isOpenDialogConfirm = ref(false);
const setDialogConfirm = (status) => {
   isOpenDialogConfirm.value = status;
};

const handlePersonnelCurrency = async () => {
   isLoading.value = true;
   form.value = {
      ...form.value,
      experienceCompensation: experienceCompensation.value,
      specialCompensation: specialCompensation.value,
      salary: salary.value,
   };
   const res =
      props.openDialogMode === "create"
         ? await addPersonnelCurrency(props?.personnelId, form.value)
         : await updatePersonnelCurrency(props?.personnelId, props?.currencyId, form.value);
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
   document.getElementById("input_file_currency").click();
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
            document.getElementById("input_file_currency").value = "";
         }
      }
   }
};

const experienceCompensation = ref("");
const specialCompensation = ref("");
const salary = ref("");
const genInputDecimal = (event, type) => {
   const ele = event.target;
   const decimal = parseInt(ele.getAttribute("data-decimal")) || 0;
   const val = ele.value;

   if (!isNaN(decimal)) {
      if (decimal > 0) {
         const splitVal = val.split(".");
         if (val && type === "experienceCompensation") {
            experienceCompensation.value = parseFloat(experienceCompensation.value.toFixed(2));
         }
         if (val && type === "specialCompensation") {
            specialCompensation.value = parseFloat(specialCompensation.value.toFixed(2));
         }
         if (val && type === "salary") {
            salary.value = parseFloat(salary.value.toFixed(2));
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
