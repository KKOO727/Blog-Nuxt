<template>
  <div>
    <command-button
      :is-active="editorContext.isActive.anchor()"
      :readonly="et.isCodeViewMode"
      :command="openAddAnchorDialog"
      :enable-tooltip="et.tooltip"
      :tooltip="tooltip"
      icon="anchor"
    />

    <el-dialog
      :title="tooltip"
      :visible.sync="addAnchorDialogVisible"
      :append-to-body="true"
      width="400px"
      custom-class="el-tiptap-edit-link-dialog"
    >
      <el-form
        :model="idAttrs"
        label-position="right"
        size="small"
      >
        <el-form-item
          label="Add anchor"
          prop="id"
        >
          <el-input
            v-model="idAttrs.id"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button
          size="small"
          round
          @click="closeAddAnchorDialog"
        >
          Cancel
        </el-button>

        <el-button
          type="primary"
          size="small"
          round
          @mousedown.prevent
          @click="addAnchor"
        >
          Add anchor
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Inject, Vue, Watch } from 'vue-property-decorator';
import { Dialog, Form, FormItem, Input, Checkbox, Button } from 'element-ui';
import { MenuData } from 'tiptap';
import CommandButton from '../CommandButton.vue';

@Component({
  components: {
    [Dialog.name]: Dialog,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
    CommandButton,
  },
})

export default class AddAnchorCommandButton extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  readonly editorContext!: MenuData;

  @Inject() readonly et!: any;

  idAttrs = {};

  addAnchorDialogVisible = false;

  tooltip = "Apply anchor";

  @Watch('addAnchorDialogVisible', { immediate: true })
  onDialogVisibleChange () {
    const attrs = this.editorContext.getMarkAttrs('anchor');
    this.idAttrs = {...attrs};
  }

  private mounted () {
  }

  private addAnchor () {
    this.editorContext.commands.anchor(this.idAttrs);
    this.closeAddAnchorDialog();
  }

  private openAddAnchorDialog () {
    this.addAnchorDialogVisible = true;
  }

  private closeAddAnchorDialog () {
    this.addAnchorDialogVisible = false;
  }
};
</script>
