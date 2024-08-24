import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * ReadMe Component
 * 
 * Purpose:
 * The `ReadMe` component is designed to render markdown-formatted text.
 * It utilizes the `react-markdown` library along with the `remark-gfm` plugin 
 * to support GitHub-flavored markdown (GFM).
 * 
 * Props:
 * - content: String
 *   - The markdown-formatted text to be rendered.
 * 
 * Structure:
 * - Renders the markdown content passed via the `content` prop.
 * 
 * Usage:
 * ```jsx
 * <ReadMe content={yourMarkdownContent} />
 * ```
 */

const ReadMe = ({ content }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ReadMe;
