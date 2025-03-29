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
    const {user, setLoading } = useAppContext();
    const [step, setStep] = useState(1);
    const [budgetDiscussionData, setBudgetDiscussionData] = useState({
        bd_contact_information:{},
        bd_proposal_ownership: {},
        bd_psapb:{},
        bd_proposal_details:{},
        bd_costing:{},
        bd_further_information:{}
    });

    const [isContinueDisabled, setIsContinueDisabled] = useState(true);
    
    const [showDraftSuccessfulBudgetDiscussionModal, setShowDraftSuccessfulBudgetDiscussionModal] = useState(false);
    const [selectedDraftId, setSelectedDraftId] = useState(null);

    const [errors, setErrors] = useState({});
    const [helperText, setHelperText] = useState({});
    const isSmallScreen = useMediaQuery((theme) =>
        theme.breakpoints.down('sm')
    );

    const closeCreateBDDialog = () => {
        onClose();
        if (location.pathname.includes('propose'))
            navigate('/proposal_discussion/budget_discussion'); 
    }
    const handleClose = ()  => {
        consol.log("Handle close clicked");
    };
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

    useEffect(() => {
       // console.log('budgetDiscussionData changed thrue StateChange');
      //  console.table(budgetDiscussionData);
    }, [budgetDiscussionData]);


//     const handleDataChange = (e, dataName) => {
//         setBudgetDiscussionData({
//              ...budgetDiscussionData,
//              bd_contact_information: {
//                  ...budgetDiscussionData?.bd_contact_information,
//                  [dataName]: e.target.value
//              }})
//    };
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
     //   console.log(handleCreateBudgetDiscussion);
        setLoading(true);
        try {
                const newBD = await createBudgetDiscussion(budgetDiscussionData);
                console.log(newId);
                alert(newid);
              
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
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      };
    const validateField = (e,dataName)=>{
        setErrors({})
        if(e.target.required)
        {
            if (!e.target.value.trim()) {
                setErrors({ ...errors, [dataName]:  e.target.name +` is required`})
            } 
        }
        if (e.target.type === 'email' && !isValidEmail(e.target.value)) {
            setErrors({ ...errors, [dataName]: "Invalid email format" });
        }
        if(e.target.type === 'number' && isNaN(Number(value))) {
            setErrors({ ...errors, [dataName]: "Must be a number" });
        }
    }
    useEffect(() => {
        console.log('promenjen Error',errors);
  //      console.log(hasAnyNonEmptyString(errors));
       //  console.table(budgetDiscussionData);
     }, [errors]);
    // Use handleIsContinueDisabled in useEffect
    // useEffect(() => {
    //     handleIsContinueDisabled();
    // }, [handleIsContinueDisabled]); // Now handleIsContinueDisabled can be safely added to the dependency array

    // useEffect(() => {
    //     setProposalData((prev) => ({
    //         ...prev,
    //     }));
    // }, [user]);

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
                    </Grid>
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
                                    онClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateField={validateField}
                                />
                            )}
                            {step === 3 && (
                                <ProposalOwnership
                                    setStep={setStep}
                                    step={step}
                                    онClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateField={validateField}
                                />
                            )}
                            {step === 4 && (
                               <ProblemStatementsAndProposalBenefits
                                    setStep={setStep}
                                    step={step}
                                    онClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateField={validateField}
                                />
                            )}
                            {step === 5 && (
                                <ProposalDetails
                                    setStep={setStep}
                                    step={step}
                                    онClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateField={validateField}
                                 />
                            )}
                            {step === 6 && (
                                <Costing
                                    setStep={setStep}
                                    step={step}
                                    онClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateField={validateField}
                                />
                            )}
                            {step === 7 && (
                               <FurtherInformation
                                    setStep={setStep}
                                    step={step}
                                    онClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateField={validateField}
                                />
                            )}
                            {step === 8 && (
                                <AdministrationAndAuditing
                                    setStep={setStep}
                                    step={step}
                                    онClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateField={validateField}
                                />
                            )}
                            {step === 9 && (
                                <BudgetDiscussionSubmit
                                    setStep={setStep}
                                    step={step}
                                    онClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateField={validateField}
                                />
                            )}
                            {step === 10 && (
                                <BudgetDiscussionReview
                                setStep={setStep}
                                    step={step}
                                    онClose={() => closeCreateBDDialog()}
                                    setBudgetDiscussionData={setBudgetDiscussionData}
                                    currentBudgetDiscussionData={budgetDiscussionData}
                                    submitBudgetDiscussion={handleCreateBudgetDiscussion}
                                    errors={errors}
                                    setErrors={setErrors}                                    
                                    setSelectedDraftId={setSelectedDraftId}
                                    handleSaveDraft={handleSaveDraft}
                                    validateField={validateField}
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
