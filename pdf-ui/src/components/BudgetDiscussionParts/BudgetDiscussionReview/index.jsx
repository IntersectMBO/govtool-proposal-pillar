import { Box, Card, CardContent, Button, Typography, List, ListItem, TextField, MenuItem, Grid, Link, FormControlLabel, Checkbox} from "@mui/material"
import { useEffect, useState } from 'react';
import { getAllCurrencies } from '../../../lib/api';
import { StepperActionButtons } from '../../BudgetDiscussionParts';

const BudgetDiscussionReview = ({ setStep, step, currentBudgetDiscussionData, setBudgetDiscussionData, onClose, submitBudgetDiscussion, setSelectedDraftId, selectedDraftId, handleSaveDraft, errors, setErrors }) => {
   
    const handleDataChange = (e, dataName) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setBudgetDiscussionData({
             ...currentBudgetDiscussionData,
                               ...currentBudgetDiscussionData,
                  [dataName]: value
             })
   };
    useEffect(() => {
        
        if(currentBudgetDiscussionData?.confidentiality === false)
            setBudgetDiscussionData({
                ...currentBudgetDiscussionData,
                                  ...currentBudgetDiscussionData,
                     confidentiality_description: ''
                })
    }, [currentBudgetDiscussionData]);
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
                                    textAlign: 'left',
                                    mt: 2,
                                }}
                            >
                                <Typography variant='h4' gutterBottom mb={2} sx={{textAlign: 'center'}}>
                                    Review Your Submission
                                </Typography>
                                <Box color={(theme) => theme.palette.text.grey}>
                                    <Typography variant="body1" mb={2}vv sx={{textAlign: 'center'}}>
                                        Review your proposal data before submitting it
                                    </Typography>
                                    <Box sx={{align: "left"}} >
                                        <Typography variant='h4' gutterBottom sx={{align:"left"}}>
                                            Section 1: Contact Information
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Beneficiary Full Name
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_contact_information?.beneficiary_full_name || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Beneficiary e-mail
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_contact_information?.beneficiary_email || ''}
                                        </Typography><Typography variant='body1' gutterBottom>
                                            Beneficiary Country of Residence
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_contact_information?.beneficiary_country_of_residence || ''}c
                                        </Typography><Typography variant='body1' gutterBottom>
                                            Beneficiary Nationality
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_contact_information?.beneficiary_nationality || ''}
                                        </Typography><Typography variant='body1' gutterBottom>
                                            Submission Lead Full Name'
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_contact_information?.submission_lead_full_name || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Submission Lead Email
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_contact_information?.submission_lead_email || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Is this proposal being submitted on behalf of an individual (the beneficiary), company, or some other group?
                                        </Typography>
                                        <Typography gutterBottom>
                                           {currentBudgetDiscussionData?.budget_discussion_contact_information?.submited_on_behalf}
                                        </Typography>
                                        { currentBudgetDiscussionData.budget_discussion_contact_information?.submited_on_behalf === 'Company' ? 
                                        (
                                            <Box>
                                                <Typography variant='body1' gutterBottom>
                                                    Company Name
                                                </Typography>
                                                <Typography gutterBottom>
                                                    {currentBudgetDiscussionData?.budget_discussion_contact_information?.company_name || ''}
                                                </Typography>
                                                <Typography variant='body1' gutterBottom>
                                                    Company Domain Name
                                                </Typography>
                                                <Typography gutterBottom>
                                                    {currentBudgetDiscussionData?.budget_discussion_contact_information?.company_domain_name || ''}
                                                </Typography>
                                                <Typography variant='body1' gutterBottom>
                                                    Country of Incorporation
                                                </Typography>
                                                <Typography gutterBottom>
                                                {currentBudgetDiscussionData?.budget_discussion_contact_information?.beneficiary_country_of_incorporation || ''}
                                                </Typography>
                                            </Box>                                            
                                        ):''}
                                        {currentBudgetDiscussionData.budget_discussion_contact_information?.submited_on_behalf === 'Group'? 
                                        (
                                            <Box>
                                                <Typography variant='body1' gutterBottom>
                                                    Group Name
                                                </Typography>
                                                <Typography gutterBottom>
                                                    {currentBudgetDiscussionData?.budget_discussion_contact_information?.group_name || ''}
                                                </Typography>
                                                <Typography variant='body1' gutterBottom>
                                                    Type of Group
                                                </Typography>
                                                <Typography gutterBottom>
                                                    {currentBudgetDiscussionData?.budget_discussion_contact_information?.type_of_group || ''}
                                                </Typography>
                                                <Typography variant='body1' gutterBottom>
                                                    Key Information to Identify Group
                                                </Typography>
                                                <Typography gutterBottom>
                                                    {currentBudgetDiscussionData?.budget_discussion_contact_information?.key_information_to_identify_group || ''}
                                                </Typography>
                                            </Box>
                                        ):''}
                                    </Box>
                                    <Box sx={{align: "left"}} >
                                        <Typography variant='h4' gutterBottom sx={{align:"left"}}>
                                            Section 2: Proposal Ownership
                                        </Typography>    
                                        <Typography variant='body1' gutterBottom>
                                            Proposal Public Champion: Who would you like to be the public proposal champion?
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_proposal_ownership?.proposal_public_champion || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            What social handles would you like to be used? E.g. Github, X
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_proposal_ownership?.social_handles || ''}
                                        </Typography>
                                    </Box>
                                   <Box sx={{align: "left"}} >
                                        <Typography variant='h4' gutterBottom sx={{align:"left"}}>
                                            Section 3: Problem Statements and Proposal Benefits
                                        </Typography>    
                                        <Typography variant='body1' gutterBottom>
                                            Problem Statement
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.problem_statement || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Proposal Benefit
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.proposal_benefit || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Does this proposal align to the Product Roadmap and Roadmap Goals?
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.roadmap_name || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Does your proposal align to any of the budget categories?
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.budget_discussion_type_name || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Does your proposal align with any of the Intersect Committees?
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.committee_name || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            If possible provide evidence of wider community endorsement for this proposal?
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_problem_statements_and_proposal_benefits?.supplementary_endorsement || ''}
                                        </Typography>
                                    </Box>
                                    <Box sx={{align: "left"}} >
                                        <Typography variant='h4' gutterBottom sx={{align:"left"}}>
                                            Section 4: Proposal Details
                                        </Typography>    
                                        <Typography variant='body1' gutterBottom>
                                             What is your proposed name to be used to reference this proposal publicly?
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_proposal_details?.proposal_name || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Proposal Description
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_proposal_details?.proposal_description || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Please list any key dependencies (if any) for this proposal?
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_proposal_details?.key_dependencies || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            How will this proposal be maintained and supported after initial development?
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_proposal_details?.maintain_and_support || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Key Proposal Deliverable(s) and Definition of Done: What tangible milestones or outcomes are to be delivered and what will the community ultimately receive?
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_proposal_details?.key_proposal_deliverables || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Resourcing & Duration Estimates: Please provide estimates of team size and duration to achieve the Key Proposal Deliverables outlined above.                                        
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_proposal_details?.resourcing_duration_estimates || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Experience: Please provide previous experience relevant to complete this project.
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_proposal_details?.experience || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Contracting: Please describe how you expect to be contracted.
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_proposal_details?.contract_type_name || ''}
                                        </Typography>
                                    </Box>
                                    </Box>
                                    <Box sx={{align: "left"}} >
                                        <Typography variant='h4' gutterBottom sx={{align:"left"}}>
                                            Section 5: Costing
                                        </Typography> 
                                        <Typography variant='body1' gutterBottom>
                                            ADA Amount
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_costing?.ada_amount || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            ADA to USD Conversion Rate
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_costing?.ada_to_usd_conversion_rate || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Preferred currency
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_costing?.preferred_currency || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Amount in preferred currency
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_costing?.amount_in_preferred_currency || ''}
                                        </Typography>
                                        <Typography variant='body1' gutterBottom>
                                            Cost breakdown
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.budget_discussion_costing?.cost_breakdown || ''}
                                        </Typography>
                                    </Box>
                                    <Box sx={{align: "left"}} >
                                        <Typography variant='h4' gutterBottom sx={{align:"left"}}>
                                            Section 6: Further information
                                        </Typography> 
                                        <Typography variant='body1' gutterBottom>
                                            Supporting links
                                        </Typography>
                                        <Typography sx={{display: 'flex', flexDirection: 'column',gap:"8px" }}>
                                        {currentBudgetDiscussionData.budget_discussion_further_information?.proposal_links?.map((link, index) => (
                                            <Link 
                                                key={index}
                                                href={link.prop_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                >
                                                {link.prop_link_text}
                                            </Link>

                                        ),)
                                        }
                                        </Typography>
                                    </Box>
                                    <Box sx={{align: "left"}} >
                                        <Typography variant='h4' gutterBottom sx={{align:"left"}}>
                                            Section 7: Administration and Auditing
                                        </Typography> 
                                    
                                        <Typography variant='body1' gutterBottom>
                                            Would you like Intersect to be your named Administrator, including acting as the auditor, as per the Cardano Constitution?*
                                        </Typography>
                                        <Typography gutterBottom>
                                            {currentBudgetDiscussionData?.itersect_named_administrator || ''}
                                        </Typography>
                                    </Box>
                                </Box>
                            <StepperActionButtons onClose={onClose} onSaveDraft={handleSaveDraft} onContinue={submitBudgetDiscussion} continueText="Submit"
                                   onBack={setStep} selectedDraftId={selectedDraftId} nextStep={step+1} backStep={step-1}
                            />
                        </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
export default BudgetDiscussionReview;
