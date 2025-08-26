export default {
   async fetchDashboardPersonnelList(filters: { agencyIds: number }) {
      const { agencyIds } = filters;

      const options = {
         method: "GET",
         url: `/personnel/list?offset=0&max=-1`,
      };

      if (agencyIds) {
         options.url += `&agencyIds=${agencyIds}`;
      }

      return await fetchApi(options);
   },
   async fetchDashboardAcademicOwnerSummary(filters: { ownerIds: any[]; yearType: string; year: string; yearPrevCount: string }) {
      const { ownerIds, yearType, year, yearPrevCount } = filters;
      const options = {
         method: "GET",
         url: `/dashboard/academic/owner/summary?yearType=${yearType}&year=${year}&yearPrevCount=${yearPrevCount}`,
      };
      if (ownerIds.length) {
         const ids = ownerIds.map((item) => item.id);
         options.url += `&ownerIds=${ids}`;
      }
      return await fetchApi(options);
   },
   async fetchDashboardAcademicBudgetsourceSummary(filters: { year: string; yearPrevCount: string }) {
      const { year, yearPrevCount } = filters;
      const options = {
         method: "GET",
         url: `/dashboard/academic/budgetSource/summary?year=${year}&yearPrevCount=${yearPrevCount}`,
      };
      return await fetchApi(options);
   },
   async fetchDashboardAcademicBudgetsourceAmountSummary(filters: { yearType: string; year: string; yearPrevCount: string }) {
      const { yearType, year, yearPrevCount } = filters;
      const options = {
         method: "GET",
         url: `/dashboard/academic/budgetSource/amountSummary?year=${year}&yearPrevCount=${yearPrevCount}&yearType=${yearType}`,
      };
      return await fetchApi(options);
   },
};
