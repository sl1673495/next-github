import { memo, useMemo } from 'react'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/default.css'
import 'github-markdown-css'

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
const md = new MarkdownIt({
  html: true,
  linkify: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str, true).value;
      } catch (e) { console.error(e) }
    }
    return ''; // 使用额外的默认转义
  },
})

const b64ToUtf8 = (str) => {
  return decodeURIComponent(escape(atob(str)))
}

let hljsInited = false
export default memo(({ content, isBase64 }) => {
  const converted = isBase64 ? b64ToUtf8(content) : content
  const html = useMemo(() => md.render(converted), [converted])
  if (!hljsInited && typeof window !== 'undefined') {
    hljs.initHighlightingOnLoad()
    hljsInited = true
  }

  return (
    <div className="markdown-body">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
})
