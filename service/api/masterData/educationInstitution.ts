export default {
    //สถาบันการศึกษา
    async fetchMasterEducationInstitutionList(filters: { keyword: string; offset: number; max: number }) {
       const { keyword, offset, max } = filters;
       const options = {
          method: "GET",
          url: `/masterManagement/educationInstitution/?offset=${offset}&max=${max}`,
       };
       if (keyword) {
          options.url += `&keyword=${keyword}`;
       }
       return await fetchApi(options);
    },
    async fetchEducationInstitution(id: string) {
       const options = {
          method: "GET",
          url: `/masterManagement/educationInstitution/${id}`,
       };
       return await fetchApi(options);
    },
    async createEducationInstitution(data: { nameTh: string }) {
       const req = {
          nameTh: data.nameTh,
       };
       const options = {
          method: "POST",
          url: `/masterManagement/educationInstitution/`,
          body: req,
          showToastError: true,
       };
       return await fetchApi(options);
    },
    async updateEducationInstitution(data: { id: number; nameTh: string }) {
       const req = {
          nameTh: data.nameTh,
       };
       const options = {
          method: "POST",
          url: `/masterManagement/educationInstitution/${data.id}`,
          body: req,
          showToastError: true,
       };
       return await fetchApi(options);
    },
    async deleteEducationInstitution(id: number) {
       const options = {
          method: "DELETE",
          url: `/masterManagement/educationInstitution/${id}`,
       };
       return await fetchApi(options);
    },
 };
 