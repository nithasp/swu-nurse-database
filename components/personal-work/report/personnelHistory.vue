<template>
   <form v-if="!isFormLoading">
      <div class="bg-white">
         <h1 class="text-white text-xl px-5 py-1.5 bg-primary-500 rounded-t-lg">ข้อมูลส่วนตัว</h1>
         <div :class="[mode !== 'view' ? 'xl:gap-y-1' : 'xl:gap-y-3', 'grid grid-cols-[1fr] gap-3 p-3 bg-white md:grid-cols-[1fr_1fr] ']">
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>วันเกิด</span>
                     <span v-if="mode !== 'view'" class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <Datepicker
                  class="text-sm"
                  inputId="dateOfBirth"
                  v-model="form.personnelHistory.dateOfBirth"
                  :placeholder="'วันเกิด'"
                  inputHeight="h-[38px]"
                  :requireInput="{ showMessage: validator.dateOfBirth?.showMessage, message: validator.dateOfBirth?.message }"
                  :disabled="mode === 'view'"
               />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>หมู่เลือด</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <div>
                  <div
                     :class="[
                        validator.dateOfBirth?.showMessage ? 'md:-mt-[27px] xl:mt-0' : '',
                        'mobile:grid grid-cols-[1fr_auto_1fr] mobile:items-center mobile:gap-3',
                     ]"
                  >
                     <USelectMenu
                        v-model="form.personnelHistory.bloodTypeId"
                        :options="bloodTypeList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="nameTh"
                        :disabled="mode === 'view'"
                        :ui="{
                           base: 'w-full h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100',
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
                     <span class="text-sm my-3">RH</span>
                     <USelectMenu
                        v-model="form.personnelHistory.bloodTypeRhId"
                        :options="bloodTypeRhList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        :disabled="mode === 'view'"
                        :ui="{
                           base: 'w-full h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100',
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
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex items-center xl:justify-self-end">
                  <p class="text-sm text-gray-700">
                     <span>อายุ</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <div class="flex items-center gap-4">
                  <div class="flex items-center">
                     <div class="w-14">
                        <Input
                           v-model="form.personnelHistory.ageYears"
                           class="flex flex-col text-sm"
                           heightClass="h-[38px]"
                           placeholderColor="text-gray-100"
                           disabled="true"
                        />
                     </div>
                     <span class="ml-3.5 text-sm">ปี :</span>
                  </div>
                  <div class="flex items-center">
                     <div class="w-14">
                        <Input
                           v-model="form.personnelHistory.ageMonths"
                           placeholder=""
                           class="flex flex-col text-sm"
                           heightClass="h-[38px]"
                           placeholderColor="text-gray-100"
                           disabled="true"
                        />
                     </div>
                     <span class="ml-3.5 text-sm">เดือน</span>
                  </div>
               </div>
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>เชื้อชาติ</span>
                     <span v-if="mode !== 'view'" class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <div>
                  <USelectMenu
                     v-model="form.personnelHistory.ethnicityId"
                     :options="ethnicityList"
                     placeholder="-- เลือก --"
                     value-attribute="id"
                     option-attribute="name"
                     searchable
                     searchable-placeholder="ค้นหาเชื้อชาติ"
                     :search-attributes="['name']"
                     :disabled="mode === 'view'"
                     :ui="{
                        base: `h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                           validator.ethnicityId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                  <div class="flex items-center mt-2" v-if="validator.ethnicityId?.showMessage">
                     <label class="text-error-500 text-sm">{{ validator.ethnicityId?.message }}</label>
                  </div>
               </div>
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>วันที่เกษียณราชการ</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <Input
                  v-if="form.personnelHistory.dateOfBirth"
                  v-model="form.personnelHistory.dateOfRetirement"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  disabled="true"
               />
               <Input v-else class="flex flex-col text-sm" heightClass="h-[38px]" placeholderColor="text-gray-100" disabled="true" />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>สถานะทางการทหาร</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <USelectMenu
                  v-model="form.personnelHistory.militaryServiceStatusId"
                  :options="militaryServiceStatusList"
                  placeholder="-- เลือก --"
                  value-attribute="id"
                  option-attribute="nameTh"
                  :disabled="mode === 'view'"
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
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>สัญชาติ</span>
                     <span v-if="mode !== 'view'" class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <div>
                  <USelectMenu
                     v-model="form.personnelHistory.nationalityId"
                     :options="nationalityList"
                     placeholder="-- เลือก --"
                     value-attribute="id"
                     option-attribute="nameTh"
                     searchable
                     searchable-placeholder="ค้นหาสัญชาติ"
                     :search-attributes="['nameTh']"
                     :disabled="mode === 'view'"
                     :ui="{
                        base: `h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                           validator.nationalityId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                  <div class="flex items-center mt-2" v-if="validator.nationalityId?.showMessage">
                     <label class="text-error-500 text-sm">{{ validator.nationalityId?.message }}</label>
                  </div>
               </div>
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>โรคประจำตัว</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <Input
                  v-model="form.personnelHistory.chronicDisease"
                  placeholder="โรคประจำตัว"
                  :class="[validator.nationalityId?.showMessage ? 'md:-mt-[27px] xl:mt-0' : '', 'flex flex-col text-sm']"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>ศาสนา</span>
                     <span v-if="mode !== 'view'" class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <div>
                  <USelectMenu
                     v-model="form.personnelHistory.religionId"
                     :options="religionList"
                     placeholder="-- เลือก --"
                     value-attribute="id"
                     option-attribute="nameTh"
                     searchable
                     searchable-placeholder="ค้นหาศาสนา"
                     :search-attributes="['nameTh']"
                     :disabled="mode === 'view'"
                     :ui="{
                        base: `h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                           validator.religionId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                  <div class="flex items-center mt-2" v-if="validator.religionId?.showMessage">
                     <label class="text-error-500 text-sm">{{ validator.religionId?.message }}</label>
                  </div>
               </div>
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <div class="text-sm text-gray-700 mt-2 xl:text-right">
                     <span>เป็นบุตรคนที่</span>
                     <span>:&nbsp;</span>
                  </div>
               </div>
               <Input
                  type="number"
                  v-model="form.personnelHistory.orderInSibling"
                  placeholder="เป็นบุตรคนที่"
                  :class="[validator.religionId?.showMessage ? 'md:-mt-[27px] xl:mt-0' : '', 'flex flex-col text-sm']"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>สถานะทางครอบครัว</span>
                     <span v-if="mode !== 'view'" class="text-error-500 text-sm">*&nbsp;</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <div>
                  <USelectMenu
                     v-model="form.personnelHistory.maritalStatusId"
                     :options="maritalStatusList"
                     placeholder="-- เลือก --"
                     value-attribute="id"
                     option-attribute="nameTh"
                     :disabled="mode === 'view'"
                     :ui="{
                        base: `h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100 ${
                           validator.maritalStatusId?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : ''
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
                  <div class="flex items-center mt-2" v-if="validator.maritalStatusId?.showMessage">
                     <label class="text-error-500 text-sm">{{ validator.maritalStatusId?.message }}</label>
                  </div>
               </div>
            </div>
            <div class="hidden grid-cols-[1fr] gap-2.5 items-center md:grid xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]"></div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <div class="text-sm text-gray-700 mt-2 xl:text-right">
                     <span>จำนวนพี่น้องทั้งหมด&nbsp;(รวมตนเอง)</span>
                     <span>:&nbsp;</span>
                  </div>
               </div>
               <Input
                  type="number"
                  v-model="form.personnelHistory.numberOfSibling"
                  placeholder="จำนวนพี่น้องทั้งหมด (รวมตนเอง)"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]"></div>
         </div>
      </div>

      <div class="bg-white">
         <h1 class="text-white text-xl px-5 py-1.5 bg-primary-500 rounded-t-lg">ที่อยู่ปัจจุบัน (ที่สามารถติดต่อได้สะดวก)</h1>

         <div :class="[mode !== 'view' ? 'xl:gap-y-1' : 'xl:gap-y-3', 'grid grid-cols-[1fr] gap-3 p-3 bg-white md:grid-cols-[1fr_1fr] ']">
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>เลขที่</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <Input
                  v-model="form.currentAddress.houseNo"
                  placeholder="เลขที่"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>หมู่ที่</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <Input
                  v-model="form.currentAddress.moo"
                  placeholder="หมู่ที่"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>หมู่บ้าน</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <Input
                  v-model="form.currentAddress.village"
                  placeholder="หมู่บ้าน"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>อาคาร</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <Input
                  v-model="form.currentAddress.building"
                  placeholder="อาคาร"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>ชั้นที่</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <Input
                  v-model="form.currentAddress.floor"
                  type="number"
                  placeholder="ชั้นที่"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>ห้อง</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <Input
                  v-model="form.currentAddress.room"
                  placeholder="ห้อง"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>ซอย</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <Input
                  v-model="form.currentAddress.soi"
                  placeholder="ซอย"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>ถนน</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <Input
                  v-model="form.currentAddress.street"
                  placeholder="ถนน"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>จังหวัด</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>

               <div class="relative">
                  <USelectMenu
                     v-model="form.currentAddress.provinceId"
                     :options="provinceList"
                     placeholder="-- เลือก --"
                     value-attribute="id"
                     option-attribute="name"
                     searchable
                     searchable-placeholder="จังหวัด"
                     :search-attributes="['name']"
                     :disabled="mode === 'view'"
                     :ui="{
                        base: 'h-[38px] max-w-[450px] border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100',
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
                     @change="(provinceId) => handleProvinceCurrentAddressChange(provinceId, 'change')"
                  >
                  </USelectMenu>
               </div>
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>รหัสไปรษณีย์</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <input
                  v-model="form.currentAddress.zipcode"
                  placeholder="รหัสไปรษณีย์"
                  maxlength="5"
                  @keypress="allowOnlyNumbers"
                  @input="() => validateInput('currentAddress')"
                  :disabled="mode === 'view'"
                  class="leading-[3] placeholder:text-gray-100 placeholder:h-full placeholder:text-sm rounded-lg px-[14px] w-full border border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed text-sm flex flex-col h-[38px]"
               />
            </div>
            <div class="mb-4 xl:mb-6 grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>อำเภอ/เขต</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <div class="relative">
                  <USelectMenu
                     v-model="form.currentAddress.districtId"
                     :options="districtCurrentAddressList"
                     placeholder="-- เลือก --"
                     value-attribute="id"
                     option-attribute="name"
                     searchable
                     searchable-placeholder="อำเภอ/เขต"
                     :search-attributes="['name']"
                     :disabled="mode === 'view'"
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
                     @change="(districtId) => handleDistrictCurrentAddressChange(districtId)"
                  >
                  </USelectMenu>
                  <p class="text-xs absolute bottom-[-22px] right-0 text-[#F00] font-sarabun-bold whitespace-nowrap">
                     *เลือกจังหวัด&nbsp;อำเภอและตำบล&nbsp;ตามลำดับ
                  </p>
               </div>
            </div>
            <div class="mb-4 xl:mb-6 grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <p class="text-sm text-gray-700 mt-2">
                     <span>ตำบล/แขวง</span>
                     <span>:&nbsp;</span>
                  </p>
               </div>
               <USelectMenu
                  v-model="form.currentAddress.subDistrictId"
                  :options="subDistrictCurrentAddressList"
                  placeholder="-- เลือก --"
                  value-attribute="id"
                  option-attribute="name"
                  searchable
                  searchable-placeholder="ตำบล/แขวง"
                  :search-attributes="['name']"
                  :disabled="mode === 'view'"
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
                  @change="(subDistrictId) => handleSubDistrictCurrentAddressChange(subDistrictId)"
               >
               </USelectMenu>
            </div>

            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <div class="text-sm text-gray-700 mt-2 xl:text-right">
                     <span>โทรศัพท์สายตรง</span>
                     <span>:&nbsp;</span>
                  </div>
               </div>
               <Input
                  v-model="form.currentAddress.tel"
                  placeholder="โทรศัพท์สายตรง"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>

            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <div class="text-sm text-gray-700 mt-2 xl:text-right">
                     <span>หมายเลข&nbsp;DID</span>
                     <span>:&nbsp;</span>
                  </div>
               </div>
               <Input
                  v-model="form.currentAddress.didNumber"
                  placeholder="หมายเลข DID"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>

            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <div class="text-sm text-gray-700 mt-2 xl:text-right">
                     <span>โทรศัพท์มหาวิทยาลัย</span>
                     <span>:&nbsp;</span>
                  </div>
               </div>
               <Input
                  v-model="form.currentAddress.universityTel"
                  placeholder="โทรศัพท์มหาวิทยาลัย"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <div class="text-sm text-gray-700 mt-2 xl:text-right">
                     <span>เบอร์ติดต่อภายใน</span>
                     <span>:&nbsp;</span>
                  </div>
               </div>
               <div class="grid grid-cols-[1.1fr_auto_1fr] gap-[9px] items-center">
                  <Input
                     v-model="form.currentAddress.internalUniversityTel"
                     placeholder="เบอร์ติดต่อภายใน"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="mode === 'view'"
                  />
                  <span class="text-sm">กดต่อ</span>
                  <Input
                     v-model="form.currentAddress.internalUniversityTelConnect"
                     placeholder="กดต่อ"
                     class="flex flex-col text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="mode === 'view'"
                  />
               </div>
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <div class="text-sm text-gray-700 mt-2 xl:text-right">
                     <span>โทรศัพท์ที่ติดต่อได้</span>
                     <span>:&nbsp;</span>
                  </div>
               </div>
               <Input
                  v-model="form.currentAddress.contactTel"
                  placeholder="โทรศัพท์ที่ติดต่อได้"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>
            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <div class="text-sm text-gray-700 mt-2 xl:text-right">
                     <span>โทรสาร</span>
                     <span>:&nbsp;</span>
                  </div>
               </div>
               <Input
                  v-model="form.currentAddress.fax"
                  placeholder="โทรสาร"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>

            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <div class="text-sm text-gray-700 mt-2 xl:text-right">
                     <span>โทรศัพท์มือถือ</span>
                     <span>:&nbsp;</span>
                  </div>
               </div>
               <Input
                  v-model="form.currentAddress.mobileNumber"
                  placeholder="โทรศัพท์มือถือ"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>

            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <div class="text-sm text-gray-700 mt-2 xl:text-right">
                     <span>เว็บไซต์ส่วนตัว</span>
                     <span>:&nbsp;</span>
                  </div>
               </div>
               <Input
                  v-model="form.currentAddress.website"
                  placeholder="เว็บไซต์ส่วนตัว"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>

            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <div class="text-sm text-gray-700 mt-2 xl:text-right">
                     <span>Buasri ID</span>
                     <span>:&nbsp;</span>
                  </div>
               </div>
               <Input
                  v-model="form.currentAddress.buasriID"
                  placeholder="Buasri ID"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>

            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]"></div>

            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <div class="text-sm text-gray-700 mt-2 xl:text-right">
                     <span>อีเมล</span>
                     <span>:&nbsp;</span>
                  </div>
               </div>
               <Input
                  v-model="form.currentAddress.primaryEmail"
                  placeholder="อีเมล"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>

            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]"></div>

            <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
               <div class="flex xl:justify-self-end">
                  <div class="text-sm text-gray-700 mt-2 xl:text-right">
                     <span>อีเมลสำรอง</span>
                     <span>:&nbsp;</span>
                  </div>
               </div>
               <Input
                  v-model="form.currentAddress.secondaryEmail"
                  placeholder="อีเมล"
                  class="flex flex-col text-sm"
                  heightClass="h-[38px]"
                  placeholderColor="text-gray-100"
                  :disabled="mode === 'view'"
               />
            </div>
         </div>
      </div>

      <div id="emergency-contact-list" class="bg-white mb-1" v-for="(item, index) in emergencyContactList" :key="index" v-if="emergencyContactList.length">
         <div class="px-5 py-1.5 bg-primary-500 rounded-t-lg flex justify-between">
            <h1 class="text-white text-xl">บุคคลที่สามารถติดต่อได้เมื่อมีเหตุฉุกเฉิน คนที่ {{ index + 1 }}</h1>
            <img :src="ArrowIcon" alt="" :class="[item.isOpen ? 'rotate-180' : '', 'cursor-pointer transition duration-300']" @click="item.isOpen = !item.isOpen" />
         </div>

         <div :class="[item.isOpen ? 'max-h-[2000px]' : 'max-h-0', 'overflow-hidden transition-all duration-500 ease-in-out']">
            <div
               class="p-3 md:relative md:pt-11 md:grid md:grid-cols-[1fr_1fr] md:gap-3 xl:grid-cols-[80px_164px_164px_164px_164px_164px] xl:items-center xl:p-[35px_26px]"
            >
               <div class="flex -mb-3 md:absolute md:left-3 md:top-[15px] xl:relative xl:top-[15px]">
                  <p class="text-sm text-gray-700 whitespace-nowrap mb-5 xl:mb-[31px]">ภาษาไทย</p>
                  <span v-if="mode !== 'view'" class="text-error-500 text-sm">*</span>
               </div>
               <div class="mb-4">
                  <p class="text-sm text-[#344054] mb-1.5">คำนำหน้าชื่อ</p>
                  <Input
                     v-model="item.prefix"
                     placeholder="คำนำหน้าชื่อ"
                     class="flex flex-col w-full text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="mode === 'view'"
                  />
               </div>
               <div class="mb-4">
                  <p class="text-sm text-[#344054] mb-1.5">ชื่อ</p>
                  <Input
                     v-model="item.firstname"
                     placeholder="ชื่อ"
                     class="flex flex-col w-full text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="mode === 'view'"
                  />
               </div>
               <div class="mb-4">
                  <p class="text-sm text-[#344054] mb-1.5">ชื่อกลาง</p>
                  <Input
                     v-model="item.middlename"
                     placeholder="ชื่อกลาง"
                     class="flex flex-col w-full text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="mode === 'view'"
                  />
               </div>
               <div class="mb-4">
                  <p class="text-sm text-[#344054] mb-1.5">นามสกุล</p>
                  <Input
                     v-model="item.lastname"
                     placeholder="นามสกุล"
                     class="flex flex-col w-full text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="mode === 'view'"
                  />
               </div>
               <div class="xl:mb-4">
                  <p class="text-sm text-[#344054] mb-1.5">ความสัมพันธ์</p>
                  <Input
                     v-model="item.relationship"
                     placeholder="ความสัมพันธ์"
                     class="flex flex-col w-full text-sm"
                     heightClass="h-[38px]"
                     placeholderColor="text-gray-100"
                     :disabled="mode === 'view'"
                  />
               </div>
            </div>

            <div>
               <h1 class="text-[#333333] text-xs font-sarabun-bold px-5 py-1.5 bg-primary-50 rounded-t-lg">ที่อยู่ที่ทำงาน</h1>
               <div :class="[mode !== 'view' ? 'xl:gap-y-1' : 'xl:gap-y-3', 'grid grid-cols-[1fr] gap-3 p-3 bg-white  md:grid-cols-[1fr_1fr]']">
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>เลขที่</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.workplace.houseNo"
                        placeholder="เลขที่"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>หมู่ที่</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.workplace.moo"
                        placeholder="หมู่ที่"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>คณะ&nbsp;/&nbsp;สาขา</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.workplace.branch"
                        placeholder="คณะ / สาขา"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>หมู่บ้าน</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.workplace.village"
                        placeholder="หมู่บ้าน"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>อาคาร</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.workplace.building"
                        placeholder="อาคาร"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>ชั้นที่</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.workplace.floor"
                        type="number"
                        placeholder="ชั้นที่"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>ห้อง</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.workplace.room"
                        placeholder="ห้อง"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>ซอย</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.workplace.soi"
                        placeholder="ซอย"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>ถนน</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.workplace.street"
                        placeholder="ถนน"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>

                  <div class="mb-4 xl:mb-6 grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]"></div>

                  <div class="mb-4 xl:mb-6 grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>จังหวัด</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>

                     <div class="relative">
                        <USelectMenu
                           v-model="item.workplace.provinceId"
                           :options="provinceList"
                           placeholder="-- เลือก --"
                           value-attribute="id"
                           option-attribute="name"
                           searchable
                           searchable-placeholder="จังหวัด"
                           :search-attributes="['name']"
                           :disabled="mode === 'view'"
                           :ui="{
                              base: 'h-[38px]  border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100',
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
                              async (provinceId) => {
                                 const resDistrict = await fetchDistrictList({ provinceId });
                                 if (resDistrict?.code === 20000) {
                                    item.districtWorkplaceList = resDistrict.responseObject.districtList;

                                    item.workplace.districtId = 0;
                                    item.workplace.subDistrictId = 0;
                                    item.workplace.zipcode = '';
                                    item.subDistrictWorkplaceList = [];
                                 }
                              }
                           "
                        ></USelectMenu>
                     </div>
                  </div>

                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>รหัสไปรษณีย์</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <input
                        v-model="item.workplace.zipcode"
                        placeholder="รหัสไปรษณีย์"
                        maxlength="5"
                        @keypress="allowOnlyNumbers"
                        @input="() => validateInput('emergencyContactWorkplace')"
                        :disabled="mode === 'view'"
                        class="leading-[3] placeholder:text-gray-100 placeholder:h-full placeholder:text-sm rounded-lg px-[14px] w-full border border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed text-sm flex flex-col h-[38px]"
                     />
                  </div>

                  <div class="mb-4 xl:mb-6 grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>อำเภอ/เขต</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>

                     <div class="relative">
                        <USelectMenu
                           v-model="item.workplace.districtId"
                           :options="item.districtWorkplaceList"
                           placeholder="-- เลือก --"
                           value-attribute="id"
                           option-attribute="name"
                           searchable
                           searchable-placeholder="อำเภอ/เขต"
                           :search-attributes="['name']"
                           :disabled="mode === 'view'"
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
                              async (districtId) => {
                                 const res = await fetchSubdistrictList({ districtId });
                                 if (res?.code === 20000) {
                                    item.subDistrictWorkplaceList = res.responseObject.subDistrictList;
                                    item.workplace.subDistrictId = 0;
                                    item.workplace.zipcode = '';
                                 }
                              }
                           "
                        >
                        </USelectMenu>
                        <p class="text-xs absolute bottom-[-22px] right-0 text-[#F00] font-sarabun-bold whitespace-nowrap">
                           *เลือกจังหวัด&nbsp;อำเภอและตำบล&nbsp;ตามลำดับ
                        </p>
                     </div>
                  </div>

                  <div class="mb-4 xl:mb-6 grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>ตำบล/แขวง</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>

                     <USelectMenu
                        v-model="item.workplace.subDistrictId"
                        :options="item.subDistrictWorkplaceList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        searchable
                        searchable-placeholder="ตำบล/แขวง"
                        :search-attributes="['name']"
                        :disabled="mode === 'view'"
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
                              const zipcode = item.subDistrictWorkplaceList.find((i) => i.id === subDistrictId)?.zipcodes;
                              item.workplace.zipcode = zipcode;
                           }
                        "
                     >
                     </USelectMenu>
                  </div>

                  <div class="mb-4 xl:mb-6 grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <div class="text-sm text-gray-700 mt-2 xl:text-right">
                           <span>โทรศัพท์</span>
                           <span>:&nbsp;</span>
                        </div>
                     </div>
                     <Input
                        v-model="item.workplace.tel"
                        placeholder="โทรศัพท์"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <div class="text-sm text-gray-700 mt-2 xl:text-right">
                           <span>โทรสาร</span>
                           <span>:&nbsp;</span>
                        </div>
                     </div>
                     <Input
                        v-model="item.workplace.fax"
                        placeholder="โทรสาร"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
               </div>
            </div>

            <div>
               <h1 class="text-[#333333] text-xs font-sarabun-bold px-5 py-1.5 bg-primary-50 rounded-t-lg">ที่อยู่ปัจจุบัน</h1>
               <div :class="[mode !== 'view' ? 'xl:gap-y-1' : 'xl:gap-y-3', 'grid grid-cols-[1fr] gap-3 p-3 bg-white md:grid-cols-[1fr_1fr] ']">
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>เลขที่</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.currentAddress.houseNo"
                        placeholder="เลขที่"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>หมู่ที่</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.currentAddress.moo"
                        placeholder="หมู่ที่"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>หมู่บ้าน</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.currentAddress.village"
                        placeholder="หมู่บ้าน"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>อาคาร</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.currentAddress.building"
                        placeholder="อาคาร"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>ชั้นที่</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.currentAddress.floor"
                        type="number"
                        placeholder="ชั้นที่"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>ห้อง</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.currentAddress.room"
                        placeholder="ห้อง"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>ซอย</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.currentAddress.soi"
                        placeholder="ซอย"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>ถนน</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <Input
                        v-model="item.currentAddress.street"
                        placeholder="ถนน"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="mb-4 xl:mb-6 grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>จังหวัด</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>

                     <USelectMenu
                        v-model="item.currentAddress.provinceId"
                        :options="provinceList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        searchable
                        searchable-placeholder="จังหวัด"
                        :search-attributes="['name']"
                        :disabled="mode === 'view'"
                        :ui="{
                           base: 'h-[38px]  border border-gray-100 focus:border-primary-50 focus:!ring-0 disabled:bg-gray-100',
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
                           async (provinceId) => {
                              const resDistrict = await fetchDistrictList({ provinceId });
                              if (resDistrict?.code === 20000) {
                                 item.districtCurrentAddressList = resDistrict.responseObject.districtList;

                                 item.currentAddress.districtId = 0;
                                 item.currentAddress.subDistrictId = 0;
                                 item.currentAddress.zipcode = '';
                                 item.subDistrictCurrentAddressList = [];
                              }
                           }
                        "
                     ></USelectMenu>
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>รหัสไปรษณีย์</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <input
                        v-model="item.currentAddress.zipcode"
                        placeholder="รหัสไปรษณีย์"
                        maxlength="5"
                        @keypress="allowOnlyNumbers"
                        @input="() => validateInput('emergencyContactCurrentAddress')"
                        :disabled="mode === 'view'"
                        class="leading-[3] placeholder:text-gray-100 placeholder:h-full placeholder:text-sm rounded-lg px-[14px] w-full border border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed text-sm flex flex-col h-[38px]"
                     />
                  </div>
                  <div class="mb-4 xl:mb-6 grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>อำเภอ/เขต</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <div class="relative">
                        <USelectMenu
                           v-model="item.currentAddress.districtId"
                           :options="item.districtCurrentAddressList"
                           placeholder="-- เลือก --"
                           value-attribute="id"
                           option-attribute="name"
                           searchable
                           searchable-placeholder="อำเภอ/เขต"
                           :search-attributes="['name']"
                           :disabled="mode === 'view'"
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
                              async (districtId) => {
                                 const res = await fetchSubdistrictList({ districtId });
                                 if (res?.code === 20000) {
                                    item.subDistrictCurrentAddressList = res.responseObject.subDistrictList;
                                    item.currentAddress.subDistrictId = 0;
                                    item.currentAddress.zipcode = '';
                                 }
                              }
                           "
                        >
                        </USelectMenu>
                        <p class="text-xs absolute bottom-[-22px] right-0 text-[#F00] font-sarabun-bold whitespace-nowrap">
                           *เลือกจังหวัด&nbsp;อำเภอและตำบล&nbsp;ตามลำดับ
                        </p>
                     </div>
                  </div>
                  <div class="mb-4 xl:mb-6 grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <p class="text-sm text-gray-700 mt-2">
                           <span>ตำบล/แขวง</span>
                           <span>:&nbsp;</span>
                        </p>
                     </div>
                     <USelectMenu
                        v-model="item.currentAddress.subDistrictId"
                        :options="item.subDistrictCurrentAddressList"
                        placeholder="-- เลือก --"
                        value-attribute="id"
                        option-attribute="name"
                        searchable
                        searchable-placeholder="ตำบล/แขวง"
                        :search-attributes="['name']"
                        :disabled="mode === 'view'"
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
                              const zipcode = item.subDistrictCurrentAddressList.find((i) => i.id === subDistrictId)?.zipcodes;
                              item.currentAddress.zipcode = zipcode;
                           }
                        "
                     >
                     </USelectMenu>
                  </div>

                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <div class="text-sm text-gray-700 mt-2 xl:text-right">
                           <span>โทรศัพท์</span>
                           <span>:&nbsp;</span>
                        </div>
                     </div>
                     <Input
                        v-model="item.currentAddress.tel"
                        placeholder="โทรศัพท์"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
                  <div class="grid grid-cols-[1fr] gap-2.5 xl:grid-cols-[207px_1fr] 2xl:grid-cols-[207px_0.7fr]">
                     <div class="flex xl:justify-self-end">
                        <div class="text-sm text-gray-700 mt-2 xl:text-right">
                           <span>โทรสาร</span>
                           <span>:&nbsp;</span>
                        </div>
                     </div>
                     <Input
                        v-model="item.currentAddress.fax"
                        placeholder="โทรสาร"
                        class="flex flex-col text-sm"
                        heightClass="h-[38px]"
                        placeholderColor="text-gray-100"
                        :disabled="mode === 'view'"
                     />
                  </div>
               </div>
               <div class="flex items-center justify-center gap-2.5 my-5">
                  <button
                     class="flex items-center justify-center gap-1 px-6 py-2.5 rounded-md bg-[#D1D2D3]"
                     type="button"
                     @click="setDialogDeleteEmergencyContact(true, item.id, index)"
                     v-if="index > 0"
                  >
                     <img src="/assets/icons/fi-rs-cross-circle.svg" alt="cross-circle-icon" />
                     <span>ลบรายการ</span>
                  </button>

                  <button class="flex items-center justify-center gap-1 px-6 py-2.5 rounded-md bg-[#F26522]" type="button" @click="addEmergencyContactTemp">
                     <img src="/assets/icons/fi-rs-add.svg" alt="add-icon" />
                     <span class="text-white">เพิ่มรายการ</span>
                  </button>
               </div>
            </div>

            <div v-if="index === emergencyContactList.length - 1" class="flex flex-wrap gap-2 justify-end p-3">
               <ButtonEdit v-if="mode === 'view'" @click="toEditMode" />
               <ButtonSave v-else @click="submitForm" />
               <ButtonCancel to="/personal-work/report" />
            </div>
         </div>
      </div>

   </form>
   <SkeletonForm v-else :count="12" />
   <DialogConfirm
      :isOpen="isOpenDialogConfirm"
      :setDialog="setDialogConfirm"
      title="บันทึกข้อมูล"
      desc="คุณต้องการบันทึกข้อมูลนี้ใช่หรือไม่"
      icon="success"
      :btnAction="handleUpdatePersonnelDetail"
   />
   <DialogConfirm
      :isOpen="isOpenDialogDeleteEmergencyContactConfirm"
      :setDialog="setDialogDeleteEmergencyContact"
      title="ลบข้อมูล"
      desc="คุณต้องการลบบุคคลที่สามารถติดต่อนี้ใช่หรือไม่"
      icon="warning"
      :btnAction="deleteEmergencyContactTemp"
   />
   <Loading v-if="isLoading" />
