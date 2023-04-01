import { VerticalFeatureRow } from '../feature/VerticalFeatureRow';
import { Section } from '../layout/Section';

const VerticalFeatures = () => (
  <Section
    title="Use Proven Methods With Immersion"
    description="Using a Space Repetition System (SRS), learn Japanese with the most proven methods for efficient learning and gradually be immersed in the language"
  >
    <VerticalFeatureRow
      title="Enjoy Incremental Learning as well as SRS!"
      description="Our combination of the spaced repetition system as well as building upon previous concepts to teach you new ones will bring your learning to lightspeed!"
      image="/assets/images/feature3.svg"
      imageAlt="First feature alt text"
    />
    <VerticalFeatureRow
      title="Learn to Form Sentences Quickly"
      description="Learn tons of new vocabulary every lesson and then learn grammar that builds upon the vocabulary you've learned"
      image="/assets/images/Noun_talking_1722610_80baff.svg"
      imageAlt="Second feature alt text"
      reverse
    />
    <VerticalFeatureRow
      title="Enjoy Incremental Learning as well as SRS!"
      description="As you go along you're Japanese journey, you will be provided with more and more real Japanese to provide you with true Japanese immersion!"
      image="/assets/images/feature3.svg"
      imageAlt="Third feature alt text"
    />
    {/* <VerticalFeatureRow
      title="Enjoy Incremental Learning as well as SRS!"
      description="Our combination of the spaced repetition system as well as building upon previous concepts to teach you new ones will bring your learning to lightspeed!"
      image="/assets/images/Japanese_Hiragana_kyokashotai_A.svg"
      imageAlt="Third feature alt text"
    /> */}
  </Section>
);

export { VerticalFeatures };
