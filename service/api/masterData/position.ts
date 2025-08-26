export default {
   //ตำแหน่งงาน
   async fetchMasterPositionList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/position/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchPosition(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/position/${id}`,
      };
      return await fetchApi(options);
   },
   async createPosition(data: { nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/position/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updatePosition(data: { id: number; nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/position/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deletePosition(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/position/${id}`,
      };
      return await fetchApi(options);
   },
};
