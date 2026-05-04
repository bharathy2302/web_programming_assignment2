<template>
  <div>
    <div class="card shadow-sm border-0 mb-3 list-card">
      <div class="card-body">
        <div class="d-flex align-items-center mb-3">
          <div class="list-icon">📋</div>
          <div class="ms-2">
            <h5 class="card-title text-primary mb-0">Employees</h5>
            <small class="text-muted">Manage and review all records</small>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-head">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Salary</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(emp, idx) in employees" :key="emp.id">
                <td>{{ idx + 1 }}</td>
                <td>{{ emp.name }}</td>
                <td>{{ emp.designation }}</td>
                <td>
                  <span class="badge" :class="departmentBadge(emp.department)">{{ emp.department || 'General' }}</span>
                </td>
                <td>{{ formatSalary(emp.salary) }}</td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-primary me-2" @click="$emit('edit', emp)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', emp)">Delete</button>
                </td>
              </tr>
              <tr v-if="!employees || employees.length===0">
                <td colspan="6" class="text-center text-muted">No employees yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeList',
  props: {
    employees: { type: Array, default: () => [] }
  },
  methods: {
    formatSalary(value) {
      const num = Number(value)
      if (!Number.isFinite(num)) return '-'
      return `$${num}`
    },
    departmentBadge(dept) {
      const key = (dept || '').toLowerCase()
      if (key.includes('eng')) return 'bg-primary-subtle text-primary'
      if (key.includes('design')) return 'bg-warning-subtle text-warning'
      if (key.includes('product')) return 'bg-info-subtle text-info'
      if (key.includes('hr')) return 'bg-danger-subtle text-danger'
      return 'bg-secondary-subtle text-secondary'
    }
  }
}
</script>

<style scoped>
.list-card { background: linear-gradient(180deg,#ffffff,#f8f5ff); }
.list-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg,#f093fb,#f5576c);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 22px;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.35);
}
.table-head {
  background: linear-gradient(90deg,#f0ebff,#f8f5ff);
}
</style>
