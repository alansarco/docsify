// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";
import { getStatus } from "components/General/Utils";
import { getStatusColor } from "components/General/Utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentRoot({handleViewRequest, notifs}) {
    const [DATA, setDATA] = useState(); 
    const [rendering, setRendering] = useState(0);
    const navigate = useNavigate(); 

    const HandleDATA = (data) => {
        setDATA(data);
        setRendering(2);
        handleViewRequest();
        navigate("/my-active-requests", {
            state: { passedData: data, render: 2 }
        });
    
    };

    return (
        <SoftBox>
            {notifs && notifs.length > 0 && notifs.map((notif) => (
            <SoftBox key={notif.reference_no} py={2} px={3} className="border-bottom SoftBox cursor-pointer" 
                onClick={() => HandleDATA(notif.reference_no)}>
                <SoftBox display="flex">
                    <SoftTypography variant="h6">{notif.doc_name}</SoftTypography>
                    <SoftBadge 
                    badgeContent={getStatus(notif.status)} 
                    variant="gradient" 
                    color={getStatusColor(notif.status)} 
                    size="sm" 
                    />
                </SoftBox>
                {/* <SoftBox display="flex">
                    <SoftTypography variant="h6" color="secondary" className="text-xxs">{notif.username}</SoftTypography>
                </SoftBox> */}
                <SoftBox mt={1}>
                    <SoftTypography className="text-xxs" color="dark" > <b>Updated:</b> {notif.updated_date}</SoftTypography>
                </SoftBox> 
                
                </SoftBox>
            ))}
        </SoftBox>
    )
}

export default StudentRoot;
