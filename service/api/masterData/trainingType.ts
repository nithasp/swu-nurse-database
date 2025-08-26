export default {
   //ประเภทการฝึกอบรม
   async fetchMasterTrainingTypeList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/trainingType/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchTrainingType(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/trainingType/${id}`,
      };
      return await fetchApi(options);
   },
   async createTrainingType(data: { nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/trainingType/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateTrainingType(data: { id: number; nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/trainingType/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteTrainingType(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/trainingType/${id}`,
      };
      return await fetchApi(options);
   },
};
