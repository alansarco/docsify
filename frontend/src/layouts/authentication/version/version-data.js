export const versions = [
    { 
        version: "V1.1.250317", 
        details: [
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