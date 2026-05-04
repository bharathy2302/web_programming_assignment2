<template>
  <div id="app" class="min-vh-100 d-flex flex-column app-bg">
    <header class="py-4 shadow-sm mb-4 header-hero">
      <div class="container">
        <div class="d-flex align-items-center">
          <img src="./assets/logo.png" alt="logo" style="height:52px;"/>
          <div class="ms-3">
            <h1 class="h4 mb-1 text-white">Employee Management</h1>
            <small class="text-white-50">Create · Read · Update · Delete</small>
          </div>
          <span class="badge ms-auto hero-badge">Live Sync</span>
        </div>
        <div class="row g-3 mt-3">
          <div class="col-6 col-lg-3">
            <div class="stat-tile">
              <div class="stat-label">Employees</div>
              <div class="stat-value">{{ employees.length }}</div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="stat-tile">
              <div class="stat-label">Departments</div>
              <div class="stat-value">{{ departmentCount }}</div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="stat-tile">
              <div class="stat-label">Avg Salary</div>
              <div class="stat-value">{{ averageSalary }}</div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="stat-tile">
              <div class="stat-label">Last Updated</div>
              <div class="stat-value">{{ lastUpdated }}</div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="container mb-5">
      <div class="row g-4">
        <div class="col-lg-4">
          <employee-form :selected="selected" @save="saveEmployee" @cancel="clearSelection" />
        </div>
        <div class="col-lg-8">
          <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
          <div v-if="isLoading" class="alert alert-info">Loading employees...</div>
          <employee-list :employees="employees" @edit="selectEmployee" @delete="deleteEmployee" />
        </div>
      </div>
    </main>

    <footer class="mt-auto py-3 text-center text-muted">
      <div class="container">Built with Vue.js & Bootstrap — connected to MockAPI</div>
    </footer>
  </div>
</template>

<script>
import EmployeeForm from './components/EmployeeForm.vue'
import EmployeeList from './components/EmployeeList.vue'
import employeeService from './services/employeeService'

export default {
  name: 'App',
  components: { EmployeeForm, EmployeeList },
  data() {
    return {
      employees: [],
      selected: null,
      isLoading: false,
      errorMsg: ''
    }
  },
  mounted() {
    this.fetchEmployees()
  },
  computed: {
    departmentCount() {
      const unique = new Set(this.employees.map(e => (e.department || '').trim()).filter(Boolean))
      return unique.size
    },
    averageSalary() {
      const salaries = this.employees.map(e => Number(e.salary)).filter(n => Number.isFinite(n))
      if (!salaries.length) return '$0'
      const avg = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
      return `$${avg}`
    },
    lastUpdated() {
      if (!this.employees.length) return '---'
      return new Date().toLocaleDateString()
    }
  },
  methods: {
    async fetchEmployees() {
      this.isLoading = true
      this.errorMsg = ''
      try {
        const { data } = await employeeService.getEmployees()
        console.log('Employees fetched successfully:', data)
        this.employees = data
      } catch (err) {
        console.error('Error fetching employees:', err)
        this.errorMsg = `Failed to load employees: ${err.message}`
      } finally {
        this.isLoading = false
      }
    },
    async saveEmployee(emp) {
      this.errorMsg = ''
      try {
        if (emp.id) {
          const { data } = await employeeService.updateEmployee(emp.id, emp)
          console.log('Employee updated:', data)
          const idx = this.employees.findIndex(e => e.id === emp.id)
          if (idx !== -1) this.employees.splice(idx, 1, data)
          this.selected = null
        } else {
          const { data } = await employeeService.createEmployee(emp)
          console.log('Employee created:', data)
          this.employees.unshift(data)
        }
      } catch (err) {
        console.error('Error saving employee:', err)
        this.errorMsg = `Failed to save employee: ${err.message}`
      }
    },
    selectEmployee(emp) {
      this.selected = { ...emp }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    async deleteEmployee(emp) {
      if (!confirm(`Delete ${emp.name}?`)) return
      this.errorMsg = ''
      try {
        await employeeService.deleteEmployee(emp.id)
        console.log('Employee deleted:', emp.id)
        this.employees = this.employees.filter(e => e.id !== emp.id)
        if (this.selected && this.selected.id === emp.id) this.selected = null
      } catch (err) {
        console.error('Error deleting employee:', err)
        this.errorMsg = `Failed to delete employee: ${err.message}`
      }
    },
    clearSelection() {
      this.selected = null
    }
  }
}
</script>

<style>
#app { font-family: Avenir, Helvetica, Arial, sans-serif; }
.app-bg {
  background-image:
    radial-gradient(1200px 400px at 20% 0%, rgba(102, 126, 234, 0.12), transparent 60%),
    radial-gradient(900px 400px at 85% 10%, rgba(118, 75, 162, 0.08), transparent 60%),
    linear-gradient(180deg,#f8f7ff,#ffffff);
}
.header-hero {
  background: linear-gradient(135deg,#667eea,#764ba2);
  border-radius: 0 0 14px 14px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}
.hero-badge {
  background: rgba(255,255,255,0.2);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.4);
  font-weight: 600;
}
.stat-tile {
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 12px;
  padding: 12px 14px;
  color: #fff;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.stat-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.75); }
.stat-value { font-size: 20px; font-weight: 700; }
main { padding-top: 8px; }
.card { border-radius: 10px; }
</style>
