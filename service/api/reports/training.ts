export default {
   async fetchPersonnelTrainingReport(filters: {
      offset: number;
      max: number;
      agencyId: any[];
      trainingTypeId: any[];
      yearType: string;
      year: string;
      numberOfYears: string;
   }) {
      const { offset, max, agencyId, trainingTypeId, yearType, year, numberOfYears } = filters;
      const options = {
         method: "GET",
         url: `/personnel/training/report/list?offset=${offset}&max=${max}`,
      };
      if (agencyId.length) {
         const ids = agencyId.map((item) => item.id);
         options.url += `&agencyId=${ids}`;
      }
      if (trainingTypeId.length) {
         const ids = trainingTypeId.map((item) => item.id);
         options.url += `&trainingTypeId=${ids}`;
      }
      if (yearType) {
         options.url += `&yearType=${yearType}`;
      }
      if (year) {
         options.url += `&year=${year}`;
      }
      if (numberOfYears) {
         options.url += `&numberOfYears=${numberOfYears}`;
      }
      return await fetchApi(options);
   },
};
