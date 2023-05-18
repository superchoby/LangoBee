import Link from 'next/link';
import './styles.scss'
import Header from '../(root)/Header'
import { BASE_URL } from '../shared';

export const metadata = {
    title: 'Articles',
    description: 'Discover our wealth of Japanese explanations'
}

const ARTICLE_PATH = (forLesson: boolean, language?: string, slug?: string) => {
    const base = forLesson ? '/lesson-article' : '/articles'
    return `${base}/${language != null ? language : ':language'}/${slug != null ? slug : ':slug'}`
}

interface ArticlePreviewProps { 
    category: string
    title: string 
    slug: string
    sections: {
      header: string
      content: string
    }[]
}

function removeXMLTags(input: string): string {
    const regex = /<[^>]*>/g; // Match all XML tags
    const output = input.replace(regex, ''); // Replace XML tags with an empty string
    return output;
}
  
const ArticlePreview = ({
    category,
    title,
    slug,
    sections
}: ArticlePreviewProps) => {
    return (
      <li className='article-preview'>
        <Link href={ARTICLE_PATH(false, 'Japanese', slug)}>{title}</Link>
        <p>{removeXMLTags(sections[0].content).slice(0, 130)}...</p>
      </li>
    )
}
  
async function getData() {
    const res = await fetch(`${BASE_URL}languages/article`);

    // Recommendation: handle errors
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data');
    }
   
    return res.json();
  }
   
  export default async function Page() {
    const articles: ArticlePreviewProps[] = await getData();
   
    return (
        <main>
            <Header />
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