</template>

<script setup>
import moment from "moment";
import Loading from "~/components/loading";
import Input from "~/components/form/input";
import Datepicker from "~/components/form/datepicker";
import ButtonSave from "~/components/button/save";
import ButtonEdit from "~/components/button/edit";
import ButtonCancel from "~/components/button/cancel";
import DialogConfirm from "~/components/dialog/confirm";
import SkeletonForm from "~/components/ui/skeleton/form";
import ArrowIcon from "~/assets/icons/arrow-up.svg";

const toast = useToast();
const props = defineProps({
   personnelId: String,
   mode: String,
});

import usePersonnelHistoryAPI from "~/service/api/personnelHistory";
const { fetchPersonnelHistoryDetail, updatePersonnelHistoryDetail } = usePersonnelHistoryAPI;

import usePersonnelEmergencyContactAPI from "~/service/api/personnelEmergencyContact";
const { fetchPersonnelEmergency, addUpdatePersonnelEmergency, deletePersonnelEmergency } = usePersonnelEmergencyContactAPI;

import useMasterDataAPI from "~/service/api/masterDataList";
const {
   fetchBloodTypeList,
   fetchBloodTypeRhList,
   fetchEthnicityList,
   fetchMilitaryServiceStatusList,
   fetchNationalityList,
   fetchReligionList,
   fetchMaritalStatusList,
   fetchProvinceList,
   fetchDistrictList,
   fetchSubdistrictList,
} = useMasterDataAPI;

