// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { getStatusBgColor, getStatusColor } from "./Utils";

function HorizontalTimeline({STATUS}) {
    const timelineData = [
        { data: "PENDING" },
        { data: "ON QUEUE" },
        { data: "PROCESSING" },
        { data: "FOR RELEASE" },
        { data: "COMPLETED" },
    ];
      return (  
      <>
            <SoftBox className="timeline-container d-flex p-4">
                <SoftBox className="d-flex align-items-center" >
                {timelineData.map((item, index) => (
                <SoftBox key={index} className="timeline-item">
                    <SoftBox className="timeline-line h1">
                            <DoubleArrowIcon color={index <= STATUS ? getStatusColor(index) : "secondary"} />
                    </SoftBox>
                    <SoftBox className={`text-center px-md-5 px-3 py-md-3 py-2 shadow rounded ${index <= STATUS ? getStatusBgColor(index) : "bg-light"}`}>
                            <SoftTypography variant="h6" className="text-xxs text-nowrap" color={index <= STATUS ? "white" : "dark"}>
                                {item.data}
                            </SoftTypography>
                    </SoftBox>
                </SoftBox>
                ))}
                </SoftBox>
            </SoftBox>
      </>
      );
}

export default HorizontalTimeline;
