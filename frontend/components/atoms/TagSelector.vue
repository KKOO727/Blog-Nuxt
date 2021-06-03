<template>
  <b-form-group :label="label">
    <b-form-tags v-model="tagList" size="lg" :limit="limit" add-on-change no-outer-focus class="mb-0">
      <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
        <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
          <li v-for="tag in tags" :key="tag" class="list-inline-item">
            <b-form-tag
              :title="tag"
              :disabled="disabled"
              variant="info"
              @remove="removeTag(tag)"
            >
              {{ tag }}
            </b-form-tag>
          </li>
        </ul>
        <b-form-select
          v-bind="inputAttrs"
          :disabled="disabled || availableOptions.length === 0"
          :options="availableOptions"
          v-on="inputHandlers"
        >
          <template v-slot:first>
            <option disabled value="">
              Tag Select
            </option>
          </template>
        </b-form-select>
      </template>
    </b-form-tags>
  </b-form-group>
</template>

<script>
import { BFormGroup, BFormTags, BFormSelect, BFormTag } from 'bootstrap-vue'

export default {
  name: 'TagSelector',
  components: {
    BFormGroup,
    BFormTags,
    BFormSelect,
    BFormTag
  },
  props: {
    formTags: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: null
    },
    wholeList: {
      type: Array,
      default: () => []
    },
  },
  data: () => ({
    // wholeList: [],
    error: null,
    tagList: []
  }),
  computed: {
    availableOptions () {
      return this.wholeList.filter(opt => !this.tagList.includes(opt))
    }
  },
  watch: {
    tagList () {
      const listIndex = []
      this.tagList.forEach(item => {
        listIndex.push(this.wholeList.indexOf(item))
      })
      this.$emit('changeTags', this.tagList, listIndex)
    },
    formTags () {
      this.tagList = this.formTags
    }
  },
  async created () {
  },
  methods: {
    onContext () {
      // this.$log.debug(this.form.date)
    }
  }
}
</script>
