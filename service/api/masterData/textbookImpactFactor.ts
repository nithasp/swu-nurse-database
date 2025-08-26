export default {
   //ระดับฐานข้อมูลหนังสือ /ตำรา
   async fetchMasterTextbookImpactFactorList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/textbookImpactFactor/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchTextbookImpactFactor(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/textbookImpactFactor/${id}`,
      };
      return await fetchApi(options);
   },
   async createTextbookImpactFactor(data: { nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/textbookImpactFactor/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateTextbookImpactFactor(data: { id: number; nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/textbookImpactFactor/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteTextbookImpactFactor(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/textbookImpactFactor/${id}`,
      };
      return await fetchApi(options);
   },
};
