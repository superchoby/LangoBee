import { ArticleContainer } from './ArticleContainer'

export const VerbsNaiForm = (): JSX.Element => {
  return (
        <ArticleContainer
            content={[
              {
                subheader: 'Usage and Formality',
                content: (
                        <p>
                            This form of the verb is the negative form of
                            verbs that is used in casual situations. Negative
                            form essentially means you add &quot;not&quot; to the word. E.g
                            not run, not eat, not sleep etc.
                        </p>
                )
              },
              {
                subheader: 'How to Conjugate to This Form',
                content: (
                        <p>
                            To conjugate to this form, you figure out what
                            group the verb is in and apply one of the following
                            rules:
                        </p>
                )
              },
              {
                subheader: 'For う verbs:',
                content: (
                        <p>
                            Grab the last variable, turn it into the あ version and add ない to the end.
                            By あ version we mean things such as: く-&gt;か, る-&gt;ら, and む-&gt;ま.

                            Note: There is one exception and it&apos;s that in the case of う, the あ version is わ.
                            You can see this in the <ruby>買<rt>か</rt>う</ruby> example.

                            <br /><br />
                            Examples:
                        </p>
                )
              },
              {
                subheader: '',
                content: (
                        <table>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        聞<rt>き</rt>く
                                    </ruby>
                                    -&gt;
                                    <ruby>
                                        聞<rt>き</rt>かない
                                    </ruby>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        泳<rt>およ</rt>ぐ
                                    </ruby>
                                    -&gt;
                                    <ruby>
                                        泳<rt>およ</rt>がない
                                    </ruby>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        買<rt>か</rt>う
                                    </ruby>
                                    -&gt;
                                    <ruby>
                                        買<rt>か</rt>わない
                                    </ruby>
                                </td>
                            </tr>
                        </table>
                )
              },
              {
                subheader: 'For る verbs:',
                content: (
                    <p>
                        Remove the る and add ない

                        <br /><br />
                        Examples:
                </p>
                )
              },
              {
                subheader: '',
                content: (
                        <table>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        出<rt>で</rt>る
                                    </ruby>
                                    -&gt;
                                    <ruby>
                                        出<rt>で</rt>ない
                                    </ruby>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        食<rt>た</rt>べる
                                    </ruby>
                                    -&gt;
                                    <ruby>
                                        食<rt>た</rt>べない
                                    </ruby>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        見<rt>み</rt>る
                                    </ruby>
                                    -&gt;
                                    <ruby>
                                        見<rt>み</rt>ない
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
                            Note: Be sure to notice that the ない form of 来る is pronounced こない

                            Examples (all of them):
                        </p>
                )
              },
              {
                subheader: '',
                content: (
                        <table>
                            <tr>
                                <td className='td-with-border-right'>
                                    する -&gt; しない
                                </td>
                            </tr>
                            <tr>
                                <td className='td-with-border-right'>
                                    <ruby>
                                        来<rt>く</rt>る
                                    </ruby>
                                    -&gt;
                                    <ruby>
                                        来<rt>こ</rt>ない
                                    </ruby>
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
                            to convert verbs into ない form!
                        </p>
                )
              }
            ]}
        />
  )
}
