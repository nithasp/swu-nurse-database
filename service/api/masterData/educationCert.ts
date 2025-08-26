export default {
    //วุฒิการศึกษา
    async fetchMasterEducationCertList(filters: { keyword: string; offset: number; max: number }) {
       const { keyword, offset, max } = filters;
       const options = {
          method: "GET",
          url: `/masterManagement/educationCert/?offset=${offset}&max=${max}`,
       };
       if (keyword) {
          options.url += `&keyword=${keyword}`;
       }
       return await fetchApi(options);
    },
    async fetchEducationCert(id: string) {
       const options = {
          method: "GET",
          url: `/masterManagement/educationCert/${id}`,
       };
       return await fetchApi(options);
    },
    async createEducationCert(data: { nameTh: string }) {
       const req = {
          nameTh: data.nameTh,
       };
       const options = {
          method: "POST",
          url: `/masterManagement/educationCert/`,
          body: req,
          showToastError: true,
       };
       return await fetchApi(options);
    },
    async updateEducationCert(data: { id: number; nameTh: string }) {
       const req = {
          nameTh: data.nameTh,
       };
       const options = {
          method: "POST",
          url: `/masterManagement/educationCert/${data.id}`,
          body: req,
          showToastError: true,
       };
       return await fetchApi(options);
    },
    async deleteEducationCert(id: number) {
       const options = {
          method: "DELETE",
          url: `/masterManagement/educationCert/${id}`,
       };
       return await fetchApi(options);
    },
 };
 