import { BASE_URL } from '../../../shared';
import Link from 'next/link';
import Header from '../../../(root)/Header'
import './styles.scss'
import ReactMarkdown from 'react-markdown'
import { Metadata } from 'next';
import { PROD_URL } from '../../../shared';

async function getArticle(language: string, slug: string) {
  const res = await fetch(`${BASE_URL}languages/article/${language}/${slug}/`, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
 
  return res.json();
}

export async function generateMetadata({ params }: { params: {language: string, slug: string} }): Promise<Metadata> {
  const { language, slug } = params
  const { article }: { article: ArticleStructure } = await getArticle(language, slug)

  return { 
    title: article.title,
    description: article.meta_description,
    alternates: {
      canonical: `${PROD_URL}${language}/${slug}/`
    }
  }
}

interface ArticleStructure {
  title: string
  body: string
  meta_description: string
}

export default async function page({params}: { params: { language: string, slug: string } }) {
    const {language, slug} = params
    const {article}: {article: ArticleStructure} = await getArticle(language, slug)

    return (
      <main>
        <Header />
        <div style={{color: '#3A3A3A'}} className='mt-10 w-5/6 my-0 mx-auto md:w-4/5 lg:w-2/3 xl:w-3/5 mb-28'>
          <h1 
            className='text-3xl font-bold text-center mb-10'
            data-testid="article-title"
          >
            {article.title}
          </h1>
          <ReactMarkdown className='text-left article-contents'>
            {article.body}
          </ReactMarkdown>

          <Link 
            className='button-at-bottom-of-article py-3 text-white block w-40 text-center mx-auto'
            href='/articles'
          >
            Back to Articles
          </Link>
        </div>
      </main>
    )
}
  