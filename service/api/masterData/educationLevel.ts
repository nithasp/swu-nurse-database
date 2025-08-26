export default {
   //ระดับการศึกษา
   async fetchMasterEducationLevelList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/educationLevel/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchEducationLevel(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/educationLevel/${id}`,
      };
      return await fetchApi(options);
   },
   async createEducationLevel(data: { nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/educationLevel/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateEducationLevel(data: { id: number; nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/educationLevel/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteEducationLevel(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/educationLevel/${id}`,
      };
      return await fetchApi(options);
   },
};
