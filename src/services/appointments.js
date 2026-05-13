import api from './api'

export const appointmentService = {
  async getAll(status = null) {
    const params = status ? { status } : {}
    const response = await api.get('/appointments', { params })
    return response.data
  },

  async create(data) {
    const response = await api.post('/appointments', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/appointments/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/appointments/${id}`)
    return response.data
  },

  async getDoctors() {
    const response = await api.get('/doctors')
    return response.data
  },
}