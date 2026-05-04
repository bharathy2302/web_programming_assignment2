<template>
  <div class="card shadow-sm border-0 form-card">
    <div class="card-body">
      <div class="d-flex align-items-center mb-3">
        <div class="form-icon">✎</div>
        <div class="ms-2">
          <h5 class="card-title text-primary mb-0">{{ isEdit ? 'Update Employee' : 'Add Employee' }}</h5>
          <small class="text-muted">Keep records clean and up to date</small>
        </div>
      </div>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input v-model="form.name" type="text" class="form-control" placeholder="Full name" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Designation</label>
          <input v-model="form.designation" type="text" class="form-control" placeholder="e.g. Software Engineer" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Department</label>
          <input v-model="form.department" type="text" class="form-control" placeholder="e.g. Engineering" />
        </div>
        <div class="mb-3">
          <label class="form-label">Salary</label>
          <input v-model.number="form.salary" type="number" class="form-control" placeholder="Numeric value" />
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-success">{{ isEdit ? 'Save Changes' : 'Add Employee' }}</button>
          <button type="button" @click="onReset" class="btn btn-outline-secondary">Reset</button>
          <button v-if="isEdit" type="button" @click="$emit('cancel')" class="btn btn-outline-danger ms-auto">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeForm',
  props: {
    selected: { type: Object, default: null }
  },
  data() {
    return {
      form: this.emptyForm()
    }
  },
  computed: {
    isEdit() {
      return !!(this.selected && this.selected.id)
    }
  },
  watch: {
    selected: {
      handler(val) {
        if (val) this.form = { ...val }
        else this.form = this.emptyForm()
      },
      immediate: true
    }
  },
  methods: {
    emptyForm() {
      return { id: null, name: '', designation: '', department: '', salary: null }
    },
    onSubmit() {
      // emit save with the employee object
      this.$emit('save', { ...this.form })
      if (!this.isEdit) this.form = this.emptyForm()
    },
    onReset() {
      if (this.isEdit) this.form = { ...this.selected }
      else this.form = this.emptyForm()
    }
  }
}
</script>

<style scoped>
.form-card { background: linear-gradient(180deg,#ffffff, #f8f5ff); }
.card-title { font-weight: 700; }
.form-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg,#667eea,#764ba2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 22px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}
</style>
