import React from 'react';
import { Box, Button } from '@mui/material';
import PropTypes from 'prop-types';

const StepperActionButtons = ({
  onClose,
  onSaveDraft,
  onContinue,
  onBack,
  selectedDraftId,
  nextStep = 0,
  backStep,
  showCancel = true,
  showSaveDraft = true,
  showContinue = true,
  showBack = true,
  cancelText = 'Cancel',
  saveDraftText = 'Save Draft',
  continueText = 'Continue',
  backText = 'Back'
}) => {
  // Calculate backStep if not provided
  const calculatedBackStep = backStep !== undefined ? backStep : nextStep - 2;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
      <Box>
        {showCancel && (
          <Button
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={onClose}
            data-testid="cancel-button"
          >
            {cancelText}
          </Button>
        )}
        {showBack && (
          <Button
            variant="outlined"
            onClick={() => onBack(calculatedBackStep)}
            data-testid="back-button"
          >
            {backText}
          </Button>
        )}
      </Box>
      
      <Box>
        {showSaveDraft && (
          <Button
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={() => onSaveDraft(selectedDraftId)}
            data-testid="draft-button"
          >
            {saveDraftText}
          </Button>
        )}
        {showContinue && (
          <Button
            variant="contained"
            onClick={() => onContinue(nextStep)}
            data-testid="continue-button"
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
  backText: PropTypes.string
};

StepperActionButtons.defaultProps = {
  onSaveDraft: () => {},
  onBack: () => {},
  selectedDraftId: null,
  nextStep: 0,
  showCancel: true,
  showSaveDraft: true,
  showContinue: true,
  showBack: true,
  cancelText: 'Cancel',
  saveDraftText: 'Save Draft',
  continueText: 'Continue',
  backText: 'Back'
};

export default StepperActionButtons;