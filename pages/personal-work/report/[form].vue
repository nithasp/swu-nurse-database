<template>
   <header class="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-2 pl-4 pr-6 py-2.5 rounded-xl bg-[#ffffffbf]">
         <img :src="route.params.form === 'create' ? ReportIcon2 : ReportIcon3" alt="personal-work-report-icon" class="w-8 h-8" />
         <p class="text-xl text-[#333333]">
            {{ route.params.form === "create" ? "เพิ่มรายงานบุคลากร" : "รายงานบุคลากร" }}
         </p>
      </div>
      <div class="flex justify-between items-center gap-3.5 mt-4 md:mt-0">
         <div class="relative">
            <UIcon
               v-if="form.info?.image && route.params.form !== 'view'"
               name="i-heroicons-x-circle-16-solid"
               class="w-5 h-5 cursor-pointer absolute right-0 top-1"
               @click="setDialogDeleteFile(true)"
            />
            <img :src="form.info?.image ? form.info?.image : AvatarPlaceholder" alt="personnel-image" class="w-20 h-20 object-cover rounded-[50%]" />
         </div>

         <div v-if="route.params.form !== 'view'">
            <ButtonUpload @click="selectFile" />
            <input type="file" accept="image/*" id="input_file_personnel_image" class="hidden" @change="changeFile" />
         </div>
      </div>
   </header>

   <div id="personnel-information">
      <form v-if="!isFormLoading">
         <div id="personnel-information-section1" class="rounded-[8px_8px_0px_0px] bg-white p-3 pt-0 xl:px-[18px] xl:py-7 xl:mt-[17.5px]">
            <div
               class="mb-6 sm:grid sm:grid-cols-[1fr_1fr] sm:gap-3 sm:mt-5 sm:mb-0 sm:relative sm:pt-8 xl:grid-cols-[80px_164px_164px_164px_164px_164px] xl:mt-0 xl:pt-0"
            >
               <div class="flex relative pt-4 mt-4 sm:absolute sm:top-[-18px] sm:z-0 sm:left-0 xl:static xl:mt-5">
                  <p class="text-sm text-gray-700 whitespace-nowrap mb-2">ภาษาไทย</p>
                  <span class="text-error-500 text-sm" v-if="route.params.form !== 'view'">*</span>
               </div>
               <div class="mb-2 sm:mt-[10px] xl:mt-0">
                  <p class="text-[#344054] text-sm mb-1.5">คำนำหน้าชื่อภายนอก</p>

                  <div>
                     <USelectMenu
                        v-model="form.info.prefixId"
                        :options="prefix"
                        placeholder="คำนำหน้าชื่อ"
                        value-attribute="id"
                        option-attribute="nameTh"
                        :disabled="route.params.form === 'view'"
                        :ui="{
                           base: `h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.prefixId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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

                     <div class="flex items-center mt-2" v-if="validator.prefixId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.prefixId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="mb-2 sm:mt-[10px] xl:mt-0">
                  <p class="text-[#344054] text-sm mb-1.5">คำนำหน้าชื่อภายใน</p>
                  <div class="">
                     <USelectMenu
                        v-model="form.info.internalPrefixId"
                        :options="internalPrefix"
                        placeholder="คำนำหน้าชื่อ"
                        value-attribute="id"
                        option-attribute="nameTh"
                        :disabled="route.params.form === 'view'"
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
                     >
                     </USelectMenu>
                  </div>
               </div>
               <div class="mb-2">
                  <p class="text-[#344054] text-sm mb-1.5">ชื่อ</p>
                  <Input
                     v-model="form.info.firstname"
                     placeholder="ชื่อ"
                     class="flex flex-col w-full text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :requireInput="{ showMessage: validator.firstname?.showMessage, message: validator.firstname?.message }"
                     @change="(event) => clearRequireOnChange({ value: event.target.value, key: 'firstname' })"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
               <div class="mb-2">
                  <p class="text-[#344054] text-sm mb-1.5">ชื่อกลาง</p>
                  <Input
                     v-model="form.info.middlename"
                     placeholder="ชื่อกลาง"
                     class="flex flex-col w-full text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
               <div class="mb-2">
                  <p class="text-[#344054] text-sm mb-1.5">นามสกุล</p>
                  <Input
                     v-model="form.info.lastname"
                     placeholder="นามสกุล"
                     class="flex flex-col w-full text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :requireInput="{ showMessage: validator.lastname?.showMessage, message: validator.lastname?.message }"
                     @change="(event) => clearRequireOnChange({ value: event.target.value, key: 'lastname' })"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
            </div>
            <div class="mb-6 sm:grid sm:grid-cols-[1fr_1fr] sm:gap-3 sm:mt-5 sm:mb-3 sm:relative xl:grid-cols-[80px_164px_164px_164px_164px_164px] xl:mb-0 xl:mt-2">
               <div class="flex sm:absolute sm:top-[-5px] sm:z-0 sm:left-0 xl:static">
                  <p class="text-sm text-gray-700 whitespace-nowrap mt-2 mb-2">ภาษาอังกฤษ</p>
                  <span class="text-error-500 text-sm mt-2" v-if="route.params.form !== 'view'">*</span>
               </div>

               <div class="mb-2 sm:mt-[32px] xl:mt-0">
                  <p class="text-[#344054] text-sm mb-1.5 xl:hidden">Prefix</p>
                  <USelectMenu
                     v-model="form.info.prefixId"
                     :options="prefix"
                     placeholder="Prefix"
                     value-attribute="id"
                     option-attribute="nameEn"
                     :disabled="route.params.form === 'view'"
                     :ui="{
                        base: `h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                           validator.prefixId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                  <div class="flex items-center mt-2" v-if="validator.prefixId?.showMessage">
                     <label class="text-error-500 text-sm">{{ validator.prefixId?.message }}</label>
                  </div>
               </div>

               <div class="mb-2 sm:mt-[32px] xl:mt-0">
                  <p class="text-[#344054] text-sm mb-1.5 xl:hidden">Prefix</p>
                  <USelectMenu
                     v-model="form.info.internalPrefixId"
                     :options="internalPrefix"
                     placeholder="Prefix"
                     value-attribute="id"
                     option-attribute="nameEn"
                     :disabled="route.params.form === 'view'"
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
                  >
                  </USelectMenu>
               </div>

               <div class="mb-2">
                  <p class="text-[#344054] text-sm mb-1.5 xl:hidden">Firstname</p>
                  <Input
                     v-model="form.info.firstnameEn"
                     placeholder="Firstname"
                     class="flex flex-col w-full text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :requireInput="{ showMessage: validator.firstnameEn?.showMessage, message: validator.firstnameEn?.message }"
                     @change="(event) => clearRequireOnChange({ value: event.target.value, key: 'firstnameEn' })"
                     :disabled="route.params.form === 'view'"
                  />
               </div>

               <div class="mb-2">
                  <p class="text-[#344054] text-sm mb-1.5 xl:hidden">Middlename</p>
                  <Input
                     v-model="form.info.middlenameEn"
                     placeholder="Middlename"
                     class="flex flex-col w-full text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="route.params.form === 'view'"
                  />
               </div>

               <div class="mb-2">
                  <p class="text-[#344054] text-sm mb-1.5 xl:hidden">Lastname</p>
                  <Input
                     v-model="form.info.lastnameEn"
                     placeholder="Lastname"
                     class="flex flex-col w-full text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :requireInput="{ showMessage: validator.lastnameEn?.showMessage, message: validator.lastnameEn?.message }"
                     @change="(event) => clearRequireOnChange({ value: event.target.value, key: 'lastnameEn' })"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
            </div>
            <div class="sm:flex sm:flex-wrap sm:gap-[12px] xl:grid xl:grid-cols-[315px_auto] xl:mt-3.5 xl:ml-[-18px]">
               <div class="xl:grid xl:grid-cols-[148px_168px] xl:gap-2.5">
                  <div class="flex justify-self-end">
                     <p class="text-sm text-gray-700 whitespace-nowrap pt-2 mb-2">
                        <span>ชื่อล็อคอินเข้าใช้งาน</span>
                        <span class="text-error-500 text-sm" v-if="route.params.form !== 'view'">*&nbsp;</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <Input
                     v-model="form.username"
                     placeholder="ชื่อล็อคอินเข้าใช้งาน"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :requireInput="{ showMessage: validator.username?.showMessage, message: validator.username?.message }"
                     @change="
                        (event) => {
                           clearRequireOnChange({ value: event.target.value, key: 'username' });
                        }
                     "
                     :disabled="route.params.form === 'view' || route.params.form === 'edit'"
                  />
               </div>
               <div class="w-full sm:w-[calc(50%-6px)] xl:grid xl:grid-cols-[148px_168px] xl:gap-2.5">
                  <div class="flex justify-self-end">
                     <p class="text-sm text-gray-700 whitespace-nowrap pt-2 mb-2">
                        <span>ระดับการใช้งาน</span>
                        <span class="text-error-500 text-sm" v-if="route.params.form !== 'view'">*&nbsp;</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <div>
                     <USelectMenu
                        v-model="form.roles"
                        :options="roles"
                        placeholder="-- เลือก --"
                        multiple
                        value-attribute="id"
                        option-attribute="name"
                        :disabled="route.params.form === 'view'"
                        :ui="{
                           base: `h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.roles?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
                           }`,
                           rounded: 'rounded-lg',
                           placeholder: 'text-gray-100',
                        }"
                        :uiMenu="{
                           ring: 'ring-gray-100',
                           option: {
                              active: 'bg-gray-50',
                           },
                           label: 'text-sm text-gray-100',
                           input: 'border-gray-100 placeholder:text-gray-100',
                        }"
                        @change="
                           () => {
                              if (form.roles.length === 0) {
                                 form.roles.push(roles.find((i) => i.isFixed)?.id);
                              }
                           }
                        "
                     >
                        <template #label>
                           <span v-if="form.roles.length > 0" class="truncate">
                              {{ getRoleLabel() }}
                           </span>
                        </template>
                     </USelectMenu>

                     <div class="flex items-center mt-2" v-if="validator.roles?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.roles?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="xl:grid xl:grid-cols-[148px_168px] xl:gap-2.5" v-if="route.params.form === 'create'">
                  <div class="flex justify-self-end">
                     <p class="text-sm text-gray-700 whitespace-nowrap pt-2 mb-2 xl:mb-0">
                        <span>รหัสผ่าน</span>
                        <span class="text-error-500 text-sm" v-if="route.params.form !== 'view'">*&nbsp;</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <Input
                     v-model="form.password"
                     type="password"
                     placeholder="รหัสผ่าน"
                     class="flex flex-col text-sm whitespace-nowrap"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :requireInput="{ showMessage: validator.password?.showMessage, message: validator.password?.message }"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
               <div class="xl:grid xl:grid-cols-[148px_168px] xl:gap-2.5" v-if="route.params.form === 'create'">
                  <div class="flex justify-self-end">
                     <p class="text-sm text-gray-700 whitespace-nowrap pt-2 mb-2 xl:mb-0">
                        <span>ยืนยันรหัสผ่าน</span>
                        <span class="text-error-500 text-sm" v-if="route.params.form !== 'view'">*&nbsp;</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <div>
                     <Input
                        v-model="confirmPassword"
                        type="password"
                        placeholder="ยืนยันรหัสผ่าน"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :requireInput="{
                           showMessage: checkConfirmPassword() ? true : validator.confirmPassword?.showMessage,
                           message: checkConfirmPassword() ? 'รหัสผ่านไม่ตรงกัน' : validator.confirmPassword?.message,
                        }"
                        @change="(event) => clearRequireOnChange({ value: event.target.value, key: 'confirmPassword' })"
                        :disabled="route.params.form === 'view'"
                     />
                  </div>
               </div>
               <div class="w-full sm:w-[calc(50%-6px)] xl:grid xl:grid-cols-[148px_168px] xl:gap-2.5">
                  <div class="flex justify-self-end">
                     <p class="text-sm text-gray-700 whitespace-nowrap pt-2 mb-2">
                        <span>สถานะการใช้งาน</span>
                        <span class="text-error-500 text-sm" v-if="route.params.form !== 'view'">*&nbsp;</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <div>
                     <USelectMenu
                        v-model="form.enabled"
                        :options="usageStatus"
                        placeholder="สถานะการใช้งาน"
                        value-attribute="id"
                        option-attribute="name"
                        :disabled="route.params.form === 'view'"
                        :ui="{
                           base: `h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.enabled?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                     <div class="flex items-center mt-2" v-if="validator.enabled?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.enabled?.message }}</label>
                     </div>
                  </div>
               </div>
            </div>
            <div class="flex justify-end mt-5">
               <ButtonChangePassword type="button" v-if="route.params.form === 'edit'" @click="setDialogChangePersonnelPassword(true)" />
            </div>
         </div>
         <div id="personnel-information-section2" class="bg-white">
            <h1 class="text-white text-xl px-5 py-1.5 bg-primary-500 rounded-t-lg">รายละเอียดทั่วไป</h1>
            <div :class="[route.params.form !== 'view' ? 'xl:gap-y-1' : 'xl:gap-y-3', 'grid grid-cols-[1fr] gap-3 p-3 bg-white md:grid-cols-[1fr_1fr]']">
               <div class="grid sm:grid-cols-[1fr] gap-2.5 items-center xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div :class="[validator.gender?.showMessage ? 'pb-5' : '', 'flex xl:justify-self-end']">
                     <p class="text-sm text-gray-700">
                        <span>เพศ</span>
                        <span class="text-error-500 text-sm" v-if="route.params.form !== 'view'">*&nbsp;</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <div
                     :class="[validator.gender?.showMessage ? 'pt-2' : '', route.params.form === 'view' ? 'block' : 'flex items-start gap-2.5 md:items-center', '']"
                  >
                     <div v-if="route.params.form === 'view'" class="text-sm">
                        <Input
                           v-model="form.info.gender"
                           type="text"
                           placeholder="เพศ"
                           class="flex flex-col text-sm"
                           heightClass="h-[38px]"
                           placeholderColor="text-gray-100"
                           :disabled="route.params.form === 'view'"
                        />
                     </div>
                     <div v-else>
                        <URadioGroup
                           class="gender-group"
                           v-model="form.info.gender"
                           :options="[
                              {
                                 value: 'ชาย',
                                 label: 'ชาย',
                              },
                              {
                                 value: 'หญิง',
                                 label: 'หญิง',
                              },
                           ]"
                           :ui="{
                              fieldset: 'flex gap-5',
                           }"
                        />
                        <div class="flex items-center mt-2" v-if="validator.gender?.showMessage">
                           <label class="text-error-500 text-sm">{{ validator.gender?.message }}</label>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>เลขที่หนังสือเดินทาง</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <Input
                     v-model="form.info.passportNo"
                     placeholder="เลขที่หนังสือเดินทาง"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>เลขประจำตัวประชาชน</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>

                  <div :class="validator.dateStartedAtSwu?.showMessage ? 'mt-[-28px] xl:!mt-0' : ''">
                     <input
                        type="text"
                        v-model="form.info.citizenId"
                        @input="formatIdCitizenInput"
                        @change="() => isCitizenIdError()"
                        maxlength="17"
                        placeholder="เลขบัตรประจำตัวประชาชน 13 หลัก"
                        :disabled="route.params.form === 'view'"
                        class="leading-[3] placeholder:text-gray-100 placeholder:h-full placeholder:text-sm rounded-lg px-[14px] w-full border border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed text-sm flex flex-col h-[38px]"
                     />
                     <!-- <div class="flex items-center mt-2" v-if="validator.citizenId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.citizenId?.message }}</label>
                     </div> -->

                     <div class="flex items-center mt-2" v-if="isCitizenIdErrorRef">
                        <label class="text-error-500 text-sm">เลขประจำตัวประชาชนต้องมี 13 หลัก</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>วันที่เริ่มทำงานที่ มศว.</span>
                        <span class="text-error-500 text-sm" v-if="route.params.form !== 'view'">*&nbsp;</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <Datepicker
                     class="text-sm"
                     inputId="dateStartedAtSwu"
                     v-model="form.info.dateStartedAtSwu"
                     :placeholder="'วัน/เดือน/ปี'"
                     inputHeight="h-[38px]"
                     :requireInput="{ showMessage: validator.dateStartedAtSwu?.showMessage, message: validator.dateStartedAtSwu?.message }"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>วันที่เริ่มรับราชการ</span>
                        <span class="text-error-500 text-sm" v-if="route.params.form !== 'view'">*&nbsp;</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <Datepicker
                     :class="(validator.personnelTypeId?.showMessage ? 'mt-[-28px] xl:!mt-0' : '', 'text-sm')"
                     inputId="dateStartedGov"
                     v-model="form.info.dateStartedGov"
                     :placeholder="'วัน/เดือน/ปี'"
                     inputHeight="h-[38px]"
                     :requireInput="{ showMessage: validator.dateStartedGov?.showMessage, message: validator.dateStartedGov?.message }"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>ประเภทบุคลากร</span>
                        <span class="text-error-500 text-sm" v-if="route.params.form !== 'view'">*&nbsp;</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <div :class="validator.dateStartedGov?.showMessage ? 'mt-[-28px] xl:!mt-0' : ''">
                     <USelectMenu
                        v-model="form.info.personnelTypeId"
                        :options="personnelType"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="nameTh"
                        :search-attributes="['nameTh']"
                        :disabled="route.params.form === 'view'"
                        :ui="{
                           base: `h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                              validator.personnelTypeId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                     <div class="flex items-center mt-2" v-if="validator.personnelTypeId?.showMessage">
                        <label class="text-error-500 text-sm">{{ validator.personnelTypeId?.message }}</label>
                     </div>
                  </div>
               </div>
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>วันที่รายงานตัว</span>
                        <span class="text-error-500 text-sm" v-if="route.params.form !== 'view'">*&nbsp;</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <Datepicker
                     class="text-sm"
                     inputId="dateReportToWork"
                     v-model="form.info.dateReportToWork"
                     :placeholder="'วัน/เดือน/ปี'"
                     inputHeight="h-[38px]"
                     :requireInput="{ showMessage: validator.dateReportToWork?.showMessage, message: validator.dateReportToWork?.message }"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
               <div class="hidden grid-cols-[1fr] gap-2.5 items-center md:grid xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]"></div>
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>สถานภาพบุคลากร</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <USelectMenu
                     v-model="form.info.personnelStatusId"
                     :options="personnelStatus"
                     placeholder="-- เลือก --"
                     value-attribute="id"
                     option-attribute="nameTh"
                     :search-attributes="['nameTh']"
                     :disabled="route.params.form === 'view'"
                     :ui="{
                        base: `h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100`,
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
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>เลขที่สมาชิกสภาการพยาบาล</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <Input
                     v-model="form.info.nursingMembershipNo"
                     placeholder="เลขที่สมาชิกสภาการพยาบาล"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:pt-0 xl:justify-self-end">
                     <div class="text-sm text-gray-700 xl:text-right">
                        <span>เลขที่ใบประกอบวิชาชีพ</span>
                        <div class="hidden xl:block"></div>
                        <span>การพยาบาลและผดุงครรภ์ ชั้น 1</span>
                        <span>:&nbsp;</span>
                     </div>
                  </div>
                  <Input
                     v-model="form.info.professtionalLicenseNo"
                     placeholder="เลขที่ใบประกอบวิชาชีพ"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>วันหมดอายุ</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <Datepicker
                     class="text-sm"
                     inputId="expirationDate"
                     v-model="form.info.dateNursingMembershipExpired"
                     :placeholder="'วัน/เดือน/ปี'"
                     inputHeight="h-[38px]"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>วันเริ่ม</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <Datepicker
                     class="text-sm"
                     inputId="dateStarted"
                     v-model="form.info.dateStarted"
                     :placeholder="'วัน/เดือน/ปี'"
                     inputHeight="h-[38px]"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>เลขที่สมาชิกสมาคมพยาบาล</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <Input
                     v-model="form.info.nursingAssociationNo"
                     placeholder="เลขที่สมาชิกสมาคมพยาบาล"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>วันหมดอายุสมาชิกสมาคมฯ</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <div class="grid grid-cols-[107px_auto] gap-4 items-center">
                     <Checkbox v-model="form.info.nursingAssociationExpireType" label="ตลอดชีพ" :disabled="openDialogMode === 'view'" />
                     <Datepicker
                        class="text-sm"
                        inputId="dateNursingAssociationExpired"
                        v-model="form.info.dateNursingAssociationExpired"
                        :placeholder="'วัน/เดือน/ปี'"
                        inputHeight="h-[38px]"
                        :disabled="route.params.form === 'view' || form.info.nursingAssociationExpireType"
                     />
                  </div>
               </div>
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>เหตุผลที่พ้นจากราชการ</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <Input
                     v-model="form.info.reasonForRetirement"
                     placeholder="เหตุผลที่พ้นจากราชการ"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>วันที่พ้นจากราชการ</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <Datepicker
                     class="text-sm"
                     inputId="dateOfRetirement"
                     v-model="form.info.dateOfRetirement"
                     :placeholder="'วัน/เดือน/ปี'"
                     inputHeight="h-[38px]"
                     :disabled="route.params.form === 'view'"
                  />
               </div>

               <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                  <div class="flex pt-2 xl:justify-self-end">
                     <p class="text-sm text-gray-700">
                        <span>รายละเอียดที่ออกจากราชการ</span>
                        <span>:&nbsp;</span>
                     </p>
                  </div>
                  <Input
                     v-model="form.info.detailForRetirement"
                     placeholder="รายละเอียดที่ออกจากราชการ"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="route.params.form === 'view'"
                  />
               </div>
            </div>

            <div class="flex flex-wrap gap-2 justify-end p-3">
               <ButtonEdit v-if="route.params.form === 'view'" @click="toEditMode" />
               <ButtonSave v-else @click="submitForm" />
               <ButtonCancel to="/personal-work/report" />
            </div>
         </div>
      </form>
      <SkeletonForm v-else :count="12" />
   </div>

   <div class="mt-16" v-if="route.params.form !== 'create'">
      <div class="flex gap-4 justify-between overflow-x-auto p-2.5">
         <div
            class="item text-base text-[#333333] font-bold whitespace-nowra relative"
            :class="[item.id === currentTab ? 'text-primary-500' : '', 'item text-base text-[#333333] font-bold whitespace-nowrap cursor-pointer']"
            v-for="item in tabItems"
            :key="`menu-${item.id}`"
            @click="currentTab = item.id"
         >
            {{ item.title }}
            <div v-if="item.id === currentTab" class="absolute bottom-[-5px] -translate-x-2/4 left-2/4 w-[108%] h-[2px] bg-primary-500"></div>
         </div>
      </div>
      <div class="mt-1">
         <PersonnelHistory v-if="currentTab === 'personal-history'" :personnelId="route.query?.id" :mode="route.params.form" />
         <PersonnelAddress v-if="currentTab === 'personnel-address'" :personnelId="route.query?.id" :mode="route.params.form" />
         <CurrentRateHoldingInformation v-if="currentTab === 'current-rate-holding-information'" :personnelId="route.query?.id" :mode="route.params.form" />
         <EducationalInformation v-if="currentTab === 'educational-information'" :personnelId="route.query?.id" :mode="route.params.form" />
         <FurtherEducationInformation v-if="currentTab === 'further-education-information'" :personnelId="route.query?.id" :mode="route.params.form" />
         <TrainingInformation v-if="currentTab === 'training-information'" :personnelId="route.query?.id" :modePersonnel="route.params.form" />
         <ContractRenewalInformation v-if="currentTab === 'contract-renewal-information'" :personnelId="route.query?.id" :modePersonnel="route.params.form" />
         <LeaveInformation v-if="currentTab === 'leave-information'" :personnelId="route.query?.id" :modePersonnel="route.params.form" />
         <CvDocument v-if="currentTab === 'cv-document'" :personnelId="route.query?.id" :modePersonnel="route.params.form" />
      </div>
   </div>
   <DialogChangePersonnelPassword
      :isOpenChangePersonnelPassword="isOpenChangePersonnelPassword"
      :setDialog="setDialogChangePersonnelPassword"
      :personnelId="route.query?.id"
   />
   <DialogConfirm
      :isOpen="isOpenDialogConfirm"
      :setDialog="setDialogConfirm"
      title="บันทึกข้อมูล"
      desc="คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่"
      icon="success"
      :btnAction="handlePersonnel"
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
import Checkbox from "~/components/form/checkbox";
import Datepicker from "~/components/form/datepicker";
import Loading from "~/components/loading";

