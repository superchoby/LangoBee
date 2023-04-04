import Link from 'next/link';

import { Background } from '../background/Background';
import { Button } from '../button/Button';
import { HeroOneButton } from '../hero/HeroOneButton';
import { Section } from '../layout/Section';
import { NavbarTwoColumns } from '../navigation/NavbarTwoColumns';
import { Logo } from './Logo';

const Hero = () => (
  <Background color="bg-gray-100">
    <Section yPadding="py-6">
      <NavbarTwoColumns logo={<Logo xl />}>
        <li>
          <Link href={!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.langobee.com'}>
            <a>Sign in</a>
          </Link>
        </li>
      </NavbarTwoColumns>
    </Section>

    <Section yPadding="pt-20 pb-32">
      <HeroOneButton
        title={
          <>
            {'The most comprehensive site for\n'}
            <span className="text-primary-500">Japanese Learners</span>
          </>
        }
        description="The most efficient way to go from student to sensei"
        button={
          <Link href={!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.langobee.com'}>
            <a>
              <Button xl>Begin my Journey</Button>
            </a>
          </Link>
        }
      />
    </Section>
  </Background>
);

export { Hero };
