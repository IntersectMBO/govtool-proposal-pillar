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

    const InfoSection = ({ question, answer, answerTestId }) => {
        return (
            <Box
                sx={{
                    mb: 2,
                }}
            >
                <Typography variant='caption' gutterBottom>
                    {question}
                </Typography>
                <Typography
                    variant='body1'
                    gutterBottom
                    data-testid={answerTestId}
                    sx={{
                        mb: 2,
                    }}
                >
                    {answer || '-'}
                </Typography>
            </Box>
        );
    };

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
                                sx={{ textAlign: 'center', mb: 3 }}
                            >
                                Review Your Submission
                            </Typography>
                            <Box>
                                <Typography
                                    variant='body1'
                                    mb={2}
                                    vv
                                    sx={{ textAlign: 'center' }}
                                    color={(theme) => theme.palette.text.grey}
                                >
                                    Review your proposal data before submitting
                                    it
                                </Typography>
                                <Box sx={{ align: 'left' }}>
                                    <Typography
                                        variant='h4'
                                        gutterBottom
                                        sx={{ align: 'left', mb: 3 }}
                                    >
                                        Section 1: Contact Information
                                    </Typography>

                                    <InfoSection
                                        question='Beneficiary Full Name'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_contact_information
                                                ?.be_full_name || ''
                                        }
                                        answerTestId='beneficiary-full-name-content'
                                    />

                                    <InfoSection
                                        question='Beneficiary Country of Residence'
                                        answer={
                                            allCountries.find(
                                                (country) =>
                                                    country.id ===
                                                    currentBudgetDiscussionData
                                                        ?.bd_contact_information
                                                        ?.be_country_of_res
                                            )?.attributes?.country_name ||
                                            'Error'
                                        }
                                        answerTestId='beneficiary-country-of-residence-content'
                                    />

                                    <InfoSection
                                        question='Beneficiary Nationality'
                                        answer={
                                            allCountries.find(
                                                (country) =>
                                                    country.id ===
                                                    currentBudgetDiscussionData
                                                        ?.bd_contact_information
                                                        ?.be_nationality
                                            )?.attributes?.country_name ||
                                            'Error'
                                        }
                                        dataTestId='beneficiary-nationality-content'
                                    />

                                    <InfoSection
                                        question='Submission Lead Full Name'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_contact_information
                                                ?.submission_lead_full_name ||
                                            ''
                                        }
                                        dataTestId='submission-lead-full-name-content'
                                    />

                                    <InfoSection
                                        question='Submission Lead Email'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_contact_information
                                                ?.submission_lead_email || ''
                                        }
                                        dataTestId='submission-lead-email-content'
                                    />
                                </Box>
                                <Box sx={{ align: 'left' }}>
                                    <Typography
                                        variant='h4'
                                        gutterBottom
                                        sx={{ align: 'left', mb: 4 }}
                                    >
                                        Section 2: Proposal Ownership
                                    </Typography>

                                    <InfoSection
                                        question='Is this proposal being submitted on
                                        behalf of an individual (the
                                        beneficiary), company, or some other
                                        group?'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_ownership
                                                ?.submited_on_behalf || ''
                                        }
                                        answerTestId='submited-on-behalf-content'
                                    />

                                    {currentBudgetDiscussionData
                                        .bd_proposal_ownership
                                        ?.submited_on_behalf === 'Company' ? (
                                        <Box>
                                            <InfoSection
                                                question='Company Name'
                                                answer={
                                                    currentBudgetDiscussionData
                                                        ?.bd_proposal_ownership
                                                        ?.company_name || ''
                                                }
                                                answerTestId='company-name-content'
                                            />

                                            <InfoSection
                                                question='Company Domain Name'
                                                answer={
                                                    currentBudgetDiscussionData
                                                        ?.bd_proposal_ownership
                                                        ?.company_domain_name ||
                                                    ''
                                                }
                                                answerTestId='company-domain-name-content'
                                            />

                                            <InfoSection
                                                question='Country of Incorporation'
                                                answer={
                                                    allCountries.find(
                                                        (country) =>
                                                            country.id ===
                                                            currentBudgetDiscussionData
                                                                ?.bd_proposal_ownership
                                                                ?.be_country
                                                    )?.attributes
                                                        ?.country_name ||
                                                    'Error'
                                                }
                                                answerTestId='country-of-incorporation-content'
                                            />
                                        </Box>
                                    ) : (
                                        ''
                                    )}
                                    {currentBudgetDiscussionData
                                        .bd_proposal_ownership
                                        ?.submited_on_behalf === 'Group' ? (
                                        <Box>
                                            <InfoSection
                                                question='Group Name'
                                                answer={
                                                    currentBudgetDiscussionData
                                                        ?.bd_proposal_ownership
                                                        ?.group_name || ''
                                                }
                                                answerTestId='group-name-content'
                                            />

                                            <InfoSection
                                                question='Type of Group'
                                                answer={
                                                    currentBudgetDiscussionData
                                                        ?.bd_proposal_ownership
                                                        ?.type_of_group || ''
                                                }
                                                answerTestId='group-type-content'
                                            />

                                            <InfoSection
                                                question='Key Information to Identify
                                                Group'
                                                answer={
                                                    currentBudgetDiscussionData
                                                        ?.bd_proposal_ownership
                                                        ?.key_info_to_identify_group ||
                                                    ''
                                                }
                                                answerTestId='group-identity-information-content'
                                            />
                                        </Box>
                                    ) : (
                                        ''
                                    )}

                                    <InfoSection
                                        question='Proposal Public Champion: Who would you
                                        like to be the public proposal champion?'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_ownership
                                                ?.proposal_public_champion || ''
                                        }
                                        answerTestId='provide-preferred-content'

                                    />

                                    <InfoSection
                                        question='What social handles would you like to be
                                        used? E.g. Github, X'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_ownership
                                                ?.social_handles || ''
                                        }
                                        answerTestId='social-handles-content'
                                    />
                                </Box>
                                <Box sx={{ align: 'left' }}>
                                    <Typography
                                        variant='h4'
                                        gutterBottom
                                        sx={{ align: 'left', mb: 3 }}
                                    >
                                        Section 3: Problem Statements and
                                        Proposal Benefits
                                    </Typography>

                                    <InfoSection
                                        question='Problem Statement'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_psapb?.problem_statement ||
                                            ''
                                        }
                                        answerTestId={'problem-statement-content'}
                                    />

                                    <InfoSection
                                        question='Proposal Benefit'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_psapb?.proposal_benefit ||
                                            ''
                                        }
                                        answerTestId={'proposal-benefit-content'}
                                    />

                                    <InfoSection
                                        question='Does this proposal align to the Product
                                        Roadmap and Roadmap Goals?'
                                        answer={
                                            allRoadMaps.find(
                                                (rm) =>
                                                    rm.id ===
                                                    currentBudgetDiscussionData
                                                        ?.bd_psapb?.roadmap_name
                                            )?.attributes?.roadmap_name ||
                                            'Error'
                                        }
                                        answerTestId={'roadmap-content'}
                                    />

                                    <InfoSection
                                        question='Does your proposal align to any of the
                                        budget categories?'
                                        answer={
                                            allBDTypes.find(
                                                (bt) =>
                                                    bt.id ===
                                                    currentBudgetDiscussionData
                                                        ?.bd_psapb?.type_name
                                            )?.attributes?.type_name || 'Error'
                                        }
                                        answerTestId={'budget-category-content'}
                                    />

                                    <InfoSection
                                        question='Does your proposal align with any of the
                                        Intersect Committees?'
                                        answer={
                                            allCommittees.find(
                                                (co) =>
                                                    co.id ===
                                                    currentBudgetDiscussionData
                                                        ?.bd_psapb
                                                        ?.committee_name
                                            )?.attributes?.committee_name ||
                                            'Error'
                                        }
                                        answerTestId={'committee-content'}
                                    />

                                    <InfoSection
                                        question='If possible provide evidence of wider
                                        community endorsement for this proposal?'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_psapb
                                                ?.supplementary_endorsement ||
                                            ''
                                        }
                                        answerTestId={'endorsement-content'}
                                    />
                                </Box>
                                <Box sx={{ align: 'left' }}>
                                    <Typography
                                        variant='h4'
                                        gutterBottom
                                        sx={{ align: 'left', mb: 3 }}
                                    >
                                        Section 4: Proposal Details
                                    </Typography>

                                    <InfoSection
                                        question='What is your proposed name to be used
                                        to reference this proposal publicly?'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_detail
                                                ?.proposal_name || ''
                                        }
                                        answerTestId={'proposal-name-content'}
                                    />

                                    <InfoSection
                                        question='Proposal Description'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_detail
                                                ?.proposal_description || ''
                                        }
                                        answerTestId={'proposal-description-content'}
                                    />

                                    <InfoSection
                                        question='Please list any key dependencies (if
                                        any) for this proposal?'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_detail
                                                ?.key_dependencies || ''
                                        }
                                        answerTestId={'key-dependencies-content'}
                                    />

                                    <InfoSection
                                        question='How will this proposal be maintained and
                                        supported after initial development?'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_detail
                                                ?.maintain_and_support || ''
                                        }
                                        answerTestId={'maintain-and-support-content'}
                                    />

                                    <InfoSection
                                        question='Key Proposal Deliverable(s) and
                                        Definition of Done: What tangible
                                        milestones or outcomes are to be
                                        delivered and what will the community
                                        ultimately receive?'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_detail
                                                ?.key_proposal_deliverables ||
                                            ''
                                        }
                                        answerTestId={
                                            'key-proposal-deliverables-content'
                                        }
                                    />

                                    <InfoSection
                                        question='Resourcing & Duration Estimates: Please
                                        provide estimates of team size and
                                        duration to achieve the Key Proposal
                                        Deliverables outlined above.'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_detail
                                                ?.resourcing_duration_estimates ||
                                            ''
                                        }
                                        answerTestId={
                                            'resourcing-duration-estimates-content'
                                        }
                                    />

                                    <InfoSection
                                        question='Experience: Please provide previous
                                        experience relevant to complete this
                                        project.'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_proposal_detail
                                                ?.experience || ''
                                        }
                                        answerTestId={'experience-content'}
                                    />

                                    <InfoSection
                                        question='Contracting: Please describe how you
                                        expect to be contracted.'
                                        answer={
                                            allContractTypeList.find(
                                                (co) =>
                                                    co.id ===
                                                    currentBudgetDiscussionData
                                                        ?.bd_proposal_detail
                                                        ?.contract_type_name
                                            )?.attributes?.contract_type_name ||
                                            'Error'
                                        }
                                        answerTestId={'contracting-type-name-content'}
                                    />
                                </Box>
                                <Box sx={{ align: 'left' }}>
                                    <Typography
                                        variant='h4'
                                        gutterBottom
                                        sx={{ align: 'left', mb: 3 }}
                                    >
                                        Section 5: Costing
                                    </Typography>

                                    <InfoSection
                                        question='ADA Amount'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_costing?.ada_amount || ''
                                        }
                                        answerTestId={'ada-amount-content'}
                                    />

                                    <InfoSection
                                        question='ADA to USD Conversion Rate'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_costing
                                                ?.usd_to_ada_conversion_rate ||
                                            ''
                                        }
                                        answerTestId={
                                            'usd-to-ada-conversion-rate-content'
                                        }
                                    />

                                    <InfoSection
                                        question='Preferred currency'
                                        answer={
                                            allCurrencyList.find(
                                                (co) =>
                                                    co.id ===
                                                    currentBudgetDiscussionData
                                                        ?.bd_costing
                                                        ?.preferred_currency
                                            )?.attributes
                                                ?.currency_letter_code ||
                                            'Error'
                                        }
                                        answerTestId={
                                            'preferred-currency-content'
                                        }
                                    />

                                    <InfoSection
                                        question='Amount in preferred currency'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_costing
                                                ?.amount_in_preferred_currency ||
                                            ''
                                        }
                                        answerTestId={
                                            'amount-in-preferred-currency-content'
                                        }   
                                    />

                                    <InfoSection
                                        question='Cost breakdown'
                                        answer={
                                            currentBudgetDiscussionData
                                                ?.bd_costing?.cost_breakdown ||
                                            ''
                                        }
                                        answerTestId={
                                            'cost-breakdown-content'
                                        }
                                    />
                                </Box>
                                <Box sx={{ align: 'left' }}>
                                    <Typography
                                        variant='h4'
                                        gutterBottom
                                        sx={{ align: 'left', mb: 3 }}
                                    >
                                        Section 6: Further information
                                    </Typography>
                                    <Typography variant='body1' gutterBottom>
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
                                <Box sx={{ align: 'left', mb: 5, mt: 2 }}>
                                    <Typography
                                        variant='h4'
                                        gutterBottom
                                        sx={{ align: 'left', mb: 3 }}
                                    >
                                        Section 7: Administration and Auditing
                                    </Typography>

                                    <InfoSection
                                        question='Would you like Intersect to be your
                                        named Administrator, including acting as
                                        the auditor, as per the Cardano
                                        Constitution?'
                                        answer={
                                            currentBudgetDiscussionData?.itersect_named_administrator
                                                ? 'Yes'
                                                : 'No'
                                        }
                                        answerTestId={
                                            'intersect-named-administrator-content'
                                        }
                                    />
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
