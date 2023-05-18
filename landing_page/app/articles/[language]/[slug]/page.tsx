import { BASE_URL } from '../../../shared';
import Link from 'next/link';
import { parse } from 'node-html-parser';
import Header from '../../../(root)/Header'
import './styles.scss'

async function getArticle(language: string, slug: string) {
  const res = await fetch(`${BASE_URL}languages/article/${language}/${slug}/`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
 
  return res.json();
}

export async function generateMetadata({ params }: { params: {language: string, slug: string} }) {
  const { article } = await getArticle(params.language, params.slug)
  console.log(article.sections[0].content.slice(0, 100))
  return { 
    title: article.title,
    description: article.sections[0].content.slice(0, 100)
  }
}

interface ArticleSection {
  content: string
  header: string | null
}

interface ArticleStructure {
  title: string
  sections: ArticleSection[]
}

const parseContent = (content: string) => {
  const root = parse(`<p>${content}</p>`);
  const subheaders = root.querySelectorAll('subheader');
  subheaders.forEach(subheader => {
    const h3 = `<h3 class='text-xl font-bold my-3.5'>${subheader.text}</h3>`;
    subheader.replaceWith(h3);
  });

  return root.innerHTML;
};

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
          {article.sections.map(({ header, content }) => {
            return <div className='article-section' key={header}>
              {header != null && <h2 className='text-2xl font-bold my-3.5'>{header}</h2>}
              <div dangerouslySetInnerHTML={{ __html: parseContent(content.split('<newline />').join('\n')) }} />
            </div>
          })}

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
  