import AvatarPlaceholder from "~/assets/images/placeholder/avatar-placeholder.png";
import ReportIcon2 from "~/assets/images/personal-work/report/report-icon2.png";
import ReportIcon3 from "~/assets/images/personal-work/report/report-icon3.png";

import ButtonUpload from "~/components/button/upload";
import ButtonEdit from "~/components/button/edit";
import ButtonSave from "~/components/button/save";
import ButtonCancel from "~/components/button/cancel";
import ButtonChangePassword from "~/components/button/changePassword";

import DialogChangePersonnelPassword from "~/components/dialog/personal-work/changePersonnelPassword";
import DialogConfirm from "~/components/dialog/confirm";

import SkeletonForm from "~/components/ui/skeleton/form";

import PersonnelAddress from "~/components/personal-work/report/personnelAddress";
import ContractRenewalInformation from "~/components/personal-work/report/contractRenewalInformation";
import CurrentRateHoldingInformation from "~/components/personal-work/report/currentRateHoldingInformation";
import CvDocument from "~/components/personal-work/report/cvDocument";
import EducationalInformation from "~/components/personal-work/report/educationalInformation";
import FurtherEducationInformation from "~/components/personal-work/report/furtherEducationInformation/furtherEducationInformation.vue";
import LeaveInformation from "~/components/personal-work/report/leaveInformation";
import PersonnelHistory from "~/components/personal-work/report/personnelHistory";
import TrainingInformation from "~/components/personal-work/report/trainingInformation";

