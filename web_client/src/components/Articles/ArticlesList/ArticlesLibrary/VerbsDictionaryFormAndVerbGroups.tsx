import { ArticleContainer } from './ArticleContainer'

export const VerbsDictionaryFormAndVerbGroups = (): JSX.Element => {
  return (
        <ArticleContainer
            content={[
              {
                subheader: '',
                content: (
                        <p>
                            This form is called the dictionary form because
                            when you look up verbs in a dictionary, they will
                            all be written in this form. All verbs in dictionary
                            form end with the う sound such as む, る, す, or つ.
                            When shown charts of how to conjugate between Japanese
                            forms, it is generally given from the perspective of
                            the dictionary form. E.g. a chart showing you how to
                            write a verb into its casual past tense, will tell
                            you how to change it from the dictionary form.
                        </p>
                )
              },
              {
                subheader: 'Level of formality',
                content: (
                        <p>
                            In conversation, this is the form that is used when
                            talking to someone you are more familiar with. This
                            is the “casual” form of Japanese verbs.
                        </p>
                )
              },
              {
                subheader: 'Verb Groups',
                content: (
                        <p>
                            When it comes to conjugating verbs, it is important to
                            know the three groups of verbs. These groups will
                            determine how you conjugate a verb into all the other
                            conjugations. Verb forms are put into 3 groups:
                            う verbs, る verbs, and irregular verbs.
                        </p>
                )
              },
              {
                subheader: 'Examples',
                content: (
                        <table>
                            <tr>
                                <th className='td-with-border-right'>う verbs</th>
                                <th className='td-with-border-right'>る verbs</th>
                                <th>Irregular verbs </th>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        聞 <rt>き</rt>く
                                    </ruby>
                                </td>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        出<rt>で</rt>る
                                    </ruby>
                                </td>
                                <td>する</td>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        泳<rt>およ</rt>ぐ
                                    </ruby>
                                </td>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        食<rt>た</rt>べる
                                    </ruby>
                                </td>
                                <td>
                                    <ruby>
                                        来<rt>く</rt>る
                                    </ruby>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        遊<rt>あそ</rt>ぶ
                                    </ruby>
                                </td>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        起<rt>お</rt>きる
                                    </ruby>
                                </td>
                            </tr>
                        </table>
                )
              },
              {
                content: (
                        <p>
                            Note: While I’ve only shown a few examples of
                            う verbs and る verbs, the irregular verbs
                            listed are all the ones that exist.
                        </p>
                )
              },
              {
                subheader: 'The Verb Groups',
                content: (
                        <p>
                            う verbs get their name because they are created by
                            grabbing the last character in the stem of a verb
                            and changing it to an う sound. For example the stem
                            of <ruby>聞 <rt>き</rt>く</ruby> is 聞き and you can see that the last char of
                            the stem, き, has become く, the う version of it.
                        </p>
                )
              },
              {
                content: (
                        <p>
                            る verbs get their name because they are created by
                            grabbing the stem of the verb and simply adding る
                            to the end. For example the stem of <ruby>食<rt>た</rt>べる</ruby>
                            is 食べ and you can see that a る was just simply added to the end.
                        </p>
                )
              },
              {
                content: (
                        <p>
                            Irregular verbs get their names because there are only
                            two verbs that fit this category, する and &nbsp;
                            <ruby>来<rt>く</rt>る</ruby>, and
                            they break many typical verb conjugation rules.
                            But wait, some verbs ending in る are actually
                            classified as う verbs. Let’s see about that.
                        </p>
                )
              },
              {
                subheader: 'How to tell if a verb ending in る is a う or る verb',
                content: (
                        <p>
                            Put simply, if the vowel sound before the る is あ, う or お,
                            then it is an う verb. For example in the verb, つくる (to make),
                            the sound before the る is a う sound so you know it is an う verb.
                            If the vowel sound before the る is え or い, then it is &nbsp;
                            <span style={{ fontWeight: 500 }}>most likely</span> to be a る verb. Unfortunately there
                            are exceptions.
                        </p>
                )
              },
              {
                content: (
                        <p>
                            I know these verb rules sound very complicated but what’s
                            important to know is, as you learn more verbs and practice
                            them, you’ll be able to automatically discern what type a
                            verb is without even having to think once about the rules!
                            Over time you will eventually gain a sense for how to
                            classify verbs and it will all become second hand nature!
                        </p>
                )
              }
            ]}
        />
  )
}
