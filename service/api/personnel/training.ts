export default {
   async fetchPersonnelTrainingList(personnelId: string, filters: { offset: number; max: number }) {
      const { offset, max } = filters;
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/training/list?offset=${offset}&max=${max}`,
      };
      return await fetchApi(options);
   },
   async fetchPersonnelTraining(personnelId: string, id: number) {
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/training/${id}`,
      };
      return await fetchApi(options);
   },
   async addPersonnelTraining(
      personnelId: string,
      data: {
         educationYearId: number;
         dateTrainingStart: string;
         dateTrainingEnd: string;
         duration: string;
         course: string;
         trainingPaymentTypeId: number;
         files: any[];
         budgetYearId: number;
         subject: string;
         trainingTypeId: number;
         institution: string;
         location: string;
         lecturer: string;
         matchGuideline: MatchGuideline;
         objective: string;
         detail: string;
         summary: string;
         apply: string;
         evaluation: string;
         suggestion: string;
         trainingPayment: string;
      }
   ) {
      const req = {
         educationYearId: data.educationYearId || 0,
         dateTrainingStart: genTextDate({ date: data.dateTrainingStart, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD/MM/YYYY", isBuddhistYear: true }),
         dateTrainingEnd: genTextDate({ date: data.dateTrainingEnd, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD/MM/YYYY", isBuddhistYear: true }),
         duration: data.duration,
         course: data.course,
         trainingPaymentTypeId: data.trainingPaymentTypeId || 0,
         files: [] as any[],
         budgetYearId: data.budgetYearId || 0,
         subject: data.subject,
         trainingTypeId: data.trainingTypeId || 0,
         institution: data.institution,
         location: data.location,
         lecturer: data.lecturer,
         matchGuideline: {
            vision: data.matchGuideline.vision,
            nurse: data.matchGuideline.nurse,
            teaching: data.matchGuideline.teaching,
            research: data.matchGuideline.research,
            academic: data.matchGuideline.academic,
            profession: data.matchGuideline.profession,
            management: data.matchGuideline.management,
            other: data.matchGuideline.other,
            otherRemark: data.matchGuideline.other ? data.matchGuideline.otherRemark : "",
         },
         objective: data.objective,
         detail: data.detail,
         summary: data.summary,
         apply: data.apply,
         evaluation: data.evaluation,
         suggestion: data.suggestion,
         trainingPayment: data.trainingPaymentTypeId === 1
         ? data.trainingPayment ? parseFloat(data.trainingPayment) : 0
         : 0
      };

      for (const file of data.files) {
         req.files.push({
            fileId: file.fileId,
            add: file.add,
            delete: false,
         });
      }
      const options = {
         method: "POST",
         url: `/personnel/${personnelId}/training`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updatePersonnelTraining(
      personnelId: string,
      data: {
         id: number;
         educationYearId: number;
         dateTrainingStart: string;
         dateTrainingEnd: string;
         duration: string;
         course: string;
         trainingPaymentTypeId: number;
         files: any[];
         filesDelete: any[];
         budgetYearId: number;
         subject: string;
         trainingTypeId: number;
         institution: string;
         location: string;
         lecturer: string;
         matchGuideline: MatchGuideline;
         objective: string;
         detail: string;
         summary: string;
         apply: string;
         evaluation: string;
         suggestion: string;
         trainingPayment: string;
      }
   ) {
      const req = {
         educationYearId: data.educationYearId || 0,
         dateTrainingStart: genTextDate({ date: data.dateTrainingStart, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD/MM/YYYY", isBuddhistYear: true }),
         dateTrainingEnd: genTextDate({ date: data.dateTrainingEnd, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD/MM/YYYY", isBuddhistYear: true }),
         duration: data.duration,
         course: data.course,
         trainingPaymentTypeId: data.trainingPaymentTypeId || 0,
         files: [] as any[],
         budgetYearId: data.budgetYearId || 0,
         subject: data.subject,
         trainingTypeId: data.trainingTypeId || 0,
         institution: data.institution,
         location: data.location,
         lecturer: data.lecturer,
         matchGuideline: {
            vision: data.matchGuideline.vision,
            nurse: data.matchGuideline.nurse,
            teaching: data.matchGuideline.teaching,
            research: data.matchGuideline.research,
            academic: data.matchGuideline.academic,
            profession: data.matchGuideline.profession,
            management: data.matchGuideline.management,
            other: data.matchGuideline.other,
            otherRemark: data.matchGuideline.other ? data.matchGuideline.otherRemark : "",
         },
         objective: data.objective,
         detail: data.detail,
         summary: data.summary,
         apply: data.apply,
         evaluation: data.evaluation,
         suggestion: data.suggestion,
         trainingPayment: data.trainingPaymentTypeId === 1
         ? data.trainingPayment ? parseFloat(data.trainingPayment) : 0
         : 0
      };

      for (const file of data.files) {
         req.files.push({
            fileId: file.fileId,
            add: file.add,
            delete: false,
         });
      }

      for (const file of data.filesDelete) {
         req.files.push({
            fileId: file.fileId,
            add: false,
            delete: true,
         });
      }

      const options = {
         method: "POST",
         url: `/personnel/${personnelId}/training/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deletePersonnelTraining(personnelId: string, id: number) {
      const options = {
         method: "DELETE",
         url: `/personnel/${personnelId}/training/${id}`,
      };
      return await fetchApi(options);
   },
};

interface MatchGuideline {
   vision: boolean;
   nurse: boolean;
   teaching: boolean;
   research: boolean;
   academic: boolean;
   profession: boolean;
   management: boolean;
   other: boolean;
   otherRemark?: string;
}
