import React from 'react';
import axios from 'axios';
import { useStateContext } from "context/ContextProvider";
import { apiRoutes } from 'components/Api/ApiRoutes';
import { toast } from "react-toastify";
import SoftButton from 'components/SoftButton';
import DownloadIcon from '@mui/icons-material/Download';

const DownloadTemplate = ({ setSearchTriggered, fileid, fileName }) => {
    const {token} = useStateContext();  
    const YOUR_ACCESS_TOKEN = token; 
    const headers = {
        'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
    };
    const handleDownload = async () => {
        try {
            setSearchTriggered(true);
            const response = await axios.get(apiRoutes.downloadStudentTemplate, {params: { fileid }, headers,
                responseType: 'blob' // Important to set response type to blob for binary data
            });

            // Create a URL for the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const contentType = response.headers['content-type'];
            const file_name = `${fileName}.xlsx`;

            // Create a link element to download the file
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file_name); // Set the file name
            document.body.appendChild(link);
            link.click();
            link.remove();
            setSearchTriggered(false);
            toast.success("Downloading file successfull!", { autoClose: true });
        } catch (error) {
            toast.error("No file to download!", { autoClose: true });
            setSearchTriggered(false);
            console.log(error);
        }
    };

    return (
        <>
        <SoftButton onClick={handleDownload} className="text-xxs rounded-pill p-0 px-2 ms-1" variant="gradient" color="info" size="small">
             <DownloadIcon /> Download Template
        </SoftButton>
        </>
        
    );
};

export default DownloadTemplate;