import useReportAPI from "~/service/api/report";
const { fetchPersonnelDetail, addPersonnel, updatePersonnel, uploadPersonnelImage } = useReportAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const { fetchPrefixList, fetchInternalPrefixList, fetchPersonnelTypeList, fetchPersonnelStatusList } = useMasterDataAPI;

import useRoleAPI from "~/service/api/role";
const { fetchRolesList } = useRoleAPI;

const toast = useToast();
const route = useRoute();
const isLoading = ref(false);
const isFormLoading = ref(false);
const form = ref({
   username: "",
   password: "",
   enabled: false,
   roles: [],
   info: {
      prefixId: 0,
      internalPrefixId: 0,
      firstname: "",
      middlename: "",
      lastname: "",
      firstnameEn: "",
      middlenameEn: "",
      lastnameEn: "",
      gender: "",
      citizenId: "",
      dateStarted: "",
      dateStartedGov: "",
      personnelStatusId: 0,
      professtionalLicenseNo: "",
      dateOfRetirement: "",
      passportNo: "",
      dateStartedAtSwu: "",
      personnelTypeId: 0,
      dateReportToWork: "",
      nursingMembershipNo: "",
      dateNursingMembershipExpired: "",
      reasonForRetirement: "",
      detailForRetirement: "",
      image: "",
      imageId: 0,

      nursingAssociationNo: "",
      nursingAssociationExpireType: 0,
      dateNursingAssociationExpired: ""
   },
});
const validator = ref({
   prefixId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   firstname: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   lastname: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   firstnameEn: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   lastnameEn: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   username: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   password: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   confirmPassword: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   roles: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
      type: "array",
   },
   enabled: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },

   // รายละเอียดทั่วไป
   gender: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   dateStartedAtSwu: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   dateStartedGov: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   personnelTypeId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   dateReportToWork: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   citizenId: {
      showMessage: false,
      message: "เลขประจำตัวประชาชนต้องมี 13 หลัก",
   },
});

