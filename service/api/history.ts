export default {
   async fetchHistoryList(filters: { keyword: string; offset: number; max: number; dateA: string; dateB: string; roleIds: any[]; moduleIds: any[] }) {
      const { keyword, offset, max, dateA, dateB, roleIds, moduleIds } = filters;
      const options = {
         method: "GET",
         url: `/history/list?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      if (roleIds.length) {
         const ids = roleIds.map((item) => item.id);
         options.url += `&roleIds=${ids}`;
      }
      if (moduleIds.length) {
         const ids = moduleIds.map((item) => item.id);
         options.url += `&moduleIds=${ids}`;
      }

      if (dateA) {
         options.url += `&dateA=${encodeURIComponent(
            genTextDate({
               date: dateA,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD/MM/YYYY HH:mm",
               isBuddhistYear: true,
            })
         )}`;
      }
      if (dateB) {
         options.url += `&dateB=${encodeURIComponent(
            genTextDate({
               date: dateB,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD/MM/YYYY HH:mm",
               isBuddhistYear: true,
            })
         )}`;
      }
      return await fetchApi(options);
   },
   //ชื่อสิทธิ์ผู้ใช้งาน
   async fetchHistoryRoleList() {
      const options = {
         method: "GET",
         url: `/history/role`,
      };
      return await fetchApi(options);
   },
   //เมนูที่เข้าใช้งาน
   async fetchHistoryModuleList() {
      const options = {
         method: "GET",
         url: `/history/module`,
      };
      return await fetchApi(options);
   },
};
