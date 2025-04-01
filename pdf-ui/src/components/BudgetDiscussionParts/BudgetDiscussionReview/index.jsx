import {
    Box,
    Card,
    CardContent,
    Button,
    Typography,
    List,
    ListItem,
    TextField,
    MenuItem,
    Grid,
    Link,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
    getAllCurrencies,
    getCountryList,
    getContractTypeList,
    getBudgetDiscussionRoadMapList,
    getBudgetDiscussionIntersectCommittee,
    getBudgetDiscussionTypes,
} from '../../../lib/api';
import { StepperActionButtons } from '../../BudgetDiscussionParts';

const BudgetDiscussionReview = ({
    setStep,
    step,
    currentBudgetDiscussionData,
    setBudgetDiscussionData,
    onClose,
    submitBudgetDiscussion,
    setSelectedDraftId,
    selectedDraftId,
    handleSaveDraft,
    errors,
    setErrors,
}) => {
    const [allCountries, setAllCountries] = useState([]);
    const [allCurrencyList, setAllCurrencyList] = useState([]);
    const [allRoadMaps, setAllRoadMaps] = useState([]);
    const [allBDTypes, setAllBDTypes] = useState([]);
    const [allCommittees, setAllCommittees] = useState([]);
    const [allContractTypeList, setAllContractTypeList] = useState([]);

    useEffect(() => {
        if (currentBudgetDiscussionData?.confidentiality === false)
            setBudgetDiscussionData({
                ...currentBudgetDiscussionData,
                ...currentBudgetDiscussionData,
                confidentiality_description: '',
            });
    }, [currentBudgetDiscussionData]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!allCountries.length) {
                    const countriesResponse = await getCountryList();
                    setAllCountries(countriesResponse?.data || []);
                }
                if (!allCurrencyList.length) {
                    const allCurrenciesResponse = await getAllCurrencies();
                    setAllCurrencyList(allCurrenciesResponse?.data || []);
                }
                if (!allRoadMaps.length) {
                    const allRoadMapsResponse =
                        await getBudgetDiscussionRoadMapList();
                    setAllRoadMaps(allRoadMapsResponse?.data || []);
                }
                if (!allBDTypes.length) {
                    const allBDTypesResponse = await getBudgetDiscussionTypes();
                    setAllBDTypes(allBDTypesResponse?.data || []);
                }
                if (!allCommittees.length) {
                    const allCommitteesResponse =
                        await getBudgetDiscussionIntersectCommittee();
                    setAllCommittees(allCommitteesResponse?.data || []);
                }
                if (!allContractTypeList.length) {
                    const allContractTypeListResponse =
                        await getContractTypeList();
                    setAllContractTypeList(
                        allContractTypeListResponse?.data || []
                    );
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
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
                            <Typography
                                variant='h4'
                                gutterBottom
                                mb={2}
                                sx={{ textAlign: 'center' }}
                            >
                                Review Your Submission
                            </Typography>
                            <Box color={(theme) => theme.palette.text.grey}>
                                <Typography
                                    variant='body1'
                                    mb={2}
                                    vv
                                    sx={{ textAlign: 'center' }}
                                >
                                    Review your proposal data before submitting
                                    it
                                </Typography>
                                <Box sx={{ align: 'left' }}>
                                    <Typography
                                        variant='h4'
                                        gutterBottom
                                        sx={{ align: 'left' }}
                                    >
                                        Section 1: Contact Information
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Beneficiary Full Name
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData
                                            ?.bd_contact_information
                                            ?.be_full_name || ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Beneficiary e-mail
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData
                                            ?.bd_contact_information
                                            ?.be_email || ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Beneficiary Country of Residence
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {allCountries.find(
                                            (country) =>
                                                country.id ===
                                                currentBudgetDiscussionData
                                                    ?.bd_contact_information
                                                    ?.be_country_of_res
                                        )?.attributes?.country_name || 'Error'}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Beneficiary Nationality
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {allCountries.find(
                                            (country) =>
                                                country.id ===
                                                currentBudgetDiscussionData
                                                    ?.bd_contact_information
                                                    ?.be_nationality
                                        )?.attributes?.country_name || 'Error'}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Submission Lead Full Name'
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData
                                            ?.bd_contact_information
                                            ?.submission_lead_full_name || ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Submission Lead Email
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData
                                            ?.bd_contact_information
                                            ?.submission_lead_email || ''}
                                    </Typography>
                                </Box>
                                <Box sx={{ align: 'left' }}>
                                    <Typography
                                        variant='h4'
                                        gutterBottom
                                        sx={{ align: 'left' }}
                                    >
                                        Section 2: Proposal Ownership
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Is this proposal being submitted on
                                        behalf of an individual (the
                                        beneficiary), company, or some other
                                        group?
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_ownership
                                                ?.submited_on_behalf
                                        }
                                    </Typography>
                                    {currentBudgetDiscussionData
                                        .bd_proposal_ownership
                                        ?.submited_on_behalf === 'Company' ? (
                                        <Box>
                                            <Typography
                                                variant='body'
                                                gutterBottom
                                            >
                                                Company Name
                                            </Typography>
                                            <Typography
                                                variant='h6'
                                                gutterBottom
                                            >
                                                {currentBudgetDiscussionData
                                                    ?.bd_proposal_ownership
                                                    ?.company_name || ''}
                                            </Typography>
                                            <Typography
                                                variant='body'
                                                gutterBottom
                                            >
                                                Company Domain Name
                                            </Typography>
                                            <Typography
                                                variant='h6'
                                                gutterBottom
                                            >
                                                {currentBudgetDiscussionData
                                                    ?.bd_proposal_ownership
                                                    ?.company_domain_name || ''}
                                            </Typography>
                                            <Typography
                                                variant='body'
                                                gutterBottom
                                            >
                                                Country of Incorporation
                                            </Typography>
                                            <Typography
                                                variant='h6'
                                                gutterBottom
                                            >
                                                {allCountries.find(
                                                    (country) =>
                                                        country.id ===
                                                        currentBudgetDiscussionData
                                                            ?.bd_proposal_ownership
                                                            ?.be_country
                                                )?.attributes?.country_name ||
                                                    'Error'}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        ''
                                    )}
                                    {currentBudgetDiscussionData
                                        .bd_proposal_ownership
                                        ?.submited_on_behalf === 'Group' ? (
                                        <Box>
                                            <Typography
                                                variant='body'
                                                gutterBottom
                                            >
                                                Group Name
                                            </Typography>
                                            <Typography
                                                variant='h6'
                                                gutterBottom
                                            >
                                                {currentBudgetDiscussionData
                                                    ?.bd_proposal_ownership
                                                    ?.group_name || ''}
                                            </Typography>
                                            <Typography
                                                variant='body'
                                                gutterBottom
                                            >
                                                Type of Group
                                            </Typography>
                                            <Typography
                                                variant='h6'
                                                gutterBottom
                                            >
                                                {currentBudgetDiscussionData
                                                    ?.bd_proposal_ownership
                                                    ?.type_of_group || ''}
                                            </Typography>
                                            <Typography
                                                variant='body'
                                                gutterBottom
                                            >
                                                Key Information to Identify
                                                Group
                                            </Typography>
                                            <Typography
                                                variant='h6'
                                                gutterBottom
                                            >
                                                {currentBudgetDiscussionData
                                                    ?.bd_proposal_ownership
                                                    ?.key_info_to_identify_group ||
                                                    ''}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        ''
                                    )}
                                    <Typography variant='body' gutterBottom>
                                        Proposal Public Champion: Who would you
                                        like to be the public proposal champion?
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData
                                            ?.bd_proposal_ownership
                                            ?.proposal_public_champion || ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        What social handles would you like to be
                                        used? E.g. Github, X
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData
                                            ?.bd_proposal_ownership
                                            ?.social_handles || ''}
                                    </Typography>
                                </Box>
                                <Box sx={{ align: 'left' }}>
                                    <Typography
                                        variant='h4'
                                        gutterBottom
                                        sx={{ align: 'left' }}
                                    >
                                        Section 3: Problem Statements and
                                        Proposal Benefits
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Problem Statement
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData?.bd_psapb
                                            ?.problem_statement || ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Proposal Benefit
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData?.bd_psapb
                                            ?.proposal_benefit || ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Does this proposal align to the Product
                                        Roadmap and Roadmap Goals?
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {allRoadMaps.find(
                                            (rm) =>
                                                rm.id ===
                                                currentBudgetDiscussionData
                                                    ?.bd_psapb?.roadmap_name
                                        )?.attributes?.roadmap_name || 'Error'}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Does your proposal align to any of the
                                        budget categories?
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {allBDTypes.find(
                                            (bt) =>
                                                bt.id ===
                                                currentBudgetDiscussionData
                                                    ?.bd_psapb?.type_name
                                        )?.attributes?.type_name || 'Error'}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Does your proposal align with any of the
                                        Intersect Committees?
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {allCommittees.find(
                                            (co) =>
                                                co.id ===
                                                currentBudgetDiscussionData
                                                    ?.bd_psapb?.committee_name
                                        )?.attributes?.committee_name ||
                                            'Error'}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        If possible provide evidence of wider
                                        community endorsement for this proposal?
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData?.bd_psapb
                                            ?.supplementary_endorsement || ''}
                                    </Typography>
                                </Box>
                                <Box sx={{ align: 'left' }}>
                                    <Typography
                                        variant='h4'
                                        gutterBottom
                                        sx={{ align: 'left' }}
                                    >
                                        Section 4: Proposal Details
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                         What is your proposed name to be used
                                        to reference this proposal publicly?
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData
                                            ?.bd_proposal_detail
                                            ?.proposal_name || ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Proposal Description
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData
                                            ?.bd_proposal_detail
                                            ?.proposal_description || ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Please list any key dependencies (if
                                        any) for this proposal?
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData
                                            ?.bd_proposal_detail
                                            ?.key_dependencies || ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        How will this proposal be maintained and
                                        supported after initial development?
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData
                                            ?.bd_proposal_detail
                                            ?.maintain_and_support || ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Key Proposal Deliverable(s) and
                                        Definition of Done: What tangible
                                        milestones or outcomes are to be
                                        delivered and what will the community
                                        ultimately receive?
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData
                                            ?.bd_proposal_detail
                                            ?.key_proposal_deliverables || ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Resourcing & Duration Estimates: Please
                                        provide estimates of team size and
                                        duration to achieve the Key Proposal
                                        Deliverables outlined above.
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData
                                            ?.bd_proposal_detail
                                            ?.resourcing_duration_estimates ||
                                            ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Experience: Please provide previous
                                        experience relevant to complete this
                                        project.
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData
                                            ?.bd_proposal_detail?.experience ||
                                            ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Contracting: Please describe how you
                                        expect to be contracted.
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {allContractTypeList.find(
                                            (co) =>
                                                co.id ===
                                                currentBudgetDiscussionData
                                                    ?.bd_proposal_detail
                                                    ?.contract_type_name
                                        )?.attributes?.contract_type_name ||
                                            'Error'}
                                    </Typography>
                                </Box>
                                <Box sx={{ align: 'left' }}>
                                    <Typography
                                        variant='h4'
                                        gutterBottom
                                        sx={{ align: 'left' }}
                                    >
                                        Section 5: Costing
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        ADA Amount
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData?.bd_costing
                                            ?.ada_amount || ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        ADA to USD Conversion Rate
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData?.bd_costing
                                            ?.usd_to_ada_conversion_rate || ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Preferred currency
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {allCurrencyList.find(
                                            (co) =>
                                                co.id ===
                                                currentBudgetDiscussionData
                                                    ?.bd_costing
                                                    ?.preferred_currency
                                        )?.attributes?.currency_letter_code ||
                                            'Error'}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Amount in preferred currency
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData?.bd_costing
                                            ?.amount_in_preferred_currency ||
                                            ''}
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Cost breakdown
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData?.bd_costing
                                            ?.cost_breakdown || ''}
                                    </Typography>
                                </Box>
                                <Box sx={{ align: 'left' }}>
                                    <Typography
                                        variant='h4'
                                        gutterBottom
                                        sx={{ align: 'left' }}
                                    >
                                        Section 6: Further information
                                    </Typography>
                                    <Typography variant='body' gutterBottom>
                                        Supporting links
                                    </Typography>
                                    <Typography
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px',
                                        }}
                                    >
                                        {currentBudgetDiscussionData.bd_further_information?.proposal_links?.map(
                                            (link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.prop_link}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                >
                                                    {link.prop_link_text}
                                                </Link>
                                            )
                                        )}
                                    </Typography>
                                </Box>
                                <Box sx={{ align: 'left' }}>
                                    <Typography
                                        variant='h4'
                                        gutterBottom
                                        sx={{ align: 'left' }}
                                    >
                                        Section 7: Administration and Auditing
                                    </Typography>

                                    <Typography variant='body' gutterBottom>
                                        Would you like Intersect to be your
                                        named Administrator, including acting as
                                        the auditor, as per the Cardano
                                        Constitution?*
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        {currentBudgetDiscussionData?.itersect_named_administrator
                                            ? 'Yes'
                                            : 'No'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <StepperActionButtons
                            onClose={onClose}
                            onSaveDraft={handleSaveDraft}
                            onContinue={submitBudgetDiscussion}
                            continueText='Submit'
                            onBack={setStep}
                            selectedDraftId={selectedDraftId}
                            nextStep={step + 1}
                            backStep={step - 1}
                        />
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};
export default BudgetDiscussionReview;
