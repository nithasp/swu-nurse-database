export default {
   async fetchAcademicList(filters: { keyword: string; offset: number; max: number; educationYear: any[] }) {
      const { keyword, offset, max, educationYear } = filters;
      const options = {
         method: "GET",
         url: `/academic/report/list?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      if (educationYear.length) {
         const ids = educationYear.map((item) => item.id);
         options.url += `&educationYear=${ids}`;
      }
      return await fetchApi(options);
   },
};
