<template>
   <div class="px-8 pb-8">
      <div class="mt-40 flex items-center justify-center">
         <div class="text-center">
            <img :src="EmptyStage" alt="Empty Stage" class="h-28 m-auto" />
            <p class="py-3">{{ text || 'โปรดค้นหาข้อมูลที่ต้องการ'}}</p>
         </div>
      </div>
   </div>
</template>

<script setup>
import EmptyStage from "~/assets/icons-image/empty-stage.png";
defineProps({
   text: String
});
</script>
