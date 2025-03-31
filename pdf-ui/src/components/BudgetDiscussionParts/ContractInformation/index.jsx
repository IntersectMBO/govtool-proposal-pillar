import { Box, Card, CardContent, Button, Typography, List, ListItem, TextField, MenuItem, Grid } from "@mui/material"
import { useEffect, useState } from 'react';
import { getCountryList, getNationalityList } from '../../../lib/api';
import { StepperActionButtons } from '../../BudgetDiscussionParts';

const ContractInformation = ({ setStep, step, onClose, currentBudgetDiscussionData, setBudgetDiscussionData,  setSelectedDraftId, selectedDraftId, handleSaveDraft, errors, setErrors, validateSection }) => {
     const [allCountries, setAllCountries] = useState([]);
     //const [allNationalities, setAllNationalities] = useState([]);

     useEffect(() => {
          const fetchData = async () => {
               try {
                    if (!allCountries.length) {
                         const countriesResponse = await getCountryList();
                         setAllCountries(countriesResponse?.data || []);
                    }
                    // if (!allNationalities.length) {
                    //      const nationalitiesResponse = await getNationalityList();
                    //      setAllNationalities(nationalitiesResponse?.data || []);
                    // }
               } catch (error) {
                    console.error("Error fetching data:", error);
               }
          };
          fetchData();
     }, []);
     useEffect(() => {
          validateSection("bd_contact_information");
      }, [currentBudgetDiscussionData?.bd_contact_information]);

     const handleDataChange = (e, dataName) => {
          setBudgetDiscussionData({
               ...currentBudgetDiscussionData,
               bd_contact_information: {
                    ...currentBudgetDiscussionData?.bd_contact_information,
                    [dataName]: e.target.value
               }})
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
                                   <Typography variant='h4' gutterBottom>
                                        Section 1: Contact Information
                                   </Typography>
                              </Box>
                              <Box color={(theme) => theme.palette.text.grey}>
                                   <Typography variant='body1' gutterBottom>
                                        In order to process your proposal, Intersect requires a few contact details.
                                        This section will be kept confidential and will not be publicly shared.
                                   </Typography>
                                   <Typography variant='body1' gutterBottom>
                                        We will collect the contact details for two individuals:
                                   </Typography>
                                   <List sx={{
                                        listStyleType: 'disc',
                                        marginLeft: 2,
                                        textAlign: 'justify',
                                        marginBottom: 0,
                                   }}
                                   >
                                        <ListItem
                                             sx={{
                                                  textAlign: 'justify',
                                                  display: 'list-item',
                                                  paddingY: 0,
                                                  marginY: 0,
                                             }}
                                        >
                                             <Typography variant='body1' gutterBottom>
                                                  The beneficiary of the project - the person responsible for signing the legal contract on behalf of a company / entity (if approved on-chain).
                                             </Typography>
                                        </ListItem>
                                        <ListItem
                                             sx={{
                                                  textAlign: 'justify',
                                                  display: 'list-item',
                                                  paddingY: 0,
                                                  marginY: 0,
                                             }}
                                        >
                                             <Typography variant='body1' gutterBottom>
                                                  The submission lead - the person submitting the proposal.
                                             </Typography>
                                        </ListItem>
                                   </List>
                                   <Typography variant='body1' gutterBottom>
                                        If you are submitting on behalf of an Intersect Committee, the Committee Chair will be the beneficiary and the Committee Secretary will be the submission lead. Please submit the Intersect Committee's email as the beneficiary email. The same individual may fulfil both roles. Additionally, the submission lead may also serve as the proposal's public champion, as further defined below.
                                   </Typography>
                              </Box>
                              <Box>
                                   <TextField
                                        name= 'Beneficiary Full Name'
                                        label='*Beneficiary Full Name'
                                        value={currentBudgetDiscussionData?.bd_contact_information?.be_full_name || ''}
                                        helperText={errors['bd_contact_information.be_full_name']?.trim() || 'The person responsible for signing the legal contract on behalf of a company / entity (if approved on-chain).'}
                                        required
                                        fullWidth
                                        error={!!errors['bd_contact_information.be_full_name']?.trim()}
                                        onChange={(e) => handleDataChange(e, 'be_full_name')}
                                        sx={{ mb: 2 }}
                                   />
                                   <TextField
                                        name='Beneficiary e-mail'
                                        label='*Beneficiary e-mail'
                                        value={currentBudgetDiscussionData?.bd_contact_information?.be_email || ''}
                                        required
                                        helperText={errors['bd_contact_information.be_email']?.trim()}
                                        error={!!errors['bd_contact_information.be_email']?.trim()}
                                        type='email'
                                        fullWidth
                                        onChange={(e) => handleDataChange(e, 'be_email')}
                                        sx={{ mb: 2 }}
                                   />
                                   <Box sx={{ display: 'flex', gap: 2}} >
                                        <Grid container spacing={2}>
                                             <Grid item xs={6}>
                                                  <TextField
                                                       select
                                                       label='Beneficiary Country of Residence'
                                                       value={currentBudgetDiscussionData?.bd_contact_information?.be_country_of_res || ''}
                                                       helperText={errors['bd_contact_information.be_country_of_res']?.trim()}
                                                       error={!!errors['bd_contact_information.be_country_of_res']?.trim()}
                                                       required
                                                       fullWidth
                                                       onChange={(e) => handleDataChange(e, 'be_country_of_res')}
                                                       SelectProps={{
                                                            SelectDisplayProps: {
                                                                 'data-testid': 'beneficiary-country-of-residence',
                                                            },
                                                       }}
                                                       sx={{ mb: 2 }}
                                                  >
                                                       {allCountries.map((option) => (
                                                            <MenuItem
                                                                      key={option?.id}
                                                                      value={option?.id}
                                                                      data-testid={`${option?.attributes.country_name?.toLowerCase()}-button`}
                                                                 >
                                                                 {option?.attributes.country_name}
                                                            </MenuItem>
                                                       ))}
                                                  </TextField>
                                             </Grid>
                                             <Grid item xs={6}>
                                                  <TextField
                                                       select
                                                       label='Beneficiary Nationality'
                                                       value={currentBudgetDiscussionData?.bd_contact_information?.be_nationality || ''}
                                                       required
                                                       fullWidth
                                                       helperText={errors['bd_contact_information.be_nationality']?.trim()}
                                                       error={!!errors['bd_contact_information.be_nationality']?.trim()}
                                                       onChange={(e) => handleDataChange(e, 'be_nationality')}
                                                       SelectProps={{
                                                            SelectDisplayProps: {
                                                                 'data-testid': 'beneficiary-nationality',
                                                            },
                                                       }}
                                                       sx={{ mb: 2 }}
                                                  >
                                                       {allCountries?.map((option) => (
                                                            <MenuItem 
                                                                      key={option?.id} 
                                                                      value={option?.id} 
                                                                      data-testid={`${option?.attributes.nationality_name?.toLowerCase()}-button`} 
                                                                 >
                                                                 {option?.attributes.country_name}
                                                            </MenuItem>
                                                       ))}
                                                  </TextField>
                                             </Grid>
                                        </Grid>     
                                   </Box>
                                   <TextField
                                        name='*Submission Lead Full Name'
                                        label='*Submission Lead Full Name'
                                        value={currentBudgetDiscussionData?.bd_contact_information?.submission_lead_full_name || ''}
                                        required
                                        fullWidth
                                        helperText={errors['bd_contact_information.submission_lead_full_name']?.trim() || '*the person submitting the proposal'}
                                        error={!!errors['bd_contact_information.submission_lead_full_name']?.trim()}
                                        onChange={(e) => handleDataChange(e, 'submission_lead_full_name')}
                                        sx={{ mb: 2 }}
                                   />
                                   <TextField
                                        name='*Submission Lead Email'
                                        label='*Submission Lead Email'
                                        value={currentBudgetDiscussionData?.bd_contact_information?.submission_lead_email || ''}
                                        required
                                        fullWidth
                                        helperText={errors['bd_contact_information.submission_lead_email']?.trim()}
                                        error={!!errors['bd_contact_information.submission_lead_email']?.trim()}
                                        onChange={(e) => handleDataChange( e, 'submission_lead_email')}
                                        sx={{ mb: 2 }}
                                   />
                              </Box>
                              <StepperActionButtons onClose={onClose} onSaveDraft={handleSaveDraft} onContinue={setStep}
                                onBack={setStep} selectedDraftId={selectedDraftId} nextStep={step+1} backStep={step-1} errors={errors} 
                              />
                             
                         </CardContent>
                    </Card>
               </Box>
          </Box>
     );
}

export default ContractInformation;