const form = ref({
   personnelHistory: {
      dateOfBirth: "",
      nationalityId: 0,
      religionId: 0,
      maritalStatusId: 0,
      numberOfSibling: null,
      bloodTypeId: 0,
      bloodTypeRhId: 0,
      militaryServiceStatusId: 0,
      chronicDisease: "chronicDisease",
      orderInSibling: null,
      ethnicityId: 0,
      dateOfRetirement: "",
      ageYears: "",
      ageMonths: "",
   },
   currentAddress: {
      houseNo: "",
      village: "",
      floor: "",
      soi: "",
      moo: "",
      room: "",
      street: "",
      districtId: 0,
      subDistrictId: 0,
      provinceId: 0,
      zipcode: "",
      didNumber: "",
      tel: "",
      fax: "",
      website: "",
      universityTel: "",
      internalUniversityTel: "",
      internalUniversityTelConnect: "",
      contactTel: "",
      mobileNumber: "",
      buasriID: "",
      primaryEmail: "",
      secondaryEmail: "",
   },
});
const validator = ref({
   dateOfBirth: {
      showMessage: false,
      message: "กรอกข้อมูลไม่ครบถ้วน",
   },
   ethnicityId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   nationalityId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   religionId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
   maritalStatusId: {
      showMessage: false,
      message: "จำเป็นต้องเลือก",
   },
});

