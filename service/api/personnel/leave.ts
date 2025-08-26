export default {
   async fetchPersonnelLeaveList(personnelId: string, filters: { offset: number; max: number }) {
      const { offset, max } = filters;
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/leave/list?offset=${offset}&max=${max}`,
      };
      return await fetchApi(options);
   },
   async fetchPersonnelLeave(personnelId: string, id: number) {
      const options = {
         method: "GET",
         url: `/personnel/${personnelId}/leave/${id}`,
      };
      return await fetchApi(options);
   },
   async addPersonnelLeave(
      personnelId: string,
      data: {
         leaveTypeId: number;
         leaveRangeType: string;
         remark: string;
         dateLeaveStart: string;
         dateLeaveEnd: string;
         timeLeaveStart: string;
         timeLeaveEnd: string;
         files: any[];
      }
   ) {
      const start =
         data.leaveRangeType == "1"
            ? genTextDate({
                 date: data.dateLeaveStart,
                 format: "YYYY-MM-DDTHH:mm:ssZ",
                 oldFormat: "DD/MM/YYYY",
                 isBuddhistYear: true,
              })
            : genTextDate({
                 date: `${data.dateLeaveStart} ${data.timeLeaveStart}`,
                 format: "YYYY-MM-DDTHH:mm:ssZ",
                 oldFormat: "DD/MM/YYYY HH:mm",
                 isBuddhistYear: true,
              });
      const end =
         data.leaveRangeType == "1"
            ? genTextDate({ date: data.dateLeaveEnd, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD/MM/YYYY", isBuddhistYear: true })
            : genTextDate({
                 date: `${data.dateLeaveEnd} ${data.timeLeaveEnd}`,
                 format: "YYYY-MM-DDTHH:mm:ssZ",
                 oldFormat: "DD/MM/YYYY HH:mm",
                 isBuddhistYear: true,
              });
      const req = {
         leaveTypeId: data.leaveTypeId || 0,
         leaveRangeType: parseInt(data.leaveRangeType) || 0,
         remark: data.remark,
         dateLeaveStart: start,
         dateLeaveEnd: end,
         files: [] as any[],
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
         url: `/personnel/${personnelId}/leave`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updatePersonnelLeave(
      personnelId: string,
      data: {
         id: number;
         leaveTypeId: number;
         leaveRangeType: string;
         remark: string;
         dateLeaveStart: string;
         dateLeaveEnd: string;
         timeLeaveStart: string;
         timeLeaveEnd: string;
         files: any[];
         filesDelete: any[];
      }
   ) {
      const start =
         data.leaveRangeType == "1"
            ? genTextDate({
                 date: data.dateLeaveStart,
                 format: "YYYY-MM-DDTHH:mm:ssZ",
                 oldFormat: "DD/MM/YYYY",
                 isBuddhistYear: true,
              })
            : genTextDate({
                 date: `${data.dateLeaveStart} ${data.timeLeaveStart}`,
                 format: "YYYY-MM-DDTHH:mm:ssZ",
                 oldFormat: "DD/MM/YYYY HH:mm",
                 isBuddhistYear: true,
              });
      const end =
         data.leaveRangeType == "1"
            ? genTextDate({ date: data.dateLeaveEnd, format: "YYYY-MM-DDTHH:mm:ssZ", oldFormat: "DD/MM/YYYY", isBuddhistYear: true })
            : genTextDate({
                 date: `${data.dateLeaveEnd} ${data.timeLeaveEnd}`,
                 format: "YYYY-MM-DDTHH:mm:ssZ",
                 oldFormat: "DD/MM/YYYY HH:mm",
                 isBuddhistYear: true,
              });
      const req = {
         leaveTypeId: data.leaveTypeId || 0,
         leaveRangeType: parseInt(data.leaveRangeType) || 0,
         remark: data.remark,
         dateLeaveStart: start,
         dateLeaveEnd: end,
         files: [] as any[],
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
         url: `/personnel/${personnelId}/leave/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deletePersonnelLeave(personnelId: string, id: number) {
      const options = {
         method: "DELETE",
         url: `/personnel/${personnelId}/leave/${id}`,
      };
      return await fetchApi(options);
   },
};
