const toast = useToast();
export const uploadFile = async (file) => {
   const token = useCookie("swuNurseAccessToken");
   const headers = {
      Authorization: `Bearer ${token.value}`,
   };

   const types = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
   ];
   const messageError = "รองรับสกุลไฟล์ .PDF, .DOCX, .XLSX และแนะนำขนาดแต่ละไฟล์ไม่เกิน 20 MB สูงสุด 3 ไฟล์";
   if (types.includes(file.type)) {
      const size = file.size / 1024 / 1000;
      if (size > 20) {
         toast.add({ title: messageError, color: "red" });
         return;
      }
      const formData = new FormData();
      formData.append("file", file);

      const config = useRuntimeConfig();
      try {
         const res = await $fetch("/fileupload", {
            baseURL: config.public.apiBaseUrl,
            method: "POST",
            body: formData,
            headers,
         });
         if (res.code === 20000) {
            return { fileName: res.responseObject.filename, fileId: res.responseObject.fileId, url: res.responseObject.url };
         } else {
            handleResponseError(res);
            return res;
         }
      } catch (error) {
         if (error.response && error.response._data) {
            handleResponseError(error.response._data);
         } else {
            toast.add({ title: "An unexpected error occurred", color: "red" });
         }
         return null;
      }
   } else {
      toast.add({ title: messageError, color: "red" });
      return null;
   }
};

export const uploadFileCV = async (file, personnelId) => {
   const token = useCookie("swuNurseAccessToken");
   const headers = {
      Authorization: `Bearer ${token.value}`,
   };
   const types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
   const messageError = "รองรับไฟล์เอกสาร .pdf, .docx และขนาดไฟล์ไม่เกิน 20 MB";
   if (types.includes(file.type)) {
      const size = file.size / 1024 / 1000;
      if (size > 20) {
         toast.add({ title: messageError, color: "red" });
         return;
      }
      const formData = new FormData();
      formData.append("file", file);

      const config = useRuntimeConfig();
      try {
         const res = await $fetch(`/personnel/${personnelId}/cv`, {
            baseURL: config.public.apiBaseUrl,
            method: "POST",
            body: formData,
            headers,
         });
         if (res.code === 20000) {
            toast.add({ title: res.message, color: "green" });
            return { fileName: res.responseObject.filename, fileId: res.responseObject.fileId };
         } else {
            handleResponseError(res);
            return res;
         }
      } catch (error) {
         if (error.response && error.response._data) {
            handleResponseError(error.response._data);
         } else {
            toast.add({ title: "An unexpected error occurred", color: "red" });
         }
         return null;
      }
   } else {
      toast.add({ title: messageError, color: "red" });
      return null;
   }
};

const handleResponseError = (res) => {
   if (res.code === 40100) {
      if (token.value) {
         token.value = null;
         toast.add({ title: res.message, color: "red" });
         navigateTo("/login");
      }
   } else {
      toast.add({ title: res.message || "An error occurred", color: "red" });
   }
};

export const uploadFileTemplatePersonnel = async (file) => {
   const types = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
   const token = useCookie("swuNurseAccessToken");
   const headers = {};
   headers["Authorization"] = `Bearer ${token.value}`;
   if (types.includes(file.type)) {
      const formData = new FormData();
      const config = useRuntimeConfig();
      formData.append("file", file);
      try {
         const res = await $fetch("/fileupload", {
            baseURL: config.public.apiBaseUrl,
            method: "POST",
            body: formData,
            headers: headers,
         });
         if (res.code === 20000) {
            return { fileName: res.responseObject.filename, fileId: res.responseObject.fileId, url: res.responseObject.url };
         } else {
            handleResponseError(res);
            return res;
         }
      } catch (error) {
         if (error.response && error.response._data) {
            handleResponseError(error.response._data);
         } else {
            toast.add({ title: "An unexpected error occurred", color: "red" });
         }
         return null;
      }
   } else {
      toast.add({ title: "Invalid file type", color: "red" });
      return null;
   }
};

export const exportFile = async (path, fileName) => {
   try {
      const token = useCookie("swuNurseAccessToken");
      const config = useRuntimeConfig();

      const requestOptions = {
         method: "GET",
         headers: {
            Authorization: `Bearer ${token.value}`,
         },
      };

      let contentType = "";
      fetch(`${config.public.apiBaseUrl}${path}`, requestOptions)
         .then((response) => {
            contentType = response.headers.get("content-type");
            return response.blob();
         })
         .then((myBlob) => {
            const blob = new Blob([myBlob], {
               type: contentType,
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `${fileName}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(link.href);
         });
   } catch (error) {
      console.error("Error during file export:", error);
   }
};

export const changeFile = async (e, path) => {
   const fileId = ref(0);
   if (e.target.files.length) {
      for (let i = 0; i < e.target.files.length; i++) {
         const res = await uploadFileTemplatePersonnel(e.target.files[i]);
         if (res) {
            fileId.value = res?.fileId;
         }
         const data = {
            fileId: fileId.value,
         };

         const config = useRuntimeConfig();
         const token = useCookie("swuNurseAccessToken");
         const headers = {};
         headers["Authorization"] = `Bearer ${token.value}`;
         try {
            const res = await $fetch(path, {
               baseURL: config.public.apiBaseUrl,
               method: "POST",
               body: JSON.stringify(data),
               headers: headers,
            });

            if (res?.code === 20000) {
               toast.add({ title: "นำเข้าข้อมูลสำเร็จแล้ว", color: "green" });
               return res;
            } else {
               toast.add({ title: res?.message, color: "red" });
               return res;
            }

         } catch (error) {
            toast.add({ title: error.data.message, color: "red" });
            return error;
         }
      }
   }
};