const prefix = ref([]);
const internalPrefix = ref([]);
const personnelType = ref([]);
const personnelStatus = ref([]);
const roles = ref([]);
const usageStatus = ref([
   { id: 1, status: true, name: "เปิด" },
   { id: 2, status: false, name: "ปิด" },
]);
const enabledStatus = ref(0);
const confirmPassword = ref("");
const currentTab = ref("");
const tabItems = ref([
   { title: "ประวัติส่วนตัว", id: "personal-history" },
   { title: "ที่อยู่", id: "personnel-address" },
   {
      title: "ข้อมูลการถือครองอัตราปัจจุบัน",
      id: "current-rate-holding-information",
   },
   { title: "ข้อมูลการศึกษา", id: "educational-information" },
   { title: "ข้อมูลการศึกษาต่อ", id: "further-education-information" },
   { title: "ข้อมูลการฝึกอบรม", id: "training-information" },
   { title: "ข้อมูลการต่อสัญญา", id: "contract-renewal-information" },
   { title: "ข้อมูลการลา", id: "leave-information" },
   { title: "เอกสาร CV", id: "cv-document" },
]);

const filtersRole = ref({
   keyword: "",
   enabled: 1,
   permissionIds: [],
   max: -1,
   offset: 0,
   currentPage: 1,
});

