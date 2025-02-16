// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";
import { getStatus } from "components/General/Utils";
import { getStatusColor } from "components/General/Utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminRoot({handleViewRequest, notifs}) {
    const [DATA, setDATA] = useState(); 
    const [rendering, setRendering] = useState(0);
    const navigate = useNavigate(); 

    const HandleDATA = (data) => {
        setDATA(data);
        setRendering(2);
        handleViewRequest();
        navigate("/active-campus", {
            state: { passedData: data, render: 2 }
        });
    
    };

    return (
        <SoftBox>
            {notifs && notifs.length > 0 && notifs.map((notif) => (
            <SoftBox key={notif.clientid} py={2} px={3} className="border-bottom SoftBox cursor-pointer" 
                onClick={() => HandleDATA(notif.clientid)}>
                <SoftBox display="flex">
                    <SoftTypography variant="h6">{notif.client_name}</SoftTypography>
                </SoftBox>
                <SoftBox mt={1}>
                    <SoftTypography className="text-xxs" color="dark" > <b>Focal:</b> {notif.representative}</SoftTypography>
                </SoftBox> 
                <SoftBox mt={0}>
                    <SoftTypography className="text-xxs" color="dark" > <b>Updated:</b> {notif.created_date}</SoftTypography>
                </SoftBox> 
                
                </SoftBox>
            ))}
        </SoftBox>
    )
}

export default AdminRoot;
