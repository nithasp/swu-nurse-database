export default {
   async fetchPersonnelEducationAdditionalList(personnelId: string, filters: { offset: number; max: number }) {
      const { offset, max } = filters;
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/educationAdditional/list?offset=${offset}&max=${max}`,
      };
      return await fetchApi(options);
   },
   async fetchPersonnelEducationAdditionalById(personnelId: string, educationAdditionalId: string) {
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/educationAdditional/${educationAdditionalId}`,
      };
      return await fetchApi(options);
   },
   async addPersonnelEducationAdditional(
      personnelId: string,
      body: {
         educationYearId: number;
         contractNumber: string;
         educationLevelId: number;
         course: string;
         dateLeaveEducationStart: string;
         dateLeaveEducationEnd: string;
         implementation: string;
         fileId: number;
         leaveTypeId: number;
         educationCertificationId: number;
         educationInstitutionId: number;
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
         dateLeaveEducationStart: genTextDate({
            date: body.dateLeaveEducationStart,
            format: "YYYY-MM-DDTHH:mm:ssZ",
            oldFormat: "DD-MM-YYYY HH:mm",
            isBuddhistYear: true,
         }),
         dateLeaveEducationEnd: genTextDate({
            date: body.dateLeaveEducationEnd,
            format: "YYYY-MM-DDTHH:mm:ssZ",
            oldFormat: "DD-MM-YYYY HH:mm",
            isBuddhistYear: true,
         }),
      };
      const options = {
         method: "POST",
         url: `/personnel/${personnelId}/educationAdditional`,
         body,
      };
      return await fetchApi(options);
   },
   async updatePersonnelEducationAdditional(
      personnelId: string,
      educationAdditionalId: string,
      body: {
         educationYearId: number;
         contractNumber: string;
         educationLevelId: number;
         course: string;
         dateLeaveEducationStart: string;
         dateLeaveEducationEnd: string;
         implementation: string;
         fileId: number;
         leaveTypeId: number;
         educationCertificationId: number;
         educationInstitutionId: number;
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
         dateLeaveEducationStart: genTextDate({
            date: body.dateLeaveEducationStart,
            format: "YYYY-MM-DDTHH:mm:ssZ",
            oldFormat: "DD-MM-YYYY HH:mm",
            isBuddhistYear: true,
         }),
         dateLeaveEducationEnd: genTextDate({
            date: body.dateLeaveEducationEnd,
            format: "YYYY-MM-DDTHH:mm:ssZ",
            oldFormat: "DD-MM-YYYY HH:mm",
            isBuddhistYear: true,
         }),
         files: body.files.concat(body.filesDelete).map(({ filename, link, ...i }) => i)
      };
      const options = {
         method: "POST",
         url: `/personnel/${personnelId}/educationAdditional/${educationAdditionalId}`,
         body,
      };
      return await fetchApi(options);
   },
   async deletePersonnelEducationAdditional(personnelId: string, educationAdditionalId: string) {
      const options = {
         method: "DELETE",
         url: `/personnel/${personnelId}/educationAdditional/${educationAdditionalId}`,
      };
      return await fetchApi(options);
   },
};
