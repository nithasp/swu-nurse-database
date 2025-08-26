export default {
   async fetchPersonnelHistoryDetail(id: string) {
      const options = {
         method: "GET",
         url: `/personnel/${id}/history`,
      };
      return await fetchApi(options);
   },
   async updatePersonnelHistoryDetail(
      id: string,
      body: {
         personnelHistory: {
            dateOfBirth: string;
            nationalityId: number;
            religionId: number;
            ethnicityId: number;
            dateOfRetirement: string;
            maritalStatusId: number;
            numberOfSibling: number;
            bloodTypeId: number;
            bloodTypeRhId: number;
            militaryServiceStatusId: number;
            chronicDisease: string;
            orderInSibling: number;
         };
         currentAddress: {
            houseNo: string;
            village: string;
            floor: string;
            soi: string;
            moo: string;
            room: string;
            street: string;
            subDistrictId: number;
            districtId: number;
            provinceId: number;
            zipcode: string;
            didNumber: string;
            tel: string;
            fax: string;
            website: string;
            universityTel: string;
            internalUniversityTel: string;
            internalUniversityTelConnect: string;
            contactTel: string;
            mobileNumber: string;
            buasriID: string;
            primaryEmail: string;
            secondaryEmail: string;
            building: string;
         };
      }
   ) {
      body = {
         ...body,
         personnelHistory: {
            ...body.personnelHistory,
            orderInSibling: body.personnelHistory.orderInSibling ? Math.floor(body.personnelHistory.orderInSibling) : 0,
            numberOfSibling: body.personnelHistory.numberOfSibling ? Math.floor(body.personnelHistory.numberOfSibling) : 0,
            dateOfBirth: genTextDate({
               date: body.personnelHistory.dateOfBirth,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY HH:mm",
               isBuddhistYear: true,
            }),
            dateOfRetirement: genTextDate({
               date: body.personnelHistory.dateOfRetirement,
               format: "YYYY-MM-DDTHH:mm:ssZ",
               oldFormat: "DD-MM-YYYY HH:mm",
               isBuddhistYear: true,
            }),
         },
      };
      const options = {
         method: "POST",
         url: `/personnel/${id}/history`,
         body,
      };
      return await fetchApi(options);
   },
};