const isViewOrEditMode = (route.params.form === "view" || route.params.form === "edit") && route.query.id;

onMounted(() => {
   currentTab.value = tabItems.value[0].id;
   getData();
});

watch(
   () => form.value.password,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "password" });
      if (confirmPassword) {
         clearRequireOnChange({ value: newData, key: "confirmPassword" });
      }
   }
);

watch(
   () => form.value.info.prefixId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "prefixId" });
   }
);
watch(
   () => form.value.roles,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "roles", type: "array" });
   }
);
watch(
   () => form.value.enabled,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "enabled" });
   }
);
watch(
   () => form.value.info.gender,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "gender" });
   }
);
watch(
   () => form.value.info.personnelTypeId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "personnelTypeId" });
   }
);

watch(
   () => form.value.info.dateStartedAtSwu,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "dateStartedAtSwu" });
   }
);
watch(
   () => form.value.info.dateStartedGov,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "dateStartedGov" });
   }
);
watch(
   () => form.value.info.dateReportToWork,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "dateReportToWork" });
   }
);
watch(
   () => form.value.info.nursingAssociationExpireType,
   (newData) => {
      if (form.value.info.nursingAssociationExpireType) {
         form.value.info.dateNursingAssociationExpired = "";
      }
      clearRequireOnChange({ value: newData, key: "dateReportToWork" });
   }
);
const getData = () => {
   isFormLoading.value = true;
   Promise.all([
      fetchPrefixList(),
      fetchInternalPrefixList(),
      fetchPersonnelTypeList(),
      fetchPersonnelStatusList(),
      fetchRolesList(filtersRole.value),
      isViewOrEditMode ? fetchPersonnelDetail(route.query.id) : Promise.resolve(),
   ]).then((res) => {
      if (res[0]?.code === 20000) {
         prefix.value = res[0].responseObject.prefixList;
      }
      if (res[1]?.code === 20000) {
         internalPrefix.value = res[1].responseObject.internalPrefixList;
      }
      if (res[2]?.code === 20000) {
         personnelType.value = res[2].responseObject.personnelTypeList;
      }
      if (res[3]?.code === 20000) {
         personnelStatus.value = res[3].responseObject.personnelStatusList;
      }
      if (res[4]?.code === 20000) {
         roles.value = res[4].responseObject.roles;
         roles.value.sort((a, b) => b.isDefault - a.isDefault);
         if (!route.query.id) {
            const roleDefaultValue = roles.value.find((i) => i.isFixed)?.id;
            form.value.roles.push(roleDefaultValue);
         }
      }
      if (isViewOrEditMode) {
         if (res[5]?.code === 20000) {
            let personnelDetail = res[5].responseObject;
            form.value = {
               ...personnelDetail,
               enabled: personnelDetail.enabled ? 1 : 0,
               roles: personnelDetail.roles.map((i) => (route.params.form === "edit" ? i.id : i)),
               info: {
                  ...personnelDetail.info,
                  nursingAssociationExpireType: personnelDetail.info.nursingAssociationExpireType === 2 ? true : false,
               },
            };
         }
      }
      isFormLoading.value = false;
   });
};

