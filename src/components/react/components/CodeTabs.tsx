import React from 'react';

// Function to split the content based on <pre> tags
const splitContent = (content: string) => {
    const regex = /(<pre[^>]*>.*?<\/pre>)/gs; // Regex to match <pre> blocks
    const codeBlocks: string[] = [];
    const otherContent: string[] = [];

    let lastIndex = 0;

    // Find all <pre> tags and split the content
    content.match(regex)?.forEach((match, offset) => {
        // Add content before the <pre> block as 'other content'
        if (lastIndex < offset) {
            otherContent.push(content.slice(lastIndex, offset));
        }
        // Add the <pre> block as a code block
        codeBlocks.push(match);
        lastIndex = offset + match.length;
    });

    // Add any remaining 'other content' after the last <pre> tag
    if (lastIndex < content.length) {
        otherContent.push(content.slice(lastIndex));
    }

    return { codeBlocks, otherContent };
};

interface CodeTabsProps {
    children: React.ReactNode;
}

const CodeTabs: React.FC<CodeTabsProps> = ({ children }) => {
    return (
        <>
            {children}
        </>
    );
};

export default CodeTabs;
