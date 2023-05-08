export const parseContent = (content: string) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(`<p>${content}</p>`, 'text/xml')
  const subheaders = xmlDoc.getElementsByTagName('subheader')
  while (subheaders.length > 0) {
    const span = document.createElement('h3')
    // span.classList.add('kana-mnemonic-bold-pronunciation')
    span.textContent = subheaders[0].textContent
    subheaders[0].replaceWith(span)
  }

  const bolds = xmlDoc.getElementsByTagName('bold')
  while (bolds.length > 0) {
    const span = document.createElement('span')
    span.classList.add('bold-span')
    span.textContent = bolds[0].textContent
    bolds[0].replaceWith(span)
  }

  const speakers = xmlDoc.getElementsByTagName('speaker')
  while (speakers.length > 0) {
    const span = document.createElement('span')
    // span.classList.add('kana-mnemonic-bold-pronunciation')
    span.classList.add('story-speaker-name')
    span.textContent = speakers[0].textContent + ':'
    speakers[0].replaceWith(span)
  }

  return xmlDoc.documentElement.innerHTML
}
