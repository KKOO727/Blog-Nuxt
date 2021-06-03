import { Link } from '../../../plugins/element-tiptap/index'
import { Plugin, TextSelection } from 'prosemirror-state'
import { getMarkRange } from 'tiptap-utils'
import { updateMark, removeMark } from 'tiptap-commands'
import AddAnchorCommandButton from './AddAnchorCommandButton.vue'

function getAttrs (dom) {
  return {
    id: dom.getAttribute('id')
  }
}

function toDOM (mark) {
  const {
    id
  } = mark.attrs
  const attrs = {}
  attrs.id = id

  return ['span', attrs, 0]
}

export default class Anchor extends Link {
  // @ts-ignore

  get name () {
    return 'anchor'
  }

  get schema () {
    return {
      attrs: {
        id: {
          default: null
        }
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'span[id]',
          getAttrs
        }
      ],
      toDOM
    }
  }

  get plugins () {
    return [
      new Plugin({
        props: {
          handleClick (view, pos) {
            const { schema, doc, tr } = view.state

            const range = getMarkRange(doc.resolve(pos), schema.marks.anchor)

            if (!range) { return false }

            const $start = doc.resolve(range.from)
            const $end = doc.resolve(range.to)

            const transaction = tr.setSelection(new TextSelection($start, $end))

            view.dispatch(transaction)
            return true
          }
        }
      })
    ]
  }

  commands ({ type }) {
    return (attrs) => {
      if (attrs.id) {
        return updateMark(type, attrs)
      }

      return removeMark(type)
    }
  }

  menuBtnView (editorContext) {
    return {
      component: AddAnchorCommandButton,
      componentProps: {
        editorContext
      }
    }
  }
}
