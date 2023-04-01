import Link from 'next/link';

import { Button } from '../button/Button';
import { CTABanner } from '../cta/CTABanner';
import { Section } from '../layout/Section';

const Banner = () => (
  <Section>
    <CTABanner
      title="Come and start your amazing Japanese journey with us"
      subtitle="No better time than now!"
      button={
        <Link href={!process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.LangoBee.com'}>
          <a>
            <Button>Begin my Journey</Button>
          </a>
        </Link>
      }
    />
  </Section>
);

export { Banner };
