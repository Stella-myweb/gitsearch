import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { transformReadmeImages } from '@/utils/readmeImages'

interface MarkdownViewerProps {
  content: string
  username: string
  repoName: string
  branch?: string
}

export function MarkdownViewer({
  content,
  username,
  repoName,
  branch = 'main',
}: MarkdownViewerProps) {
  const transformed = transformReadmeImages(content, username, repoName, branch)

  return (
    <div className="prose prose-github prose-sm sm:prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {transformed}
      </ReactMarkdown>
    </div>
  )
}
