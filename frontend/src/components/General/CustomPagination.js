// PaginationLinks.js
import { Pagination } from '@mui/material';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import React from 'react';

function CustomPagination({ fetchdata, fetchNextPrevTasks }) {
  if (!fetchdata || !fetchdata.links) {
    return null;
  }

  const handlePageChange = (event, value) => {
    const selectedPage = value;
    const selectedLink = fetchdata.links.find(link => link.label.includes(selectedPage));
    if (selectedLink) {
      fetchNextPrevTasks(selectedLink.url);
    }
  };

  return (
    <SoftBox mt={2} className="d-block d-md-flex text-center justify-content-center justify-content-md-between">
      <SoftTypography className="text-xs my-auto fw-bold" >
        {fetchdata.from} - {fetchdata.to} of {fetchdata.total} results
      </SoftTypography>
      <Pagination
        count={fetchdata.last_page}
        page={fetchdata.current_page}
        onChange={handlePageChange}
        variant="outlined"
        color="info"
        size="medium"
        className="d-flex justify-content-center mt-2 mt-md-0"
      />
    </SoftBox>
  );
}

export default CustomPagination;
