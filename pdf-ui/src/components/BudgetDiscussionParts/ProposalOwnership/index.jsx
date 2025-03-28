import { Box, Card, CardContent, Typography, TextField, MenuItem, FormControlLabel, Checkbox } from "@mui/material"
import { useEffect, useState } from 'react';
import { StepperActionButtons } from '../../BudgetDiscussionParts';
import { getCountryList } from '../../../lib/api';

const ProposalOwnership = ({ setStep, step, currentBudgetDiscussionData, setBudgetDiscussionData, onClose, setSelectedDraftId, selectedDraftId, handleSaveDraft }) => {
     const [allCountries, setAllCountries] = useState([]);
     useEffect(() => {
               const fetchData = async () => {
                    try {
                         if (!allCountries.length) {
                              const countriesResponse = await getCountryList();
                              setAllCountries(countriesResponse?.data || []);
                         }
                    } catch (error) {
                         console.error("Error fetching data:", error);
                    }
               };
     
               fetchData();
          }, []);
     const handleDataChange = (e, dataName) => {
          const value = e.target.type === 'checkbox' ? e.target.checked  : e.target.value;
          setBudgetDiscussionData({
             ...currentBudgetDiscussionData,
             budget_discussion_proposal_ownership: {
                 ...currentBudgetDiscussionData?.budget_discussion_proposal_ownership,
                 [dataName]: value
             }})
   };
   const handleSubmitedOnBehalfChange = (e) => {
     setBudgetDiscussionData({
          ...currentBudgetDiscussionData,
          budget_discussion_proposal_ownership: {
              ...currentBudgetDiscussionData?.budget_discussion_proposal_ownership,
          submited_on_behalf: e.target.value,
          company_name: '', company_domain_name: '', beneficiary_country_of_incorporation: '',
          group_name: '', type_of_group: '', key_information_to_identify_group: '' }});
     };

     return (
          <Box display='flex' flexDirection='column'>
               <Box>
                    <Card>
                         <CardContent
                              sx={{
                                   ml: {
                                        xs: 0,
                                        sm: 5,
                                        md: 5,
                                        lg: 15,
                                   },
                                   mr: {
                                        xs: 0,
                                        sm: 5,
                                        md: 5,
                                        lg: 15,
                                   },
                              }}
                         >
                              <Box
                                   sx={{
                                        align: 'center',
                                        textAlign: 'center',
                                        mt: 2,
                                   }}
                              >
                                   <Typography variant='h4' gutterBottom sx={{mb: 2}}>
                                       Section 2: Proposal Ownership
                                   </Typography>
                              </Box>
                              <Box>
                              <TextField
                                   select
                                   label='*Is this proposal being submitted on behalf of an individual (the beneficiary), company, or some other group?'
                                   value={currentBudgetDiscussionData?.budget_discussion_proposal_ownership?.submited_on_behalf || 'Please Choose'}
                                   required
                                   fullWidth
                                   onChange={(e) =>{handleSubmitedOnBehalfChange(e)}}
                                   SelectProps={{
                                        SelectDisplayProps: {
                                             'data-testid': 'beneficiary-nationality',
                                        },
                                   }}
                                   helperText='If you are submitting on behalf of an Intersect Committee, please select Group. The Group Name would be the “Name of the Committee (e.g. MCC, TSC)”. The Type of Group would be “Intersect Committee”. The Key Information to Identify the Group would be the names of the Voting members of the Committee.'
                                   sx={{ mb: 2 }}
                                   >
                                   <MenuItem key={"1"} value={"Individual"} >Individual</MenuItem>
                                   <MenuItem key={"2"} value={"Company"} >Company</MenuItem>
                                   <MenuItem key={"3"} value={"Group"} >Group</MenuItem>
                              </TextField>
                              { currentBudgetDiscussionData.budget_discussion_proposal_ownership?.submited_on_behalf === 'Company' ? 
                              (<Box>
                                   <TextField
                                        label='Company Name*'
                                        value={currentBudgetDiscussionData?.budget_discussion_proposal_ownership?.company_name || ''}
                                        required
                                        fullWidth
                                        onChange={(e) => handleDataChange(e, 'company_name')}
                                        sx={{ mb: 2 }}
                                   />
                                   <TextField
                                        label='Company Domain Name'
                                        helperText='Example of domain format to input: intersectmbo.org'
                                        value={currentBudgetDiscussionData?.budget_discussion_proposal_ownership?.company_domain_name || ''}
                                        required
                                        fullWidth
                                        onChange={(e) => handleDataChange(e, 'company_domain_name')}
                                        sx={{ mb: 2 }}
                                   />
                                   <TextField
                                        select
                                        label='Country of Incorporation'
                                        value={currentBudgetDiscussionData?.budget_discussion_proposal_ownership?.beneficiary_country_of_incorporation || ''}
                                        required
                                        fullWidth
                                        onChange={(e) => handleDataChange(e, 'beneficiary_country_of_incorporation')}
                                        SelectProps={{
                                             SelectDisplayProps: {
                                                  'data-testid': 'country-of-incorporation',
                                             },
                                        }}
                                        sx={{ mb: 2 }}
                                   >
                                        {allCountries.map((option) => (
                                             <MenuItem
                                                       key={option?.id}
                                                       value={option?.id}
                                                       data-testid={`${option?.attributes.country_name?.toLowerCase()}-country-of-incorporation-button`}
                                                       >
                                                  {option?.attributes.country_name}
                                             </MenuItem>
                                        ))}
                                   </TextField>
                               </Box>) 
                              : "" }
                              {currentBudgetDiscussionData.budget_discussion_proposal_ownership?.submited_on_behalf === 'Group'? 
                              (<Box>
                                   <TextField
                                        label='Group Name*'
                                        value={currentBudgetDiscussionData?.budget_discussion_proposal_ownership?.group_name || ''}
                                        required
                                        fullWidth
                                        onChange={(e) => handleDataChange(e, 'group_name')}
                                        sx={{ mb: 2 }}
                                   />
                                   <TextField
                                        label='Type of Group'
                                        value={currentBudgetDiscussionData?.budget_discussion_proposal_ownership?.type_of_group || ''}
                                        required
                                        fullWidth
                                        onChange={(e) => handleDataChange(e,'type_of_group')}
                                        sx={{ mb: 2 }}
                                   />
                                   <TextField
                                        label='Key Information to Identify Group'
                                        value={currentBudgetDiscussionData?.budget_discussion_proposal_ownership?.key_information_to_identify_group || ''}
                                        required
                                        fullWidth
                                        onChange = {(e) => handleDataChange(e, 'key_information_to_identify_group')}
                                        sx={{ mb: 2 }}
                                   />
                               </Box>) 
                              : ""}
                              <TextField
                                        select
                                        label='Proposal Public Champion: Who would you like to be the public proposal champion?'
                                        value={currentBudgetDiscussionData?.budget_discussion_proposal_ownership?.proposal_public_champion || ''}
                                        required
                                        fullWidth
                                        onChange={(e) => handleDataChange(e, 'proposal_public_champion')}
                                        SelectProps={{
                                             SelectDisplayProps: {
                                                  'data-testid': 'proposal-public-champion', 
                                             },
                                        }}
                                        sx={{ mb: 2 }}
                                        helperText='A Proposal Champion is a formal advocate for the proposal. They are responsible for providing information on the proposal, answering queries and generally building support amongst DReps. To facilitate this, the preferred contact details will be shared publicly.'
                                   >
                                        <MenuItem key={"1"} value={"Beneficiary listed above"} >Beneficiary listed above</MenuItem>
                                        <MenuItem key={"2"} value={"Submission lead listed above"} >Submission lead listed above</MenuItem>
                                   </TextField>
                                   <TextField
                                        label='Please provide your preferred contact details that will be shared publicly (e.g. email address, X handle, Discord handle, Github) ?'
                                        value={currentBudgetDiscussionData?.budget_discussion_proposal_ownership?.social_handles || ''}
                                        required
                                        fullWidth
                                        onChange={(e) => handleDataChange(e, 'social_handles')}
                                        sx={{ mb: 2 }}
                                   />
                                   <FormControlLabel
                                        control={
                                             <Checkbox
                                             checked={currentBudgetDiscussionData?.budget_discussion_proposal_ownership?.agreed}
                                             onChange={(e) => handleDataChange(e, 'agreed')}
                                             />
                                        }
                                        label={
                                             <Typography variant="body2">
                                                  I agree to the information in section 2 to be shared publicly
                                             </Typography>
                                        }
                                        />
                                                                      
                                </Box>
                              <StepperActionButtons onClose={onClose} onSaveDraft={handleSaveDraft} onContinue={setStep}
                                   onBack={setStep} selectedDraftId={selectedDraftId} nextStep={step+1} backStep={step-1}
                              />
                         </CardContent>
                    </Card>
               </Box>
          </Box>
     );
}
export default ProposalOwnership;