export default {
   //หัวข้อรายงานการศึกษาต่อ
   async fetchMasterReportTopicList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/reportTopic/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchReportTopic(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/reportTopic/${id}`,
      };
      return await fetchApi(options);
   },
   async createReportTopic(data: { nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/reportTopic/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateReportTopic(data: { id: number; nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/reportTopic/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteReportTopic(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/reportTopic/${id}`,
      };
      return await fetchApi(options);
   },
};
