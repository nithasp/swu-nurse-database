export default {
   async fetchPersonnelCurrency(personnelId: string, filters: { offset: number; max: number }) {
      const { offset, max } = filters;
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/currency/list?offset=${offset}&max=${max}`,
      };
      return await fetchApi(options);
   },
   async fetchPersonnelCurrencyById(personnelId: string, currencyId: string) {
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/currency/${currencyId}`,
      };
      return await fetchApi(options);
   },
   async addPersonnelCurrency(
      personnelId: string,
      body: {
         currencyId: any;
         currencyNumber: any;
         budgetTypeId: number;
         positionId: number;
         workBranchId: number;
         agencyId: number;
         salary: any;
         experienceCompensation: any;
         specialCompensation: any;
         currencyType: string;
         divisionId: number;
         academicPositionId: number;
         placementDate: string;
         currentLevel: any;
         maxLevel: any;
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
         currencyNumber: body.currencyNumber ? String(Math.floor(body.currencyNumber)) : "",
         currencyId: body.currencyId ? parseFloat(body.currencyId) : 0,
         salary: body.salary ? parseFloat(body.salary) : 0,
         experienceCompensation: body.experienceCompensation ? parseFloat(body.experienceCompensation) : 0,
         specialCompensation: body.specialCompensation ? parseFloat(body.specialCompensation) : 0,
         currentLevel: body.currentLevel,
         maxLevel: body.maxLevel,
         placementDate: genTextDate({ date: body.placementDate, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
      };
      const options = {
         method: "POST",
         url: `/personnel/${personnelId}/currency`,
         body,
      };
      return await fetchApi(options);
   },
   async updatePersonnelCurrency(
      personnelId: string,
      currencyId: string,
      body: {
         currencyId: any;
         currencyNumber: any;
         budgetTypeId: number;
         positionId: number;
         workBranchId: number;
         agencyId: number;
         salary: any;
         experienceCompensation: any;
         specialCompensation: any;
         currencyType: string;
         divisionId: number;
         academicPositionId: number;
         placementDate: string;
         currentLevel: any;
         maxLevel: any;
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
         currencyNumber: body.currencyNumber ? String(Math.floor(body.currencyNumber)) : "",
         currencyId: body.currencyId ? parseFloat(body.currencyId) : 0,
         salary: body.salary ? parseFloat(body.salary) : 0,
         experienceCompensation: body.experienceCompensation ? parseFloat(body.experienceCompensation) : 0,
         specialCompensation: body.specialCompensation ? parseFloat(body.specialCompensation) : 0,
         currentLevel: body.currentLevel,
         maxLevel: body.maxLevel,
         placementDate: genTextDate({ date: body.placementDate, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
         files: body.files.concat(body.filesDelete).map(({ filename, link, ...i }) => i)
      };
      const options = {
         method: "POST",
         url: `/personnel/${personnelId}/currency/${currencyId}`,
         body,
      };
      return await fetchApi(options);
   },
   async deletePersonnelCurrency(personnelId: string, currencyId: string) {
      const options = {
         method: "DELETE",
         url: `/personnel/${personnelId}/currency/${currencyId}`,
      };
      return await fetchApi(options);
   },
};
