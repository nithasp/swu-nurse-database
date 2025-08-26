export default {
   //หน่วยงานที่ปฏิบัติงาน
   async fetchMasterAgencyList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/agency/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchAgency(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/agency/${id}`,
      };
      return await fetchApi(options);
   },
   async createAgency(data: { nameTh: string; amount: string }) {
      const req = {
         nameTh: data.nameTh,
         amount: parseInt(data.amount),
      };
      const options = {
         method: "POST",
         url: `/masterManagement/agency/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateAgency(data: { id: number; nameTh: string; amount: string }) {
      const req = {
         nameTh: data.nameTh,
         amount: parseInt(data.amount),
      };
      const options = {
         method: "POST",
         url: `/masterManagement/agency/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteAgency(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/agency/${id}`,
      };
      return await fetchApi(options);
   },
};
