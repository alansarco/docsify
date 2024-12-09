import React from 'react';
import axios from 'axios';
import { useStateContext } from "context/ContextProvider";
import { apiRoutes } from 'components/Api/ApiRoutes';
import { toast } from "react-toastify";
import SoftButton from 'components/SoftButton';

const DownloadButton = ({ candidateId, handleLoading, pollid }) => {
    const {token} = useStateContext();  
    const YOUR_ACCESS_TOKEN = token; 
    const headers = {
        'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
    };
    const handleDownload = async () => {
        try {
            handleLoading(true);
            const response = await axios.get(apiRoutes.downloadRequirements, {
                params: { candidateId, pollid },
                headers,
                responseType: 'blob' // Important to set response type to blob for binary data
            });
            // Create a URL for the file
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Create a link element to download the file
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'requirements.zip'); // Set the file name
            document.body.appendChild(link);
            link.click();
            link.remove();
            handleLoading(false);
            toast.success("Downloading file successfull!", { autoClose: true });
        } catch (error) {
            toast.error("No file or requiremnts to download!", { autoClose: true });
            handleLoading(false);
            console.log(error);
        }
    };

    return (
        <>
        <SoftButton className="mx-1 mt-1 mt-md-0 w-100 text-xxs px-2 rounded-pill text-nowrap" onClick={handleDownload} variant="gradient"  color="success"  size="small">
            Download Requirements
        </SoftButton>
        </>
        
    );
};

export default DownloadButton;