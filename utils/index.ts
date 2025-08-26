import moment from "moment";

export const debounce = (func: Function, timeout: any) => {
   let timeoutId: any;
   return (...args: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
         func(...args);
      }, timeout);
   };
};

export const formatCurrency = (value: any, digits: any) => {
   if (!value) {
      return "";
   }
   let dollarUSLocale = Intl.NumberFormat("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
   return dollarUSLocale.format(value);
};

export const genTextDate = (data: { date: any; format: string; oldFormat?: string; isBuddhistYear: boolean }) => {
   let result = "";
   const { date, format, oldFormat, isBuddhistYear } = data;
   if (date) {
      let momentDate;
      if (oldFormat) {
         momentDate = moment(date, oldFormat);
      } else {
         momentDate = moment(date);
      }

      if (isBuddhistYear) {
         momentDate.subtract(543, "years");
      } else {
         momentDate.add(543, "years");
      }

      result = momentDate.format(format);
   }
   return result;
};

export const checkFormatDD_MM_YYYY = (dateString: any) => {
   const ddmmyyyyRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

   if (!ddmmyyyyRegex.test(dateString)) {
      return false;
   }

   const [_, day, month, year] = dateString.match(ddmmyyyyRegex);

   const date = new Date(`${year}-${month}-${day}`);
   const isValidDate = date && date.getDate() === parseInt(day) && date.getMonth() + 1 === parseInt(month) && date.getFullYear() === parseInt(year);

   return isValidDate;
};

export const openNewTab = (url: string) => {
   if (url) {
      window.open(url);
   }
};

export const getColorsList = (index: number) => {
   const colors = [
      "#00FF87",
      "#40C9FF",
      "#696EFF",
      "#FFA585",
      "#9BF8F4",
      "#9BAFD9",
      "#FEEBFF",
      "#01A5CF",
      "#B190BA",
      "#C2D4F9",
      "#FFEAE1",
      "#AF55E9",
      "#A8F368",
      "#F3F520",
      "#F16C52",
      "#F8A902",
      "#242ACF",
      "#FF51EB",
      "#FFA5F4",
      "#BE4F50",
      "#2276FF",
      "#D57500",
      "#F2568D",
      "#FAAFAF",
      "#E6E6A7",
      "#C6978E",
      "#51527D",
      "#42047E",
      "#5CB270",
      "#FB0700",
      "#565656",
      "#9DC405",
      "#8B3B00",
      "#36648B",
      "#96C2CB",
      "#B6D894",
      "#C0C0C0",
      "#937777",
      "#E8EDF2",
      "#CC7A88",
      "#654522",
      "#707E38",
      "#C2B280",
      "#653EB3",
      "#C61575",
      "#FFDCA8",
      "#0057AA",
      "#BEBE00",
      "#3E9FB3",
      "#000000",
   ];
   if (index > -1) {
      return colors[index];
   }
};
