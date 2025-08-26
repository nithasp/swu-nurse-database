export default {
   //ระดับฐานข้อมูลวารสาร
   async fetchMasterImpactFactorList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/impactFactor/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchImpactFactor(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/impactFactor/${id}`,
      };
      return await fetchApi(options);
   },
   async createImpactFactor(data: { nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/impactFactor/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateImpactFactor(data: { id: number; nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/impactFactor/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteImpactFactor(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/impactFactor/${id}`,
      };
      return await fetchApi(options);
   },
};
