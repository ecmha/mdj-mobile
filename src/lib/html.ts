import * as html2parser from 'htmlparser2-without-node-native';
import { decodeHTML } from 'entities';

// Same list RenderHTML drops when displaying a message.
const IGNORED_TAGS = [
  'script',
  'style',
  'meta',
  'link',
  'iframe',
  'object',
  'embed',
];

// Tags that end the current line when flattened to plain text.
const LINE_BREAK_TAGS = ['br', 'li'];

// Tags that are separated by a blank line, so shared text keeps the
// paragraph rhythm the reader sees on screen.
const PARAGRAPH_TAGS = [
  'p',
  'div',
  'ul',
  'ol',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
];

/**
 * Flattens the HTML body of a message into shareable plain text, reusing the
 * parser RenderHTML already relies on so entities and tag handling stay
 * consistent with what the reader sees on screen.
 */
export const htmlToPlainText = (html: string): string => {
  const collect = (node: any): string => {
    if (node.type === html2parser.ElementType.Text) {
      return decodeHTML(node.data);
    }

    if (node.type === html2parser.ElementType.Tag) {
      if (IGNORED_TAGS.includes(node.name)) return '';
      const inner = (node.children ?? []).map(collect).join('');
      if (PARAGRAPH_TAGS.includes(node.name)) return `${inner}\n\n`;
      if (LINE_BREAK_TAGS.includes(node.name)) return `${inner}\n`;
      return inner;
    }

    return '';
  };

  return html2parser
    .parseDOM(html)
    .map(collect)
    .join('')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};
