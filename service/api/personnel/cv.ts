export default {
   async fetchPersonnelCV(personnelId: string) {
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/cv`,
      };
      return await fetchApi(options);
   },
   async deletePersonnelCV(personnelId: string) {
      const options = {
         method: "DELETE",
         url: `/personnel/${personnelId}/cv`,
      };
      return await fetchApi(options);
   },
};
