// @ts-nocheck
import { Node, MenuData } from 'tiptap';
import { MenuBtnView } from '../types';
import IframeCommandButton from '../components/MenuCommands/IframeCommandButton.vue';

export default class Iframe extends Node implements MenuBtnView {
  get name () {
    return 'iframe';
  }

  // @ts-ignore
  get schema () {
    return {
      attrs: {
        src: {
          default: null,
        },
      },
      group: 'block',
      selectable: false,
      parseDOM: [{
        tag: 'iframe',
        // @ts-ignore
        getAttrs: dom => ({
          src: dom.getAttribute('src'),
        }),
      }],
      toDOM: (node) => ['iframe', {
        src: `https://www.youtube.com/embed/${getId(node.attrs.src)}`,
        frameborder: 0,
        allowfullscreen: 'true',
      }],
    };
  }

  commands ({ type }) {
    return attrs => (state, dispatch) => {
      const { selection } = state;
      const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos;
      const node = type.create(attrs);
      const transaction = state.tr.insert(position, node);
      dispatch(transaction);
    };
  }

  get view () {
    return {
      props: ['node', 'updateAttrs', 'view'],
      computed: {
        src: {
          get () {
            return `https://www.youtube.com/embed/${getId(this.node.attrs.src)}`
          },
          set (src) {
            this.updateAttrs({
              src: `https://www.youtube.com/embed/${src}`,
            });
          },
        },
      },
      template: `
        <div class="iframe">
          <iframe class="iframe__embed" :src="src"></iframe>
        </div>
      `,
    };
  }

  menuBtnView (editorContext: MenuData) {
    return {
      component: IframeCommandButton,
      componentProps: {
        editorContext,
      },
    };
  }
}

function getId(url: String) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11)
    ? match[2]
    : null;
}