const bloodTypeList = ref([]);
const bloodTypeRhList = ref([]);
const ethnicityList = ref([]);
const militaryServiceStatusList = ref([]);
const nationalityList = ref([]);
const religionList = ref([]);
const maritalStatusList = ref([]);

const emergencyContactList = ref([
   {
      id: 0,
      prefix: "",
      firstname: "",
      middlename: "",
      lastname: "",
      relationship: "",
      currentAddress: {
         houseNo: "",
         village: "",
         building: "",
         floor: "",
         soi: "",
         moo: "",
         room: "",
         street: "",
         subDistrictId: 0,
         districtId: 0,
         provinceId: 0,
         zipcode: "",
         tel: "",
         fax: "",
      },
      workplace: {
         houseNo: "",
         village: "",
         floor: "",
         soi: "",
         moo: "",
         room: "",
         street: "",
         subDistrictId: 0,
         districtId: 0,
         provinceId: 0,
         zipcode: "",
         tel: "",
         fax: "",
         branch: "",
      },
      isOpen: true,
   },
]);

const provinceList = ref([]);
const districtCurrentAddressList = ref([]);
const subDistrictCurrentAddressList = ref([]);

const isLoading = ref(false);
const isFormLoading = ref(false);
const isFirstRender = ref(true);

onMounted(() => {
   getData();
});

