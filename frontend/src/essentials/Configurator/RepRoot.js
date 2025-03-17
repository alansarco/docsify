// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";
import { getStatus } from "components/General/Utils";
import { getStatusColor } from "components/General/Utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RepRoot({handleViewRequest, notifs, notifs1}) {
    const [DATA, setDATA] = useState(); 
    const [rendering, setRendering] = useState(0);
    const navigate = useNavigate(); 

    const HandleDATA = (data) => {
        setDATA(data);
        setRendering(2);
        handleViewRequest();
        if(data === "transfer") {
            navigate("/transferees", {
                state: { passedData: data, render: 2 }
            });
        }
        else {
            navigate("/students", {
                state: { passedData: data, render: 2 }
            });
        }
    
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
            {notifs1 && notifs1.length > 0 && notifs1.map((notif) => (
            <SoftBox key={notif.id} py={2} px={3} className="border-bottom SoftBox cursor-pointer" 
                onClick={() => HandleDATA("transfer")}>
                <SoftBox display="flex">
                    <SoftTypography variant="h6">{notif.fullname}</SoftTypography>
                    <SoftBadge 
                    badgeContent={getStatus(notif.status)} 
                    variant="gradient" 
                    color={getStatusColor(notif.status)} 
                    size="sm" 
                    />
                </SoftBox>
                <SoftBox display="flex">
                    <SoftTypography variant="h6" color="secondary" className="text-xxs">{notif.username}</SoftTypography>
                </SoftBox>
                <SoftBox mt={1}>
                    <SoftTypography className="text-xxs" color="dark" > <b>Transferee From:</b> {notif.client_name}</SoftTypography>
                    <SoftTypography className="text-xxs" color="dark" > <b>Updated Date:</b> {notif.updated_date}</SoftTypography>
                </SoftBox> 
                
                </SoftBox>
            ))}
        </SoftBox>
    )
}

export default RepRoot;
