export default {
   async fetchAcademicServicesList(filters: { keyword: string; offset: number; max: number; educationYearIds: string; budgetSourceIds: string; ownerIds: string }) {
      const { keyword, offset, max, educationYearIds, budgetSourceIds, ownerIds } = filters;
      const options = {
         method: "GET",
         url: `/academic/list?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      if (educationYearIds) {
         options.url += `&educationYearIds=${educationYearIds}`;
      }
      if (budgetSourceIds) {
         options.url += `&budgetSourceIds=${budgetSourceIds}`;
      }
      if (ownerIds) {
         options.url += `&ownerIds=${ownerIds}`;
      }
      return await fetchApi(options);
   },

   async fetchAcademicServicesOwnerList(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/academic/owner?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },

   async addAcademicServicesRegister(body: {
      budgetSourceId: number;
      dateStart: string;
      dateEnd: string;
      name: string;
      ownerId: number;
      participant: any;
      revenue: any;
      receiveEducationFundCount: any;
      receiveEducationFundAlumniCount: any;
      trainingAlumniList: {
         id: number;
         name: string;
      }[];
      traingingSiteCount: any;
      operationTrainingSiteName: string;
      satisfactionOperationAvg: string;
      satisfactionTheoryAvg: string;
      satisfactionOverallAvg: string;
      summaryFiles: {
         fileId: number;
         add: boolean;
         delete?: boolean;
         filename?: string;
         link?: string;
      }[];
      filesDelete?: {
         fileId: number;
         add: boolean;
         delete: boolean;
      }[];
      trainingAlumniListTemp?: {
         name: string;
      };
   }) {
      body = {
         ...body,
         participant: body.participant ? parseFloat(body.participant) : 0,
         revenue: body.revenue ? parseFloat(body.revenue) : 0,
         receiveEducationFundCount: body.receiveEducationFundCount ? parseFloat(body.receiveEducationFundCount) : 0,
         receiveEducationFundAlumniCount: body.receiveEducationFundAlumniCount ? parseFloat(body.receiveEducationFundAlumniCount) : 0,
         traingingSiteCount: body.traingingSiteCount ? parseFloat(body.traingingSiteCount) : 0,
         dateStart: genTextDate({ date: body.dateStart, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
         dateEnd: genTextDate({ date: body.dateEnd, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
         summaryFiles: body.summaryFiles.map((i) => ({ fileId: i.fileId, add: i.add })),
      };
      delete body.filesDelete;
      delete body.trainingAlumniListTemp;
      const options = {
         method: "POST",
         url: `/academic`,
         body,
      };
      return await fetchApi(options);
   },
   async updateAcademicServicesRegister(
      academicId: string,
      body: {
         budgetSourceId: number;
         dateStart: string;
         dateEnd: string;
         name: string;
         ownerId: number;
         participant: any;
         revenue: any;
         receiveEducationFundCount: any;
         receiveEducationFundAlumniCount: any;
         trainingAlumniList: {
            id: number;
            name: string;
         }[];
         traingingSiteCount: any;
         operationTrainingSiteName: string;
         satisfactionOperationAvg: string;
         satisfactionTheoryAvg: string;
         satisfactionOverallAvg: string;
         summaryFiles: {
            fileId: number;
            add: boolean;
            delete?: boolean;
            filename?: string;
            link?: string;
         }[];
         filesDelete?: {
            fileId: number;
            add: boolean;
            delete: boolean;
         }[];
         trainingAlumniListTemp?: {
            name: string;
         };
      }
   ) {
      body = {
         ...body,
         participant: body.participant ? parseFloat(body.participant) : 0,
         revenue: body.revenue ? parseFloat(body.revenue) : 0,
         receiveEducationFundCount: body.receiveEducationFundCount ? parseFloat(body.receiveEducationFundCount) : 0,
         receiveEducationFundAlumniCount: body.receiveEducationFundAlumniCount ? parseFloat(body.receiveEducationFundAlumniCount) : 0,
         traingingSiteCount: body.traingingSiteCount ? parseFloat(body.traingingSiteCount) : 0,
         dateStart: genTextDate({ date: body.dateStart, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
         dateEnd: genTextDate({ date: body.dateEnd, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
         summaryFiles: body.summaryFiles.concat(<[]>body.filesDelete).map(({ filename, link, ...i }) => i),
         trainingAlumniList: body.trainingAlumniList.map((i) => ({ id: i.id, name: i.name })),
      };
      delete body.filesDelete;
      delete body.trainingAlumniListTemp;
      const options = {
         method: "POST",
         url: `/academic/${academicId}`,
         body,
      };
      return await fetchApi(options);
   },

   async addAcademicServicesMoney(body: {
      name: string;
      budgetSourceId: number;
      dateStart: string;
      dateEnd: string;
      rounds: {
         no: any;
         dateStart: string;
         dateEnd: string;
      }[];
      targets: {
         id?: number;
         name: string;
         count: any;
      }[];
      location: string;
      subDistrictId: number;
      districtId: number;
      provinceId: number;
      ownerId: number;
      receiveBudget: any;
      useBudget: any;
      objective: string;
      benefit: string;
      suggestion: string;
      satisfaction: string;
      teachingIntegration: string;
      researchIntegration: string;
      reason: string;
      summaryFiles: {
         fileId: number;
         add: boolean;
         delete?: boolean;
         filename?: string;
         link?: string;
      }[];
      filesDelete?: {
         fileId: number;
         add: boolean;
         delete: boolean;
      }[];
      roundTemp?: {
         no: string;
         dateStart: string;
         dateEnd: string;
      };
      targetsTemp?: {
         name: string;
         count: string;
      };
   }) {
      body = {
         ...body,
         dateStart: genTextDate({ date: body.dateStart, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
         dateEnd: genTextDate({ date: body.dateEnd, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
         rounds: body.rounds.map((i) => {
            return {
               no: Math.floor(i.no),
               dateStart: genTextDate({ date: i.dateStart, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
               dateEnd: genTextDate({ date: i.dateEnd, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
            };
         }),
         useBudget: body.useBudget ? parseFloat(body.useBudget) : 0,
         receiveBudget: body.receiveBudget ? parseFloat(body.receiveBudget) : 0,
         targets: body.targets.map((i) => ({ name: i.name, count: parseFloat(i.count) })),
         summaryFiles: body.summaryFiles.map((i) => ({ fileId: i.fileId, add: i.add }))
      };

      delete body.filesDelete;
      delete body.roundTemp;
      delete body.targetsTemp;

      const options = {
         method: "POST",
         url: `/academic`,
         body,
      };
      return await fetchApi(options);
   },
   async updateAcademicServicesMoney(
      academicId: string,
      body: {
         name: string;
         budgetSourceId: number;
         dateStart: string;
         dateEnd: string;
         rounds: {
            no: any;
            dateStart: string;
            dateEnd: string;
         }[];
         targets: {
            id?: number;
            name: string;
            count: any;
         }[];
         location: string;
         subDistrictId: number;
         districtId: number;
         provinceId: number;
         ownerId: number;
         receiveBudget: any;
         useBudget: any;
         objective: string;
         benefit: string;
         suggestion: string;
         satisfaction: string;
         teachingIntegration: string;
         researchIntegration: string;
         reason: string;
         summaryFiles: {
            fileId: number;
            add: boolean;
            delete?: boolean;
            filename?: string;
            link?: string;
         }[];
         filesDelete?: {
            fileId: number;
            add: boolean;
            delete: boolean;
         }[];
         roundTemp?: {
            no: string;
            dateStart: string;
            dateEnd: string;
         };
         targetsTemp?: {
            name: string;
            count: string;
         };
      }
   ) {
      body = {
         ...body,
         dateStart: genTextDate({ date: body.dateStart, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
         dateEnd: genTextDate({ date: body.dateEnd, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
         rounds: body.rounds.map((i) => {
            return {
               no: Math.floor(i.no),
               dateStart: genTextDate({ date: i.dateStart, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
               dateEnd: genTextDate({ date: i.dateEnd, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD-MM-YYYY HH:mm", isBuddhistYear: true }),
            };
         }),
         useBudget: body.useBudget ? parseFloat(body.useBudget) : 0,
         receiveBudget: body.receiveBudget ? parseFloat(body.receiveBudget) : 0,
         targets: body.targets.map((i) => ({ name: i.name, count: parseFloat(i.count) })),
         summaryFiles: body.summaryFiles.concat(<[]>body.filesDelete).map(({ filename, link, ...i }) => i),
      };

      delete body.filesDelete;
      delete body.roundTemp;
      delete body.targetsTemp;

      const options = {
         method: "POST",
         url: `/academic/${academicId}`,
         body,
      };
      return await fetchApi(options);
   },

   async fetchAcademicServicesById(academicId: number) {
      const options = {
         method: "GET",
         url: `/academic/${academicId}`,
      };
      return await fetchApi(options);
   },
   async deleteAcademicService(academicId: number) {
      const options = {
         method: "DELETE",
         url: `/academic/${academicId}`,
      };
      return await fetchApi(options);
   },
};
