export default {
   //คำนำหน้าชื่อ
   async fetchMasterPrefixList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/prefix/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchPrefix(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/prefix/${id}`,
      };
      return await fetchApi(options);
   },
   async createPrefix(data: { nameTh: string; nameEn: string }) {
      const req = {
         nameTh: data.nameTh,
         nameEn: data.nameEn,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/prefix/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updatePrefix(data: { id: number; nameTh: string; nameEn: string }) {
      const req = {
         nameTh: data.nameTh,
         nameEn: data.nameEn,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/prefix/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deletePrefix(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/prefix/${id}`,
      };
      return await fetchApi(options);
   },
};
