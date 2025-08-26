export default {
   //ประเภทสิ่งประดิษฐ์
   async fetchMasterInventionTypeList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/inventionType/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchInventionType(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/inventionType/${id}`,
      };
      return await fetchApi(options);
   },
   async createInventionType(data: { nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/inventionType/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateInventionType(data: { id: number; nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/inventionType/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteInventionType(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/inventionType/${id}`,
      };
      return await fetchApi(options);
   },
};