watch(
   () => form.value.personnelHistory.dateOfBirth,
   (newData) => {
      handleDateOfBirth(newData);
      getDateOfRetirement(newData);
      clearRequireOnChange({ value: newData, key: "dateOfBirth" });
   }
);
watch(
   () => form.value.personnelHistory.nationalityId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "nationalityId" });
   }
);
watch(
   () => form.value.personnelHistory.ethnicityId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "ethnicityId" });
   }
);
watch(
   () => form.value.personnelHistory.religionId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "religionId" });
   }
);
watch(
   () => form.value.personnelHistory.maritalStatusId,
   (newData) => {
      clearRequireOnChange({ value: newData, key: "maritalStatusId" });
   }
);

const getData = async () => {
   isFormLoading.value = true;
   isFirstRender.value = true;
   Promise.all([
      fetchPersonnelHistoryDetail(props?.personnelId),
      fetchBloodTypeList(),
      fetchBloodTypeRhList(),
      fetchEthnicityList(),
      fetchMilitaryServiceStatusList(),
      fetchNationalityList(),
      fetchReligionList(),
      fetchMaritalStatusList(),
      fetchProvinceList(),
      fetchPersonnelEmergency(props?.personnelId),
   ]).then((res) => {
      if (res[0]?.code === 20000) {
         form.value.personnelHistory = {
            ...res[0].responseObject.personnelHistory,
            orderInSibling: res[0].responseObject.personnelHistory.orderInSibling || "-",
            numberOfSibling: res[0].responseObject.personnelHistory.numberOfSibling || "-",
            dateOfRetirement: genTextDate({
               date: res[0].responseObject.personnelHistory.dateOfRetirement,
               format: "DD-MM-YYYY  ",
               oldFormat: "YYYY-MM-DDTHH:mm:ssZ",
               isBuddhistYear: false,
            }),
         };
         form.value.currentAddress = res[0].responseObject.currentAddress;
         form.value.emergencyContact = res[0].responseObject.emergencyContact;
      }
      if (res[1]?.code === 20000) {
         bloodTypeList.value = res[1].responseObject.bloodTypeList;
      }
      if (res[2]?.code === 20000) {
         bloodTypeRhList.value = res[2].responseObject.bloodTypeRhList;
      }
      if (res[3]?.code === 20000) {
         ethnicityList.value = res[3].responseObject.ethnicityList;
      }
      if (res[4]?.code === 20000) {
         militaryServiceStatusList.value = res[4].responseObject.militaryServiceStatusList;
      }
      if (res[5]?.code === 20000) {
         nationalityList.value = res[5].responseObject.prefixesList;
      }
      if (res[6]?.code === 20000) {
         religionList.value = res[6].responseObject.religionList;
      }
      if (res[7]?.code === 20000) {
         maritalStatusList.value = res[7].responseObject.maritalStatusList;
      }
      if (res[8]?.code === 20000) {
         provinceList.value = res[8].responseObject.provinceList;
         handleProvinceCurrentAddressChange(form.value.currentAddress.provinceId, "fetch");
      }
      if (res[9]?.code === 20000) {
         if (res[9].responseObject.emergencyContacts.length) {
            emergencyContactList.value = res[9].responseObject.emergencyContacts.map((item) => ({
               ...item,
               isOpen: true,
            }));
         }
         fetchEmergencyContactAddress();
      }
      isFormLoading.value = false;
      setTimeout(() => {
         isFirstRender.value = false;
      }, 100);
   });
};