const getPersonnelDetail = async () => {
   isLoading.value = true;
   const res = await fetchPersonnelDetail(route.query.id);
   if (res?.code === 20000) {
      let personnelDetail = res.responseObject;
      form.value = {
         ...personnelDetail,
         enabled: personnelDetail.enabled ? 1 : 0,
         roles: personnelDetail.roles.map((i) => (route.params.form === "edit" ? i.id : i)),
         info: {
            ...personnelDetail.info,
            dateStartedAtSwu: genTextDate({
               date: personnelDetail.info.dateStartedAtSwu,
               format: "DD-MM-YYYY  ",
               oldFormat: "YYYY-MM-DDTHH:mm:ssZ",
               isBuddhistYear: false,
            }),

            dateStarted: genTextDate({ date: personnelDetail.info.dateStarted, format: "DD-MM-YYYY  ", oldFormat: "YYYY-MM-DDTHH:mm:ssZ", isBuddhistYear: false }),

            dateStartedGov: genTextDate({
               date: personnelDetail.info.dateStartedGov,
               format: "DD-MM-YYYY  ",
               oldFormat: "YYYY-MM-DDTHH:mm:ssZ",
               isBuddhistYear: false,
            }),

            dateOfRetirement: genTextDate({
               date: personnelDetail.info.dateOfRetirement,
               format: "DD-MM-YYYY  ",
               oldFormat: "YYYY-MM-DDTHH:mm:ssZ",
               isBuddhistYear: false,
            }),

            dateReportToWork: genTextDate({
               date: personnelDetail.info.dateReportToWork,
               format: "DD-MM-YYYY  ",
               oldFormat: "YYYY-MM-DDTHH:mm:ssZ",
               isBuddhistYear: false,
            }),

            dateNursingMembershipExpired: genTextDate({
               date: personnelDetail.info.dateNursingMembershipExpired,
               format: "DD-MM-YYYY  ",
               oldFormat: "YYYY-MM-DDTHH:mm:ssZ",
               isBuddhistYear: false,
            }),
         },
      };
   }
   isLoading.value = false;
};

