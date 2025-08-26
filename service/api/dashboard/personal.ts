export default {
   async fetchDashboardPersonnelAgency() {
      const options = {
         method: "GET",
         url: `/dashboard/personnel/agency`,
      };
      return await fetchApi(options);
   },
   async fetchDashboardPersonnelEducationLevel() {
      const options = {
         method: "GET",
         url: `/dashboard/personnel/educationLevel`,
      };
      return await fetchApi(options);
   },
   async fetchDashboardPersonnelPosition() {
      const options = {
         method: "GET",
         url: `/dashboard/personnel/academicPosition`,
      };
      return await fetchApi(options);
   },
};
