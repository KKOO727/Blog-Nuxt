<template>
  <div>
    <!-- <b-form-group> -->
      <b-form-tags v-model="value" :limit="limit" no-outer-focus class="mb-2">
        <template v-slot="{ tags, disabled, addTag, removeTag }">
          <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
            <li v-for="tag in tags" :key="tag" class="list-inline-item">
              <b-form-tag
                @remove="removeTag(tag)"
                :title="tag"
                :disabled="disabled"
                variant="info"
              >{{ tag | truncate(25, '...')}}</b-form-tag>
            </li>
          </ul>

          <b-dropdown size="sm" variant="outline-secondary" block menu-class="w-100">
            <template #button-content>
              Choose items
            </template>
            <b-dropdown-form @submit.stop.prevent="() => {}">
              <b-form-group
                label-for="tag-search-input"
                :label="(type) ? 'Search OR Add Item': 'Search Item'"
                label-cols-md="auto"
                class="mb-0"
                label-size="sm"
                :description="searchDesc"
                :disabled="disabled"
              >
                <b-form-input
                  v-model="search"
                  type="search"
                  size="sm"
                  @keypress="pressEnter"
                  autocomplete="off"
                 ></b-form-input>
              </b-form-group>
            </b-dropdown-form>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button
              v-for="option in availableOptions"
              :key="option"
              @click="onOptionClick({ option, addTag })"
            >
              {{ option | truncate(25, '...') }}
            </b-dropdown-item-button>
            <b-dropdown-text v-if="availableOptions.length === 0">
              There are no list available to select
            </b-dropdown-text>
            <b-dropdown-text v-if="availableOptions.length === 0 && type" style="text-align:center;">
              <b-button variant="primary" size="sm" @click="addNewItem">Add New Item</b-button>
            </b-dropdown-text>
            
          </b-dropdown>
        </template>
      </b-form-tags>
    <!-- </b-form-group> -->
  </div>
</template>

<script>
  import {BFormGroup,BFormTags,BFormTag,BDropdownForm,
  BDropdown,BDropdownText,BDropdownItemButton,
  BDropdownDivider,BFormInput,BIconTagFill, BIcon } from 'bootstrap-vue'
  export default {
    components:{
      BFormGroup,BFormTags,BFormTag,BDropdownForm,
      BDropdown,BDropdownText,BDropdownItemButton,
      BDropdownDivider,BFormInput,BIconTagFill, BIcon
    },
    data() {
      return {
        search: '',
        value: []
      }
    },
    props:{
      options: {
        type: Array,
        default: () => []
      },
      limit: {
        type: Number,
        default: null
      },
      selectedList: {
        type: Array,
        default: () => []
      },
      type: {
        type: String,
        default: ''
      }
    },
    computed: {
      criteria() {
        return this.search.trim().toLowerCase()
      },
      availableOptions() {
        const criteria = this.criteria
        const options = this.options.filter(opt => this.value.indexOf(opt) === -1)
        if (criteria) {
          return options.filter(opt => opt.toLowerCase().indexOf(criteria) > -1);
        }
        return options
      },
      searchDesc() {
        if (this.criteria && this.availableOptions.length === 0) {
          return (this.type) ? 'No matching items. Press enter key then can add new item.': 'No matching items.'
        }
        return ''
      }
    },
    watch: {
      value() {
        this.$emit('setPage', this.value)
      },
      selectedList() {
        this.value = this.selectedList;
      }
    },
    methods: {
      onOptionClick({ option, addTag }) {
        addTag(option)
        this.search = ''
      },
      pressEnter(evt) {
        if(evt.code === 'Enter' || evt.key === 'Enter'){
          this.addNewItem()
        }
      },
      addNewItem(){
          const addItem = this.search.trim();
          if(!!addItem){
            if(this.options.findIndex(item => item.toLowerCase() === addItem.toLowerCase()) > -1 || !this.type) return false;

            this.$bvModal.msgBoxConfirm(`Are you sure to add new ${this.type}: "${addItem}"?`, {
              title: 'Please Confirm Add Item',
              // size: 'sm',
              // buttonSize: 'sm',
              okVariant: 'danger',
              okTitle: 'YES',
              cancelTitle: 'NO',
              footerClass: 'p-2',
              hideHeaderClose: false,
              centered: true
            })
            .then(value => {
              if(value){
                switch (this.type){
                  case 'tag':
                    this.$store.dispatch('blogs/CREATE_TAG', {tagName: addItem})
                    break;
                  case 'category':
                    this.$store.dispatch('blogs/CREATE_CATEGORY', {categoryName: addItem})
                    break;
                }
              }
            })
            .catch(err => {
              // An error occurred
            })
          }
          this.search = ''
      }
    },
    filters: {
      truncate: function (text, length, suffix) {
        if (text.length > length) {
          return text.substring(0, length) + suffix;
        } else {
          return text;
        }
      },
    }
  }
</script>
