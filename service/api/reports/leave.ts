export default {
   async fetchPersonnelLeaveReport(filters: { offset: number; max: number; keyword: string; agencies: any[]; leaveType: any[]; dateStart: string; dateEnd: string }) {
      const { offset, max, keyword, agencies, leaveType, dateStart, dateEnd } = filters;
      const options = {
         method: "GET",
         url: `/personnel/leave/report/list?offset=${offset}&max=${max}`,
      };

      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }

      if (agencies.length) {
         const ids = agencies.map((item) => item.id);
         options.url += `&agencies=${ids}`;
      }
      if (leaveType.length) {
         const ids = leaveType.map((item) => item.id);
         options.url += `&leaveType=${ids}`;
      }
      if (dateStart) {
         options.url += `&dateStart=${encodeURIComponent(
            genTextDate({
               date: dateStart,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD/MM/YYYY",
               isBuddhistYear: true,
            })
         )}`;
      }
      if (dateEnd) {
         options.url += `&dateEnd=${encodeURIComponent(
            genTextDate({
               date: dateEnd,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD/MM/YYYY",
               isBuddhistYear: true,
            })
         )}`;
      }
      return await fetchApi(options);
   },
};
