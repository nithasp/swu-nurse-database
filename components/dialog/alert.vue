<template>
   <UModal
      :modelValue="isOpen"
      :ui="{
         width: 'w-[400px]',
         rounded: 'rounded-xl',
      }"
      :mask-closable="true"
   >
      <div class="p-6 text-center" @click.self="btnAction">
         <img v-if="type == 'success'" :src="ConfirmIcon" alt="Icon Confirm" class="w-12 h-12 m-auto" />
         <img v-else :src="WarningIcon" alt="Icon Warning" class="w-12 h-12 m-auto" />
         <div class="text-center mt-5">
            <p class="text-lg text-gray-900 font-semibold mb-2">{{ title || "-" }}</p>
            <p class="text-sm text-gray-600" v-if="desc">{{ desc }}</p>
         </div>
      </div>
   </UModal>
</template>

<script setup>
import WarningIcon from "~/assets/icons-image/warning.png";
import ConfirmIcon from "~/assets/icons-image/confirm.png";

const prop = defineProps({
   isOpen: Boolean,
   setDialog: Function,
   title: String,
   desc: String,
   btnName: String,
   type: String,
   btnAction: Function,
});

const removeAutoFocus = ref(null);
</script>
