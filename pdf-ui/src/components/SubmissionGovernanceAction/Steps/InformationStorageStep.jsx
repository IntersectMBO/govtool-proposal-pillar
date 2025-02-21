'use client';

import React, { useState, useEffect } from 'react';

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
    IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/context';
import {
    CheckingDataModal,
    ExternalDataNotMatchModal,
    UrlErrorModal,
    CancelRegistrationModal,
    GovernanceActionSubmittedModal,
    InsufficientBallanceModal,
} from '../../../components/SubmissionGovernanceAction';
import { updateProposalContent } from '../../../lib/api';
import {
    isValidURLFormat,
    isValidURLLength,
    openInNewTab,
} from '../../../lib/utils';
import { IconExternalLink } from '@intersect.mbo/intersectmbo.org-icons-set';
import { useTheme } from '@emotion/react';

const InformationStorageStep = ({ proposal, handleCloseSubmissionDialog }) => {
   
    const theme = useTheme();
    const navigate = useNavigate();
    const { walletAPI, validateMetadata } = useAppContext();
    const [jsonLdData, setJsonLdData] = useState({});
    const [hashData, setHashData] = useState('');
    const [fileURL, setFileURL] = useState('');

    const [showCheckingDataModal, setCheckingDataModal] = useState(false);
    const [showExternalDataNotMatchModal, setShowExternalDataNotMatchModal] =
        useState(false);
    const [showUrlErrorModal, setShowUrlErrorModal] = useState(false);
    const [showCancelRegistrationModal, setShowCancelRegistrationModal] =
        useState(false);
    const [
        showGovernanceActionSubmittedModal,
        setShowGovernanceActionSubmittedModal,
    ] = useState(false);

    const [showInsufficientBallanceModal, setShowInsufficientBallanceModal] =
        useState(false);

    const [urlError, setUrlError] = useState('');

    const handleURLChange = (url) => {
        setFileURL(url);

        if (!url?.length) {
            return setUrlError('');
        }

        let errorMessage = '';

        if (!isValidURLFormat(url)) {
            errorMessage = 'Invalid URL';
        } else {
            const lengthValidation = isValidURLLength(url);
            if (lengthValidation !== true) {
                errorMessage = lengthValidation;
            }
        }

        setUrlError(errorMessage);
    };
    const openGuideAboutStoringInformation = () =>
        openInNewTab(
            'https://docs.gov.tools/using-govtool/govtool-functions/storing-information-offline'
        );

    const handleCreateGAJsonLD = async () => {
        const referencesList = [];

        if (
            proposal?.attributes?.content?.attributes?.proposal_links?.length >
            0
        ) {
            proposal?.attributes?.content?.attributes?.proposal_links?.map(
                (reference) => {
                    referencesList.push({
                        label: reference?.prop_link_text || 'Label',
                        uri: reference?.prop_link,
                    });
                }
            );
        }

        const jsonLd = await walletAPI.createGovernanceActionJsonLD({
            title: proposal?.attributes?.content?.attributes?.prop_name,
            abstract: proposal?.attributes?.content?.attributes?.prop_abstract,
            motivation:
                proposal?.attributes?.content?.attributes?.prop_motivation,
            rationale:
                proposal?.attributes?.content?.attributes?.prop_rationale,
            references: referencesList,
        });

        if (!jsonLd) return;
        setJsonLdData(jsonLd);
        const hash = await walletAPI.createHash(jsonLd);
        setHashData(hash);
    };
    const proposalGATypeId= proposal?.attributes?.content?.attributes.gov_action_type_id;
    const handleGASubmission = async () => {
        try {
            setCheckingDataModal(true);
            const response = await validateMetadata({
                url: fileURL,
                hash: hashData,
                standard: 'CIP108',
            });

            if (response?.valid) {
                let govActionBuilder = null;
                if (parseInt(proposalGATypeId) === 1) {
                    govActionBuilder =
                        await walletAPI.buildNewInfoGovernanceAction({
                            hash: hashData,
                            url: fileURL,
                        });
                } else if (parseInt(proposalGATypeId) === 2) {
                    govActionBuilder =
                        await walletAPI.buildTreasuryGovernanceAction({
                            hash: hashData,
                            url: fileURL,
                            withdrawals: getWithdrawalsArray()
                        });
                }
                else if (parseInt(proposalGATypeId) === 3)
                {
                    const constitUrl = proposal?.attributes?.content?.attributes.proposal_constitution_content.data.attributes.prop_constitution_url;   
                    const constiUrlHash = await getHashFromUrl(constitUrl);
                    govActionBuilder =
                    await walletAPI.buildNewConstitutionGovernanceAction({
                        hash: hashData,
                        url: fileURL,
                        constitutionUrl: constitUrl,
                        constitutionHash: constiUrlHash
                    //prevGovernanceActionHash: string;
                    //prevGovernanceActionIndex: number;
                    //scriptHash: string;
                    });
                }
                else if(parseInt(proposalGATypeId) === 4)
                { ///Motion of No Confidence
                    govActionBuilder =
                        await walletAPI.buildNoConfidenceGovernanceAction({
                            hash: hashData,
                            url: fileURL,
                        });
                }


                if (govActionBuilder) {
                    const tx = await walletAPI.buildSignSubmitConwayCertTx({
                        govActionBuilder: govActionBuilder,
                        type: 'createGovAction',
                    });

                    if (tx) {
                        await updateProposalContent(
                            proposal?.attributes?.content?.id,
                            {
                                prop_submitted: true,
                                prop_submission_date: new Date(),
                                prop_submission_tx_hash: tx,
                            }
                        );
                        setShowGovernanceActionSubmittedModal(true);
                    }
                }
            } else {
                console.error(response);
                if (response?.status === 'URL_NOT_FOUND') {
                    setShowUrlErrorModal(true);
                } else {
                    setShowExternalDataNotMatchModal(true);
                }
            }
        } catch (error) {
            console.error(error);
            if (error?.includes('Insufficient')) {
                setShowInsufficientBallanceModal(true);
            }
        } finally {
            setCheckingDataModal(false);
        }
    };

    const getWithdrawalsArray = () => {
        let withdrawalsArray = [];
        let x = proposal?.attributes?.content?.attributes?.proposal_withdrawals.forEach((withdrawal) =>
        {
            withdrawalsArray.push({receivingAddress:withdrawal.prop_receiving_address,amount:withdrawal.prop_amount.toString()})
        });
        return withdrawalsArray;
    }

    const handleDownloadJsonLD = () => {
        const blob = new Blob([JSON.stringify(jsonLdData, null, 2)], {
            type: 'application/ld+json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.jsonld';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    async function getHashFromUrl(url) {
        try {
            if (!url) {
                throw new Error('url is not defined or null');
            }
            // Fetch the data from the URL
            const response = (await fetch(url,{'User-Agent': "govtool-agent"}));
            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Read the text content from the response
            const content = await response.text();
            // Create a hash from the fetched content
            const urlHash = await walletAPI.createHash(content);
            return urlHash;
        } catch (error) {
            console.error('Error fetching or hashing the content:', error);
            throw error; // Re-throw the error if you want to handle it further up the call stack
        }
    }

    useEffect(() => {
        if (proposal && walletAPI) {
            handleCreateGAJsonLD();
        }
    }, [walletAPI, proposal]);

    return (
        <Box
            display='flex'
            flexDirection='column'
            data-testid='information-storage-step'
        >
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
                            mt: {
                                xs: 0,
                                sm: 2,
                                md: 2,
                                lg: 3,
                            },
                            mb: {
                                xs: 0,
                                sm: 2,
                                md: 2,
                                lg: 3,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                mt: 2,
                            }}
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'center'}
                        >
                            <Typography variant='h4' component={'h2'}>
                                Information Storage Steps
                            </Typography>

                            <Button
                                variant='text'
                                endIcon={
                                    <IconExternalLink
                                        width={20}
                                        height={20}
                                        fill={theme.palette.primary.main}
                                    />
                                }
                                onClick={openGuideAboutStoringInformation}
                            >
                                <Typography variant='body1'>
                                    Read full guide
                                </Typography>
                            </Button>

                            <Typography variant='body1' textAlign={'center'}>
                                Download your file, save it to your chosen
                                location, and enter the URL of that location in
                                step 3
                            </Typography>

                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                sx={{
                                    width: '100%',
                                }}
                                my={2}
                            >
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    gap={3}
                                >
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            borderRadius: '100%',
                                            boxShadow: `2px 2px 20px 0px rgba(47, 98, 220, 0.2)`,
                                            display: 'flex',
                                            height: 54,
                                            justifyContent: 'center',
                                            width: 54,
                                        }}
                                    >
                                        <Typography
                                            color='primary'
                                            variant='h6'
                                            component={'span'}
                                        >
                                            1
                                        </Typography>
                                    </Box>
                                    <Typography variant='body1'>
                                        Download this file
                                    </Typography>
                                </Box>

                                <Button
                                    variant='outlined'
                                    sx={{ ml: 2 }}
                                    onClick={() => handleDownloadJsonLD()}
                                    data-testid='download-button'
                                >
                                    data.jsonld
                                </Button>
                            </Box>

                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                sx={{
                                    width: '100%',
                                }}
                                mb={2}
                            >
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    gap={3}
                                >
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            borderRadius: '100%',
                                            boxShadow: `2px 2px 20px 0px rgba(47, 98, 220, 0.2)`,
                                            display: 'flex',
                                            height: 54,
                                            justifyContent: 'center',
                                            width: 54,
                                        }}
                                    >
                                        <Typography
                                            color='primary'
                                            variant='h6'
                                            component={'span'}
                                            fontWeight={400}
                                        >
                                            2
                                        </Typography>
                                    </Box>
                                    <Typography variant='body1'>
                                        Save this file in a location that
                                        provides a public URL (ex. github)
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                display={'flex'}
                                flexDirection={'column'}
                                sx={{
                                    width: '100%',
                                }}
                            >
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    gap={3}
                                >
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            borderRadius: '100%',
                                            boxShadow: `2px 2px 20px 0px rgba(47, 98, 220, 0.2)`,
                                            display: 'flex',
                                            height: 54,
                                            justifyContent: 'center',
                                            width: 54,
                                            minHeight: 54,
                                            minWidth: 54,
                                        }}
                                    >
                                        <Typography
                                            color='primary'
                                            variant='h6'
                                            component={'span'}
                                        >
                                            3
                                        </Typography>
                                    </Box>
                                    <Box
                                        display={'flex'}
                                        flexDirection={'column'}
                                        sx={{ width: '100%' }}
                                    >
                                        <Typography variant='body1'>
                                            Paste the URL here
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            margin='normal'
                                            label='URL'
                                            variant='outlined'
                                            placeholder='URL'
                                            value={fileURL || ''}
                                            inputProps={{
                                                'data-testid': 'url-input',
                                            }}
                                            onChange={(e) =>
                                                handleURLChange(e.target.value)
                                            }
                                            error={!!urlError}
                                            FormHelperTextProps={{
                                                'data-testid': urlError
                                                    ? 'url-input-error-text'
                                                    : 'required-url-input-text',
                                            }}
                                            helperText={urlError || 'Required'}
                                            required
                                            sx={{
                                                mt: 1,
                                                mb: 0,
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 4,
                            }}
                        >
                            <Button
                                variant='outlined'
                                sx={{ float: 'left' }}
                                onClick={() => navigate(-1)}
                                data-testid='cancel-button'
                            >
                                Cancel
                            </Button>
                            <Button
                                variant='contained'
                                onClick={handleGASubmission}
                                disabled={!fileURL || urlError?.length > 0}
                                data-testid='submit-button'
                            >
                                Submit
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <CheckingDataModal open={showCheckingDataModal} />
            <ExternalDataNotMatchModal
                open={showExternalDataNotMatchModal}
                onClose={() => setShowExternalDataNotMatchModal(false)}
                buttonOneClick={handleCloseSubmissionDialog}
                buttonTwoClick={() => {
                    setShowExternalDataNotMatchModal(false);
                    setShowCancelRegistrationModal(true);
                }}
            />
            <UrlErrorModal
                open={showUrlErrorModal}
                onClose={() => setShowUrlErrorModal(false)}
                buttonOneClick={handleCloseSubmissionDialog}
                buttonTwoClick={() => {
                    setShowUrlErrorModal(false);
                    setShowCancelRegistrationModal(true);
                }}
            />

            <CancelRegistrationModal
                open={showCancelRegistrationModal}
                onClose={() => setShowCancelRegistrationModal(false)}
            />

            <GovernanceActionSubmittedModal
                open={showGovernanceActionSubmittedModal}
                onClose={() => setShowGovernanceActionSubmittedModal(false)}
            />

            <InsufficientBallanceModal
                open={showInsufficientBallanceModal}
                onClose={() => setShowInsufficientBallanceModal(false)}
                buttonOneClick={handleCloseSubmissionDialog}
            />
        </Box>
    );
};

export default InformationStorageStep;
