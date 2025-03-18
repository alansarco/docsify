// export const mainRoute = "http://127.0.0.1:8000";
export const mainRoute = "https://docsify-7ygpq.ondigitalocean.app";

export const apiRoutes = {  
    login: `${mainRoute}/api/login`,
    clientSelect: `${mainRoute}/api/clientselect`,
    signupsuffixRetrieve: `${mainRoute}/api/signupsuffix`,
    signupuser: `${mainRoute}/api/signupuser`,
    createOTP: `${mainRoute}/api/createotp`,
    createOTPverification: `${mainRoute}/api/createotpverification`,
    validateOTP: `${mainRoute}/api/validateotp`,
    submitPassword: `${mainRoute}/api/submitpassword`,

    app_infoRetrieve: `${mainRoute}/api/app_info`,

    authUserRetrieve: `${mainRoute}/api/user`,
    doLogout: `${mainRoute}/api/user`,

    otherStatsRetrieve: `${mainRoute}/api/dashboard/otherStats`,
    adminNotifsRetrieve: `${mainRoute}/api/dashboard/adminnotifs`,
    
    StudentAnalyticsChart: `${mainRoute}/api/analytics/studentanalyticschart`,
    gradeCounts: `${mainRoute}/api/analytics/gradecounts`,
    studentGenderCounts: `${mainRoute}/api/analytics/studentgendercounts`,
    
    RegistrarAnalyticsChart: `${mainRoute}/api/analytics/registraranalyticschart`,
    registrarGenderCounts: `${mainRoute}/api/analytics/registrargendercounts`,


    adminRetrieve: `${mainRoute}/api/admins`,
    addAdmin: `${mainRoute}/api/admins/addadmin`,
    updateAdmin: `${mainRoute}/api/admins/updateadmin`,
    deleteAdmin: `${mainRoute}/api/admins/deleteadmin`,
    retrieveAdminOne: `${mainRoute}/api/admins/retrieveadmin`,
    
    representativeRetrieve: `${mainRoute}/api/representatives`,
    addRepresentative: `${mainRoute}/api/representatives/addrepresentative`,
    updateRepresentative: `${mainRoute}/api/representatives/updaterepresentative`,
    deleteRepresentative: `${mainRoute}/api/representatives/deleterepresentative`,
    retrieveRepresentativeOne: `${mainRoute}/api/representatives/retrieverepresentative`,
    clientSelectRep: `${mainRoute}/api/clientselectrep`,
    clientSelectRepUpdate: `${mainRoute}/api/clientselectrepupdate`,

    registrarRetrieve: `${mainRoute}/api/registrars`,
    addRegistrar: `${mainRoute}/api/registrars/addregistrar`,
    updateRegistrar: `${mainRoute}/api/registrars/updateregistrar`,
    deleteRegistrar: `${mainRoute}/api/registrars/deleteregistrar`,
    retrieveRegistrarOne: `${mainRoute}/api/registrars/retrieveregistrar`,

    studentRetrieve: `${mainRoute}/api/students`,
    addStudent: `${mainRoute}/api/students/addstudent`,
    sectionSelect: `${mainRoute}/api/students/sectionselect`,
    programSelect: `${mainRoute}/api/students/programselect`,
    retrieveStudentOne: `${mainRoute}/api/students/retrievestudent`,
    updateStudent: `${mainRoute}/api/students/updatestudent`,
    uploadExcel: `${mainRoute}/api/students/uploadexcel`,
    deleteStudent: `${mainRoute}/api/students/deletestudent`,


    sectionRetrieve: `${mainRoute}/api/sections`,
    addSection: `${mainRoute}/api/sections/addsection`,
    retrieveSectionOne: `${mainRoute}/api/sections/retrievesection`,
    deleteSection: `${mainRoute}/api/sections/deletesection`,
    updateSection: `${mainRoute}/api/sections/updatesection`,

    programRetrieve: `${mainRoute}/api/programs`,
    addProgram: `${mainRoute}/api/programs/addprogram`,
    retrieveProgramOne: `${mainRoute}/api/programs/retrieveprogram`,
    deleteProgram: `${mainRoute}/api/programs/deleteprogram`,
    updateProgram: `${mainRoute}/api/programs/updateprogram`,
    
    documentRetreive: `${mainRoute}/api/documents`,
    addDocument: `${mainRoute}/api/documents/adddocument`,
    retrieveDocumentOne: `${mainRoute}/api/documents/retrievedocument`,
    deleteDocument: `${mainRoute}/api/documents/deletedocument`,
    updateDocument: `${mainRoute}/api/documents/updatedocument`,

    activeRequestRetreive: `${mainRoute}/api/requests`,
    historyRequestRetreive: `${mainRoute}/api/requests/historyrequests`,
    documentSelect: `${mainRoute}/api/requests/documentselect`,
    retrieveRequestOne: `${mainRoute}/api/requests/retrieverequest`,
    assignToMe: `${mainRoute}/api/requests/assigntome`,
    updateRequestStatus: `${mainRoute}/api/requests/updaterequeststatus`,
    representativeSelect: `${mainRoute}/api/requests/representativeselect`,
    assignRegistrar: `${mainRoute}/api/requests/assignregistrar`,

    activeTaskRetreive: `${mainRoute}/api/tasks`,
    historyTaskRetreive: `${mainRoute}/api/tasks/historytask`,

    activeStudentRequestRetreive: `${mainRoute}/api/my-requests`,
    studentHistoryRequests: `${mainRoute}/api/my-requests/studenthistoryrequests`,
    cancelRequest: `${mainRoute}/api/my-requests/cancelrequest`,
    documentSelectStudent: `${mainRoute}/api/my-requests/documentselect`,
    addRequest: `${mainRoute}/api/my-requests/addrequest`,

    activeCampusRetrieve: `${mainRoute}/api/campuses/active`,
    inactiveCampusRetrieve: `${mainRoute}/api/campuses/inactive`,
    addCampus: `${mainRoute}/api/campuses/addcampus`,
    updateCampus: `${mainRoute}/api/campuses/updatecampus`,
    deleteCampus: `${mainRoute}/api/campuses/deletecampus`,
    retrieveCampusOne: `${mainRoute}/api/campuses/retrievecampus`,
    renewCampus: `${mainRoute}/api/campuses/renewcampus`,
    
    licenseRetrieve: `${mainRoute}/api/licenses`,
    addLicense: `${mainRoute}/api/licenses/addlicense`,
    deleteLicense: `${mainRoute}/api/licenses/deletelicense`,

    adminlogsRetrieve: `${mainRoute}/api/logs/adminlogs`,
    representativelogsRetrieve: `${mainRoute}/api/logs/representativelogs`,

    adminSettings: `${mainRoute}/api/settings/adminsettings`,
    adminSettingsRetrieved: `${mainRoute}/api/settings/adminsettingsretrieved`,
    updateAdminSettings: `${mainRoute}/api/settings/updateadminsettings`,

    representativeSettings: `${mainRoute}/api/settings/representativesettings`,
    representativeSettingsRetrieved: `${mainRoute}/api/settings/representativesettingsretrieved`,
    updateRepresentativeSettings: `${mainRoute}/api/settings/updaterepresentativesettings`,


    profileRetrieved: `${mainRoute}/api/profile/profileretrieve`,
    updateProfile: `${mainRoute}/api/profile/updateprofile`,
    personalChangePass: `${mainRoute}/api/profile/personalchangepass`,

    storageRetrieve: `${mainRoute}/api/storages`,
    deleteStorageData: `${mainRoute}/api/storages/deletestoragedata`,
    downloadStorageData: `${mainRoute}/api/storages/downloadstoragedata`,
    uploadStorageData: `${mainRoute}/api/storages/uploadstoragedata`,

    transfereeRetrieve: `${mainRoute}/api/transferees`,
    addTransferee: `${mainRoute}/api/transferees/addtransferee`,
    deleteTransferRequest: `${mainRoute}/api/transferees/deletetransferrequest`,
    rejectTransferRequest: `${mainRoute}/api/transferees/rejecttransferrequest`,
    approveTransferRequest: `${mainRoute}/api/transferees/approvetransferrequest`,

    studentSelect: `${mainRoute}/api/studentselect`,


    // Add more routes here
};  