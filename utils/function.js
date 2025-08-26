const toast = useToast();
import moment from "moment";
import "moment/dist/locale/th";

export const fetchApi = async (options) => {
   const token = useCookie("swuNurseAccessToken");
   const headers = {};

   if (options.tokenTemp) {
      headers["Authorization"] = `Bearer ${options.tokenTemp}`;
   } else {
      if (token.value) {
         headers["Authorization"] = `Bearer ${token.value}`;
      }
   }

   const config = useRuntimeConfig();

   const optionFetch = {
      baseURL: config.public.apiBaseUrl,
      method: options.method,
      headers,
   };

   if (options.body) {
      optionFetch.body = options.body;
   }

   const res = await $fetch(options.url, optionFetch).catch((error) => error.data);

   if (res.code == 20000) {
      return res;
   } else {
      if (res.code == 40100) {
         if (token.value) {
            token.value = null;
            toast.add({ title: res.message, color: "red" });
            navigateTo("/login");
         }
      } else {
         try {
            const parse = JSON.parse(res);
            if (options.showToastError) {
               toast.add({ title: parse.message, color: "red" });
            }
         } catch (e) {
            if (options.showToastError) {
               toast.add({ title: res.message, color: "red" });
            }
         }
      }
      return res;
   }
};

export const fetchApiDownloadExcel = async (url, fileName, auth = true) => {
   const token = useCookie("swuNurseAccessToken");
   let headers = { "Content-Type": "application/json" };
   if (auth) {
      headers["Authorization"] = `Bearer ${token.value}`;
   }

   const config = useRuntimeConfig();

   const res = await fetch(`${config.public.apiBaseUrl}${url}`, {
      method: "GET",
      headers,
   }).catch((error) => error.data);

   if (res.status == 200) {
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      toast.add({ title: "พิมพ์รายงานสำเร็จ", color: "green" });
   } else {
      if (res.status == 403) {
         toast.add({ title: "เกิดข้อผิดพลาด หมดอายุการใช้งาน", color: "red" });
      } else {
         toast.add({ title: res.message, color: "red" });
      }
   }
};

export const inputNumberAndDotOnly = (e) => {
   if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 46) {
      e.returnValue = true;
   } else {
      e.returnValue = false;
   }
};

export const inputNumberOnly = (e) => {
   if (e.keyCode >= 48 && e.keyCode <= 57) {
      e.returnValue = true;
   } else {
      e.returnValue = false;
   }
};

export const inputNoSpace = (e) => {
   if (e.keyCode === 32) {
      e.returnValue = false;
   } else {
      e.returnValue = true;
   }
};

export const formatThaiCitizenID = (citizenID) => {
   const originalCitizenID = citizenID.toString().replaceAll("-", "");
   if (originalCitizenID.length < 13) {
      return originalCitizenID;
   }
   let part1 = originalCitizenID.slice(0, 1);
   let part2 = originalCitizenID.slice(1, 5);
   let part3 = originalCitizenID.slice(5, 10);
   let part4 = originalCitizenID.slice(10, 12);
   let part5 = originalCitizenID.slice(12);
   let formattedCitizenID = `${part1}-${part2}-${part3}-${part4}-${part5}`;
   return formattedCitizenID;
};

export const validatorForm = (form, validator) => {
   const fail = [];
   for (const key in validator) {
      if (validator[key].showMessage == true) {
         fail.push(key);
         validator[key].showMessage = true;
      } else {
         if (validator[key].type == "array") {
            if (form[key].length == 0) {
               fail.push(key);
               validator[key].showMessage = true;
            }
         } else if (validator[key].type == "object") {
            if (!form[validator[key].parentKey][key]) {
               fail.push(key);
               validator[key].showMessage = true;
            }
         } else {
            if (!form[key]) {
               fail.push(key);
               validator[key].showMessage = true;
            }
         }
      }
   }
   return fail;
};

export const calEducationYear = (date) => {
   if (!date) {
      return "";
   }
   const dateSelect = new Date(moment(date, "DD-MM-YYYY").subtract(543, "years").format(""));
   const year = dateSelect.getFullYear();
   //1 สิงหาคม ของปี พ.ศ. ปัจจุบัน - 31 กรกฎาคมของปีถัดไป
   const start = new Date(`${year}-08-01 00:00:00`);
   const end = new Date(`${year + 1}-07-31 23:59:59`);
   let yearResult = null;
   if (dateSelect.getTime() >= start.getTime() && dateSelect.getTime() <= end.getTime()) {
      yearResult = year;
   } else {
      if (dateSelect.getTime() < start.getTime()) {
         yearResult = year - 1;
      } else {
         yearResult = year + 1;
      }
   }
   return (yearResult + 543).toString();
};

export const calBudgetYear = (date) => {
   if (!date) {
      return "";
   }
   const dateSelect = new Date(moment(date, "DD-MM-YYYY").subtract(543, "years").format(""));
   const year = dateSelect.getFullYear();
   //1 ตุลาคม ของปี ปัจจุบัน - 30 กันยายน ปัจจุบัน
   const start = new Date(`${year - 1}-10-01 00:00:00`);
   const end = new Date(`${year}-09-30 23:59:59`);
   let yearResult = null;
   if (dateSelect.getTime() >= start.getTime() && dateSelect.getTime() <= end.getTime()) {
      yearResult = year;
   } else {
      if (dateSelect.getTime() < start.getTime()) {
         yearResult = year - 1;
      } else {
         yearResult = year + 1;
      }
   }
   return (yearResult + 543).toString();
};

export const diffDate = (dateOne, dateTwo) => {
   let d1 = genTextDate({ date: dateOne, format: "YYYY-MM-DD", oldFormat: "DD-MM-YYYY", isBuddhistYear: true });
   let d2 = genTextDate({ date: dateTwo, format: "YYYY-MM-DD", oldFormat: "DD-MM-YYYY", isBuddhistYear: true });

   const now = moment(new Date(d1));
   const end = moment(new Date(d2));
   const duration = moment.duration(now.diff(end));

   const years = Math.floor(duration.asDays() / 365);
   const months = Math.floor((duration.asDays() % 365) / 30);
   const days = Math.floor((duration.asDays() % 365) % 30);

   return { days, months, years };
};

export const dateFormExport = () => {
   const currentDate = new Date();
   const year = (currentDate.getFullYear() + 543).toString().slice(-2);
   const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
   const day = currentDate.getDate().toString().padStart(2, "0");
   const formattedDate = `${day}-${month}-${year}`;
   return formattedDate;
};
