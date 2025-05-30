import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { UNSAFE_ErrorResponseImpl } from 'react-router-dom';

const StepperActionButtons = ({
    onClose,
    onSaveDraft = () => {},
    onContinue,
    onBack = () => {},
    selectedDraftId = null,
    nextStep = 0,
    backStep,
    showCancel = true,
    showSaveDraft = true,
    showContinue = true,
    showBack = true,
    cancelText = 'Cancel',
    saveDraftText = 'Save Draft',
    continueText = 'Continue',
    backText = 'Back',
    errors,
}) => {
    console.log('🚀 ~ errors:', errors);
    // Calculate backStep if not provided
    const calculatedBackStep = backStep !== undefined ? backStep : nextStep - 2;
    const [continueDisabled, setContinueDisabled] = useState(false);
    const [draftDisabled, setDraftDisabled] = useState(false);

    const hasAnyNonEmptyString = (obj) => {
        if (typeof obj === 'string') {
            return obj.trim() !== '';
        }
        if (typeof obj !== 'object' || obj === null) {
            return false;
        }
        if (Array.isArray(obj)) {
            return obj.some((item) => hasAnyNonEmptyString(item));
        }
        return Object.values(obj).some((value) => hasAnyNonEmptyString(value));
    };

    useEffect(() => {
        setContinueDisabled(hasAnyNonEmptyString(errors));

        setDraftDisabled(
            !!(
                errors &&
                errors.linkErrors &&
                (errors.linkErrors[0]?.url || errors.linkErrors[0]?.text)
            )
        );
    }, [errors, continueDisabled]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Box>
                {continueDisabled}
                {showCancel && (
                    <Button
                        variant='outlined'
                        sx={{ mr: 1 }}
                        onClick={onClose}
                        data-testid='cancel-button'
                    >
                        {cancelText}
                    </Button>
                )}
                {showBack && (
                    <Button
                        variant='outlined'
                        onClick={() => onBack(calculatedBackStep)}
                        data-testid='back-button'
                    >
                        {backText}
                    </Button>
                )}
            </Box>

            <Box>
                {showSaveDraft && (
                    <Button
                        variant='outlined'
                        sx={{ mr: 1 }}
                        disabled={draftDisabled}
                        onClick={() => onSaveDraft(selectedDraftId)}
                        data-testid='draft-button'
                    >
                        {saveDraftText}
                    </Button>
                )}
                {showContinue && (
                    <Button
                        variant='contained'
                        disabled={continueDisabled}
                        onClick={() => onContinue(nextStep)}
                        data-testid={
                            continueText === 'Continue'
                                ? 'continue-button'
                                : 'submit-button'
                        }
                    >
                        {continueText}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

StepperActionButtons.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSaveDraft: PropTypes.func,
    onContinue: PropTypes.func.isRequired,
    onBack: PropTypes.func,
    selectedDraftId: PropTypes.any,
    nextStep: PropTypes.number,
    backStep: PropTypes.number,
    showCancel: PropTypes.bool,
    showSaveDraft: PropTypes.bool,
    showContinue: PropTypes.bool,
    showBack: PropTypes.bool,
    cancelText: PropTypes.string,
    saveDraftText: PropTypes.string,
    continueText: PropTypes.string,
    backText: PropTypes.string,
    errors: PropTypes.object,
};

export default StepperActionButtons;
