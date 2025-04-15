import {
    IconX,
    IconExclamation,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Box,
    Button,
    IconButton,
    Modal,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { useAppContext } from '../../context/context';
import { updateUser } from '../../lib/api';
import { useTheme } from '@emotion/react';

const style = {
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
};

const UsernameModal = ({ open, handleClose: close, setPDFUsername }) => {
    const theme = useTheme();
    const { setUser, setOpenUsernameModal } = useAppContext();
    const [username, setUsername] = useState('');
    const [step, setStep] = useState(1);
    const [usernameError, setUsernameError] = useState('');

    const validateUsername = (username) => {
        if (username === '') {
            setUsernameError('');
            return;
        }

        const usernamePattern = /^(?=.*[a-z])[a-z0-9._]{1,30}$/;
        const invalidStartPattern = /^[._]/;

        if (
            !usernamePattern.test(username) ||
            invalidStartPattern.test(username)
        ) {
            setUsernameError(
                'Invalid username. Only lower case letters, numbers, underscores, and periods are allowed. Username must be between 1 and 30 characters, contain at least one letter and cannot start with a period or underscore.'
            );
        } else {
            setUsernameError('');
        }
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value.trim();
        setUsername(value);
        validateUsername(value);
    };

    const handleClose = (setFnToNUll = true) => {
        close();
        setStep(1);
        setUsername('');
        setUsernameError('');
        setFnToNUll
            ? setOpenUsernameModal((prev) => ({
                  ...prev,
                  callBackFn: () => {},
              }))
            : open?.callBackFn();
    };

    const handleNext = async () => {
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            try {
                const updatedUser = await updateUser({
                    govtoolUsername: username,
                });

                if (!updatedUser) return;

                setUser((currentUser) => ({
                    ...currentUser,
                    user: updatedUser,
                }));

                if (setPDFUsername) {
                    setPDFUsername(updatedUser?.govtool_username);
                }

                setStep(3);
            } catch (error) {
                setStep(4);
                setUsername('');
                console.error(error);
            }
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else if (step === 3) {
            setStep(2);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Box p={3}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant='h6' component='h3'>
                                Hey, setup your username
                            </Typography>
                            <IconButton
                                onClick={handleClose}
                                data-testid='close-user-modal'
                            >
                                <IconX width='24px' height='24px' />
                            </IconButton>
                        </Box>

                        <Typography
                            variant='body2'
                            sx={{
                                mt: 2,
                                mb: 3,
                            }}
                            color={(theme) => theme.palette.text.grey}
                        >
                            By setting up a unique username, you can submit a
                            proposal, participate in discussions, connect with
                            other members and maintains a respectful
                            environment. In the provided text field, please type
                            your desired username.
                        </Typography>

                        <TextField
                            label='Username'
                            variant='outlined'
                            sx={{
                                mb: 2,
                            }}
                            fullWidth
                            value={username || ''}
                            onChange={(e) => handleUsernameChange(e)}
                            required
                            inputProps={{
                                'data-testid': 'username-input',
                            }}
                            error={Boolean(usernameError)}
                            helperText={usernameError}
                            FormHelperTextProps={{
                                'data-testid': 'username-error-text',
                            }}
                        />
                        <Button
                            data-testid='proceed-button'
                            variant='contained'
                            fullWidth
                            disabled={
                                !Boolean(usernameError) &&
                                username?.length > 0 &&
                                username?.length <= 30
                                    ? false
                                    : true
                            }
                            onClick={handleNext}
                        >
                            Proceed with this username
                        </Button>
                    </Box>
                );
            case 2:
                return (
                    <Box p={3}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant='h6' component='h3'>
                                Are you sure you want to use "{username}"?
                            </Typography>
                            <IconButton
                                onClick={handleClose}
                                data-testid='close-user-modal'
                            >
                                <IconX width='24px' height='24px' />
                            </IconButton>
                        </Box>
                        <Typography
                            variant='body2'
                            sx={{
                                mt: 2,
                                mb: 3,
                            }}
                            color={(theme) => theme.palette.text.grey}
                        >
                            Username cannot be changed in the future. Please
                            confirm it’s correct.
                        </Typography>
                        <TextField
                            label='Username'
                            variant='outlined'
                            sx={{
                                mb: 2,
                            }}
                            fullWidth
                            value={username || ''}
                            disabled
                            inputProps={{
                                'data-testid': 'username-input',
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                            }}
                        >
                            <Button
                                variant='contained'
                                fullWidth
                                onClick={handleNext}
                                data-testid='proceed-button'
                            >
                                Proceed with this username
                            </Button>
                            <Button
                                data-testid='no-change-button'
                                variant='outlined'
                                fullWidth
                                onClick={handleBack}
                            >
                                No, Change
                            </Button>
                        </Box>
                    </Box>
                );
            case 3:
                return (
                    <>
                        <Box
                            p={3}
                            borderBottom={1}
                            borderColor={(theme) =>
                                theme.palette.border.lightGray
                            }
                        >
                            <Box
                                display='flex'
                                flexDirection='row'
                                justifyContent='space-between'
                                alignItems={'center'}
                            >
                                <Typography variant='h6' component='h3'>
                                    Username submitted!
                                </Typography>
                                <IconButton
                                    onClick={() => handleClose(false)}
                                    data-testid='close-user-modal'
                                >
                                    <IconX width='24px' height='24px' />
                                </IconButton>
                            </Box>
                        </Box>
                        <Box m={2}>
                            <Button
                                data-testid='close-button'
                                variant='contained'
                                fullWidth
                                onClick={() => handleClose(false)}
                            >
                                Close
                            </Button>
                        </Box>
                    </>
                );
            case 4:
                return (
                    <>
                        <Box
                            p={3}
                            borderBottom={1}
                            borderColor={(theme) =>
                                theme.palette.border.lightGray
                            }
                        >
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
                                                theme?.palette?.iconButton
                                                    ?.error_50,
                                        },
                                        width: '100px',
                                        height: '100px',
                                    }}
                                    disabled
                                >
                                    <IconExclamation
                                        width='54px'
                                        height='54px'
                                        fill={
                                            theme?.palette?.iconButton
                                                ?.error_200
                                        }
                                    />
                                </IconButton>
                            </Box>
                            <Typography
                                id='username-unavailable-title'
                                data-testid='username-unavailable-title'
                                mt={2}
                                color={(theme) => theme.palette.text.darkPurple}
                                variant='h5'
                                component={'h5'}
                            >
                                Username Unavailable
                            </Typography>
                            <Typography
                                id='username-unavailable-description'
                                data-testid='username-unavailable-description'
                                mt={2}
                                color={(theme) => theme.palette.text.darkPurple}
                                variant='body1'
                                component={'p'}
                            >
                                The username you entered is already taken.
                                Please choose a different one.
                            </Typography>
                        </Box>
                        <Box m={2}>
                            <Button
                                data-testid='enter-new-username-button'
                                variant='contained'
                                fullWidth
                                onClick={() => setStep(1)}
                            >
                                Enter a new username
                            </Button>
                        </Box>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Modal
            open={open?.open}
            onClose={
                step === 3 ? () => handleClose() : () => handleClose(false)
            }
            data-testid='setup-username-modal'
        >
            <Box sx={style}>{renderStep()}</Box>
        </Modal>
    );
};

export default UsernameModal;
