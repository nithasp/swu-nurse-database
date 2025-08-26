export default {
   async fetchArticleList(filters: { keyword: string; offset: number; max: number; recordYear: any[]; authorId: any[]; articleType: any[]; dataTypeId: any[] }) {
      const { keyword, offset, max, recordYear, authorId, articleType, dataTypeId } = filters;
      const options = {
         method: "GET",
         url: `/article/?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      if (recordYear.length) {
         const names = recordYear.map((item) => item.name);
         options.url += `&recordYear=${names}`;
      }
      if (authorId.length) {
         const ids = authorId.map((item) => item.id);
         options.url += `&authorId=${ids}`;
      }
      if (articleType.length) {
         const ids = articleType.map((item) => item.id);
         options.url += `&articleType=${ids}`;
      }
      if (dataTypeId.length) {
         const ids = dataTypeId.map((item) => item.id);
         options.url += `&dataTypeId=${ids}`;
      }

      return await fetchApi(options);
   },
   async fetchArticle(id: number) {
      const options = {
         method: "GET",
         url: `/article/${id}`,
      };
      return await fetchApi(options);
   },
   async addArticle(data: {
      articleType: number;
      datePublish: string;
      author: Author;
      members: Member[];
      name: string;
      files: any[];
      publisher: string;
      impactFactorId: string;
   }) {
      const req = {
         articleType: data.articleType || 0,
         datePublish: genTextDate({ date: data.datePublish, format: "YYYY-MM-DD", oldFormat: "DD-MM-YYYY", isBuddhistYear: true }),
         author: {
            userId: data.author.userId || 0,
            prefix: data.author.prefix,
            personnelType: data.author.personnelType,
            name: data.author.nameAuthor,
         },
         members: [] as Member[],
         name: data.name,
         files: [] as any[],
         publisher: data.publisher,
         impactFactorId: data.impactFactorId || 0,
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
         url: `/article/`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async updateArticle(data: {
      id: number;
      articleType: number;
      datePublish: string;
      author: Author;
      members: Member[];
      name: string;
      files: any[];
      filesDelete: any[];
      publisher: string;
      impactFactorId: string;
   }) {
      const req = {
         articleType: data.articleType || 0,
         datePublish: genTextDate({ date: data.datePublish, format: "YYYY-MM-DD", oldFormat: "DD-MM-YYYY", isBuddhistYear: true }),
         author: {
            userId: data.author.userId || 0,
            prefix: data.author.prefix,
            personnelType: data.author.personnelType,
            name: data.author.nameAuthor,
         },
         members: [] as Member[],
         name: data.name,
         files: [] as any[],
         publisher: data.publisher,
         impactFactorId: data.impactFactorId || 0,
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
         url: `/article/${data.id}`,
         body: req,
         showToastError: true,
      };
      return await fetchApi(options);
   },
   async deleteArticle(id: number) {
      const options = {
         method: "DELETE",
         url: `/article/${id}`,
      };
      return await fetchApi(options);
   },
};

interface Author {
   personnelType?: number;
   prefix: number;
   userId: number;
   nameAuthor?: string;
}

interface Member {
   personnelType?: number;
   positionId: number;
   userId: number;
   name?: string;
}
