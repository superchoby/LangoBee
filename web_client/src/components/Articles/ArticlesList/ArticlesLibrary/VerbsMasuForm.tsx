import { ArticleContainer } from './ArticleContainer'

export const VerbsMasuForm = (): JSX.Element => {
  return (
        <ArticleContainer
            content={[
              {
                subheader: '',
                content: (
                        <p>
                            Japanese has many conjugations and one of the most
                            common ones you will see when first learning Japanese
                            is the standard ます form.
                        </p>
                )
              },
              {
                subheader: 'Level of formality',
                content: (
                        <p>
                            This is the more
                            formal form of Japanese verbs that Japanese people
                            will use when talking to those they are not too
                            familiar with or talking to those with a higher
                            status such as their teacher or boss.
                        </p>
                )
              },
              {
                subheader: 'How to Convert from Dictionary to ます form',
                content: (
                        <p>
                            To convert a verb to ます form the rule is to
                            get the stem of the verb and then add ます
                            to it however this can be a complicated way
                            of thinking about it as you will spend time
                            trying to figure out what the stem is and
                            then add ます. I will show you a handy trick
                            to figure out how to convert them easily.
                        </p>
                )
              },
              {
                subheader: '',
                content: (
                        <p>
                            Converting from the dictionary to the ます
                            form is simple once you figure out what type
                            of verb the verb you are looking at is.
                        </p>
                )
              },
              {
                subheader: 'For う verbs:',
                content: (
                        <p>
                            Rule: turn the last letter into an い
                            sound and add ます.

                            Examples:
                        </p>
                )
              },
              {
                subheader: '',
                content: (
                        <table>
                            <tr>
                                <th className='td-with-border-right'>Dictionary</th>
                                <th className='td-with-border-right'>ます Form</th>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        泳<rt>およ</rt>ぐ
                                    </ruby>
                                </td>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        泳<rt>およ</rt>ぎます
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
                                        遊<rt>あそ</rt>びます
                                    </ruby>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    わかる
                                </td>
                                <td className='td-with-border-right'>
                                    わかります
                                </td>
                            </tr>
                        </table>
                )
              },
              {
                subheader: 'For る verbs:',
                content: (
                        <p>
                            Rule: drop the る and add a ます

                            Examples:
                        </p>
                )
              },
              {
                subheader: '',
                content: (
                        <table>
                            <tr>
                                <th className='td-with-border-right'>Dictionary</th>
                                <th className='td-with-border-right'>ます Form</th>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        食<rt>た</rt>べる
                                    </ruby>
                                </td>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        食<rt>た</rt>べます
                                    </ruby>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        着<rt>き</rt>る
                                    </ruby>
                                </td>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        着<rt>き</rt>ます
                                    </ruby>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        見<rt>み</rt>る
                                    </ruby>
                                </td>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        見<rt>み</rt>ます
                                    </ruby>
                                </td>
                            </tr>
                        </table>
                )
              },
              {
                subheader: 'For Irregular Verbs:',
                content: (
                        <p>
                            Rule: there is no particular rule or pattern like
                            the above two but since there are only 2 verbs in
                            this category, they are easy to memorize! Since we
                            can’t apply the handy trick like before, we can use
                            the rule I mentioned earlier where you grab the stem
                            and add a ます.

                            Examples (all of them):
                        </p>
                )
              },
              {
                subheader: '',
                content: (
                        <table>
                            <tr>
                                <th className='td-with-border-right'>Dictionary</th>
                                <th className='td-with-border-right'>Stem</th>
                                <th className='td-with-border-right'>ます Form</th>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        来<rt>く</rt>る
                                    </ruby>
                                </td>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        来<rt>き</rt>
                                    </ruby>
                                </td>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        来<rt>き</rt>ます
                                    </ruby>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    する
                                </td>
                                <td className='td-with-border-right'>
                                    し
                                </td>
                                <td className='td-with-border-right'>
                                    します
                                </td>
                            </tr>
                        </table>
                )
              },
              {
                subheader: '',
                content: (
                        <p>
                            Here you have it! You now know how
                            to convert verbs into ます form!
                        </p>
                )
              }
            ]}
        />
  )
}
