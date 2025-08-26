export default {
   //สิทธิ์การเข้าใช้งาน
   async fetchPermissionList(filters: { keyword: string }) {
      const options = {
         method: "GET",
         url: `/role/permission`,
      };
      const { keyword } = filters;
      if (keyword) {
         options.url += `?keyword=${keyword}`;
      }
      return await fetchApi(options);
   },
   //ปีการศึกษา
   async fetchEducationYearList() {
      const options = {
         method: "GET",
         url: `/master/educationYear`,
      };
      return await fetchApi(options);
   },
   //ปีปฏิทิน
   async fetchRecordYearList() {
      const options = {
         method: "GET",
         url: `/master/recordYear`,
      };
      return await fetchApi(options);
   },
   //เจ้าของงานวิจัย
   async fetchLeaderList() {
      const options = {
         method: "GET",
         url: `/master/leader`,
      };
      return await fetchApi(options);
   },
   //บุคลากรภายใน /นอก
   async fetchPersonnelInExternalList() {
      const options = {
         method: "GET",
         url: `/master/personnelInExternal`,
      };
      return await fetchApi(options);
   },
   //คำนำหน้าชื่อ
   async fetchPrefixList() {
      const options = {
         method: "GET",
         url: `/master/prefix`,
      };
      return await fetchApi(options);
   },
   //แหล่งทุน
   async fetchFundingList() {
      const options = {
         method: "GET",
         url: `/master/funding`,
      };
      return await fetchApi(options);
   },
   //ระดับฐานข้อมูลวารสารระดับชาติและนานาชาติ
   async fetchImpactFactorList() {
      const options = {
         method: "GET",
         url: `/master/impactFactor`,
      };
      return await fetchApi(options);
   },
   //หัวหน้า/ ผู้ร่วมวิจัย
   async fetchMembersList(filters: { remove: any[] }) {
      const options = {
         method: "GET",
         url: `/master/members`,
      };
      if (filters.remove?.length) {
         options.url += `?remove=${filters.remove}`;
      }
      return await fetchApi(options);
   },
   //ประเภบทความ
   async fetchArticleTypeList() {
      const options = {
         method: "GET",
         url: `/master/articleType`,
      };
      return await fetchApi(options);
   },
   //คำนำหน้าชื่อภายใน
   async fetchInternalPrefixList() {
      const options = {
         method: "GET",
         url: `/master/internalPrefix`,
      };
      return await fetchApi(options);
   },
   //หน่วยงาน
   async fetchAgencyList() {
      const options = {
         method: "GET",
         url: `/master/agency`,
      };
      return await fetchApi(options);
   },
   //สถานะบุคลากร
   async fetchPersonnelStatusList() {
      const options = {
         method: "GET",
         url: `/master/personnelStatus`,
      };
      return await fetchApi(options);
   },
   //ประเภทบุคลากร
   async fetchPersonnelTypeList() {
      const options = {
         method: "GET",
         url: `/master/personnelType`,
      };
      return await fetchApi(options);
   },
   //เลือดกรุ๊ป
   async fetchBloodTypeList() {
      const options = {
         method: "GET",
         url: `/master/bloodType`,
      };
      return await fetchApi(options);
   },
   //เลือดกรุ๊ป RH
   async fetchBloodTypeRhList() {
      const options = {
         method: "GET",
         url: `/master/bloodTypeRh`,
      };
      return await fetchApi(options);
   },
   //เชื้อชาติ
   async fetchEthnicityList() {
      const options = {
         method: "GET",
         url: `/master/ethnicity`,
      };
      return await fetchApi(options);
   },
   //สถานะทางการทหาร
   async fetchMilitaryServiceStatusList() {
      const options = {
         method: "GET",
         url: `/master/militaryServiceStatus`,
      };
      return await fetchApi(options);
   },
   //เชื้อชาติ
   async fetchNationalityList() {
      const options = {
         method: "GET",
         url: `/master/nationality`,
      };
      return await fetchApi(options);
   },
   //ศาสนา
   async fetchReligionList() {
      const options = {
         method: "GET",
         url: `/master/religion`,
      };
      return await fetchApi(options);
   },
   //สถานะการแต่งงาน
   async fetchMaritalStatusList() {
      const options = {
         method: "GET",
         url: `/master/maritalStatus`,
      };
      return await fetchApi(options);
   },
   //จังหวัด
   async fetchProvinceList() {
      const options = {
         method: "GET",
         url: `/master/province`,
      };
      return await fetchApi(options);
   },
   //อำเภอ
   async fetchDistrictList(filters: { provinceId: string }) {
      const options = {
         method: "GET",
         url: `/master/district`,
      };
      const { provinceId } = filters;
      if (provinceId) {
         options.url += `?provinceId=${provinceId}`;
      }
      return await fetchApi(options);
   },
   //ตำบล
   async fetchSubdistrictList(filters: { districtId: string }) {
      const options = {
         method: "GET",
         url: `/master/subdistrict`,
      };
      const { districtId } = filters;
      if (districtId) {
         options.url += `?districtId=${districtId}`;
      }
      return await fetchApi(options);
   },

   //ค่าอัตรา
   async fetchCurrencyList() {
      const options = {
         method: "GET",
         url: `/master/currency`,
      };
      return await fetchApi(options);
   },
   //ประเภทบัญชี
   async fetchBudgetTypeList() {
      const options = {
         method: "GET",
         url: `/master/budgetType`,
      };
      return await fetchApi(options);
   },
   //ตำแหน่ง
   async fetchPositionList() {
      const options = {
         method: "GET",
         url: `/master/position`,
      };
      return await fetchApi(options);
   },
   //งาน
   async fetchWorkBranchList() {
      const options = {
         method: "GET",
         url: `/master/workBranch`,
      };
      return await fetchApi(options);
   },
   //ตำแหน่งทางวิชาการ
   async fetchAcademicPositionList() {
      const options = {
         method: "GET",
         url: `/master/academicPosition`,
      };
      return await fetchApi(options);
   },
   //สังกัด
   async fetchDivisionList() {
      const options = {
         method: "GET",
         url: `/master/division`,
      };
      return await fetchApi(options);
   },
   //ประเภทที่อยู่
   async fetchAddressTypeList() {
      const options = {
         method: "GET",
         url: `/master/addressType`,
      };
      return await fetchApi(options);
   },

   //ระดับการศึกษา
   async fetchEducationLevelList() {
      const options = {
         method: "GET",
         url: `/master/educationLevel`,
      };
      return await fetchApi(options);
   },
   //วุฒิการศึกษา
   async fetchEducationCertificationList() {
      const options = {
         method: "GET",
         url: `/master/educationCertification`,
      };
      return await fetchApi(options);
   },
   //สถาบันการศึกษา
   async fetchEducationalInstitutionList() {
      const options = {
         method: "GET",
         url: `/master/educationalInstitution`,
      };
      return await fetchApi(options);
   },
   //กลุ่มสาขาวิชา
   async fetchEducationalBranchGroupList() {
      const options = {
         method: "GET",
         url: `/master/educationalBranchGroup`,
      };
      return await fetchApi(options);
   },
   //สาขาวิชา
   async fetchEducationalBranchList() {
      const options = {
         method: "GET",
         url: `/master/educationalBranch`,
      };
      return await fetchApi(options);
   },
   //รหัสประเทศ
   async fetchCountryList() {
      const options = {
         method: "GET",
         url: `/master/country`,
      };
      return await fetchApi(options);
   },
   //ประเภทการลา
   async fetchLeaveTypeList(filters: { parent: string }) {
      const options = {
         method: "GET",
         url: `/master/leaveType`,
      };
      if (filters.parent) {
         options.url += `?parent=${filters.parent}`;
      }
      return await fetchApi(options);
   },
   //หัวข้อรายงาน
   async fetchReportTopicList() {
      const options = {
         method: "GET",
         url: `/master/reportTopic`,
      };
      return await fetchApi(options);
   },
   //ค่าใช้จ่ายในการอบรม
   async fetchTrainingPaymentTypeList() {
      const options = {
         method: "GET",
         url: `/master/trainingPaymentType`,
      };
      return await fetchApi(options);
   },
   //ปีงบประมาณ
   async fetchBudgetYearList() {
      const options = {
         method: "GET",
         url: `/master/budgetYear`,
      };
      return await fetchApi(options);
   },
   //ประเภทการฝึกอบรม
   async fetchTrainingTypeList() {
      const options = {
         method: "GET",
         url: `/master/trainingType`,
      };
      return await fetchApi(options);
   },
   //ประเภทสัญญา
   async fetchContractTypeList() {
      const options = {
         method: "GET",
         url: `/master/contractType`,
      };
      return await fetchApi(options);
   },
   //ผู้แต่งหนังสือ
   async fetchTextbookOwnerList() {
      const options = {
         method: "GET",
         url: `/master/textbookOwner`,
      };
      return await fetchApi(options);
   },
   //แหล่งที่มาของงบประมาณ
   async fetchBudgetSourceList() {
      const options = {
         method: "GET",
         url: `/master/budgetSource`,
      };
      return await fetchApi(options);
   },
   //ระดับฐานข้อมูลหนังสือ /ตำรา
   async fetchTextbookImpactFactorList() {
      const options = {
         method: "GET",
         url: `/master/textbookImpactFactor`,
      };
      return await fetchApi(options);
   },
   //ประเภทสิ่งประดิษฐ์
   async fetchInventionTypeList() {
      const options = {
         method: "GET",
         url: `/master/inventionType`,
      };
      return await fetchApi(options);
   },
   //เจ้าของบทความ
   async fetchArticleOwnerList() {
      const options = {
         method: "GET",
         url: `/master/articleOwner`,
      };
      return await fetchApi(options);
   },
   //ปีปฎิทินของบทความ
   async fetchArticleYearList() {
      const options = {
         method: "GET",
         url: `/master/articleYear`,
      };
      return await fetchApi(options);
   },
   //ปีปฏิทินของหนังสือ
   async fetchTextbookYearList() {
      const options = {
         method: "GET",
         url: `/master/textbookYear`,
      };
      return await fetchApi(options);
   },
};
