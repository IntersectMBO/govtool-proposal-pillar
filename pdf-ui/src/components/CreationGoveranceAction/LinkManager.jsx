import { useTheme } from '@emotion/react';
import { IconPlus, IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import { Box, Button, TextField, IconButton } from '@mui/material';

import { isValidURLFormat } from '../../lib/utils';

const LinkManager = ({
    maxLinks = 7,
    proposalData,
    setProposalData,
    linksErrors,
    setLinksErrors,
}) => {
    const theme = useTheme();

    const handleLinkChange = (index, field, value) => {
        let newLinks = proposalData?.proposal_links?.map((link, i) => {
            if (i === index) {
                return { ...link, [field]: value };
            }
            return link;
        });

        setProposalData({
            ...proposalData,
            proposal_links: newLinks,
        });
        if (field === 'prop_link' && value === '') {
            return setLinksErrors((prev) => {
                const { [index]: removed, ...rest } = prev;
                return rest;
            });
        }
        if (field === 'prop_link') {
            let urlError = '';
            if (value.length > 2048) {
                urlError = 'URL must be 2048 characters or less';
            } else if (value && !isValidURLFormat(value)) {
                urlError = 'Invalid URL format';
            }
            setLinksErrors((prev) => ({
                ...prev,
                [index]: {
                    ...prev[index],
                    url: urlError,
                },
            }));
        }
        if (field === 'prop_link_text') {
            let textError = '';
            if (value.length > 255) {
                textError = 'Text must be 255 characters or less';
            }
            if (value.trim() === '') {
                textError = 'Text cannot be empty';
            }
            setLinksErrors((prev) => {
                if (textError === '') {
                    const currentErrors = prev[index] || {};
                    const { text, ...otherErrors } = currentErrors;

                    if (Object.keys(otherErrors).length === 0) {
                        const { [index]: removed, ...rest } = prev;
                        return rest;
                    } else {
                        return {
                            ...prev,
                            [index]: otherErrors,
                        };
                    }
                }
                return {
                    ...prev,
                    [index]: {
                        ...prev[index],
                        text: textError,
                    },
                };
            });
        }
    };

    const handleAddLink = () => {
        if (proposalData?.proposal_links?.length < maxLinks) {
            setProposalData({
                ...proposalData,
                proposal_links: [
                    ...proposalData?.proposal_links,
                    { prop_link: '' },
                ],
            });
        }
    };

    const handleRemoveLink = (index) => {
        let newLinks = proposalData?.proposal_links?.filter(
            (_, i) => i !== index
        );
        setProposalData({
            ...proposalData,
            proposal_links: newLinks,
        });

        // Remove errors for removed link
        setLinksErrors((prev) => {
            const { [index]: removed, ...rest } = prev;
            return rest;
        });
    };

    console.log('linksErrors', linksErrors);

    return (
        <Box>
            {proposalData?.proposal_links?.map((link, index) => (
                <Box
                    key={index}
                    display='flex'
                    flexDirection='row'
                    mb={2}
                    backgroundColor={(theme) => theme.palette.primary.lightGray}
                    position='relative'
                >
                    <Box display='flex' flexDirection='column' flexGrow={1}>
                        <Box display={'flex'} justifyContent={'flex-end'}>
                            <IconButton
                                onClick={() => handleRemoveLink(index)}
                                data-testid='link-wrapper-remove-link-button'
                            >
                                <IconX width='16px' height='16px' />
                            </IconButton>
                        </Box>
                        <Box
                            sx={{
                                paddingX: 2,
                            }}
                        >
                            <TextField
                                label={`Link #${index + 1} URL`}
                                variant='outlined'
                                fullWidth
                                value={link.prop_link || ''}
                                onChange={(e) =>
                                    handleLinkChange(
                                        index,
                                        'prop_link',
                                        e.target.value
                                    )
                                }
                                placeholder='https://website.com'
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        '& fieldset': {
                                            borderColor: `${theme.palette.border.lightGray}`,
                                        },
                                    },
                                }}
                                inputProps={{
                                    'data-testid': `link-${index}-url-input`,
                                    //link length limited to 255 characters
                                    // maxLength: 255,
                                }}
                                error={!!linksErrors[index]?.url}
                                helperText={linksErrors[index]?.url}
                                FormHelperTextProps={{
                                    sx: {
                                        backgroundColor: 'transparent',
                                    },
                                    'data-testid': `link-${index}-url-input-error`,
                                }}
                            />
                            <TextField
                                label={`Link #${index + 1} Text`}
                                variant='outlined'
                                fullWidth
                                value={link.prop_link_text || ''}
                                onChange={(e) =>
                                    handleLinkChange(
                                        index,
                                        'prop_link_text',
                                        e.target.value
                                    )
                                }
                                placeholder='Text'
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        '& fieldset': {
                                            borderColor: `${theme.palette.border.lightGray}`,
                                        },
                                    },
                                }}
                                inputProps={{
                                    'data-testid': `link-${index}-text-input`,
                                }}
                                error={!!linksErrors[index]?.text}
                                helperText={linksErrors[index]?.text}
                                FormHelperTextProps={{
                                    sx: {
                                        backgroundColor: 'transparent',
                                    },
                                    'data-testid': `link-text-${index}-url-input-error`,
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            ))}
            {proposalData?.proposal_links?.length < maxLinks && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 2,
                    }}
                >
                    <Button
                        variant='text'
                        mt={2}
                        startIcon={
                            <IconPlus fill={theme.palette.primary.main} />
                        }
                        onClick={handleAddLink}
                        data-testid='add-link-button'
                    >
                        Add link
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default LinkManager;
