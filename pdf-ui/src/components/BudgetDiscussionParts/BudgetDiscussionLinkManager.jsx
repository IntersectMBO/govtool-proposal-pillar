import { useEffect, useState } from 'react';
import { IconPlus, IconX } from '@intersect.mbo/intersectmbo.org-icons-set';
import { Box, Button, TextField, IconButton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { isValidURLFormat } from '../../lib/utils';

const BudgetDiscussionLinkManager = ({
    maxLinks = 20,
    budgetDiscussionData,
    setBudgetDiscussionData,
    setLinksData,
    errors,
    setErrors,
}) => {
    const theme = useTheme();
    const [linksErrors, setLinksErrors] = useState({});

    useEffect(() => {
        if (
            budgetDiscussionData.bd_further_information?.proposal_links ===
            undefined
        ) {
            let links = [{ prop_link: '' }, { prop_link: '' }];
            setBudgetDiscussionData({
                ...budgetDiscussionData,
                bd_further_information: {
                    ...budgetDiscussionData.bd_further_information,
                    proposal_links: links,
                },
            });
        }
    }, []);

    useEffect(() => {
        setErrors((prev) => ({ ...prev, linkErrors: { ...linksErrors } }));
    }, [linksErrors]);

    const updateProposalLinks = (newLinks) => {
        setBudgetDiscussionData((prev) => ({
            ...prev,
            bd_further_information: {
                ...prev.bd_further_information,
                proposal_links: newLinks,
            },
        }));
    };

    const handleLinkChange = (index, field, value) => {
        const newLinks =
            budgetDiscussionData.bd_further_information?.proposal_links?.map(
                (link, i) => (i === index ? { ...link, [field]: value } : link)
            );

        updateProposalLinks(newLinks);
        if (field === 'prop_link') {
            if (value === '') {
                setLinksErrors((prev) => {
                    const { [index]: removed, ...rest } = prev;
                    return rest;
                });
            } else if (typeof value === 'string' && value.length > 2048) {
                setLinksErrors((prev) => ({
                    ...prev,
                    [index]: {
                        ...prev[index],
                        url: 'URL must be 2048 characters or less',
                    },
                }));
            } else if (typeof value === 'string' && value.length > 0) {
                const isValid = isValidURLFormat(value);
                setLinksErrors((prev) => ({
                    ...prev,
                    [index]: {
                        ...prev[index],
                        url: isValid ? '' : 'Invalid URL format',
                    },
                }));
            } else {
                setLinksErrors((prev) => {
                    const { [index]: removed, ...rest } = prev;
                    return rest;
                });
            }
        } else if (field === 'prop_link_text') {
            if (value.length > 255) {
                setLinksErrors((prev) => ({
                    ...prev,
                    [index]: {
                        ...prev[index],
                        text: 'Text must be 255 characters or less',
                    },
                }));
            } else {
                setLinksErrors((prev) => ({
                    ...prev,
                    [index]: {
                        ...prev[index],
                        text: '',
                    },
                }));
            }
        }
    };
    const handleAddLink = () => {
        const currentLinks =
            budgetDiscussionData.bd_further_information?.proposal_links || [];
        if (currentLinks.length < maxLinks) {
            updateProposalLinks([
                ...currentLinks,
                { prop_link: '', prop_link_text: '' },
            ]);
        }
    };

    const handleRemoveLink = (index) => {
        const newLinks =
            budgetDiscussionData.bd_further_information?.proposal_links?.filter(
                (_, i) => i !== index
            );

        updateProposalLinks(newLinks);

        // Uklanjanje grešaka za uklonjeni link
        setLinksErrors((prev) => {
            const { [index]: removed, ...rest } = prev;
            return rest;
        });
    };

    return (
        <Box sx={{ align: 'center' }}>
            <Typography
                variant='body1'
                mb={2}
                sx={{ textAlign: 'center', mt: 2 }}
            >
                (maximum of {maxLinks} entries)
            </Typography>
            {budgetDiscussionData.bd_further_information?.proposal_links?.map(
                (link, index) => (
                    <Box
                        key={index}
                        display='flex'
                        flexDirection='row'
                        mb={2}
                        backgroundColor={(theme) =>
                            theme.palette.primary.lightGray
                        }
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
                                    error={!!linksErrors[index]?.text}
                                    helperText={linksErrors[index]?.text}
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
                )
            )}
            {budgetDiscussionData.bd_further_information?.proposal_links
                ?.length < maxLinks && (
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

export default BudgetDiscussionLinkManager;
