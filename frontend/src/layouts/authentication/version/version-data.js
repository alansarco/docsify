export const latestversions = "V1.1.250428"

export const versions = [
    { 
        version: "V1.1.250428", 
        details: [
            {
                types: "new",
                description: "Add download button for student template"
            },
        ]
    },
    { 
        version: "V1.1.250426", 
        details: [
            {
                types: "bug",
                description: "Document name cannot be filtered in request list"
            },
            {
                types: "update",
                description: "Change the request list order from latest to oldest"
            },
            {
                types: "new",
                description: "Add textbox input for rejecting student account"
            },
            {
                types: "new",
                description: "Document request limit per year is set to 10 and days process is up to 14 days"
            },
            {
                types: "new",
                description: "Show account for review message when logging in using new or unverified account"
            },
            {
                types: "update",
                description: "Removed the verify data checkbox when requesting a document"
            },
            {
                types: "update",
                description: "Change the request timeline comment from input to textarea"
            },
            {
                types: "update",
                description: "Change the updated by label in request timeline"
            },
            {
                types: "update",
                description: "Change all the verified terms for account status to active/inactive"
            },
            {
                types: "new",
                description: "Enlarge School ID/document when clicked"
            },
        ]
    },
    { 
        version: "V1.1.250425", 
        details: [
            {
                types: "new",
                description: "Add tagging to email when account is rejected"
            },
            {
                types: "new",
                description: "Add address and contact number for campus information registration"
            },
            {
                types: "update",
                description: "Use email instead of username in forgot password"
            },
            {
                types: "bug",
                description: "Error in Contact field"
            },
        ]
    },
    { 
        version: "V1.1.250421", 
        details: [
            {
                types: "bug",
                description: "Error in sending OTP for school representative account registration"
            },
        ]
    },
    { 
        version: "V1.1.250322", 
        details: [
            {
                types: "update",
                description: "Do not show the current status when updating the requested document"
            },
            {
                types: "update",
                description: "Show On Hold and Rejected status only when the current status higher than On Queue"
            },
        ]
    },
    { 
        version: "V1.1.250320", 
        details: [
            {
                types: "new",
                description: "Added updated by data in request timeline"
            },
            {
                types: "new",
                description: "Added additional ON HOLD status of requests"
            },
            {
                types: "new",
                description: "Added password change indicator in dashboard"
            },
            {
                types: "update",
                description: "Allows only to edit email, contact, and profile picture in profile settings"
            },
            {
                types: "bug",
                description: "Fix contact field validator that requires 11 digits"
            },
        ]
    },
    { 
        version: "V1.1.250318", 
        details: [
            {
                types: "new",
                description: "Added Request Chart in Analytics Page"
            },
            {
                types: "new",
                description: "Added Registrar Chart in Analytics Page"
            },
            {
                types: "new",
                description: "Added Student Chart in Analytics Page"
            },
            {
                types: "new",
                description: "Added Analytics Page"
            },
        ]
    },
    { 
        version: "V1.1.250317", 
        details: [
            {
                types: "new",
                description: "Add overdue task card in school representative UI"
            },
            {
                types: "new",
                description: "Add notification for transferee student"
            },
            {
                types: "new",
                description: "Add linkable task card for registrar dashboard"
            },
            {
                types: "update",
                description: "Removed task chart in registrar UI"
            },
            {
                types: "bug",
                description: "Can pass through rejecting/approving transferee even if its already cancelled"
            },
            {
                types: "bug",
                description: "Can pass through assigning registrar to request even if the same name"
            },
            {
                types: "update",
                description: "Make Timeline tab show first before Information in active requests"
            },
            {
                types: "bug",
                description: "Shows 'Delete Representative' message when deleting student"
            },
            {
                types: "new",
                description: "Added preset filter when clicking cards in student dashboard"
            },
            {
                types: "update",
                description: "Transfer text filter above the table in all users UI"
            },
            {
                types: "update",
                description: "Joined timeline and information of request history"
            },
        ]
    },
    { 
        version: "V1.1.250316", 
        details: [
            {
                types: "update",
                description: "Make student dashboard cards bigger and linkable"
            },
            {
                types: "new",
                description: "Added table in student dashboard for recent requests"
            },
            {
                types: "update",
                description: "For non-student users, email is required as username"
            },
            {
                types: "update",
                description: "Removed the campus selection in login"
            },
            {
                types: "new",
                description: "Added software version notes"
            },
        ]
    },
];