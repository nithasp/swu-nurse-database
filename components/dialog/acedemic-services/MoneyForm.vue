<template>
   <form v-if="!isFormLoading" class="grid grid-cols-1 tablet:grid-cols-none justify-center gap-y-3 tablet:gap-2">
      <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right mt-2">
            <span>ระยะเวลาในการดำเนินงานโครงการ</span>
            <span class="text-red-500">&nbsp;*</span>
            <span>&nbsp;:</span>
         </div>
         <div class="flex tablet:w-[428px] flex-col tablet:flex-row gap-y-2">
            <Datepicker
               v-model="form.dateStart"
               inputId="dateStart"
               placeholder="วัน/เดือน/ปี"
               inputHeight="h-[38px]"
               class="w-full tablet:w-auto"
               :requireInput="{ showMessage: validator.dateStart?.showMessage, message: validator.dateStart?.message }"
               :disabled="actionMode === 'view'"
               :isStartDate="true"
            />
            <span class="mt-2 px-1.5 hidden tablet:block">-</span>
            <Datepicker
               v-model="form.dateEnd"
               inputId="dateEnd"
               placeholder="วัน/เดือน/ปี"
               inputHeight="h-[38px]"
               class="w-full tablet:w-auto"
               :requireInput="{ showMessage: validator.dateEnd?.showMessage, message: validator.dateEnd?.message }"
               :minDate="form.dateStart"
               :disabled="actionMode === 'view'"
               :setCalendarMonth="test"
            />
         </div>
      </div>

      <div class="grid items-center tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right mt-0">
            <span>ปีงบประมาณ</span>
            <span>&nbsp;:</span>
         </div>

         <Input class="flex flex-col tablet:w-[182px]" heightClass="h-[38px]" disabled :value="budgetYear" />
      </div>

      <div class="grid items-center tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right mt-0">
            <span>ปีการศึกษา</span>
            <span>&nbsp;:</span>
         </div>
         <Input class="flex flex-col tablet:w-[182px]" heightClass="h-[38px]" disabled :value="educationYear" />
      </div>

      <div class="grid items-center tablet:items-start tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="flex items-center gap-1 tablet:justify-end">
            <div class="text-sm tablet:text-right mt-2">
               <span>ครั้งที่</span>
               <span>&nbsp;:</span>
            </div>
            <ButtonAddIcon v-if="actionMode !== 'view'" class="mt-1 block tablet:hidden" @click="addRound" />
         </div>

         <div class="gap-2 tablet:flex tablet:flex-wrap">
            <Input
               v-model="form.roundTemp.no"
               type="number"
               class="flex flex-col tablet:w-[182px]"
               heightClass="h-[38px]"
               placeholder="ครั้งที่"
               :requireInput="{ showMessage: validatorRound.no?.showMessage, message: validatorRound.no?.message }"
               @change="(event) => clearRequireOnChange(validatorRound, { value: event.target.value, key: 'no' })"
               :disabled="actionMode === 'view'"
            />
            <div class="tablet:flex">
               <Datepicker
                  v-model="form.roundTemp.dateStart"
                  inputId="roundDateStart"
                  placeholder="วัน/เดือน/ปี"
                  inputHeight="h-[38px]"
                  class="w-full m-[8px_0] tablet:w-[143px] tablet:m-0"
                  :requireInput="{ showMessage: validatorRound.dateStart?.showMessage, message: validatorRound.dateStart?.message }"
                  :disabled="actionMode === 'view'"
               />
               <span class="mx-2 mt-2 hidden tablet:block">-</span>
               <Datepicker
                  v-model="form.roundTemp.dateEnd"
                  inputId="roundDateEnd"
                  placeholder="วัน/เดือน/ปี"
                  inputHeight="h-[38px]"
                  class="w-full tablet:w-[143px]"
                  :requireInput="{ showMessage: validatorRound.dateEnd?.showMessage, message: validatorRound.dateEnd?.message }"
                  :minDate="form.roundTemp.dateStart"
                  :disabled="actionMode === 'view'"
               />
            </div>
            <ButtonAddIcon v-if="actionMode !== 'view'" class="mt-1 hidden tablet:block" @click="addRound" />
         </div>
      </div>
      <div v-for="(round, index) in form.rounds" :key="`${index}_round`" class="grid items-center tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="flex items-center">
            <span class="mt-1 tablet:hidden">{{ index + 1 }}:&nbsp;</span>
            <ButtonMinusIcon v-if="actionMode !== 'view'" class="mt-1 block tablet:hidden" @click="setDialogDeleteTrainingRound(true, index)" />
         </div>
         <div class="block tablet:flex tablet:gap-2 tablet:flex-wrap">
            <Input
               v-model="round.no"
               type="number"
               class="flex flex-col tablet:w-[182px]"
               heightClass="h-[38px]"
               placeholder="ครั้งที่"
               :requireInput="{ showMessage: !round.no, message: 'กรอกข้อมูลไม่ครบถ้วน' }"
               :disabled="actionMode === 'view'"
            />

            <div class="tablet:flex">
               <Datepicker
                  v-model="round.dateStart"
                  :inputId="`roundTempDateStart-${index}`"
                  placeholder="วัน/เดือน/ปี"
                  inputHeight="h-[38px]"
                  class="w-full tablet:w-[143px] m-[8px_0] tablet:m-0"
                  :requireInput="{ showMessage: !round.dateStart, message: 'กรอกข้อมูลไม่ครบถ้วน' }"
                  :disabled="actionMode === 'view'"
               />
               <span class="mx-2 mt-2 hidden tablet:block">-</span>
               <Datepicker
                  v-model="round.dateEnd"
                  :inputId="`roundTempDateEnd-${index}`"
                  placeholder="วัน/เดือน/ปี"
                  inputHeight="h-[38px]"
                  class="w-full tablet:w-[143px]"
                  :minDate="round.dateStart"
                  :requireInput="{ showMessage: !round.dateEnd, message: 'กรอกข้อมูลไม่ครบถ้วน' }"
                  :disabled="actionMode === 'view'"
               />
            </div>
            <ButtonMinusIcon v-if="actionMode !== 'view'" class="mt-1 hidden tablet:block" @click="setDialogDeleteTrainingRound(true, index)" />
         </div>
      </div>

      <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right mt-3">
            <span>ชื่อโครงการ</span>
            <span class="text-red-500" v-if="actionMode !== 'view'">&nbsp;*</span>
            <span>&nbsp;:</span>
         </div>
         <Textarea
            v-model="form.name"
            placeholder="รายละเอียด"
            rows="3"
            class="tablet:w-[428px]"
            :requireInput="{ showMessage: validator.name?.showMessage, message: validator.name?.message }"
            :disabled="actionMode === 'view'"
            @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'name' })"
         />
      </div>

      <div class="grid items-center tablet:items-start tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1 mb-0 tablet:mb-0">
         <div class="flex items-center gap-2 tablet:justify-end">
            <div class="text-sm tablet:text-right mt-2">
               <span>กลุ่มเป้าหมาย</span>
               <span>&nbsp;:</span>
            </div>
            <ButtonAddIcon v-if="actionMode !== 'view'" class="mt-1 block tablet:hidden" @click="addTarget('add')" />
         </div>

         <div class="tablet:flex tablet:gap-2 tablet:flex-wrap">
            <Input
               v-model="form.targetsTemp.name"
               class="flex flex-col tablet:w-[180px]"
               heightClass="h-[38px]"
               placeholder="กลุ่มเป้าหมาย"
               :disabled="actionMode === 'view'"
            />
            <div class="flex mt-1 tablet:mt-2">
               <div>
                  <span class="text-sm">จำนวนผู้เข้าร่วม&nbsp;(คน)</span>
                  <span>&nbsp;:</span>
               </div>
            </div>

            <Input
               v-model="form.targetsTemp.count"
               type="number"
               class="flex flex-col w-full tablet:w-[161px]"
               heightClass="h-[38px]"
               placeholder="จำนวน"
               :disabled="actionMode === 'view'"
            />
            <ButtonAddIcon v-if="actionMode !== 'view'" class="mt-1 hidden tablet:block" @click="addTarget('add')" />
         </div>
      </div>

      <div
         v-for="(target, index) in form.targets"
         :key="`${index}_target`"
         class="grid items-center tablet:items-start tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1"
      >
         <div class="flex items-center text-sm tablet:text-right mt-2">
            <span class="mt-1 tablet:hidden">{{ index + 1 }}:&nbsp;</span>
            <ButtonMinusIcon v-if="actionMode !== 'view'" class="mt-1 tablet:hidden" @click="setDialogDeleteTarget(true, index)" />
         </div>
         <div class="tablet:flex tablet:gap-2 tablet:flex-wrap">
            <Input
               v-model="target.name"
               class="flex flex-col tablet:w-[180px]"
               heightClass="h-[38px]"
               placeholder="กลุ่มเป้าหมาย"
               :disabled="actionMode === 'view'"
            />
            <div class="flex">
               <div class="mt-2">
                  <span class="text-sm">จำนวนผู้เข้าร่วม&nbsp;(คน)</span>
                  <span>&nbsp;:</span>
               </div>
            </div>
            <Input
               v-model="target.count"
               type="number"
               class="flex flex-col w-full tablet:w-[161px]"
               heightClass="h-[38px]"
               placeholder="จำนวน"
               :requireInput="{ showMessage: !target.count, message: 'กรอกข้อมูลไม่ครบถ้วน' }"
               :disabled="actionMode === 'view'"
            />
            <ButtonMinusIcon v-if="actionMode !== 'view'" class="mt-1 hidden tablet:block" @click="setDialogDeleteTarget(true, index)" />
         </div>
      </div>

      <div class="grid gap-x-3 gap-y-1 mt-4 tablet:grid-cols-[220px_1fr] tablet:mt-0">
         <div class="text-sm tablet:text-right tablet:mt-2">
            <span>สถานที่จัดโครงการ</span>
            <span class="text-red-500" v-if="actionMode !== 'view'">&nbsp;*</span>
            <span>&nbsp;:</span>
         </div>
         <div>
            <Input
               v-model="form.location"
               placeholder="สถานที่จัดโครงการ"
               class="flex flex-col tablet:w-[428px]"
               heightClass="h-[38px]"
               :requireInput="{ showMessage: validator.location?.showMessage, message: validator.location?.message }"
               @change="(event) => clearRequireOnChange(validator, { value: event.target.value, key: 'location' })"
               :disabled="actionMode === 'view'"
            />
            <div class="flex gap-1 mt-1 flex-col sm:flex-row">
               <div class="w-full tablet:w-[140px]">
                  <USelectMenu
                     v-model="form.provinceId"
                     :options="provinceCurrentAddressList"
                     placeholder="จังหวัด"
                     value-attribute="id"
                     option-attribute="name"
                     searchable
                     searchable-placeholder="จังหวัด"
                     :search-attributes="['name']"
                     :disabled="actionMode === 'view'"
                     :ui="{
                        base: 'h-[38px] w-full  border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100',
                        rounded: 'rounded-lg',
                        placeholder: 'text-gray-100',
                        icon: {
                           base: 'text-[#636466]',
                        },
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
                        (provinceId) => {
                           getDistrictAndSubdistrictCurrentAddressList('change', provinceId),
                              clearRequireOnChange(validator, { value: provinceId, key: 'provinceId' });
                        }
                     "
                  >
                  </USelectMenu>
                  <div class="flex items-center mt-2" v-if="validator.provinceId?.showMessage">
                     <label class="text-error-500 text-sm">{{ validator.provinceId?.message }}</label>
                  </div>
               </div>

               <div class="w-full tablet:w-[140px]">
                  <USelectMenu
                     v-model="form.districtId"
                     :options="districtCurrentAddressList"
                     placeholder="อำเภอ/เขต"
                     value-attribute="id"
                     option-attribute="name"
                     searchable
                     searchable-placeholder="อำเภอ/เขต"
                     :search-attributes="['name']"
                     :disabled="actionMode === 'view'"
                     :ui="{
                        base: 'h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100',
                        rounded: 'rounded-lg',
                        placeholder: 'text-gray-100',
                        icon: {
                           base: 'text-[#636466]',
                        },
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
                        (districtId) => {
                           getSubdistrictList(districtId), clearRequireOnChange(validator, { value: districtId, key: 'districtId' });
                        }
                     "
                  >
                  </USelectMenu>
                  <div class="flex items-center mt-2" v-if="validator.districtId?.showMessage">
                     <label class="text-error-500 text-sm">{{ validator.districtId?.message }}</label>
                  </div>
               </div>

               <div class="w-full tablet:w-[140px]">
                  <USelectMenu
                     v-model="form.subDistrictId"
                     :options="subDistrictCurrentAddressList"
                     placeholder="ตำบล/แขวง"
                     value-attribute="id"
                     option-attribute="name"
                     searchable
                     searchable-placeholder="ตำบล/แขวง"
                     :search-attributes="['name']"
                     :disabled="actionMode === 'view'"
                     :ui="{
                        base: 'h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100',
                        rounded: 'rounded-lg',
                        placeholder: 'text-gray-100',
                        icon: {
                           base: 'text-[#636466]',
                        },
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
                           clearRequireOnChange(validator, { value: subDistrictId, key: 'subDistrictId' });
                        }
                     "
                  >
                  </USelectMenu>
                  <div class="flex items-center mt-2" v-if="validator.subDistrictId?.showMessage">
                     <label class="text-error-500 text-sm">{{ validator.subDistrictId?.message }}</label>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right mt-2">
            <span>หัวหน้าโครงการ</span>
            <span class="text-red-500" v-if="actionMode !== 'view'">&nbsp;*</span>
            <span>&nbsp;:</span>
         </div>
         <Select
            class="w-full tablet:w-[428px]"
            v-model="form.ownerId"
            :options="personnelShortList"
            attributeValue="id"
            attributeOption="fullname"
            placeholder="หัวหน้าโครงการ"
            searchablePlaceholder="ค้นหาแหล่งทุน"
            :requireInput="{ showMessage: validator.ownerId?.showMessage, message: validator.ownerId?.message }"
            :disabled="actionMode === 'view'"
         />
      </div>

      <div class="grid items-center tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right">
            <span>งบประมาณที่ได้รับ</span>
            <span>&nbsp;:</span>
         </div>
         <input
            type="number"
            :data-decimal="2"
            v-model="receiveBudget"
            @input="(e) => genInputDecimal(e, 'receiveBudget')"
            :onkeypress="
               (evt) => {
                  ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault();
               }
            "
            placeholder="งบประมาณที่ได้รับ"
            :disabled="actionMode === 'view'"
            class="leading-[3] placeholder:text-gray-100 placeholder:h-full placeholder:text-sm rounded-lg px-[14px] w-full border border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed text-sm flex flex-col h-[38px] tablet:w-[428px]"
         />
      </div>

      <div class="grid items-center tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right">
            <span>งบประมาณที่ใช้ไป</span>
            <span>&nbsp;:</span>
         </div>
         <input
            type="number"
            :data-decimal="2"
            v-model="useBudget"
            @input="(e) => genInputDecimal(e, 'useBudget')"
            :onkeypress="
               (evt) => {
                  ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault();
               }
            "
            placeholder="งบประมาณที่ใช้ไป"
            :disabled="actionMode === 'view'"
            class="leading-[3] placeholder:text-gray-100 placeholder:h-full placeholder:text-sm rounded-lg px-[14px] w-full border border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed text-sm flex flex-col h-[38px] tablet:w-[428px]"
         />
      </div>

      <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right tablet:mt-2">
            <span>หลักการและเหตุผล</span>
            <span>&nbsp;:</span>
         </div>
         <Textarea v-model="form.reason" placeholder="รายละเอียด" rows="3" class="text-sm tablet:w-[428px]" :disabled="actionMode === 'view'" />
      </div>

      <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right tablet:mt-2">
            <span>วัตถุประสงค์โครงการ</span>
            <span>&nbsp;:</span>
         </div>
         <Textarea v-model="form.objective" placeholder="รายละเอียด" rows="3" class="text-sm tablet:w-[428px]" :disabled="actionMode === 'view'" />
      </div>

      <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right tablet:mt-3">
            <span>ประโยชน์ที่ได้รับ</span>
            <span>&nbsp;:</span>
         </div>
         <Textarea v-model="form.benefit" placeholder="รายละเอียด" rows="3" class="text-sm tablet:w-[428px]" :disabled="actionMode === 'view'" />
      </div>

      <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right tablet:mt-3">
            <span>แนวทางในการปรับปรุง</span>
            <span>&nbsp;:</span>
         </div>
         <Textarea v-model="form.suggestion" placeholder="รายละเอียด" rows="3" class="text-sm tablet:w-[428px]" :disabled="actionMode === 'view'" />
      </div>

      <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right tablet:mt-3">
            <span>ความพึงพอใจ</span>
            <span>&nbsp;:</span>
         </div>
         <Textarea v-model="form.satisfaction" placeholder="รายละเอียด" rows="3" class="text-sm tablet:w-[428px]" :disabled="actionMode === 'view'" />
      </div>

      <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right tablet:mt-3">
            <span>การบูรณาการเรียนการสอน</span>
            <span>&nbsp;:</span>
         </div>
         <Textarea v-model="form.teachingIntegration" placeholder="รายละเอียด" rows="3" class="text-sm tablet:w-[428px]" :disabled="actionMode === 'view'" />
      </div>

      <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right tablet:mt-3">
            <span>การบูรณาการทำนุบำรุงศิลปวัฒนธรรม</span>
            <span>&nbsp;:</span>
         </div>
         <Textarea v-model="form.cultureIntegration" placeholder="รายละเอียด" rows="3" class="text-sm tablet:w-[428px]" :disabled="actionMode === 'view'" />
      </div>

      <div class="grid tablet:grid-cols-[220px_1fr] gap-x-3 gap-y-1">
         <div class="text-sm tablet:text-right tablet:mt-3">
            <span>การบูรณาการงานวิจัย</span>
            <span>&nbsp;:</span>
         </div>
         <Textarea v-model="form.researchIntegration" placeholder="รายละเอียด" rows="3" class="text-sm tablet:w-[428px]" :disabled="actionMode === 'view'" />
      </div>

      <div
         v-if="(props.actionMode === 'create' || props.actionMode === 'edit') && form.summaryFiles.length < 3"
         class="grid grid-cols-1 gap-2 tablet:grid-cols-[224px_1fr]"
      >
         <p class="text-sm text-[#333] tablet:text-right tablet:mt-2.5">สรุปผลโครงการ&nbsp;:</p>
         <div class="tablet:whitespace-nowrap">
            <ButtonChooseFile :action="selectFile" />
            <input type="file" accept=".xlsx, .docx, .pdf" id="input_file_money_form" multiple class="hidden" @change="changeFile" />
         </div>
      </div>
      <div
         v-if="props.actionMode === 'create' || (props.actionMode === 'edit' && form.summaryFiles.length < 3)"
         class="grid grid-cols-1 gap-2 tablet:grid-cols-[224px_1fr]"
      ></div>
      <div
         class="grid grid-cols-1 gap-2 tablet:grid-cols-[224px_1fr]"
         :class="[props.actionMode === 'view' && form.summaryFiles.length === 0 ? 'hidden' : 'grid', 'grid-cols-1 gap-2 tablet:grid-cols-[224px_1fr]']"
      >
         <div>
            <p v-if="props.actionMode === 'view' || form.summaryFiles.length === 3" class="text-sm md:mt-2 md:text-right">สรุปผลโครงการ&nbsp;:</p>
         </div>
         <div class="space-y-2">
            <div
               v-for="(file, index) in form?.summaryFiles"
               :key="file?.fileId"
               class="w-full tablet:w-[306px] rounded-lg bg-gray-200 px-3 py-1 h-[38px] grid justify-between items-center grid-cols-[1fr_25px] gap-x-2"
            >
               <p class="line-clamp-1 text-sm text-primary-500 cursor-pointer" @click="openNewTab(file.link || file.url)">{{ file.filename }}</p>
               <UIcon
                  v-if="props.actionMode === 'create' || props.actionMode === 'edit'"
                  name="i-heroicons-x-mark"
                  class="w-5 h-5 cursor-pointer"
                  @click="setDialogDeleteFile(true, file, index)"
               />
            </div>
         </div>
      </div>

      <BadgeError v-if="messageError" :action="() => (messageError = '')" :message="messageError" />

      <div class="mt-8 flex flex-wrap gap-2 justify-center">
         <ButtonEdit type="button" v-if="actionMode === 'view'" @click="props.btnOpenForm('edit', props.budgetSourceId)" />
         <ButtonSave type="button" v-else @click="submitForm" />
         <ButtonCancel @click="() => setDialogAcademicServicesForm(false)" ref="removeAutoFocus" />
      </div>
   </form>
   <SkeletonForm v-else :count="12" />
   <DialogConfirm
      :isOpen="isOpenConfirm"
      :setDialog="setDialogConfirm"
      title="บันทึกข้อมูล"
      desc="คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่"
      icon="success"
      :btnAction="handleAcademicServices"
   />
   <DialogConfirm
      :isOpen="isOpenDeleteRound"
      :setDialog="setDialogDeleteTrainingRound"
      title="ลบข้อมูล"
      desc="คุณต้องการลบข้อมูลนี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก"
      icon="danger"
      :btnAction="deleteTrainingAlumni"
   />
   <DialogConfirm
      :isOpen="isOpenDeleteTarget"
      :setDialog="setDialogDeleteTarget"
      title="ลบไฟล์"
      desc="คุณต้องการลบไฟล์นี้ใช่หรือไม่ <br/> หากลบแล้วจะไม่สามารถกู้คืนได้อีก"
      icon="danger"
      :btnAction="deleteTarget"
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

