import { useTheme } from '@emotion/react';
import {
    IconExclamation,
    IconX,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Box,
    Button,
    IconButton,
    Link,
    Modal,
    Typography,
} from '@mui/material';
import React from 'react';
import { openInNewTab } from '../../../lib/utils';

const UrlErrorModal = ({ open, onClose, buttonOneClick, buttonTwoClick }) => {
    const theme = useTheme();
    const openLink = () =>
        openInNewTab(
            'https://docs.gov.tools/using-govtool/govtool-functions/storing-information-offline'
        );

    return (
        <Modal open={open} onClose={onClose} data-testid='url-error-modal'>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: {
                        xs: '90%',
                        sm: '50%',
                        md: '30%',
                    },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    borderRadius: '20px',
                }}
            >
                <Box
                    pt={2}
                    pl={2}
                    pr={2}
                    pb={1}
                    borderColor={(theme) => theme.palette.border.lightGray}
                >
                    <Box
                        display='flex'
                        flexDirection='row'
                        justifyContent='flex-end'
                        alignItems={'center'}
                    >
                        <IconButton
                            onClick={onClose}
                            data-testid='url-error-modal-close-button'
                        >
                            <IconX width='24px' height='24px' />
                        </IconButton>
                    </Box>
                    <Box
                        display='flex'
                        flexDirection='row'
                        justifyContent='center'
                        alignItems={'center'}
                    >
                        <IconButton
                            sx={{
                                ':disabled': {
                                    backgroundColor: (theme) =>
                                        theme?.palette?.iconButton?.error_50,
                                },
                                width: '100px',
                                height: '100px',
                            }}
                            disabled
                        >
                            <IconExclamation
                                width='54px'
                                height='54px'
                                fill={theme?.palette?.iconButton?.error_200}
                            />
                        </IconButton>
                    </Box>
                    <Typography
                        id='url-error-modal-title'
                        data-testid='url-error-modal-title'
                        mt={2}
                        color={(theme) => theme.palette.text.darkPurple}
                        variant='h5'
                        component={'h5'}
                    >
                        The URL You Entered Cannot be Found
                    </Typography>
                    <Typography
                        id='url-error-modal-description'
                        data-testid='url-error-modal-description'
                        mt={2}
                        color={(theme) => theme.palette.text.darkPurple}
                        variant='body1'
                        component={'p'}
                    >
                        GovTool cannot find the URL that you entered. Please
                        check it and re-enter.
                    </Typography>
                    <Link
                        sx={{
                            color: (theme) => theme?.palette?.primary?.main,
                            mt: 2,
                        }}
                        component={'button'}
                        variant='body1'
                        onClick={openLink}
                        id='url-error-modal-learn-more-link'
                        data-testid='url-error-modal-learn-more-link'
                    >
                        Learn More about self-hosting
                    </Link>
                </Box>
                <Box display='flex' flexDirection='column' padding={2} gap={2}>
                    <Button
                        variant='contained'
                        fullWidth
                        sx={{
                            borderRadius: '20px',
                        }}
                        onClick={buttonOneClick}
                        data-testid='url-error-modal-go-to-data-button'
                    >
                        Go to Data Edit Screen
                    </Button>
                    <Button
                        variant='outlined'
                        fullWidth
                        sx={{
                            borderRadius: '20px',
                        }}
                        onClick={buttonTwoClick}
                        data-testid='url-error-modal-cancel-button'
                    >
                        Cancel registration
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default UrlErrorModal;
