export default {
   //ประเภทสัญญา
   async fetchMasterContractTypeList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/contractType/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchContractType(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/contractType/${id}`,
      };
      return await fetchApi(options);
   },
   async createContractType(data: { nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/contractType/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateContractType(data: { id: number; nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/contractType/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteContractType(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/contractType/${id}`,
      };
      return await fetchApi(options);
   },
};
