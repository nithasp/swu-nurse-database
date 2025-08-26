export default {
   async fetchBooksList(filters: { keyword: string; offset: number; max: number; recordYear: any[]; textbookOwner: any[] }) {
      const { keyword, offset, max, recordYear, textbookOwner } = filters;
      const options = {
         method: "GET",
         url: `/textbook/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      if (recordYear.length) {
         const names = recordYear.map((item) => item.name);
         options.url += `&recordYear=${names}`;
      }
      if (textbookOwner.length) {
         const ids = textbookOwner.map((item) => item.id);
         options.url += `&textbookOwner=${ids}`;
      }

      return await fetchApi(options);
   },
   async fetchBooks(id: number) {
      const options = {
         method: "GET",
         url: `/textbook/${id}`,
      };
      return await fetchApi(options);
   },
   async addBooks(data: {
      datePublish: string;
      author: Author;
      members: Member[];
      name: string;
      files: any[];
      publisher: string;
      impactFactorId: number;
      experts: Member[];
      funding: string;
   }) {
      const req = {
         datePublish: genTextDate({ date: data.datePublish, format: "YYYY-MM-DD", oldFormat: "DD-MM-YYYY", isBuddhistYear: true }),
         author: {
            userId: data.author.userId || 0,
            prefix: data.author.prefix,
            personnelType: data.author.personnelType,
            name: data.author.authorName,
         },
         members: [] as Member[],
         name: data.name,
         files: [] as any[],
         publisher: data.publisher,
         impactFactorId: data.impactFactorId || 0,
         experts: [] as any[],
         funding: data.funding,
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

      for (const expert of data.experts) {
         req.experts.push({
            userId: expert.userId || 0,
            positionId: expert.positionId,
            personnelType: expert.personnelType,
            name: expert.name,
         });
      }

      const options = {
         method: "POST",
         url: `/textbook/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateBooks(data: {
      id: number;
      datePublish: string;
      author: Author;
      members: Member[];
      name: string;
      files: any[];
      filesDelete: any[];
      publisher: string;
      impactFactorId: number;
      experts: Member[];
      funding: string;
   }) {
      const req = {
         datePublish: genTextDate({ date: data.datePublish, format: "YYYY-MM-DD", oldFormat: "DD-MM-YYYY", isBuddhistYear: true }),
         author: {
            userId: data.author.userId || 0,
            prefix: data.author.prefix,
            personnelType: data.author.personnelType,
            name: data.author.authorName,
         },
         members: [] as Member[],
         name: data.name,
         files: [] as any[],
         publisher: data.publisher,
         impactFactorId: data.impactFactorId || 0,
         experts: [] as any[],
         funding: data.funding,
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

      for (const expert of data.experts) {
         req.experts.push({
            userId: expert.userId || 0,
            positionId: expert.positionId,
            personnelType: expert.personnelType,
            name: expert.name,
         });
      }

      const options = {
         method: "POST",
         url: `/textbook/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteBooks(id: number) {
      const options = {
         method: "DELETE",
         url: `/textbook/${id}`,
      };
      return await fetchApi(options);
   },
};

interface Author {
   personnelType?: number;
   prefix: number;
   userId: number;
   authorName?: string;
}

interface Member {
   personnelType?: number;
   positionId: number;
   userId: number;
   name?: string;
}
