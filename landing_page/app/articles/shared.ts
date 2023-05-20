export function removeMarkdown(md: string) {
    // Remove headers marked with #
    let result = md.replace(/(^\s*#+\s*)([^#]+)/gm, '$2');
    
    // Remove bold and italics marked with *, _ or __
    result = result.replace(/(\*\*|__)(.*?)\1/g, '$2');
    result = result.replace(/(\*|_)(.*?)\1/g, '$2');
    
    // Remove inline code blocks
    result = result.replace(/(`)(.*?)\1/g, '$2');
  
    // Remove strikethrough text
    result = result.replace(/(\~\~)(.*?)\1/g, '$2');
    
    // Remove links and images
    result = result.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '$1');  // images
    result = result.replace(/\[([^\]]*)\]\(([^\)]+)\)/g, '$1');  // hyperlinks
    
    // Remove blockquotes
    result = result.replace(/\n\s*(>)\s*(.+)/g, '\n$2');
  
    // Remove horizontal rules
    result = result.replace(/(\*\*\*|- - -|___)/g, '');
    
    return result;
}