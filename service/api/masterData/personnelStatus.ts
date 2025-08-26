export default {
   //สถานะบุคลากร
   async fetchMasterPersonnelStatusList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/personnelStatus/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchPersonnelStatus(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/personnelStatus/${id}`,
      };
      return await fetchApi(options);
   },
   async createPersonnelStatus(data: { nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/personnelStatus/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updatePersonnelStatus(data: { id: number; nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/personnelStatus/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deletePersonnelStatus(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/personnelStatus/${id}`,
      };
      return await fetchApi(options);
   },
};
