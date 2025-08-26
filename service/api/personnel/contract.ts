export default {
   async fetchPersonnelContractList(personnelId: string, filters: { offset: number; max: number }) {
      const { offset, max } = filters;
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/contract/list?offset=${offset}&max=${max}`,
      };
      return await fetchApi(options);
   },
   async fetchPersonnelContract(personnelId: string, id: number) {
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/contract/${id}`,
      };
      return await fetchApi(options);
   },
   async addPersonnelContract(
      personnelId: string,
      data: {
         contractNo: string;
         dateContract: string;
         dateHired: string;
         dateContractExpired: string;
         dateContractCancel: string;
         detail: string;
         files: any[];
         contractTypeId: number;
         cancelContract: boolean;
      }
   ) {
      const req = {
         contractNo: data.contractNo,
         dateContract: genTextDate({ date: data.dateContract, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD/MM/YYYY", isBuddhistYear: true }),
         dateHired: genTextDate({ date: data.dateHired, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD/MM/YYYY", isBuddhistYear: true }),
         dateContractExpired: genTextDate({ date: data.dateContractExpired, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD/MM/YYYY", isBuddhistYear: true }),
         dateContractCancel: genTextDate({ date: data.dateContractCancel, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD/MM/YYYY", isBuddhistYear: true }),
         detail: data.detail,
         files: [] as any[],
         contractTypeId: data.contractTypeId || 0,
         cancelContract: data.cancelContract,
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
         url: `/personnel/${personnelId}/contract`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updatePersonnelContract(
      personnelId: string,
      data: {
         id: number;
         contractNo: string;
         dateContract: string;
         dateHired: string;
         dateContractExpired: string;
         dateContractCancel: string;
         detail: string;
         files: any[];
         contractTypeId: number;
         cancelContract: boolean;
         filesDelete: any[];
      }
   ) {
      const req = {
         contractNo: data.contractNo,
         dateContract: genTextDate({ date: data.dateContract, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD/MM/YYYY", isBuddhistYear: true }),
         dateHired: genTextDate({ date: data.dateHired, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD/MM/YYYY", isBuddhistYear: true }),
         dateContractExpired: genTextDate({ date: data.dateContractExpired, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD/MM/YYYY", isBuddhistYear: true }),
         dateContractCancel: genTextDate({ date: data.dateContractCancel, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD/MM/YYYY", isBuddhistYear: true }),
         detail: data.detail,
         files: [] as any[],
         contractTypeId: data.contractTypeId || 0,
         cancelContract: data.cancelContract,
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
         url: `/personnel/${personnelId}/contract/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deletePersonnelContract(personnelId: string, id: number) {
      const options = {
         method: "DELETE",
         url: `/personnel/${personnelId}/contract/${id}`,
      };
      return await fetchApi(options);
   },
};
