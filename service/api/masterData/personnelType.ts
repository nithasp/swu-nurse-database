export default {
   //ประเภทบุคลากร
   async fetchMasterPersonnelTypeList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/personnelType/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchPersonnelType(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/personnelType/${id}`,
      };
      return await fetchApi(options);
   },
   async createPersonnelType(data: { nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/personnelType/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updatePersonnelType(data: { id: number; nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/personnelType/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deletePersonnelType(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/personnelType/${id}`,
      };
      return await fetchApi(options);
   },
};
