export default {
   //ประเภทการลา
   async fetchMasterLeaveTypeList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/leaveType/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchLeaveType(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/leaveType/${id}`,
      };
      return await fetchApi(options);
   },
   async createLeaveType(data: { parent: string; nameTh: string }) {
      const req = {
         parent: data.parent,
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/leaveType/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateLeaveType(data: { id: number; parent: string; nameTh: string }) {
      const req = {
         parent: data.parent,
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/leaveType/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteLeaveType(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/leaveType/${id}`,
      };
      return await fetchApi(options);
   },
};
