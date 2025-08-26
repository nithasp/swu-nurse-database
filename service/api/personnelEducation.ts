export default {
   async fetchPersonnelEducationList(personnelId: string, filters: { offset: number; max: number }) {
      const { offset, max } = filters;
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/education/list?offset=${offset}&max=${max}`,
      };
      return await fetchApi(options);
   },
   async fetchPersonnelEducationById(personnelId: string, userEducationId: string) {
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/education/${userEducationId}`,
      };
      return await fetchApi(options);
   },
   async addPersonnelEducation(
      personnelId: string,
      body: {
         educationYearId: number;
         educationLevelId: number;
         educationInstitutionId: number;
         educationCertificationId: number;
         educationalBranchId: number;
         dateStartEducation: string;
         course: string;
         yearFinishEducationId: number;
         dateFinishEducation: string;
         govCertify: boolean;
         evaluate: boolean;
         remark: string;
         countryId: number;
         avgGrade: number | string;
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
         avgGrade: body.avgGrade ? Number(body.avgGrade) : 0,
         dateStartEducation: genTextDate({ date: body.dateStartEducation, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
         dateFinishEducation: genTextDate({ date: body.dateFinishEducation, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
      };
      const options = {
         method: "POST",
         url: `/personnel/${personnelId}/education`,
         body,
      };
      return await fetchApi(options);
   },
   async updatePersonnelEducation(
      personnelId: string,
      userEducationId: string,
      body: {
         educationYearId: number;
         educationLevelId: number;
         educationInstitutionId: number;
         educationCertificationId: number;
         educationalBranchId: number;
         dateStartEducation: string;
         course: string;
         yearFinishEducationId: number;
         dateFinishEducation: string;
         govCertify: boolean;
         evaluate: boolean;
         remark: string;
         countryId: number;
         avgGrade: number | string;
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
         avgGrade: body.avgGrade ? Number(body.avgGrade) : 0,
         dateStartEducation: genTextDate({ date: body.dateStartEducation, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
         dateFinishEducation: genTextDate({ date: body.dateFinishEducation, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
         files: body.files.concat(body.filesDelete).map(({ filename, link, ...i }) => i)
      };
      const options = {
         method: "POST",
         url: `/personnel/${personnelId}/education/${userEducationId}`,
         body,
      };
      return await fetchApi(options);
   },
   async deletePersonnelEducation(personnelId: string, userEducationId: string) {
      const options = {
         method: "DELETE",
         url: `/personnel/${personnelId}/education/${userEducationId}`,
      };
      return await fetchApi(options);
   },
};
