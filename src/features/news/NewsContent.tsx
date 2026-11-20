import { Play } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { t } from '@/i18n'
import { newsImageUrl, type NewsBlock, type NewsDoc, type NewsInline, type NewsListItem } from './newsApi'

// Renders a post body (checked and cleaned by the backend) as React elements; no HTML from
// the server is ever inserted as markup.

function isInternal(href: string) {
  return href.startsWith('/')
}

function renderInline(nodes: NewsInline[] | undefined): ReactNode {
  if (!nodes?.length) return <br />
  return nodes.map((node, index) => {
    if (node.type === 'hardBreak') return <br key={index} />
    let content: ReactNode = node.text
    for (const mark of node.marks ?? []) {
      if (mark.type === 'bold') content = <strong>{content}</strong>
      else if (mark.type === 'italic') content = <em>{content}</em>
      else if (mark.type === 'underline') content = <u>{content}</u>
      else if (mark.type === 'strike') content = <s>{content}</s>
      else if (mark.type === 'link') {
        content = isInternal(mark.attrs.href)
          ? <a href={mark.attrs.href}>{content}</a>
          : <a href={mark.attrs.href} rel="noopener noreferrer" target="_blank">{content}</a>
      }
    }
    return <span key={index}>{content}</span>
  })
}

function youtubeId(src: string) {
  return /\/embed\/([A-Za-z0-9_-]{11})/.exec(src)?.[1] ?? null
}

// A picture and a play button until the reader clicks: the YouTube player (about 1 MB of
// scripts) loads only for readers who watch, so the page opens fast from an ad.
function YouTubeVideo({ src, start }: { src: string; start: number }) {
  const [playing, setPlaying] = useState(false)
  const id = youtubeId(src)
  if (!id) return null
  const query = new URLSearchParams({ autoplay: '1', rel: '0' })
  if (start) query.set('start', String(start))
  return (
    <figure className="news-video">
      {playing ? (
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          src={`https://www.youtube-nocookie.com/embed/${id}?${query.toString()}`}
          title={t('Video YouTube')}
        />
      ) : (
        <button aria-label={t('Phát video')} className="news-video-poster" onClick={() => setPlaying(true)} type="button">
          <img alt="" decoding="async" loading="lazy" src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} />
          <span className="news-video-play"><Play aria-hidden="true" fill="currentColor" size={26} /></span>
        </button>
      )}
    </figure>
  )
}

function renderListItems(items: NewsListItem[]) {
  return items.map((item, index) => <li key={index}>{renderBlocks(item.content, true)}</li>)
}

function renderBlocks(blocks: NewsBlock[], inList = false): ReactNode {
  return blocks.map((block, index) => {
    switch (block.type) {
      case 'paragraph':
        // A single paragraph inside a list item reads as the item itself.
        return inList && blocks.length === 1 ? <span key={index}>{renderInline(block.content)}</span> : <p key={index}>{renderInline(block.content)}</p>
      case 'heading':
        return block.attrs.level === 3 ? <h3 key={index}>{renderInline(block.content)}</h3> : <h2 key={index}>{renderInline(block.content)}</h2>
      case 'bulletList':
        return <ul key={index}>{renderListItems(block.content)}</ul>
      case 'orderedList':
        return <ol key={index} start={block.attrs.start}>{renderListItems(block.content)}</ol>
      case 'blockquote':
        return <blockquote key={index}>{renderBlocks(block.content)}</blockquote>
      case 'horizontalRule':
        return <hr key={index} />
      case 'image':
        return (
          <figure className="news-figure" key={index}>
            <img alt={block.attrs.alt} decoding="async" loading="lazy" src={newsImageUrl(block.attrs.src) ?? ''} />
            {block.attrs.title ? <figcaption>{block.attrs.title}</figcaption> : null}
          </figure>
        )
      case 'youtube':
        return <YouTubeVideo key={index} src={block.attrs.src} start={block.attrs.start} />
      default:
        return null
    }
  })
}

export function NewsContent({ doc }: { doc: NewsDoc }) {
  return <div className="news-prose">{renderBlocks(doc.content)}</div>
}
