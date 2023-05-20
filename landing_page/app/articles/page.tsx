import Link from 'next/link';
import './styles.scss'
import Header from '../(root)/Header'
import { BASE_URL } from '../shared';
import { Metadata } from 'next';

function removeMarkdown(md: string) {
  let result = md.replace(/(^\s*#+\s*)([^#]+)/gm, '$2');
  result = result.replace(/(\*\*|__)(.*?)\1/g, '$2');
  result = result.replace(/(\*|_)(.*?)\1/g, '$2');
  result = result.replace(/(`)(.*?)\1/g, '$2');
  result = result.replace(/(\~\~)(.*?)\1/g, '$2');
  result = result.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '$1');
  result = result.replace(/\[([^\]]*)\]\(([^\)]+)\)/g, '$1');
  result = result.replace(/\n\s*(>)\s*(.+)/g, '\n$2');
  result = result.replace(/(\*\*\*|- - -|___)/g, '');
  
  return result;
}

export const metadata: Metadata = {
    title: 'Articles',
    description: 'Discover our wealth of Japanese explanations where we breakdown Japanese concepts into the simplest explanations so that you can be a master of them.'
}

const ARTICLE_PATH = (forLesson: boolean, language?: string, slug?: string) => {
    const base = forLesson ? '/lesson-article' : '/articles'
    return `${base}/${language != null ? language : ':language'}/${slug != null ? slug : ':slug'}`
}

interface ArticlePreviewProps { 
  tags: {name: string}[]
  title: string 
  slug: string
  body: string
}
  
const ArticlePreview = ({
    title,
    slug,
    body
}: ArticlePreviewProps) => {
    return (
      <li className='article-preview'>
        <Link href={ARTICLE_PATH(false, 'Japanese', slug)}>{title}</Link>
        <p>{removeMarkdown(body).slice(0, 130)}...</p>
      </li>
    )
}
  
async function getData() {
    const res = await fetch(`${BASE_URL}languages/article`, {cache: 'no-store'} );
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
   
    return res.json();
}
   
export default async function Page() {
  const articles: ArticlePreviewProps[] = await getData();

  return (
      <main>
          <div className='w-7/8 my-auto'><Header /></div>
          <div className='articles-homepage'>
              <h1 className='articles-homepage-header'>Knowledge Database</h1>
              <span className='artices-come-here-message'>Come here to refresh or learn new, cool things about Japanese</span>
              <ul className='articles-homepage-articles-list'>
                  {articles.map(props => <ArticlePreview key={props.title} {...props} />)}
              </ul>
          </div>
      </main>
  )
}
