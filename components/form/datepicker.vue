<template>
   <div :class="[`${props.inputId}-container`, 'relative']">
      <input :class="[
         requireInput?.showMessage ? '!border-error-300 focus:!border-error-300 focus:!outline-error-100' : '',
         inputHeight ? `${inputHeight}` : '',
         'text-sm h-11 cursor-pointer pe-11 leading-[3] placeholder:h-full placeholder:text-sm rounded-lg placeholder:text-gray-100 px-[14px] w-full border  border-gray-100 focus:outline-none focus:border-primary-50 disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed',
      ]" :id="inputId" :value="modelValue" :placeholder="placeholder" readonly :disabled="disabled" />
      <div class="me-2 cursor-pointer absolute right-3 top-[0.7rem]">
         <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
               d="M14 1.33333H12V0H10.6667V1.33333H5.33333V0H4V1.33333H2C1.46957 1.33333 0.960859 1.54405 0.585786 1.91912C0.210714 2.29419 0 2.8029 0 3.33333L0 16H16V3.33333C16 2.8029 15.7893 2.29419 15.4142 1.91912C15.0391 1.54405 14.5304 1.33333 14 1.33333ZM1.33333 3.33333C1.33333 3.15652 1.40357 2.98695 1.5286 2.86193C1.65362 2.7369 1.82319 2.66667 2 2.66667H14C14.1768 2.66667 14.3464 2.7369 14.4714 2.86193C14.5964 2.98695 14.6667 3.15652 14.6667 3.33333V5.33333H1.33333V3.33333ZM1.33333 14.6667V6.66667H14.6667V14.6667H1.33333Z"
               fill="#636466" />
            <path d="M11.3333 8.66669H10V10H11.3333V8.66669Z" fill="#636466" />
            <path d="M8.66684 8.66669H7.3335V10H8.66684V8.66669Z" fill="#636466" />
            <path d="M5.99983 8.66669H4.6665V10H5.99983V8.66669Z" fill="#636466" />
            <path d="M11.3333 11.3334H10V12.6668H11.3333V11.3334Z" fill="#636466" />
            <path d="M8.66684 11.3334H7.3335V12.6668H8.66684V11.3334Z" fill="#636466" />
            <path d="M5.99983 11.3334H4.6665V12.6668H5.99983V11.3334Z" fill="#636466" />
         </svg>
      </div>
      <div class="flex items-center mt-2" v-if="requireInput?.showMessage">
         <label class="text-error-500 text-sm">{{ requireInput.message }}</label>
      </div>

      <div class="container">
         <div class="div1"></div>
         <div class="div1"></div>
      </div>
   </div>
</template>
<script setup>
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import localeTh from "air-datepicker/locale/th";

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
});

const emit = defineEmits(["update:modelValue"]);
let airDatepicker = null;
// const dateSelected = ref(null);

watch(
   () => props.minDate,
   (newData) => {
      airDatepicker.minDate = newData ? new Date(genTextDate({ date: newData, oldFormat: "DD/MM/YYYY", isBuddhistYear: true })) : "";
   }
);

watch(
   () => props.modelValue,
   (newData) => {
      if (newData) {
         // ทำเฉพาะ component ที่มีการใช้ min date
         if (props.minDate) {
            // const date = new Date(genTextDate({ date: newData, oldFormat: "DD/MM/YYYY", isBuddhistYear: true }));
            // dateSelected.value = date;
            // airDatepicker.selectDate(date);
            if (props.showTime) {
               airDatepicker.selectDate(new Date(genTextDate({ date: newData, oldFormat: "DD/MM/YYYY HH:mm", isBuddhistYear: true })));
            } else {
               airDatepicker.selectDate(new Date(genTextDate({ date: newData, oldFormat: "DD/MM/YYYY", isBuddhistYear: true })));
            }
         }
      } else {
         airDatepicker.clear();
      }
   }
);

onMounted(() => {
   const option = {
      container: `.${props.inputId}-container`,
      locale: localeTh,
      startDate: props.modelValue ? new Date(props.modelValue) : new Date(),
      autoClose: true,
      timepicker: props.showTime,
      navTitles: {
         days(dp) {
            return `${dp.viewDate.toLocaleString("th-TH", { month: "long" })}, ${dp.viewDate.getFullYear() + 543}`;
         },
         months(dp) {
            return `${dp.viewDate.getFullYear() + 543}`;
         },
         years(dp) {
            const startYear = dp.viewDate.getFullYear() - (dp.viewDate.getFullYear() % 10);
            return `${startYear + 543} - ${startYear + 9 + 543}`;
         },
      },
      dateFormat(date) {
         const day = date.getDate().toString().padStart(2, "0");
         const month = (date.getMonth() + 1).toString().padStart(2, "0");
         const year = (date.getFullYear() + 543).toString();
         if (props.showTime) {
            const hours = date.getHours().toString();
            const minutes = date.getMinutes().toString();
            return `${day}/${month}/${year} ${hours}:${minutes}`;
         } else {
            return `${day}/${month}/${year}`;
         }
      },
      onRenderCell({ date, cellType }) {
         if (cellType === "year") {
            return {
               html: `${date.getFullYear() + 543}`,
            };
         }
      },
      onSelect({ date }) {
         let formattedDate = "";
         if (date) {
            if (props.showTime) {
               formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${(
                  date.getFullYear() + 543
               ).toString()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
            } else {
               formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${(
                  date.getFullYear() + 543
               ).toString()}`;
            }
         }
         // dateSelected.value = date;
         emit("update:modelValue", formattedDate);
      },
      onShow() {
         const airDatepickerContainer = document.querySelector('.air-datepicker');
         const div = document.createElement("div");
         div.classList.add("clear-btn");
         const text = document.createTextNode("ล้างค่า");
         div.appendChild(text);

         airDatepickerContainer.appendChild(div)

         const clearBtns = airDatepickerContainer.querySelectorAll('.clear-btn');
         if (clearBtns.length > 0) {
            const firstDiv = clearBtns[0];
            clearBtns.forEach(div => {
               if (div !== firstDiv) {
                  airDatepickerContainer.removeChild(div);
               }
            });
         }
         div.addEventListener("click", () => {
            emit("update:modelValue", '');
         });
      }
   }

   airDatepicker = new AirDatepicker(document.getElementById(props.inputId), option);

   if (props.modelValue) {
      // dateSelected.value = new Date(props.modelValue);
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
         background: #F26522;
      }
   }

   &.-current- {
      color: #f26522;
   }
}

.clear-btn {
   color: #ff9a19;
   text-align: center;
   padding: 8px 8px 10px 8px;
   color: rgb(242, 101, 34);
   cursor: pointer;
   &:hover {
      background: #F5F4F4;
   }
}
</style>