import useReportAPI from "~/service/api/report";
const { fetchPersonnelShort } = useReportAPI;

import useAcademicAPI from "~/service/api/academic";
const { fetchAcademicServicesById, addAcademicServicesMoney, updateAcademicServicesMoney } = useAcademicAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchProvinceList, fetchDistrictList, fetchSubdistrictList } = useMasterDataAPI;

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
   name: "",
   budgetSourceId: props?.budgetSourceId,
   dateStart: "",
   dateEnd: "",
   rounds: [],
   targets: [],
   location: "",
   subDistrictId: 0,
   districtId: 0,
   provinceId: 0,
   ownerId: 0,
   receiveBudget: null,
   useBudget: null,
   objective: "",
   benefit: "",
   suggestion: "",
   satisfaction: "",
   teachingIntegration: "",
   cultureIntegration: "",
   researchIntegration: "",
   reason: "",
   summaryFiles: [],
   filesDelete: [],

   roundTemp: {
      no: "",
      dateStart: "",
      dateEnd: "",
   },
   targetsTemp: {
      name: "",
      count: "",
   },
});
const validator = ref({
   budgetSourceId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
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
   targets: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   location: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   subDistrictId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   districtId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   provinceId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   ownerId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
});
const validatorRound = ref({
   no: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
      type: "object",
      parentKey: "roundTemp",
   },
   dateStart: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
      type: "object",
      parentKey: "roundTemp",
   },
   dateEnd: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
      type: "object",
      parentKey: "roundTemp",
   },
});
// const validatorTargets = ref({
//    name: {
//       showMessage: false,
//       message: "กรอกข้อมูลไม่ครบถ้วน",
//       type: "object",
//       parentKey: "targetsTemp",
//    },
//    count: {
//       showMessage: false,
//       message: "กรอกข้อมูลไม่ครบถ้วน",
//       type: "object",
//       parentKey: "targetsTemp",
//    },
// });
const resetForm = () => {
   messageError.value = "";
   form.value = {
      name: "",
      budgetSourceId: props?.budgetSourceId,
      dateStart: "",
      dateEnd: "",
      rounds: [],
      targets: [],
      location: "",
      subDistrictId: 0,
      districtId: 0,
      provinceId: 0,
      ownerId: 0,
      receiveBudget: null,
      useBudget: null,
      objective: "",
      benefit: "",
      suggestion: "",
      satisfaction: "",
      teachingIntegration: "",
      cultureIntegration: "",
      researchIntegration: "",
      reason: "",
      summaryFiles: [],
      filesDelete: [],

      roundTemp: {
         no: "",
         dateStart: "",
         dateEnd: "",
      },
      targetsTemp: {
         name: "",
         count: "",
      },
   };
   validator.value = {
      budgetSourceId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
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
      targets: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      location: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
      },
      provinceId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      districtId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      subDistrictId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
      ownerId: {
         showMessage: false,
         message: "จำเป็นต้องเลือก",
      },
   };
   validatorRound.value = {
      no: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
         type: "object",
         parentKey: "roundTemp",
      },
      dateStart: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
         type: "object",
         parentKey: "roundTemp",
      },
      dateEnd: {
         showMessage: false,
         message: "กรอกข้อมูลไม่ครบถ้วน",
         type: "object",
         parentKey: "roundTemp",
      },
   };
   // validatorTargets.value = {
   //    name: {
   //       showMessage: false,
   //       message: "กรอกข้อมูลไม่ครบถ้วน",
   //       type: "object",
   //       parentKey: "targetsTemp",
   //    },
   //    count: {
   //       showMessage: false,
   //       message: "กรอกข้อมูลไม่ครบถ้วน",
   //       type: "object",
   //       parentKey: "targetsTemp",
   //    },
   // };
   receiveBudget.value = null;
   useBudget.value = null;
};