const isOpenChangePersonnelPassword = ref(false);
const setDialogChangePersonnelPassword = (status, type) => {
   isOpenChangePersonnelPassword.value = status;
   if (type === "changePersonnelPassword") {
      getPersonnelDetail();
   }
};

const isOpenDialogConfirm = ref(false);
const setDialogConfirm = (status) => {
   isOpenDialogConfirm.value = status;
};

const handlePersonnel = async () => {
   isLoading.value = true;
   delete form.value.info.image;
   const res = route.params.form === "create" ? await addPersonnel(form.value) : await updatePersonnel(route.query.id, form.value);
   if (res?.code === 20000) {
      navigateTo("/personal-work/report");
   } else {
      toast.add({ title: res?.message, color: "red" });
      setDialogConfirm(false);
   }
   isLoading.value = false;
};

const getRoleLabel = () => {
   return roles.value
      .filter((role) =>
         form.value.roles.some((roleValue) => (route.params.form === "create" || route.params.form === "edit" ? roleValue === role.id : roleValue.id === role.id))
      )
      .map((i) => i.name)
      .join(", ");
};

const selectFile = () => {
   document.getElementById("input_file_personnel_image").click();
};

const changeFile = async (event) => {
   if (event.target.files) {
      isLoading.value = true;
      const res = await uploadPersonnelImage(event.target.files[0]);
      isLoading.value = false;
      if (res) {
         form.value.info.imageId = res.responseObject?.fileId;
         form.value.info.image = res.responseObject?.url;
      }
      document.getElementById("input_file_personnel_image").value = "";
   }
};
const fnDeleteFile = () => {
   form.value.info.imageId = -1;
   form.value.info.image = "";
   setDialogDeleteFile(false);
};
const isOpenDeleteFile = ref(false);
const setDialogDeleteFile = (status) => {
   isOpenDeleteFile.value = status;
};
const toEditMode = () => {
   navigateTo(`/personal-work/report/edit?id=${route.query?.id}`);
};