const handleProvinceCurrentAddressChange = async (provinceId, type) => {
   if (provinceId) {
      const resDistrict = await fetchDistrictList({ provinceId });
      if (resDistrict?.code === 20000) {
         districtCurrentAddressList.value = resDistrict.responseObject.districtList;
         if (type === "change") {
            form.value.currentAddress.districtId = 0;
            form.value.currentAddress.subDistrictId = 0;
            form.value.currentAddress.zipcode = "";
            subDistrictCurrentAddressList.value = [];
         }

         if (type === "fetch") {
            const resSubDistrict = await fetchSubdistrictList({ districtId: form.value.currentAddress.districtId });
            if (resSubDistrict?.code === 20000) {
               subDistrictCurrentAddressList.value = resSubDistrict.responseObject.subDistrictList;
            }
         }
      }
   }
};

const handleDistrictCurrentAddressChange = async (districtId) => {
   const res = await fetchSubdistrictList({ districtId });
   if (res?.code === 20000) {
      subDistrictCurrentAddressList.value = res.responseObject.subDistrictList;
      form.value.currentAddress.subDistrictId = 0;
      form.value.currentAddress.zipcode = "";
   }
};

const handleSubDistrictCurrentAddressChange = async (subDistrictId) => {
   const zipcode = subDistrictCurrentAddressList.value.find((i) => i.id === subDistrictId)?.zipcodes;
   form.value.currentAddress.zipcode = zipcode;
};