const isFirstRender = ref(false);
const isLoading = ref(false);
const isFormLoading = ref(false);
const removeAutoFocus = ref(null);
const personnelShortList = ref([]);
const budgetYear = ref("");
const educationYear = ref("");
const filtersPersonnelShort = ref({
   keyword: "",
   offset: 0,
   max: -1,
});

const provinceCurrentAddressList = ref([]);
const districtCurrentAddressList = ref([]);
const subDistrictCurrentAddressList = ref([]);

onMounted(() => {
   resetForm();
   getData();
});

watch(
   () => form.value.budgetSourceId,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "budgetSourceId" });
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
         const currentBuddhistYear = today.getFullYear() + 543;

         const newDataMonth = parseInt(newData.split("/")[1]);
         const newDataYear = parseInt(newData.split("/")[2]);

         if (newDataYear > currentBuddhistYear) {
            form.value.dateEnd = newData;
            setTimeout(() => {
               form.value.dateEnd = "";
            }, 10);
            return;
         }

         if (currentBuddhistYear === newDataYear && newDataMonth > currentMonth) {
            form.value.dateEnd = newData;
            setTimeout(() => {
               form.value.dateEnd = "";
            }, 10);
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

watch(
   () => form.value.roundTemp?.dateStart,
   (newData) => {
      clearRequireOnChange(validatorRound.value, { value: newData, key: "dateStart" });
      if (newData && form.value.roundTemp.dateEnd) {
         const start = new Date(genTextDate({ date: newData, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }));
         const end = new Date(genTextDate({ date: form.value.roundTemp.dateEnd, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }));

         if (start.getTime() > end.getTime()) {
            form.value.roundTemp.dateEnd = newData;
         }
      }

      if (!form.value.roundTemp.dateEnd) {
         const today = new Date();
         const currentMonth = today.getMonth() + 1;
         const currentBuddhistYear = today.getFullYear() + 543;
         const newDataMonth = parseInt(newData.split("/")[1]);
         const newDataYear = parseInt(newData.split("/")[2]);

         if (newDataYear > currentBuddhistYear) {
            form.value.roundTemp.dateEnd = newData;
            setTimeout(() => {
               form.value.roundTemp.dateEnd = "";
            }, 10);
            return;
         }

         if (currentBuddhistYear === newDataYear && newDataMonth > currentMonth) {
            form.value.roundTemp.dateEnd = newData;
            setTimeout(() => {
               form.value.roundTemp.dateEnd = "";
            }, 10);
         }
      }
   }
);

watch(
   () => form.value.roundTemp?.dateEnd,
   (newData) => {
      clearRequireOnChange(validatorRound.value, { value: newData, key: "dateEnd" });
   }
);

watch(
   () => form.value.ownerId,
   (newData) => {
      clearRequireOnChange(validator.value, { value: newData, key: "ownerId" });
   }
);

const isAddRound = ref(false);
watch(
   () => form.value.rounds.map((i) => i.dateStart),
   (newValues, oldValues) => {
      newValues.forEach((newValue, index) => {
         if (newValue !== oldValues[index]) {
            if (newValue && form.value.rounds[index].dateEnd) {
               const start = new Date(genTextDate({ date: newValue, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }));
               const end = new Date(genTextDate({ date: form.value.rounds[index].dateEnd, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }));

               if (start.getTime() > end.getTime() && isFirstRender.value === false) {
                  if (!isAddRound.value) {
                     form.value.rounds[index].dateEnd = newValue;
                  }
               }
            }
         }
      });
   }
);

const getData = () => {
   isFirstRender.value = true;
   isFormLoading.value = true;
   Promise.all([
      props?.actionMode === "edit" || props?.actionMode === "view" ? fetchAcademicServicesById(props.academicId) : Promise.resolve(),
      fetchPersonnelShort(filtersPersonnelShort.value),
      fetchProvinceList(),
   ]).then((res) => {
      if (props?.actionMode === "edit" || props?.actionMode === "view") {
         if (res[0]?.code === 20000) {
            form.value = {
               ...res[0].responseObject.academic,
               provinceId: res[0].responseObject.academic.provinceID,
               subDistrictId: res[0].responseObject.academic.subDistrictID,
               districtId: res[0].responseObject.academic.districtID,
               filesDelete: [],
               roundTemp: {
                  no: "",
                  dateStart: "",
                  dateEnd: "",
               },
               targetsTemp: {
                  name: "",
                  count: "",
               },
            };
            receiveBudget.value = form.value.receiveBudget ? form.value.receiveBudget : "";
            useBudget.value = form.value.useBudget ? form.value.useBudget : "";
         }
      }
      if (res[1]?.code === 20000) {
         personnelShortList.value = res[1].responseObject.personnels;
      }
      if (res[2]?.code === 20000) {
         provinceCurrentAddressList.value = res[2].responseObject.provinceList;
         getDistrictAndSubdistrictCurrentAddressList("fetch");
      }
      isFormLoading.value = false;
      setTimeout(() => {
         isFirstRender.value = false;
      }, 100);
   });
};
const addRound = () => {
   const fail = validatorForm(form.value, validatorRound.value);
   if (fail.length == 0) {
      form.value.rounds.push({
         no: form.value.roundTemp.no,
         dateStart: genTextDate({ date: form.value.roundTemp.dateStart, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }),
         dateEnd: genTextDate({ date: form.value.roundTemp.dateEnd, oldFormat: "DD-MM-YYYY", isBuddhistYear: true }),
      });
      isAddRound.value = true;
      form.value.roundTemp = {
         no: "",
         dateStart: "",
         dateEnd: "",
      };
      setTimeout(() => {
         isAddRound.value = false;
      }, 100);
   }
};
const isOpenDeleteRound = ref(false);
let indexRound = null;
const setDialogDeleteTrainingRound = (status, index) => {
   isOpenDeleteRound.value = status;
   indexRound = index;
};
const deleteTrainingAlumni = () => {
   form.value.rounds.splice(indexRound, 1);
   setDialogDeleteTrainingRound(false, null);
};

const isOpenDeleteTarget = ref(false);
let indexTarget = null;
const setDialogDeleteTarget = (status, index) => {
   isOpenDeleteTarget.value = status;
   indexTarget = index;
};
const deleteTarget = () => {
   form.value.targets.splice(indexTarget, 1);
   setDialogDeleteTarget(false, null);
};

const addTarget = (type) => {
   if (type === "check" && form.value.targets.length > 0) {
      return;
   }

   // const fail = validatorForm(form.value, validatorTargets.value);
   // if (fail.length === 0 && type === "add") {
   //    form.value.targets.push(form.value.targetsTemp);
   //    form.value.targetsTemp = {
   //       name: "",
   //       count: "",
   //    };
   // }

   if (type === "add") {
      form.value.targets.push(form.value.targetsTemp);
      form.value.targetsTemp = {
         name: "",
         count: "",
      };
   }
};

const isOpenConfirm = ref(false);
const setDialogConfirm = (status) => {
   isOpenConfirm.value = status;
};

const submitForm = () => {
   console.log('form.value', form.value)

   setTimeout(() => {
      const fail = validatorForm(form.value, validator.value);

      addTarget("check");
      if (form.value.rounds.length > 0) {
         const checkRounds = form.value.rounds.map((i) => Object.values(i).every((i) => i)).every((x) => x);
         if (!checkRounds) {
            fail.push("rounds");
         }
      }

      // if (form.value.targets.length > 0) {
      //    const checkTargets = form.value.targets.map((i) => Object.values(i).every((i) => i)).every((x) => x);
      //    if (!checkTargets) {
      //       fail.push("targets");
      //    }
      // } else {
      //    fail.push("targets");
      // }

      // const isTargetTempEmpty = Object.values(form.value.targetsTemp).every((item) => item);
      // if (isTargetTempEmpty && form.value.targets.length === 0) {
      //    toast.add({ title: "กรุณากดเพิ่มกลุ่มเป้าหมาย", color: "red" });
      // }

      if (fail.length == 0) {
         setDialogConfirm(true);
         messageError.value = "";
      } else {
         messageError.value = "กรุณากรอกข้อมูลให้ครบถ้วน";
      }
   }, 100);
};

const handleAcademicServices = async () => {
   isLoading.value = true;
   form.value = {
      ...form.value,
      budgetSourceId: props.budgetSourceId,
      receiveBudget: receiveBudget.value,
      useBudget: useBudget.value,
   };
   const res = props.actionMode === "create" ? await addAcademicServicesMoney(form.value) : await updateAcademicServicesMoney(props?.academicId, form.value);
   if (res?.code === 20000) {
      setDialogConfirm(false);
      props.setDialogAcademicServicesForm(false, "refresh");
      toast.add({ title: res?.message, color: "green" });
   } else {
      toast.add({ title: res?.message, color: "red" });
   }
   isLoading.value = false;
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

const getSubdistrictList = async (districtId) => {
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

const receiveBudget = ref("");
const useBudget = ref("");

const genInputDecimal = (event, type) => {
   const ele = event.target;
   const decimal = parseInt(ele.getAttribute("data-decimal")) || 0;
   const val = ele.value;

   if (!isNaN(decimal)) {
      if (decimal > 0) {
         const splitVal = val.split(".");
         if (val && type === "receiveBudget") {
            receiveBudget.value = parseFloat(receiveBudget.value.toFixed(2));
         }
         if (val && type === "useBudget") {
            useBudget.value = parseFloat(useBudget.value.toFixed(2));
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
   document.getElementById("input_file_money_form").click();
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
            document.getElementById("input_file_money_form").value = "";
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
