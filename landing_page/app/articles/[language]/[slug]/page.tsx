import { BASE_URL } from '../../../shared';
import Link from 'next/link';
import Header from '../../../(root)/Header'
import './styles.scss'
import ReactMarkdown from 'react-markdown'
import { Metadata } from 'next';
import { PROD_URL } from '../../../shared';

async function getArticle(language: string, slug: string) {
  const res = await fetch(`${BASE_URL}languages/article/${language}/${slug}/`);
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
  linked_articles: {
    article_being_linked_to: { title: string, slug: string }
    relationship: 'additional_reading' | 'prerequisite'
    explanation: string
  }[]
}

export default async function page({params}: { params: { language: string, slug: string } }) {
    const {language, slug} = params
    const {article}: {article: ArticleStructure} = await getArticle(language, slug)
    const prerequisiteArticles: { title: string, explanation: string, slug: string }[] = []
    const suggestedArticlesToReadAfter: { title: string, explanation: string, slug: string }[] = []
    for (const {article_being_linked_to: {title, slug}, relationship, explanation} of article.linked_articles) {
      if (relationship === 'prerequisite') {
        prerequisiteArticles.push({
          title, 
          explanation,
          slug,
        })
      } else {
        suggestedArticlesToReadAfter.push({
          title, 
          explanation,
          slug,
        })
      }
    }

    return (
      <main>
        <Header />
        <div style={{color: '#3A3A3A'}} className='mt-10 w-5/6 my-0 mx-auto md:w-4/5 lg:w-2/3 xl:w-3/5 mb-28'>
          {prerequisiteArticles.length > 0 && (
            <div className='mb-12'>
              <h2>Links to suggested readings if you arent familiar with:</h2>
              <ul>
                {prerequisiteArticles.map(({title, slug}) => {
                  return (
                    <ul key={title}>
                      <Link href={`/articles/${language}/${slug}/`} className='font-bold underline'>
                        {title}
                      </Link>
                    </ul>
                  )
                })}
              </ul>
            </div>
          )}
          <h1 
            className='text-3xl font-bold text-center mb-10'
            data-testid="article-title"
          >
            {article.title}
          </h1>
          <ReactMarkdown className='text-left article-contents'>
            {article.body}
          </ReactMarkdown>

          {suggestedArticlesToReadAfter.length > 0 && (
            <>
              <div className='w-full bg-slate-300 h-px my-8' />
              <div className='mb-12'>
                <h2>Some fun related topics that build off of what you just read:</h2>
                <ul>
                  {suggestedArticlesToReadAfter.map(({title, slug}) => {
                    return (
                      <ul key={title}>
                        <Link href={`/articles/${language}/${slug}/`} className='font-bold underline'>
                          {title}
                        </Link>
                      </ul>
                    )
                  })}
                </ul>
              </div>
            </>
            
          )}

          {/* <div className='mx-auto flex justify-between'> */}
            <Link 
              className='button-at-bottom-of-article py-3 text-white block w-36 text-center mx-auto'
              href='/articles'
            >
              Back to Articles
            </Link>

            {/* <Link 
              className='button-at-bottom-of-article py-3 text-black block w-36 text-center'
              href='/signup'
            >
              Join LangoBee
            </Link>
          </div> */}
          
        </div>
      </main>
    )
}
  