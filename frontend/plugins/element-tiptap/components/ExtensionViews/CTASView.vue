<template>
  <el-form ref="form" class="cta-form">

  <el-form-item class="title-content">
    Do you want a Quick and Cheap<br/>
    <strong>Residence Visa</strong>
    and<br/>
    <strong>Easy Second Passport</strong>
  </el-form-item>
<!-- 
    <el-row :gutter="10">
      <el-col :span="12">
        <el-select v-model="country" placeholder="please select your country">
          <el-option :label="item" :value="item" v-for="(item, index) in countries" :key="index"></el-option>
        </el-select>
      </el-col>
      <el-col :span="11">
        <el-input v-model="email" placeholder="please input your email"></el-input>
      </el-col>
    </el-row> -->

    <el-form-item>
      <el-button type="primary" @click="onSubmit">Send</el-button>
    </el-form-item>

</el-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Form, FormItem, Select, Option, Col, Row, Button, Input } from 'element-ui';

@Component({
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Select.name]: Select,
    [Option.name]: Option,
    [Col.name]: Col,
    [Row.name]: Row,
    [Button.name]: Button,
    [Input.name]: Input,
  },
})
export default class CTASView extends Vue {
  @Prop({
    type: String,
    required: false,
  })
  readonly country!: String;

  @Prop({
    type: String,
    required: false,
  })
  readonly email!: String;

  get countries() {
    return [
      'Panama',
      'Angola',
      'Albania',
      'Azerbaijan',
      'Jamaica',
      'Viet Nam'
    ]
  }

  private onSubmit() {
    console.log("onSubmit");
  }
};
</script>
<style>

</style>