const submitForm = () => {
   const formMerged = {
      ...form.value.info,
      username: form.value.username,
      password: form.value.password,
      confirmPassword: confirmPassword.value,
      enabled: form.value.enabled,
      roles: form.value.roles,
   };
   if (route.params.form === "edit") {
      //delete formMerged.username;
      delete formMerged.password;
      delete formMerged.confirmPassword;
   }
   let fail = validatorForm(formMerged, validator.value);
   let failEditMode = fail.filter((i) => !["username", "password", "confirmPassword"].includes(i));

   if (form.value.password !== confirmPassword.value) {
      fail.push("confirmPassword");
   }

   // if (form.value.info.citizenId && form.value.info.citizenId.length < 17) {
   //    fail.push("citizenId");
   //    failEditMode.push("citizenId");
   //    validator.value.citizenId.showMessage = true;
   // } else {
   //    validator.value.citizenId.showMessage = false;
   //    fail = fail.filter(item => item !== 'citizenId');
   //    failEditMode = failEditMode.filter(item => item !== 'citizenId');
   // }

   if (!isCitizenIdErrorRef.value) {
      fail = fail.filter((item) => item !== "citizenId");
      failEditMode = failEditMode.filter((item) => item !== "citizenId");
   }

   if (route.params.form === "edit" && failEditMode.length === 0 && !isCitizenIdErrorRef.value) {
      setDialogConfirm(true);
   } else if (fail.length === 0 && !isCitizenIdErrorRef.value) {
      setDialogConfirm(true);
   } else {
      toast.add({ title: "กรุณากรอกข้อมูลให้ครบถ้วน", color: "red" });
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

      const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (options.key === "username") {
         if (form.value.username && !regexEmail.test(form.value.username)) {
            validator.value.username.showMessage = true;
            validator.value.username.message = "รูปแบบอีเมลไม่ถูกต้อง";
         }
         if (!form.value.username) {
            validator.value.username.showMessage = true;
            validator.value.username.message = "กรอกข้อมูลไม่ครบถ้วน";
         }
      }

      const regexPassword = /^.{8,20}$/;
      if (options.key === "password") {
         if (form.value.password && !regexPassword.test(form.value.password)) {
            validator.value.password.showMessage = true;
            validator.value.password.message = "รหัสผ่านต้องอยู่ระหว่าง 8-20 ตัว";
         }
         if (!form.value.password) {
            validator.value.password.showMessage = true;
            validator.value.password.message = "กรอกข้อมูลไม่ครบถ้วน";
         }
      }
   }
};

const checkConfirmPassword = () => {
   if (form.value.password) {
      if (confirmPassword.value && form.value.password !== confirmPassword.value) {
         return true;
      }
   }
};

const formatIdCitizenInput = () => {
   let input = form.value.info.citizenId.replace(/\D/g, "");
   let formatted = "";
   if (input.length > 0) formatted += input.substring(0, 1);
   if (input.length >= 2) formatted += "-" + input.substring(1, 5);
   if (input.length >= 6) formatted += "-" + input.substring(5, 10);
   if (input.length >= 11) formatted += "-" + input.substring(10, 12);
   if (input.length >= 13) formatted += "-" + input.substring(12, 13);

   form.value.info.citizenId = formatted;
};

const isCitizenIdErrorRef = ref(false);
const isCitizenIdError = () => {
   if (form.value.info.citizenId && form.value.info.citizenId.length < 17) {
      isCitizenIdErrorRef.value = true;
   } else {
      isCitizenIdErrorRef.value = false;
   }
};
</script>
