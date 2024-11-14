import { Typography } from '@mui/material';

const removeMarkdown = (markdown) => {
    if (!markdown) return '';

    return markdown
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        .replace(/\~\~(.*?)\~\~/g, '$1')
        .replace(/\!\[.*?\]\(.*?\)/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/`{1,2}([^`]+)`{1,2}/g, '$1')
        .replace(/^\s{0,3}>\s?/g, '')
        .replace(/^\s{1,3}([-*+]|\d+\.)\s+/g, '')
        .replace(/^(\n)?\s{0,}#{1,6}\s*( (.+))? +#+$|^(\n)?\s{0,}#{1,6}\s*( (.+))?$/gm, '$1$3$4$6')
        .replace(/\n{2,}/g, '\n')
        .replace(/\\([\\`*{}\[\]()#+\-.!_>])/g, '$1');
};

const MarkdownTextComponent = ({ markdownText }) => {
    const plainText = removeMarkdown(markdownText);

    return (
        <Typography
            variant='body2'
            component='p'
            color='text.darkPurple'
            sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                lineHeight: '1.5',
                maxHeight: '4.5em',
            }}
        >
            {plainText}
        </Typography>
    );
};

export default MarkdownTextComponent;
