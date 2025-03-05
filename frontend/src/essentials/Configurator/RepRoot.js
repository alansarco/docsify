// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";
import { getStatus } from "components/General/Utils";
import { getStatusColor } from "components/General/Utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RepRoot({handleViewRequest, notifs}) {
    const [DATA, setDATA] = useState(); 
    const [rendering, setRendering] = useState(0);
    const navigate = useNavigate(); 

    const HandleDATA = (data) => {
        setDATA(data);
        setRendering(2);
        handleViewRequest();
        navigate("/students", {
            state: { passedData: data, render: 2 }
        });
    
    };

    return (
        <SoftBox>
            {notifs && notifs.length > 0 && notifs.map((notif) => (
            <SoftBox key={notif.username} py={2} px={3} className="border-bottom SoftBox cursor-pointer" 
                onClick={() => HandleDATA(notif.username)}>
                <SoftBox display="flex">
                    <SoftTypography variant="h6">{notif.fullname}</SoftTypography>
                    <SoftBadge 
                    badgeContent={getStatus(notif.account_status)} 
                    variant="gradient" 
                    color={getStatusColor(notif.account_status)} 
                    size="sm" 
                    />
                </SoftBox>
                <SoftBox display="flex">
                    <SoftTypography variant="h6" color="secondary" className="text-xxs">{notif.username}</SoftTypography>
                </SoftBox>
                <SoftBox mt={1}>
                    <SoftTypography className="text-xxs" color="dark" > <b>Created Date:</b> {notif.created_date}</SoftTypography>
                </SoftBox> 
                
                </SoftBox>
            ))}
        </SoftBox>
    )
}

export default RepRoot;
