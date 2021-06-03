// @ts-nocheck
import { Node, MenuData } from 'tiptap';
import { MenuBtnView } from '../types';
import CommandButton from '../components/MenuCommands/CommandButton.vue';
import CTASView from '../components/ExtensionViews/CTASView.vue';

export default class CTAS extends Node implements MenuBtnView {
  get name () {
    return 'ctas';
  }

  // @ts-ignore
  get schema () {
    return {
      // attrs: {
      //   title: {
      //     default: 'Do you want a Quick and Cheap'
      //   },
      //   subtitle: {
      //     default: 'Residence Visa'
      //   },
      //   form: {
      //     default: {
      //       country: 'shanghai',
      //       email: ''
      //     }
      //   }
      // },
      group: 'block',
      selectable: false,
      parseDOM: [{
        tag: 'form',
        class: 'cta-form',
      }],
      toDOM: (node) => {
        return [
          'form',
          {
            class:'cta-form'
          },
          [
            'div',
            {class: 'el-form-item title-content'},
            [
              'div',
              {class:'el-form-item__content'},
              [
                'span',
                {},
                'Do you want a Quick and Cheap'
              ],
              ['br'],
              ['strong', {}, 'Residence Visa'],
              ['br'],
              ['span', {}, 'and'],
              ['br'],
              ['strong', {}, 'Easy Second Passport']
            ]
          ],
          [
            'div',
            {class:'el-form-item'},
            [
              'div',
              {class:'el-form-item__content'},
              [
                'button',
                {class: 'el-button el-button--primary', type:'button'},
                [
                  'span',
                  {},
                  'Send'
                ]
              ]
            ]
          ]
        ]
    },
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
    return CTASView;
  }

  menuBtnView (editorContext: MenuData) {
    return {
      component: CommandButton,
      componentProps: {
        command: editorContext.commands.ctas,
        editorContext,
        icon: 'external-link-alt',
        tooltip: editorContext.t('editor.extensions.CTAS'),
      },
    };
  }
}
