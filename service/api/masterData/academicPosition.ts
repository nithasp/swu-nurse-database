export default {
   //ตำแหน่งทางวิชาการ
   async fetchMasterAcademicPositionList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/masterManagement/academicPosition/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async fetchAcademicPosition(id: string) {
      const options = {
         method: "GET",
         url: `/masterManagement/academicPosition/${id}`,
      };
      return await fetchApi(options);
   },
   async createAcademicPosition(data: { nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/academicPosition/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateAcademicPosition(data: { id: number; nameTh: string }) {
      const req = {
         nameTh: data.nameTh,
      };
      const options = {
         method: "POST",
         url: `/masterManagement/academicPosition/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteAcademicPosition(id: number) {
      const options = {
         method: "DELETE",
         url: `/masterManagement/academicPosition/${id}`,
      };
      return await fetchApi(options);
   },
};
