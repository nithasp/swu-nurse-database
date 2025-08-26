const toast = useToast();
export default {
   async fetchPersonnelList(filters: {
      keyword: string;
      offset: number;
      max: number;
      agencyIds: number;
      personnelStatusIds: number;
      dateStartedAtSwuA: string;
      dateStartedAtSwuB: string;
   }) {
      const { keyword, offset, max, agencyIds, personnelStatusIds, dateStartedAtSwuA, dateStartedAtSwuB } = filters;

      const options = {
         method: "GET",
         url: `/personnel/list?offset=${offset}&max=${max}`,
      };

      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      if (agencyIds) {
         options.url += `&agencyIds=${agencyIds}`;
      }
      if (personnelStatusIds) {
         options.url += `&personnelStatusIds=${personnelStatusIds}`;
      }
      if (dateStartedAtSwuA) {
         options.url += `&dateStartedAtSwuA=${encodeURIComponent(
            genTextDate({
               date: dateStartedAtSwuA,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY",
               isBuddhistYear: true,
            })
         )}`;
      }
      if (dateStartedAtSwuB) {
         options.url += `&dateStartedAtSwuB=${encodeURIComponent(
            genTextDate({
               date: dateStartedAtSwuB,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY",
               isBuddhistYear: true,
            })
         )}`;
      }

      return await fetchApi(options);
   },
   async fetchPersonnelDetail(id: string) {
      const options = {
         method: "GET",
         url: `/personnel/${id}`,
      };
      return await fetchApi(options);
   },
   async fetchPersonnelShort(filters: { keyword: string; offset: number; max: number }) {
      const { keyword, offset, max } = filters;
      const options = {
         method: "GET",
         url: `/personnel/short?offset=${offset}&max=${max}`,
      };
      if (keyword) {
         options.url += `&keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   async addPersonnel(body: {
      username: string;
      password: string;
      enabled: boolean | number;
      roles: number[];
      info: {
         prefixId: number;
         internalPrefixId: number;
         firstname: string;
         middlename: string;
         lastname: string;
         firstnameEn: string;
         middlenameEn: string;
         lastnameEn: string;
         gender: string;
         citizenId: string;
         dateStarted: string;
         dateStartedGov: string;
         personnelStatusIds: number;
         professtionalLicenseNo: string;
         dateOfRetirement: string;
         passportNo: string;
         dateStartedAtSwu: string;
         personnelTypeId: number;
         dateReportToWork: string;
         nursingMembershipNo: string;
         dateNursingMembershipExpired: string;
         reasonForRetirement: string;
         detailForRetirement: string;
         imageId: number;

         nursingAssociationNo: string;
         nursingAssociationExpireType: number;
         dateNursingAssociationExpired: string;
      };
   }) {
      body = {
         ...body,
         enabled: body.enabled === 1 ? true : false,
         info: {
            ...body.info,
            dateStarted: genTextDate({
               date: body.info.dateStarted,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY HH:mm",
               isBuddhistYear: true,
            }),
            dateStartedGov: genTextDate({
               date: body.info.dateStartedGov,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY HH:mm",
               isBuddhistYear: true,
            }),
            dateOfRetirement: genTextDate({
               date: body.info.dateOfRetirement,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY HH:mm",
               isBuddhistYear: true,
            }),
            dateStartedAtSwu: genTextDate({
               date: body.info.dateStartedAtSwu,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY HH:mm",
               isBuddhistYear: true,
            }),
            dateReportToWork: genTextDate({
               date: body.info.dateReportToWork,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY HH:mm",
               isBuddhistYear: true,
            }),
            dateNursingMembershipExpired: genTextDate({
               date: body.info.dateNursingMembershipExpired,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY HH:mm",
               isBuddhistYear: true,
            }),
            nursingAssociationExpireType: body.info.nursingAssociationExpireType ? 2 : 1,
            dateNursingAssociationExpired: !body.info.nursingAssociationExpireType
               ? genTextDate({
                    date: body.info.dateNursingAssociationExpired,
                    format: "YYYY-MM-DDTHH:mm:ssZ",
                    oldFormat: "DD-MM-YYYY HH:mm",
                    isBuddhistYear: true,
                 })
               : "",
         },
      };
      const options = {
         method: "POST",
         url: `/personnel/add`,
         body,
      };
      return await fetchApi(options);
   },
   async updatePersonnel(
      id: string,
      body: {
         username: string;
         password?: string;
         enabled: boolean | number;
         roles: number[];
         info: {
            prefixId: number;
            internalPrefixId: number;
            firstname: string;
            middlename: string;
            lastname: string;
            firstnameEn: string;
            middlenameEn: string;
            lastnameEn: string;
            gender: string;
            citizenId: string;
            dateStarted: string;
            dateStartedGov: string;
            personnelStatusIds: number;
            professtionalLicenseNo: string;
            dateOfRetirement: string;
            passportNo: string;
            dateStartedAtSwu: string;
            personnelTypeId: number;
            dateReportToWork: string;
            nursingMembershipNo: string;
            dateNursingMembershipExpired: string;
            reasonForRetirement: string;
            detailForRetirement: string;
            imageId: number;

            nursingAssociationNo: string;
            nursingAssociationExpireType: number;
            dateNursingAssociationExpired: string;
         };
      }
   ) {
      body = {
         ...body,
         enabled: body.enabled === 1 ? true : false,
         info: {
            ...body.info,
            dateStarted: genTextDate({
               date: body.info.dateStarted,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY HH:mm",
               isBuddhistYear: true,
            }),
            dateStartedGov: genTextDate({
               date: body.info.dateStartedGov,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY HH:mm",
               isBuddhistYear: true,
            }),
            dateOfRetirement: genTextDate({
               date: body.info.dateOfRetirement,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY HH:mm",
               isBuddhistYear: true,
            }),
            dateStartedAtSwu: genTextDate({
               date: body.info.dateStartedAtSwu,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY HH:mm",
               isBuddhistYear: true,
            }),
            dateReportToWork: genTextDate({
               date: body.info.dateReportToWork,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY HH:mm",
               isBuddhistYear: true,
            }),
            dateNursingMembershipExpired: genTextDate({
               date: body.info.dateNursingMembershipExpired,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY HH:mm",
               isBuddhistYear: true,
            }),
            nursingAssociationExpireType: body.info.nursingAssociationExpireType ? 2 : 1,
            dateNursingAssociationExpired: !body.info.nursingAssociationExpireType
               ? genTextDate({
                    date: body.info.dateNursingAssociationExpired,
                    format: "YYYY-MM-DDTHH:mm:ssZ",
                    oldFormat: "DD-MM-YYYY HH:mm",
                    isBuddhistYear: true,
                 })
               : "",
         },
      };
      delete body.password;

      const options = {
         method: "POST",
         url: `/personnel/${id}`,
         body,
      };
      return await fetchApi(options);
   },
   async deletePersonnel(personnelId: string) {
      const options = {
         method: "DELETE",
         url: `/personnel/${personnelId}`,
      };
      return await fetchApi(options);
   },
   async changePersonnelPassword(
      id: string,
      body: {
         password: string;
         confirmPassword: string;
      }
   ) {
      const options = {
         method: "POST",
         url: `/personnel/${id}/changePassword`,
         body,
      };
      return await fetchApi(options);
   },
   async uploadPersonnelImage(file: any) {
      const token = useCookie("swuNurseAccessToken");
      const headers = {
         Authorization: `Bearer ${token.value}`,
      };

      const types = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (types.includes(file.type)) {
         const size = file.size / 1024 / 1000;
         if (size > 20) {
            toast.add({ title: "ไฟล์ต้องมีขนาดไม่เกิน 20MB", color: "red" });
            return;
         }
         const formData = new FormData();
         formData.append("file", file);

         const config = useRuntimeConfig();
         try {
            const res: any = await $fetch("/fileupload", {
               baseURL: config.public.apiBaseUrl,
               method: "POST",
               body: formData,
               headers,
            });
            if (res?.code === 20000) {
               return res;
            } else {
               toast.add({ title: res?.message, color: "red" });
            }
         } catch (error) {
            toast.add({ title: "An unexpected error occurred", color: "red" });
            return null;
         }
      } else {
         toast.add({ title: "Invalid file type", color: "red" });
      }
   },

   //Saral
   async fetchDownloadPersonnelTemplate() {
      const options = {
         method: "GET",
         url: `/personnel/template`,
      };
      return await fetchApi(options);
   },
};
