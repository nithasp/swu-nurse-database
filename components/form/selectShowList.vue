<template>
   <div class="flex gap-3 items-center">
      <p class="text-gray-400 text-sm">แสดง</p>
      <div class="w-[80px]">
         <USelectMenu
            :options="pages"
            value-attribute="value"
            option-attribute="name"
            color="white"
            :ui="{
               base: 'h-[38px] border border-gray-100 focus:border-primary-50 focus:!ring-0',
               rounded: 'rounded-lg',
            }"
            :uiMenu="{
               ring: 'ring-gray-100',
               option: {
                  active: 'bg-gray-50 cursor-pointer',
               },
               label: 'px-1 leading-[3]',
               input: 'border-gray-100 placeholder:text-gray-100',
            }"
            v-model="select"
            @change="setShowList($event)"
         >
            <template #option="{ option: person }">
               <span class="truncate ps-1.5 leading-7">{{ person.name }}</span>
            </template>
         </USelectMenu>
      </div>
   </div>
</template>
<script setup>
defineProps({
   setShowList: Function,
});

const select = ref(10);

const pages = [
   {
      value: 10,
      name: "10",
   },
   {
      value: 25,
      name: "25",
   },
   {
      value: 50,
      name: "50",
   },
   {
      value: 75,
      name: "75",
   },
   {
      value: 100,
      name: "100",
   },
];
</script>
