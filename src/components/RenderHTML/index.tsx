import { View } from 'react-native';
import * as html2parser from 'htmlparser2-without-node-native';
import { decodeHTML } from 'entities';
import MText from '../Text';
import { textMedium } from '@/theme/primitives/typography';

type RenderProps = {
  html: string;
};

export default function RenderHTML({ html }: RenderProps) {
  const document = html2parser.parseDOM(html);
  const ignoreTags = [
    'script',
    'style',
    'meta',
    'link',
    'iframe',
    'object',
    'embed',
  ];
  const textTags = ['span', 'strong', 'em', 'b', 'i', 'u', 'a'];

  const renderNode = (node: any, index: number): React.ReactNode => {
    if (node.type === html2parser.ElementType.Text) {
      return (
        <MText style={[textMedium]} key={index}>
          {decodeHTML(node.data)}
        </MText>
      );
    }

    if (node.type === html2parser.ElementType.Tag) {
      const Wrapper = textTags.includes(node.name) ? MText : View;
      const children = node.children.map((child: any, idx: number) =>
        renderNode(child, idx),
      );
      if (ignoreTags.includes(node.name)) return null;
      return <Wrapper key={index}>{children}</Wrapper>;
    }

    return null;
  };

  return document.map((node: any, index: number) => renderNode(node, index));
}