const fetchEmergencyContactAddress = async () => {
   for (let i = 0; i < emergencyContactList.value.length; i++) {
      let {
         currentAddress: { subDistrictId: currentSubDistrictId, districtId: currentDistrictId, provinceId: currentProvinceId },
         workplace: { subDistrictId: workplaceSubDistrictId, districtId: workplaceDistrictId, provinceId: workplaceProvinceId },
      } = emergencyContactList.value[i];

      // Workplace
      if (workplaceProvinceId) {
         const resDistrictWorkplace = await fetchDistrictList({ provinceId: workplaceProvinceId });
         if (resDistrictWorkplace?.code === 20000) {
            emergencyContactList.value[i].districtWorkplaceList = resDistrictWorkplace.responseObject.districtList;

            if (workplaceDistrictId) {
               const resSubDistrictWorkplace = await fetchSubdistrictList({ districtId: workplaceDistrictId });
               if (resSubDistrictWorkplace?.code === 20000) {
                  emergencyContactList.value[i].subDistrictWorkplaceList = resSubDistrictWorkplace.responseObject.subDistrictList;
               }
            }
         }
      }

      // Current Address
      if (currentProvinceId) {
         const resDistrictCurrentAddress = await fetchDistrictList({ provinceId: currentProvinceId });
         if (resDistrictCurrentAddress?.code === 20000) {
            emergencyContactList.value[i].districtCurrentAddressList = resDistrictCurrentAddress.responseObject.districtList;

            if (currentDistrictId) {
               const resSubDistrictCurrentAddress = await fetchSubdistrictList({ districtId: currentDistrictId });
               if (resSubDistrictCurrentAddress?.code === 20000) {
                  emergencyContactList.value[i].subDistrictCurrentAddressList = resSubDistrictCurrentAddress.responseObject.subDistrictList;
               }
            }
         }
      }
   }
};

