export default {
   async fetchPersonnelEducationAdditionalProgressList(personnelId: string, educationAdditionalId: string, filters: { offset: number; max: number }) {
      const { offset, max } = filters;
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/educationAdditionalProgress/list?offset=${offset}&max=${max}&educationAdditionalId=${educationAdditionalId}`,
      };
      return await fetchApi(options);
   },
   async fetchPersonnelEducationAdditionalProgressById(personnelId: string, educationAdditionalProgressId: string) {
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/educationAdditionalProgress/${educationAdditionalProgressId}`,
      };
      return await fetchApi(options);
   },
   async addPersonnelEducationAdditionalProgress(
      personnelId: string,
      body: {
         educationAdditionalId: number;
         educationYearLevel: any;
         dateReported: string;
         reportTopicId: number;
         detail: string;
         files: {
            fileId: number;
            add: boolean;
            delete: boolean;
            filename?: string;
            link?: string;
         }[];
      }
   ) {
      body = {
         ...body,
         educationYearLevel: Math.round(body.educationYearLevel),
         dateReported: genTextDate({
            date: body.dateReported,
            format: "YYYY-MM-DDTHH:mm:ssZ",
            oldFormat: "DD-MM-YYYY HH:mm",
            isBuddhistYear: true,
         }),
      };
      const options = {
         method: "POST",
         url: `/personnel/${personnelId}/educationAdditionalProgress`,
         body,
      };
      return await fetchApi(options);
   },
   async updatePersonnelEducationAdditionalProgress(
      personnelId: string,
      educationAdditionalProgressId: string,
      body: {
         educationAdditionalId: number;
         educationYearLevel: any;
         dateReported: string;
         reportTopicId: number;
         detail: string;
         files: {
            fileId: number;
            add: boolean;
            delete: boolean;
            filename?: string;
            link?: string;
         }[];
         filesDelete: {
            fileId: number;
            add: boolean;
            delete: boolean;
         }[];
      }
   ) {
      body = {
         ...body,
         educationYearLevel: Math.round(body.educationYearLevel),
         dateReported: genTextDate({
            date: body.dateReported,
            format: "YYYY-MM-DDTHH:mm:ssZ",
            oldFormat: "DD-MM-YYYY HH:mm",
            isBuddhistYear: true,
         }),
         files: body.files.concat(body.filesDelete).map(({ filename, link, ...i }) => i),
      };
      const options = {
         method: "POST",
         url: `/personnel/${personnelId}/educationAdditionalProgress/${educationAdditionalProgressId}`,
         body,
      };
      return await fetchApi(options);
   },
   async deletePersonnelEducationAdditionalProgress(personnelId: string, educationAdditionalProgressId: string) {
      const options = {
         method: "DELETE",
         url: `/personnel/${personnelId}/educationAdditionalProgress/${educationAdditionalProgressId}`,
      };
      return await fetchApi(options);
   },
};
