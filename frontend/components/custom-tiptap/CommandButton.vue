<template>
  <el-tooltip
    :content="tooltip"
    :open-delay="350"
    :disabled="!enableTooltip || readonly"
    transition="el-zoom-in-bottom"
    effect="dark"
    placement="top"
  >
    <div
      :class="commandButtonClass"
      @mousedown.prevent
      @click="onClick"
    >
      <v-icon :name="icon" />
    </div>
  </el-tooltip>
</template>

<script lang="ts">
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/anchor';
import 'vue-awesome/icons/video';

import { Component, Prop, Vue } from 'vue-property-decorator';
import { Tooltip } from 'element-ui';

@Component({
  components: {
    'v-icon': Icon,
    [Tooltip.name]: Tooltip,
  },
})

export default class CommandButton extends Vue {
  @Prop({
    type: String,
    required: true,
  })
  readonly icon!: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  readonly isActive!: boolean;

  @Prop({
    type: String,
    required: true,
  })
  readonly tooltip!: string;

  @Prop({
    type: Boolean,
    required: true,
  })
  readonly enableTooltip!: boolean;

  @Prop({
    type: Function,
    default: {},
  })
  readonly command!: Function;

  @Prop({
    type: Boolean,
    default: false,
  })
  readonly readonly!: boolean;

  private get commandButtonClass (): object {
    return {
      'el-tiptap-editor__command-button': true,
      'el-tiptap-editor__command-button--active': this.isActive,
      'el-tiptap-editor__command-button--readonly': this.readonly,
    };
  }

  onClick () {
    if (!this.readonly) this.command();
  }
}
</script>