const addEmergencyContactTemp = () => {
   emergencyContactList.value.push({
      id: 0,
      prefix: "",
      firstname: "",
      middlename: "",
      lastname: "",
      relationship: "",
      currentAddress: {
         houseNo: "",
         village: "",
         building: "",
         floor: "",
         soi: "",
         moo: "",
         room: "",
         street: "",
         subDistrictId: 0,
         districtId: 0,
         provinceId: 0,
         zipcode: "",
         tel: "",
         fax: "",
      },
      workplace: {
         houseNo: "",
         village: "",
         floor: "",
         soi: "",
         moo: "",
         room: "",
         street: "",
         subDistrictId: 0,
         districtId: 0,
         provinceId: 0,
         zipcode: "",
         tel: "",
         fax: "",
         branch: "",
      },
      isOpen: true,
   });
};

const isOpenDialogConfirm = ref(false);
const setDialogConfirm = (status) => {
   isOpenDialogConfirm.value = status;
};
const handleUpdatePersonnelDetail = async () => {
   isLoading.value = true;
   const res = await updatePersonnelHistoryDetail(props?.personnelId, form.value);
   if (res?.code === 20000) {
      handleAddUpdatePersonnelEmergency();
   } else {
      toast.add({ title: res?.message, color: "red" });
      setDialogConfirm(false);
      isLoading.value = false;
   }
};

const emergencyContactInfo = ref({
   id: 0,
   index: 0,
});

const isOpenDialogDeleteEmergencyContactConfirm = ref(false);
const setDialogDeleteEmergencyContact = (status, id, index) => {
   isOpenDialogDeleteEmergencyContactConfirm.value = status;
   emergencyContactInfo.value = {
      id,
      index,
   };
};

const deleteEmergencyContactTemp = async () => {
   if (emergencyContactInfo.value.id === 0) {
      emergencyContactList.value.splice(emergencyContactInfo.value.index, 1);
      setDialogDeleteEmergencyContact(false);
   } else {
      isLoading.value = true;
      const res = await deletePersonnelEmergency(props?.personnelId, emergencyContactInfo.value.id);
      if (res?.code === 20000) {
         toast.add({ title: res?.message, color: "green" });
         const resPersonnelEmergency = await fetchPersonnelEmergency(props?.personnelId);
         emergencyContactList.value = resPersonnelEmergency.responseObject.emergencyContacts.map((item) => ({
            ...item,
            isOpen: true,
         }));
      } else {
         toast.add({ title: res?.message, color: "red" });
      }
      setDialogDeleteEmergencyContact(false);
      isLoading.value = false;
   }
};

const handleAddUpdatePersonnelEmergency = async () => {
   const emergencyContactListArray = emergencyContactList.value.map((item) => {
      delete item.isOpen;
      delete item.districtWorkplaceList;
      delete item.subDistrictWorkplaceList;
      delete item.districtCurrentAddressList;
      delete item.subDistrictCurrentAddressList;
      return item;
   });
   const body = {
      emergencyContacts: emergencyContactListArray,
   };
   const res = await addUpdatePersonnelEmergency(props?.personnelId, body);
   if (res?.code === 20000) {
      navigateTo(`/personal-work/report`);
      setDialogConfirm(false);
   } else {
      toast.add({ title: res?.message, color: "red" });
      setDialogConfirm(false);
   }
   isLoading.value = false;
};

const toEditMode = () => {
   navigateTo(`/personal-work/report/edit?id=${props?.personnelId}`);
};
const submitForm = () => {
   const fail = validatorForm(form.value.personnelHistory, validator.value);
   if (fail.length == 0) {
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
   }
};
const handleDateOfBirth = (e) => {
   // Calc ageYears and ageMonths
   var a = moment(moment().toArray().slice(0, 3));
   var b = moment(moment(e, "DD-MM-YYYY").subtract(543, "years").toArray().slice(0, 3));

   let years = a.diff(b, "year");
   b.add(years, "years");

   let months = a.diff(b, "months");
   b.add(months, "months");

   form.value.personnelHistory.ageYears = years ? years : "";
   form.value.personnelHistory.ageMonths = months ? months : "";

   // Calc dateOfRetirement (Old)
   // const dateRetired = new Date(moment(e, "DD-MM-YYYY").add(603, "years").format(""));
   // const dateRetiredBuddhistFormat = genTextDate({
   //    date: dateRetired,
   //    format: "DD/MM/YYYY",
   //    oldFormat: "DD-MM-YYYY HH:mm",
   //    isBuddhistYear: true,
   // });
   // form.value.personnelHistory.dateOfRetirement = dateRetiredBuddhistFormat;
};

const allowOnlyNumbers = (event) => {
   const char = String.fromCharCode(event.which);
   if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
   }
};
const validateInput = (type) => {
   if (type === "currentAddress") {
      form.value.currentAddress.zipcode = form.value.currentAddress.zipcode.replace(/[^0-9]/g, "").slice(0, 5);
   }
   if (type === "emergencyContactWorkplace") {
      form.value.emergencyContact.workplace.zipcode = form.value.emergencyContact.workplace.zipcode.replace(/[^0-9]/g, "").slice(0, 5);
   }
   if (type === "emergencyContactCurrentAddress") {
      form.value.emergencyContact.currentAddress.zipcode = form.value.emergencyContact.currentAddress.zipcode.replace(/[^0-9]/g, "").slice(0, 5);
   }
};

const getDateOfRetirement = (dateStr) => {
   const date = moment(dateStr, "DD-MM-YYYY");

   if (!date.isValid()) {
      console.log("Invalid date");
      return;
   }

   const year = date.year();
   const isInFirstRange = date.isBetween(moment(`01-01-${year}`, "DD-MM-YYYY"), moment(`30-09-${year}`, "DD-MM-YYYY"), null, "[]");

   const retirementYear = isInFirstRange ? year + 60: year + 61;
   form.value.personnelHistory.dateOfRetirement = `30/09/${retirementYear}`;
};
</script>
