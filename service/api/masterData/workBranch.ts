export default {
   //ประเภทการฝึกอบรม
   async fetchMasterWorkBranchList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/workBranch/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchWorkBranch(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/workBranch/${id}`,
      };
      return await fetchApi(options);
   },
   async createWorkBranch(data: { nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/workBranch/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateWorkBranch(data: { id: number; nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/workBranch/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteWorkBranch(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/workBranch/${id}`,
      };
      return await fetchApi(options);
   },
};
