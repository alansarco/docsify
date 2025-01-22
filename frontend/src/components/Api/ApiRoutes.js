export const mainRoute = "http://127.0.0.1:8000";
// export const mainRoute = "https://seahorse-app-to578.ondigitalocean.app/app";

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
    updateAdminSettings: `${mainRoute}/api/settings/updatesdminsettings`,

    profileRetrieved: `${mainRoute}/api/profile/profileretrieve`,
    updateProfile: `${mainRoute}/api/profile/updateprofile`,
    personalChangePass: `${mainRoute}/api/profile/personalchangepass`,













    residentsRetrieve: `${mainRoute}/api/residents`,

    retrieveAnnouncement: `${mainRoute}/api/announcements`,
    retrieveAnnouncementOne: `${mainRoute}/api/announcements/retrieve`,
    addAnnouncement: `${mainRoute}/api/announcements/addannouncement`,
    deleteAnnouncement: `${mainRoute}/api/announcements/deleteannouncement`,
    updateAnnouncement: `${mainRoute}/api/announcements/updateannouncement`,

    retrieveReport: `${mainRoute}/api/reports`,
    retrieveReportOne: `${mainRoute}/api/reports/retrieve`,
    submitComment: `${mainRoute}/api/reports/submitcomment`,
    addReport: `${mainRoute}/api/reports/addreport`,
    deleteReport: `${mainRoute}/api/reports/deletereport`,
    resolveReport: `${mainRoute}/api/reports/resolvereport`,
    reopenReport: `${mainRoute}/api/reports/reopenreport`,
    updateReport: `${mainRoute}/api/reports/updatereport`,

    retrieveOfficials: `${mainRoute}/api/officials`,
    retrieveOfficialOne: `${mainRoute}/api/officials/retrieve`,
    addOfficial: `${mainRoute}/api/officials/addofficial`,
    deleteOfficial: `${mainRoute}/api/officials/deleteofficial`,
    updateOfficial: `${mainRoute}/api/officials/updateofficial`,

    accountRetrieve: `${mainRoute}/api/accounts`,
    accountRetrieveOne: `${mainRoute}/api/accounts/retrieve`,
    accountStore: `${mainRoute}/api/accounts/store`,
    accountDelete: `${mainRoute}/api/accounts/delete`,
    accountUpdate: `${mainRoute}/api/accounts/update`,
    accountChangePass: `${mainRoute}/api/accounts/personalchangepass`,
    uploadExcel: `${mainRoute}/api/accounts/uploadexcel`,

    requestRetrieve: `${mainRoute}/api/requests`,
    requestorInfo: `${mainRoute}/api/requests/requestorinfo`,
    editRequest: `${mainRoute}/api/requests/editrequest`,

    suffixRetrieve: `${mainRoute}/api/suffix`,

    otherStatsRetrieve: `${mainRoute}/api/dashboard/otherStats`,
    adminNotifsRetrieve: `${mainRoute}/api/dashboard/adminnotifs`,

    retrieveSettings: `${mainRoute}/api/settings`,
    updateSettings: `${mainRoute}/api/settings/updatesettings`,

    docRetrieve: `${mainRoute}/api/documents`,

    docSelect: `${mainRoute}/api/document-requests/docselect`,
    requestRetrieve: `${mainRoute}/api/document-requests`,
    addRequest: `${mainRoute}/api/document-requests/addrequest`,
    deleteRequest: `${mainRoute}/api/document-requests/deleterequest`,
    finishedRequest: `${mainRoute}/api/document-requests/finishedrequest`,
    claimedRequest: `${mainRoute}/api/document-requests/claimedrequest`,
    availabledateRequest: `${mainRoute}/api/document-requests/availabledate`,
    
    // Add more routes here
};  