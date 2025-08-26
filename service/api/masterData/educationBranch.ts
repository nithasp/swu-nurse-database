export default {
   //สาขาวิชา
   async fetchMasterEducationBranchList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/educationBranch/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchEducationBranch(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/educationBranch/${id}`,
      };
      return await fetchApi(options);
   },
   async createEducationBranch(data: { nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/educationBranch/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateEducationBranch(data: { id: number; nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/educationBranch/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteEducationBranch(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/educationBranch/${id}`,
      };
      return await fetchApi(options);
   },
};
