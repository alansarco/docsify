export default function VotingDateValidation ({name, updatedData, toast}) {
    const applicationStart = new Date(updatedData.application_start);
    const applicationEnd = new Date(updatedData.application_end);
    const validationEnd = new Date(updatedData.validation_end);
    const votingStart = new Date(updatedData.voting_start);
    const votingEnd = new Date(updatedData.voting_end);
  
    // Rule 1: Application start and end can be equal, but end must be greater than or equal to start
    if (name === 'application_start' || name === 'application_end') {
      if (applicationEnd < applicationStart) {
        toast.dismiss();
        toast.warning('Application End must be greater than or equal to Application Start.', { autoClose: true });
        updatedData.application_end = ''; // Reset application_end if invalid
      }
      updatedData.validation_end = '';
      updatedData.voting_start = '';
      updatedData.voting_end = '';
    }
  
    // Rule 2: Validation end must be greater than both application start and end
    if (name === 'validation_end') {
      if (validationEnd <= applicationEnd || validationEnd <= applicationStart) {
        toast.dismiss();
        toast.warning('Validation End must be greater than both Application Start and End.', { autoClose: true });
        updatedData.validation_end = ''; // Reset validation_end if invalid
      }
      updatedData.voting_start = '';
      updatedData.voting_end = '';
    }
  
    // Rule 3: Voting start and end can be equal, but end must be greater than start and greater than validation end
    if (name === 'voting_start' || name === 'voting_end') {
      if (votingEnd < votingStart) {
        toast.dismiss();  
        toast.warning('Voting End must be greater than or equal to Voting Start.', { autoClose: true });
        updatedData.voting_end = ''; // Reset voting_end if invalid
      } else if (votingEnd <= validationEnd) {
        toast.dismiss();
        toast.warning('Voting End must be greater than Validation End.', { autoClose: true });
        updatedData.voting_end = ''; // Reset voting_end if invalid
      } else if (votingStart <= validationEnd) {
        toast.dismiss();
        toast.warning('Voting Start must be greater than Validation End.', { autoClose: true });
        updatedData.voting_start = ''; // Reset voting_start if invalid
      }
    }
  
    return updatedData;
  };
  