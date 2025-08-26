export default {
   async fetchDashboardResearchesPercent(filters: { yearType: string; year: number; numberOfYears: string }) {
      const { yearType, year, numberOfYears } = filters;
      const options = {
         method: "GET",
         url: `/dashboard/researches/percent?yearType=${yearType}&year=${year}&numberOfYears=${numberOfYears}`,
      };
      return await fetchApi(options);
   },
   async fetchDashboardYear(filters: { researches: any[]; agency: string; leader: any[]; yearType: string; year: number; numberOfYear: string }) {
      const { researches, agency, leader, yearType, year, numberOfYear } = filters;
      const options = {
         method: "GET",
         url: `/dashboard/researches/year?agency=${agency}&yearType=${yearType}&year=${year}&numberOfYear=${numberOfYear}`,
      };
      if (researches.length) {
         const ids = researches.map((item) => item.id);
         options.url += `&researches=${ids}`;
      }
      if (leader.length) {
         const ids = leader.map((item) => item.id);
         options.url += `&leader=${ids}`;
      }
      return await fetchApi(options);
   },
   async fetchDashboardAgency(filters: { researches: any[]; yearType: string; year: number; numberOfYear: string }) {
      const { researches, yearType, year, numberOfYear } = filters;
      const options = {
         method: "GET",
         url: `/dashboard/researches/agency?yearType=${yearType}&year=${year}&numberOfYear=${numberOfYear}`,
      };
      if (researches.length) {
         const ids = researches.map((item) => item.id);
         options.url += `&researches=${ids}`;
      }
      return await fetchApi(options);
   },
   async fetchDashboardFunding(filters: { yearType: string; year: number; numberOfYear: string }) {
      const { yearType, year, numberOfYear } = filters;
      const options = {
         method: "GET",
         url: `/dashboard/researches/funding?yearType=${yearType}&year=${year}&numberOfYear=${numberOfYear}`,
      };
      return await fetchApi(options);
   },
};
