import { useTheme } from '@emotion/react';
import {
    IconLink,
    IconPencil,
} from '@intersect.mbo/intersectmbo.org-icons-set';
import {
    Box,
    Button,
    Card,
    CardContent,
    Link,
    Typography,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { openInNewTab } from '../../lib/utils';

const Step3 = ({
    setStep,
    proposalData,
    governanceActionTypes,
    isSmallScreen,
    handleSaveDraft,
}) => {
    const openLink = (link) => openInNewTab(link);
    const theme = useTheme();

    return (
        <Card variant='outlined'>
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
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'justify',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            mt: 2,
                            mb: 4,
                            alignContent: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant='h4' gutterBottom>
                            Review Your Submission
                        </Typography>
                    </Box>

                    <Typography
                        variant='h5'
                        gutterBottom
                        data-testid='title-content'
                    >
                        {proposalData?.prop_name}
                    </Typography>

                    <Box>
                        <Typography
                            variant='body1'
                            color={theme.palette.text.grey}
                            gutterBottom
                        >
                            Goverance Action Type
                        </Typography>
                        <Typography
                            variant='body1'
                            gutterBottom
                            data-testid='governance-action-type-content'
                        >
                            {
                                governanceActionTypes?.find(
                                    (x) =>
                                        +x?.value ===
                                        +proposalData?.gov_action_type_id
                                )?.label
                            }
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant='body1'
                            color={theme.palette.text.grey}
                            gutterBottom
                        >
                            Abstrtact
                        </Typography>
                        <ReactMarkdown
                            components={{
                                p(props) {
                                    const { children } = props;
                                    return (
                                        <Typography
                                            variant='body1'
                                            data-testid='abstract-content'
                                            style={{
                                                wordWrap: 'break-word',
                                            }}
                                        >
                                            {children}
                                        </Typography>
                                    );
                                },
                            }}
                        >
                            {proposalData?.prop_abstract || ''}
                        </ReactMarkdown>
                    </Box>

                    <Box>
                        <Typography
                            variant='body1'
                            color={theme.palette.text.grey}
                            gutterBottom
                        >
                            Motivation
                        </Typography>
                        <ReactMarkdown
                            components={{
                                p(props) {
                                    const { children } = props;
                                    return (
                                        <Typography
                                            variant='body1'
                                            data-testid='motivation-content'
                                            style={{
                                                wordWrap: 'break-word',
                                            }}
                                        >
                                            {children}
                                        </Typography>
                                    );
                                },
                            }}
                        >
                            {proposalData?.prop_motivation || ''}
                        </ReactMarkdown>
                    </Box>

                    <Box>
                        <Typography
                            variant='body1'
                            color={theme.palette.text.grey}
                            gutterBottom
                        >
                            Rationale
                        </Typography>
                        <ReactMarkdown
                            components={{
                                p(props) {
                                    const { children } = props;
                                    return (
                                        <Typography
                                            variant='body1'
                                            data-testid='rationale-content'
                                            style={{
                                                wordWrap: 'break-word',
                                            }}
                                        >
                                            {children}
                                        </Typography>
                                    );
                                },
                            }}
                        >
                            {proposalData?.prop_rationale || ''}
                        </ReactMarkdown>
                    </Box>
                    {proposalData?.proposal_withdrawals?.map(
                                    (withdrawal, index) => (
                    <Box>
                        <Box>
                            <Typography
                                variant='body1'
                                color={theme.palette.text.grey}
                                gutterBottom
                            >
                                Receiving address
                            </Typography>
                            <Typography
                                variant='body1'
                                gutterBottom
                                data-testid={`receiving-address-${index}-content`}
                            >
                                {withdrawal.prop_receiving_address}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                variant='body1'
                                color={theme.palette.text.grey}
                                gutterBottom
                            >
                                Amount
                            </Typography>
                            <Typography
                                variant='body1'
                                gutterBottom
                                data-testid={`amount-${index}-content`}
                            >
                                {withdrawal.prop_amount}
                            </Typography>
                        </Box>
                    </Box>
                    ))}

                    {proposalData?.proposal_links?.length > 0 && (
                        <Box>
                            <Typography
                                variant='body1'
                                color={theme.palette.text.grey}
                                gutterBottom
                            >
                                Supporting links
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: isSmallScreen
                                        ? 'column'
                                        : 'row',
                                    flexWrap: 'wrap',
                                    gap: 2,
                                }}
                            >
                                {proposalData?.proposal_links?.map(
                                    (link, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                textDecoration: 'none',
                                            }}
                                            component={Button}
                                            onClick={() =>
                                                openLink(link?.prop_link)
                                            }
                                        >
                                            <Box mr={0.5}>
                                                <IconLink
                                                    fill={
                                                        theme.palette.primary
                                                            .main
                                                    }
                                                />
                                            </Box>
                                            <Typography
                                                variant='body1'
                                                component='span'
                                                data-testid={`link-${index}-text-content`}
                                            >
                                                {link?.prop_link_text}
                                            </Typography>
                                        </Box>
                                    )
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: isSmallScreen ? 'column' : 'row',
                        justifyContent: 'space-between',
                        mt: 10,
                    }}
                >
                    <Box>
                        <Button
                            variant='outlined'
                            startIcon={
                                <IconPencil fill={theme.palette.primary.main} />
                            }
                            sx={{
                                mb: {
                                    xs: 2,
                                    md: 0,
                                },
                            }}
                            fullWidth={isSmallScreen}
                            onClick={() => setStep(2)}
                            data-testid='back-to-edit-button'
                        >
                            Back to editing
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                whiteSpace: 'nowrap',
                                textTransform: 'none',
                                width: '100%',
                            }}
                        >
                            <Button
                                variant='text'
                                fullWidth
                                onClick={() => {
                                    handleSaveDraft(true);
                                }}
                                data-testid='save-draft-button'
                            >
                                Save Draft
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                width: '100%',
                            }}
                        >
                            <Button
                                variant='contained'
                                fullWidth
                                onClick={() => handleSaveDraft(false)}
                                data-testid='submit-button'
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Step3;
