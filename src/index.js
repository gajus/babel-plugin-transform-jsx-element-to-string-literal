// @flow

import babelPluginJsxSyntax from 'babel-plugin-syntax-jsx';
import BabelTypes from 'babel-types';

const defaultTagNames = [
  'heredoc'
];

export default ({
  types: t
}: {
  types: BabelTypes
}) => {
  return {
    inherits: babelPluginJsxSyntax,
    visitor: {
      JSXElement (path: Object, stats: Object): void {
        const tagNames = stats.opts.tagNames || defaultTagNames;

        if (!tagNames.includes(path.node.openingElement.name.name)) {
          return;
        }

        if (path.node.children.length !== 1) {
          throw new Error('Unexpected children count.');
        }

        const body = path.node.children[0];

        if (!t.isJSXText(body)) {
          throw new Error('Unexpected body node type.');
        }

        path.replaceWith(
          t.stringLiteral(body.value)
        );
      }
    }
  };
};
