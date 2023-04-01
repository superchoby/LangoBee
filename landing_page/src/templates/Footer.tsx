import Link from 'next/link';

import { Background } from '../background/Background';
import { CenteredFooter } from '../footer/CenteredFooter';
import { Section } from '../layout/Section';
import { Logo } from './Logo';
import { BsDiscord } from 'react-icons/bs'

const Footer = () => (
  <Background color="bg-gray-100">
    <Section>
      <CenteredFooter
        logo={<Logo />}
        iconList={
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Link href="https://discord.gg/DZXbZnThyA">
              <a className='discord-link-container' target="_blank" rel="noreferrer">
                <BsDiscord id='discord-icon' /> Join our Community!
              </a>
            </Link>
            <div>Feel free to ask me any questions in our Discord or at my email, Thomasqtrnh@gmail.com</div>
          </div>
        }
      >
        {/* <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a>About</a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a>Docs</a>
          </Link>
        </li>
        <li>
          <Link href="https://github.com/ixartz/Next-JS-Landing-Page-Starter-Template">
            <a>GitHub</a>
          </Link>
        </li> */}
      </CenteredFooter>
    </Section>
  </Background>
);

export { Footer };
