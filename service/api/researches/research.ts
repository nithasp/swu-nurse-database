export default {
   async fetchResearchList(filters: { keyword: string; offset: number; max: number; recordYear: any[]; leaderId: any[]; dataTypeId: any[] }) {
      const { keyword, offset, max, recordYear, leaderId, dataTypeId } = filters;
      const options = {
         method: "GET",
         url: `/researches/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      if (recordYear.length) {
         const names = recordYear.map((item) => item.name);
         options.url += `&recordYear=${names}`;
      }
      if (leaderId.length) {
         const ids = leaderId.map((item) => item.id);
         options.url += `&leaderId=${ids}`;
      }
      if (dataTypeId.length) {
         const ids = dataTypeId.map((item) => item.id);
         options.url += `&dataTypeId=${ids}`;
      }

      return await fetchApi(options);
   },
   async fetchResearch(id: number) {
      const options = {
         method: "GET",
         url: `/researches/${id}`,
      };
      return await fetchApi(options);
   },
   async addResearch(data: {
      datePublish: string;
      leader: Leader;
      members: Member[];
      name: string;
      contractNumber: string;
      dateContractStart: string;
      dateContractEnd: string;
      fundingId: string;
      budgetSponser: string;
      budgetAmount: string;
      humanEthicsCertificate: string;
      files: any[];
      publisher: string;
      impactFactorId: string;
      weight: string;
      cost: string;
   }) {
      const req = {
         datePublish: genTextDate({ date: data.datePublish, format: "YYYY-MM-DD", oldFormat: "DD-MM-YYYY", isBuddhistYear: true }),
         leader: {
            userId: data.leader.userId || 0,
            prefix: data.leader.prefix,
            personnelType: data.leader.personnelType,
            name: data.leader.leaderName,
         },
         members: [] as Member[],
         name: data.name,
         contractNumber: data.contractNumber,
         dateContractStart: genTextDate({ date: data.dateContractStart, format: "YYYY-MM-DD", oldFormat: "DD-MM-YYYY", isBuddhistYear: true }),
         dateContractEnd: genTextDate({ date: data.dateContractEnd, format: "YYYY-MM-DD", oldFormat: "DD-MM-YYYY", isBuddhistYear: true }),
         fundingId: data.fundingId || 0,
         budgetSponser: data.budgetSponser,
         budgetAmount: data.budgetAmount ? parseFloat(data.budgetAmount) : 0,
         humanEthicsCertificate: data.humanEthicsCertificate,
         files: [] as any[],
         publisher: data.publisher,
         impactFactorId: data.impactFactorId || 0,
         weight: data.weight ? parseFloat(data.weight) : 0,
         cost: data.cost ? parseFloat(data.cost) : 0,
      };

      for (const file of data.files) {
         req.files.push({
            fileId: file.fileId,
            add: file.add,
            delete: false,
         });
      }

      for (const member of data.members) {
         req.members.push({
            userId: member.userId || 0,
            positionId: member.positionId,
            personnelType: member.personnelType,
            name: member.name,
         });
      }

      const options = {
         method: "POST",
         url: `/researches/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateResearch(data: {
      id: number;
      datePublish: string;
      leader: Leader;
      members: Member[];
      name: string;
      contractNumber: string;
      dateContractStart: string;
      dateContractEnd: string;
      fundingId: string;
      budgetSponser: string;
      budgetAmount: string;
      humanEthicsCertificate: string;
      files: any[];
      filesDelete: any[];
      publisher: string;
      impactFactorId: string;
      weight: string;
      cost: string;
   }) {
      const req = {
         datePublish: genTextDate({ date: data.datePublish, format: "YYYY-MM-DD", oldFormat: "DD-MM-YYYY", isBuddhistYear: true }),
         leader: {
            userId: data.leader.userId || 0,
            prefix: data.leader.prefix,
            personnelType: data.leader.personnelType,
            name: data.leader.leaderName,
         },
         members: [] as Member[],
         name: data.name,
         contractNumber: data.contractNumber,
         dateContractStart: genTextDate({ date: data.dateContractStart, format: "YYYY-MM-DD", oldFormat: "DD-MM-YYYY", isBuddhistYear: true }),
         dateContractEnd: genTextDate({ date: data.dateContractEnd, format: "YYYY-MM-DD", oldFormat: "DD-MM-YYYY", isBuddhistYear: true }),
         fundingId: data.fundingId || 0,
         budgetSponser: data.budgetSponser,
         budgetAmount: data.budgetAmount ? parseFloat(data.budgetAmount) : 0,
         humanEthicsCertificate: data.humanEthicsCertificate,
         files: [] as any[],
         publisher: data.publisher,
         impactFactorId: data.impactFactorId || 0,
         weight: data.weight ? parseFloat(data.weight) : 0,
         cost: data.cost ? parseFloat(data.cost) : 0,
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
            fileId: file.id,
            add: false,
            delete: true,
         });
      }

      for (const member of data.members) {
         req.members.push({
            userId: member.userId || 0,
            positionId: member.positionId,
            personnelType: member.personnelType,
            name: member.name,
         });
      }

      const options = {
         method: "POST",
         url: `/researches/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteResearch(id: number) {
      const options = {
         method: "DELETE",
         url: `/researches/${id}`,
      };
      return await fetchApi(options);
   },
};

interface Leader {
   personnelType?: number;
   prefix: number;
   userId: number;
   leaderName?: string;
}

interface Member {
   personnelType?: number;
   positionId: number;
   userId: number;
   name?: string;
}
