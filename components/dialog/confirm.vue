<template>
   <UModal
      :modelValue="isOpen"
      :ui="{
         container: 'items-center',
         width: 'w-[400px]',
         rounded: 'rounded-xl',
      }"
      :initialFocus="removeAutoFocus"
   >
      <div class="p-6 text-center">
         <img v-if="icon == 'warning'" :src="WarningIcon" alt="Icon Warning" class="w-12 h-12 m-auto" />
         <img v-else-if="icon == 'success'" :src="ConfirmIcon" alt="Icon Confirm" class="w-12 h-12 m-auto" />
         <img v-else-if="icon == 'danger'" :src="DangerIcon" alt="Icon Danger" class="w-12 h-12 m-auto" />
         <div class="text-center mt-5">
            <p class="text-gray-900 font-sarabun-bold mb-1">{{ title || "-" }}</p>
            <p class="text-gray-500" v-if="desc" v-html="desc"></p>
         </div>

         <div class="mt-8 flex justify-between flex-wrap gap-y-3">
            <UButton
               size="lg"
               color="white"
               variant="solid"
               label="ยกเลิก"
               block
               class="rounded-lg w-full sm:w-[170px] border border-gray-100 !ring-0"
               @click="setDialog(false)"
               ref="removeAutoFocus"
            />
            <UButton size="lg" color="primary" variant="solid" label="ตกลง" block class="rounded-lg w-full sm:w-[170px]" @click="btnAction" />
         </div>
      </div>
   </UModal>
</template>

<script setup>
import WarningIcon from "~/assets/icons-image/warning.png";
import ConfirmIcon from "~/assets/icons-image/confirm.png";
import DangerIcon from "~/assets/icons-image/danger.png";

defineProps({
   isOpen: Boolean,
   setDialog: Function,
   title: String,
   desc: String,
   btnName: String,
   icon: String,
   btnAction: Function,
});

const removeAutoFocus = ref(null);
</script>
