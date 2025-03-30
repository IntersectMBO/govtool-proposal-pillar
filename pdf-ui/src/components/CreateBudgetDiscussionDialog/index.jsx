import { useTheme } from '@emotion/react';
import { IconCheveronLeft } from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Button,
    Grid,
    Dialog,
    Typography,
    Box,
    useMediaQuery,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DraftSuccessfulBudgetDiscussionModal, ProblemStatementsAndProposalBenefits, ContractInformation, ProposalOwnership, 
         ProposalDetails, Costing, FurtherInformation, AdministrationAndAuditing, BudgetDiscussionSubmit, 
         BudgetDiscussionReview} from '../BudgetDiscussionParts';
import { createBudgetDiscussionDraft, updateBudgetDiscussionDraft,createBudgetDiscussion } from '../../lib/api';
import { useAppContext } from '../../context/context';
import { useLocation } from 'react-router-dom';
import BudgetDiscussionInfo from '../BudgetDiscussionParts/BudgetDiscussionInfo';

const CreateBudgetDiscussionDialog = ({ open = false, onClose = false }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const {user, walletAPI, setOpenUsernameModal, setUser, clearStates , getVotingPower ,setLoading } = useAppContext();
    const [step, setStep] = useState(1);
    const [budgetDiscussionData, setBudgetDiscussionData] = useState({
        bd_contact_information:{},
        bd_proposal_ownership: {},
        bd_psapb:{},
        bd_proposal_detail:{},
        bd_costing:{},
        bd_further_information:{}
    });

    // const [isContinueDisabled, setIsContinueDisabled] = useState(true);
    
    const [showDraftSuccessfulBudgetDiscussionModal, setShowDraftSuccessfulBudgetDiscussionModal] = useState(false);
    const [selectedDraftId, setSelectedDraftId] = useState(null);

    const [errors, setErrors] = useState({});
    // const [helperText, setHelperText] = useState({});
    const isSmallScreen = useMediaQuery((theme) =>
        theme.breakpoints.down('sm')
    );

    const closeCreateBDDialog = () => {
        onClose();
        if (location.pathname.includes('propose'))
            navigate('/proposal_discussion/budget_discussion'); 
    }

    const handleSaveDraft = async () => {
        try {
            let draftId;
            if(selectedDraftId == null) {
                draftId = await createBudgetDiscussionDraft(budgetDiscussionData);
                setSelectedDraftId(draftId.data.id);
            } else {
                draftId = await updateBudgetDiscussionDraft(budgetDiscussionData, selectedDraftId);
                alert(`Draft version updated ID: ${draftId.data.id}`);
            }
        } catch (error) {
            console.error('Error while saving draft:', error);
        }
    };

    const handleDeleteProposal = async () => {
        setLoading(true);
        try {
           // await deleteProposal(selectedDraftId);
        } catch (error) {
            console.error('Failed to delete proposal:', error);
        } finally {
            setLoading(false);
        }
    };
    const  hasAnyNonEmptyString = (obj) => {
      if (typeof obj === 'string') {
             return obj.trim() !== '';
        }
      if (typeof obj !== 'object' || obj === null) {
        return false;
        }
      if (Array.isArray(obj)) {
        return obj.some(item => hasAnyNonEmptyString(item));
        }

        return Object.values(obj).some(value => hasAnyNonEmptyString(value));
      }

    const handleIsContinueDisabled = useCallback(() => { 

    }
    , [ errors ]); 

    const handleCreateBudgetDiscussion = async (isDraft = false) => {
             setLoading(true);
        try {
                const newBD = await createBudgetDiscussion(budgetDiscussionData);
                navigate(
                     `/proposal_discussion/budget_discussion/${newBD.id}`
                 );
            // if (
            //     !(
            //         budgetDiscussionData?.proposal_id &&
            //         budgetDiscussionData?.proposal_content_id
            //     )
            // ) {
            //     const { data } = await createProposal({
            //         ...budgetDiscussionData,
            //         is_draft: isDraft,
            //     });
            //     if (data && data?.attributes && data?.attributes?.proposal_id) {
            //         if (isDraft) {
            //             setShowDraftSuccessfulModal(true);
            //         } else {
            //             navigate(
            //                 `/proposal_discussion/${data?.attributes?.proposal_id}`
            //             );
            //         }

            //         if (selectedDraftId) {
            //             handleDeleteProposal();
            //         }
            //     }

            //     return data?.attributes?.proposal_id;
            //}
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const validateSection = (section) => {
        const validationResult = validateProposal({[section]: budgetDiscussionData[section]}, section);
        setErrors(validationResult||{});
    }

    function validateProposal(proposal, sectionsToValidate = null) {

            const validationRules = {
                "bd_psapb": {
                    "type_name": { required: true, type: 'number' },
                    "roadmap_name": { required: true, type: 'number' },
                    "committee_name": { required: true, type: 'number' },
                    "proposal_benefit": { required: true, type: 'string' },
                    "problem_statement": { required: true, type: 'string' },
                    "supplementary_endorsement": { required: true, type: 'string' },
                    "explain_proposal_roadmap": { required: budgetDiscussionData.bd_psapb.roadmap_name === 11, type: 'string' }
                },
                "bd_costing": {
                    "ada_amount": { required: true, type: 'numberString' },
                    "cost_breakdown": { required: true, type: 'string' },
                    "preferred_currency": { required: true, type: 'number' },
                    "usd_to_ada_conversion_rate": { required: true, type: 'numberString' },
                    "amount_in_preferred_currency": { required: true, type: 'numberString' }
                },
                "privacy_policy": { required: true, type: 'boolean' },
                "bd_proposal_detail": {
                    "experience": { required: true, type: 'string' },
                    "proposal_name": { required: true, type: 'string' },
                    "key_dependencies": { required: true, type: 'string' },
                    "contract_type_name": { required: true, type: 'number' },
                    "maintain_and_support": { required: true, type: 'string' },
                    "proposal_description": { required: true, type: 'string' },
                    "key_proposal_deliverables": { required: true, type: 'string' },
                    "resourcing_duration_estimates": { required: true, type: 'string' },
                    "other_contract_type":{ required: budgetDiscussionData.bd_proposal_detail.contract_type_name === 6, type: 'string' }
                },
                "bd_proposal_ownership": {
                    "agreed": { required: true, type: 'boolean' },
                    "be_country": { required: budgetDiscussionData.bd_proposal_ownership.submited_on_behalf === 'Company',  type: 'number' },
                    "group_name": { required: budgetDiscussionData.bd_proposal_ownership.submited_on_behalf === 'Group', type: 'string' },
                    "company_name": { required: budgetDiscussionData.bd_proposal_ownership.submited_on_behalf === 'Company', type: 'string' },
                    "type_of_group": { required: budgetDiscussionData.bd_proposal_ownership.submited_on_behalf === 'Group', type: 'string' },
                    "social_handles": { required: true, type: 'string' },
                    "submited_on_behalf": { required: true, type: 'string' },
                    "company_domain_name": { required: budgetDiscussionData.bd_proposal_ownership.submited_on_behalf === 'Company', type: 'string' },
                    "proposal_public_champion": { required: true, type: 'string' },
                    "key_info_to_identify_group": { required: budgetDiscussionData.bd_proposal_ownership.submited_on_behalf === 'Group', type: 'string' }
                },
                "bd_contact_information": {
                    "be_email": { required: true, type: 'email' },
                    "be_full_name": { required: true, type: 'string' },
                    "be_nationality": { required: true, type: 'number' },
                    "be_country_of_res": { required: true, type: 'number' },
                    "submission_lead_email": { required: true, type: 'email' },
                    "submission_lead_full_name": { required: true, type: 'string' }
                },
                // "bd_further_information": {
                //     "proposal_links": { 
                //         required: true, 
                //         type: 'array',
                //         itemValidation: {
                //             "prop_link": { required: true, type: 'url' },
                //             "prop_link_text": { required: true, type: 'string' }
                //         }
                //     }
                // },
                "intersect_named_administrator": { required: true, type: 'boolean' }
            };
        
            function isEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(String(email).toLowerCase());
            }
        
            function isURL(str) {
                try {
                    new URL(str);
                    return true;
                } catch (_) {
                    return false;
                }
            }
        
            function isNumberString(str) {
                return !isNaN(str) && !isNaN(parseFloat(str));
            }
        
            function validateSection(section, rules, path = '') {
                const errors = {};
                
                for (const [field, rule] of Object.entries(rules)) {
                    const fullFieldPath = path ? `${path}.${field}` : field;
                    
                    if (rule.required && (section[field] === undefined || section[field] === null)) {
                        errors[fullFieldPath] = 'Required field is missing';
                        continue;
                    }
                    
                    if (!rule.required && (section[field] === undefined || section[field] === null || section[field] === '')) {
                        continue;
                    }
                    let isValid = true;
                    switch (rule.type) {
                        case 'string':
                            isValid = typeof section[field] === 'string' && section[field].trim() !== '';
                            break;
                        case 'number':
                            isValid = typeof section[field] === 'number';
                            break;
                        case 'numberString':
                            isValid = isNumberString(section[field]);
                            break;
                        case 'boolean':
                            isValid = typeof section[field] === 'boolean';
                            break;
                        case 'email':
                            isValid = typeof section[field] === 'string' && isEmail(section[field]);
                            break;
                        case 'url':
                            isValid = typeof section[field] === 'string' && isURL(section[field]);
                            break;
                        case 'array':
                            if (!Array.isArray(section[field])) {
                                isValid = false;
                            } else if (rule.itemValidation) {
                                // Validacija svakog elementa niza
                                for (let i = 0; i < section[field].length; i++) {
                                    const itemErrors = validateSection(section[field][i], rule.itemValidation, `${fullFieldPath}[${i}]`);
                                    Object.assign(errors, itemErrors);
                                }
                                continue;
                            }
                            break;
                        default:
                            isValid = true;
                    }
                    
                    if (!isValid) {
                        errors[fullFieldPath] = `Field should be a valid ${rule.type}`;
                    }
                }
                
                return errors;
            }
            const sections = sectionsToValidate 
            ? Array.isArray(sectionsToValidate) 
                ? sectionsToValidate 
                : [sectionsToValidate]
            : Object.keys(validationRules);
    
            const allErrors = {};
            
            for (const sectionName of sections) {
                const rules = validationRules[sectionName];
                if (!rules) continue;         
                if (!proposal[sectionName]) {
                    if (rules.required) {
                        allErrors[sectionName] = 'Required section is missingaaa';
                    }
                    continue;
                }
                
                const sectionErrors = validateSection(proposal[sectionName], rules, sectionName);
                Object.assign(allErrors, sectionErrors);
            }
        
            return Object.keys(allErrors).length === 0 ? null : allErrors;
    }
    console.log(walletAPI) 
    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            data-testid='create-budget-discussion-dialog'
        >
            <Box
                sx={{
                    position: 'relative',
                    height: '100%',
                }}
            >
                <Grid container pb={4}>
                    { //?.voter?.isRegisteredAsDRep?
                    true?(

                    <Grid
                        item
                        sx={{
                            borderBottom: `1px solid ${theme.palette.border.gray}`,
                            pl: 4,
                            mt: 2,
                        }}
                        xs={12}
                    >
                        <Typography variant='h4' component='h1' gutterBottom>
                            Propose a Budget Discussion
                        </Typography>
                    </Grid>):''}
                    <Grid item my={2} pl={4} xs={12} zIndex={10}>
                        <Button
                            size='small'
                            startIcon={
                                <IconCheveronLeft
                                    width='18'
                                    height='18'
                                    fill={theme.palette.primary.main}
                                />
                            }
                            onClick={() => {
                                onClose();
                                if (location.pathname.includes('propose')) {
                                    navigate('/proposal_discussion/budget_discussion');
                                }
                            }}
                            data-testid='show-all-button'
                        >
                            Show all
                        </Button>
                    </Grid>
                    <Grid
                        xs={12}
                        item
                        display='flex'
                        justifyContent='center'
                        alignContent='center'
                        pt={4}
                    >
                        <Grid xs={11} md={8} item zIndex={10}>
                            {step === 1 && (
                                <BudgetDiscussionInfo
                                    setStep={setStep}
                                    step={step}
                                    onClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    selectedDraftId={selectedDraftId}
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                />
                            )}
                            {step === 2 && (
                                <ContractInformation
                                    setStep={setStep}
                                    step={step}
                                    onClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateSection={validateSection}
                                />
                            )}
                            {step === 3 && (
                                <ProposalOwnership
                                    setStep={setStep}
                                    step={step}
                                    onClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateSection={validateSection}
                                />
                            )}
                            {step === 4 && (
                               <ProblemStatementsAndProposalBenefits
                                    setStep={setStep}
                                    step={step}
                                    onClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateSection={validateSection}
                                />
                            )}
                            {step === 5 && (
                                <ProposalDetails
                                    setStep={setStep}
                                    step={step}
                                    onClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateSection={validateSection}
                                 />
                            )}
                            {step === 6 && (
                                <Costing
                                    setStep={setStep}
                                    step={step}
                                    onClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateSection={validateSection}
                                />
                            )}
                            {step === 7 && (
                               <FurtherInformation
                                    setStep={setStep}
                                    step={step}
                                    onClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateSection={validateSection}
                                />
                            )}
                            {step === 8 && (
                                <AdministrationAndAuditing
                                    setStep={setStep}
                                    step={step}
                                    onClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateSection={validateSection}
                                />
                            )}
                            {step === 9 && (
                                <BudgetDiscussionSubmit
                                    setStep={setStep}
                                    step={step}
                                    onClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateSection={validateSection}
                                />
                            )}
                            {step === 10 && (
                                <BudgetDiscussionReview
                                setStep={setStep}
                                    step={step}
                                    onClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    submitBudgetDiscussion={handleCreateBudgetDiscussion}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateSection={validateSection}
                                />
                            )}  
                        </Grid>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                    }}
                >
                </Box>
            </Box>

            <DraftSuccessfulBudgetDiscussionModal
                open={showDraftSuccessfulBudgetDiscussionModal}
                onClose={() => setShowDraftSuccessfulBudgetDiscussionModal(false)}
                closeCreateBDDialog={onClose}
            />
        </Dialog>
    );
};

export default CreateBudgetDiscussionDialog;
