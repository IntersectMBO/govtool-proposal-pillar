import { useTheme } from '@emotion/react';
import { useEffect } from 'react';
import { Box, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { isValidURLFormat,isValidURLLength } from '../../lib/utils';

const ConstitutionManager = ({
    proposalData,
    setProposalData,
    constitutionManagerErrors,
    setConstitutionManagerErrors 
}) => {    
    const theme = useTheme();
  
    const togglePropHhaveGuScript = (checked) => {
        let pk = proposalData.proposal_constitution_content;
        pk.prop_have_guardrails_script = checked;
        if(!checked)
        {
            pk.prop_guardrails_script_url = "";
            pk.prop_guardrails_script_hash ="";
            setConstitutionManagerErrors((prev) => ({...prev, ["prop_guardrails_script_url"] : null }));
            setConstitutionManagerErrors((prev) => ({...prev,  ["prop_guardrails_script_hash"] : null }));
        }
        else
        {
            constcheckLinkValue("",'prop_guardrails_script_url');
        }
        setProposalData({...proposalData, proposal_constitution_content: pk});
        setConstitutionManagerErrors((prev) => ({...prev, ["prop_guardrails_script_url"] : null }));
        setConstitutionManagerErrors((prev) => ({...prev,  ["prop_guardrails_script_hash"] : null }));
    };
    const handleUrlChange = (url_text) => {
        constcheckLinkValue(url_text,'prop_constitution_url');
        let pk = proposalData.proposal_constitution_content;
        pk.prop_constitution_url = url_text;
        setProposalData({...proposalData, proposal_constitution_content: pk});
    }
    const handleGLinkChange = (url_text) => {
        constcheckLinkValue(url_text,'prop_guardrails_script_url');
        let pk = proposalData.proposal_constitution_content;
        pk.prop_guardrails_script_url = url_text;
        setProposalData({...proposalData, proposal_constitution_content: pk});
    }
   
    const handleHashChange = (hash_text) => {
          constcheckHashValue(hash_text,"prop_guardrails_script_hash");
          let pk = proposalData.proposal_constitution_content;
          pk.prop_guardrails_script_hash = hash_text;
          setProposalData({...proposalData, proposal_constitution_content: pk});
      }
    const constcheckLinkValue = (prop_value, prop_name) => {

        if(prop_value === "")
        {
            setConstitutionManagerErrors((prev) => ({
                ...prev, 
                [prop_name] : "Url is mandatory"}));
        }
        else
        {
            const isValid = isValidURLFormat(prop_value);
            const isValid1 = isValidURLLength(prop_value);
            setConstitutionManagerErrors((prev) => ({
                                          ...prev, 
                                          [prop_name] :isValid ? (isValid1 === true)? null: "Url longer than 128 char" : 'Invalid URL format'}));
            }
    }
    const constcheckHashValue = (prop_value, prop_name) => {
        let isValid = false;
        if(prop_value)
        isValid = prop_value?.length > 0 ? true : false;
        setConstitutionManagerErrors((prev) => ({
                                      ...prev, 
                                    [prop_name] :isValid ? null : 'Invalid HASH value'}));
    }

    useEffect(() => {
         let pk = proposalData.proposal_constitution_content;
            if(pk != undefined)
            {
                if(Boolean(pk.prop_constitution_url))
                    constcheckLinkValue(pk.prop_constitution_url,'prop_constitution_url')
                if(Boolean(pk.prop_guardrails_script_url))
                {
                    constcheckLinkValue(pk.prop_guardrails_script_url,'prop_guardrails_script_url')
                    constcheckHashValue(pk.prop_guardrails_script_hash,"prop_guardrails_script_hash")
                }
            }
    }, [proposalData]);
    return (
<>
    <Box display='flex' flexDirection='column' flexGrow={1}>
        <TextField
            margin='normal'
            label={`New constitution URL`}
            variant='outlined'
            placeholder='e.g. https://website.com/file.txt'
            value={ proposalData?.proposal_constitution_content?.prop_constitution_url || ''}
            fullWidth
            onChange={(e) => handleUrlChange(e.target.value)}
            required
            inputProps={{
                'data-testid': `prop_constitution_url`,
            }}
            error={!!constitutionManagerErrors?.prop_constitution_url}
            helperText={constitutionManagerErrors?.prop_constitution_url}
            FormHelperTextProps={{
                sx: {
                    backgroundColor: 'transparent',
                },
                'data-testid': `prop-constitution-url-text-error`,
            }}
        />
    </Box>

    <Box display='flex' flexDirection='column' flexGrow={1}>
        <Box display={'flex'} justifyContent={'flex-center'} textAlign={'center'}>
        <FormControlLabel
            fullWidth
            label={`Do you want to provide new guardrails script data?`}
            control={
                <Checkbox                                                            
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                    onChange={(event) => togglePropHhaveGuScript(event.target.checked)}
                    checked={(proposalData?.proposal_constitution_content?.prop_have_guardrails_script == 1) || false}
                    id={`prop-have-guardrails-script`}
                    data-testid={`chb-prop-have-guardrails-script`}
                />
                }
            />
        </Box>
        { proposalData?.proposal_constitution_content?.prop_have_guardrails_script == 1 ? (        
        <Box
            display='flex'
            flexDirection='row'
            mb={2}
            backgroundColor={(theme) => theme.palette.primary.lightGray}
            position='relative'
        >
            <Box display='flex' flexDirection='column' flexGrow={1}>
                <Box
                    sx={{
                        paddingX: 2,
                        paddingY: 2,
                    }}
                >
                    <TextField
                        label={`Guardrails script URL`}
                        variant='outlined'
                        fullWidth
                        value={proposalData?.proposal_constitution_content?.prop_guardrails_script_url || ''}
                        onChange={(e) =>handleGLinkChange(e.target.value)}
                        placeholder='ipfs://somesite.com/idsdads'
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
                            'data-testid': `prop-guardrails-script-url-input`,
                        }}
                        error={!!constitutionManagerErrors?.prop_guardrails_script_url}
                        helperText={constitutionManagerErrors?.prop_guardrails_script_url}
                        FormHelperTextProps={{
                            sx: {
                                backgroundColor: 'transparent',
                            },
                            'data-testid': `prop-guardrails-script-url-input-error`,
                        }}
                    />
                    <TextField
                        label={`Guardrails script hash`}
                        variant='outlined'
                        fullWidth
                        value={proposalData?.proposal_constitution_content?.prop_guardrails_script_hash || ''}
                        onChange={(e) =>handleHashChange(e.target.value)}
                        placeholder='Guardrails script hash'
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
                            'data-testid': `prop-guardrails-script-hash-input`,
                        }}
                        error={!!constitutionManagerErrors?.prop_guardrails_script_hash}
                        helperText={constitutionManagerErrors?.prop_guardrails_script_hash}
                        FormHelperTextProps={{
                            sx: {
                                backgroundColor: 'transparent',
                            },
                            'data-testid': `prop-guardrails-script-hash-input-error`,
                        }}
                    />
                </Box>
            </Box> 
        </Box>): null }
    </Box>
</>)
}

export default ConstitutionManager;