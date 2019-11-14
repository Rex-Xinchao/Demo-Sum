<template>
  <el-dialog
    title="添加节点"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="dialogClose">
    <span>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
        <el-form-item label=" " style="margin-bottom: 0;" prop="isEmpty">
          <el-checkbox v-model="form.isEmpty" style="line-height: 1;">仅添加空节点</el-checkbox>
        </el-form-item>
        <el-form-item label="节点名称" prop="nodeName">
          <el-input v-model="form.nodeName"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
           <el-select style="width: 100%;"
                      v-model="form.productName"
                      :disabled="form.isEmpty"
                      multiple
                      placeholder="请选择">
             <el-option
               v-for="item in options"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
        </el-form-item>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="dialogSave">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
const Options = [
  {
    label: '父节点1',
    value: 1
  },
  {
    label: '父节点2',
    value: 2
  },
  {
    label: '父节点3',
    value: 3
  }
]

export default {
  name: 'add-node',
  data () {
    let vm = this
    return {
      dialogVisible: false,
      form: {
        isEmpty: false,
        nodeName: '',
        productName: ''
      },
      options: Options,
      rules: {
        nodeName: [
          { required: true, message: '请输入节点名称', trigger: 'blur' }
        ],
        productName: [
          {
            validator: (rule, value, callback) => {
              if (vm.form.isEmpty) {
                callback()
              } else if (value.length === 0) {
                callback(new Error('请选择产品名称'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  props: {
    dialogShow: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    dialogShow (data) {
      this.dialogVisible = data
    }
  },
  methods: {
    dialogSave () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('change', this.form)
          this.dialogClose()
        } else {
          return false
        }
      })
    },
    dialogClose () {
      this.dialogVisible = false
      this.form.isEmpty = false
      this.form.nodeName = null
      this.form.productName = null
      this.$refs.form.resetFields()
      this.$emit('change')
    }
  }
}
</script>
