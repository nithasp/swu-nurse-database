<template>
   <div class="relative">
      <input
         :class="[
            requireInput?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : '',
            inputHeight ? `${inputHeight}` : '',
            'text-sm h-11 cursor-pointer pe-11 leading-[3] placeholder:h-full placeholder:text-sm rounded-lg placeholder:text-gray-100 px-[14px] w-full border  border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed',
         ]"
         :id="inputId"
         :value="modelValue"
         :placeholder="placeholder"
         readonly
         :disabled="disabled"
      />
      <div class="me-2 cursor-pointer absolute right-3 top-[0.7rem]">
         <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#636466"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-clock"
         >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
         </svg>
      </div>
      <div class="flex items-center mt-2" v-if="requireInput?.showMessage">
         <label class="text-error-500 text-sm">{{ requireInput.message }}</label>
      </div>
   </div>
</template>
<script setup>
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";

const props = defineProps({
   modelValue: {
      type: [String, Number, Array, Date],
   },
   inputId: String,
   inputHeight: String,
   requireInput: Object,
   placeholder: String,
   disabled: Boolean,
   minDate: {
      type: [String, Number, Array, Date],
   },
   showTime: Boolean,
   minHours: Number,
   maxHours: Number,
});

const emit = defineEmits(["update:modelValue"]);
let airDatepicker = null;
let timeSelected = null;

watch(
   () => props.modelValue,
   (newData) => {
      if (newData == "") {
         timeSelected = null;
      }
   }
);

onMounted(() => {
   const option = {
      startDate: props.modelValue ? new Date(props.modelValue) : props.minHours != undefined ? new Date(new Date().setHours(props.minHours, 0, 0)) : "",
      timepicker: true,
      onlyTimepicker: true,
      minutesStep: 30,
      minHours: props.minHours,
      maxHours: props.maxHours,
      maxMinutes: 30,
      position: "bottom left",
      onSelect({ date }) {
         timeSelected = date;

         const hhmm = genTextDate({ date, format: "HH:mm", isBuddhistYear: true });

         //  const hours = parseInt(hhmm.split(":")[0]);
         //  airDatepicker.update({
         //     timepicker: false,
         //  });
         //  airDatepicker.update({
         //     timepicker: true,
         //     //    minDate: new Date(new Date().setHours(hours, 0, 0)),
         //     maxMinutes: hours == 12 ? 0 : 30,
         //     //  minutesStep: props.minutesStep,
         //  });

         emit("update:modelValue", hhmm);
      },
      buttons: [
         {
            content: "เลือก",
            onClick(dp) {
               if (timeSelected) {
                  emit("update:modelValue", genTextDate({ date: timeSelected, format: "HH:mm", isBuddhistYear: true }));
               } else {
                  emit("update:modelValue", genTextDate({ date: new Date(new Date().setHours(props.minHours, 0, 0)), format: "HH:mm", isBuddhistYear: true }));
               }
               airDatepicker.hide();
            },
         },
      ],
   };
   airDatepicker = new AirDatepicker(document.getElementById(props.inputId), option);

   if (props.modelValue) {
      timeSelected = new Date(props.modelValue);
      airDatepicker.selectDate(new Date(props.modelValue));
   }
});
</script>

<style lang="scss">
.air-datepicker-cell {
   border-radius: 12px;
   &.-selected- {
      background: #f26522;
      &.-focus-,
      &.-current- {
         background: #f26522;
      }
      &.-day-.-other-month-,
      &.-day-.-other-month-.-focus- {
         background: #f26422b3;
      }
   }
   &.-current- {
      color: #f26522;
   }
}
</style>
