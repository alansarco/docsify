import React from 'react';
import axios from 'axios';
import { useStateContext } from "context/ContextProvider";
import { apiRoutes } from 'components/Api/ApiRoutes';
import { toast } from "react-toastify";
import SoftButton from 'components/SoftButton';
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone';

const DownloadButton = ({ setSearchTriggered, fileid, fileName }) => {
    const {token} = useStateContext();  
    const YOUR_ACCESS_TOKEN = token; 
    const headers = {
        'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
    };
    const handleDownload = async () => {
        try {
            setSearchTriggered(true);
            const response = await axios.get(apiRoutes.downloadStorageData, {params: { fileid }, headers,
                responseType: 'blob' // Important to set response type to blob for binary data
            });

            // Create a URL for the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const contentType = response.headers['content-type'];
            const extension = contentType.split('/')[1];
            const file_name = `${fileName}.${extension}`;

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
            toast.error("No file or requiremnts to download!", { autoClose: true });
            setSearchTriggered(false);
            console.log(error);
        }
    };

    return (
        <>
        <SoftButton onClick={handleDownload} className="text-xxs rounded-pill p-0 ms-1" variant="gradient" color="success" size="small" iconOnly>
             <DownloadTwoToneIcon />
        </SoftButton>
        </>
        
    );
};

export default DownloadButton;