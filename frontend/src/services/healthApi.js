import { simulateRequest } from '../api/apiClient'
import {
  appointments,
  doctors,
  habitItems,
  healthMetrics,
  hospitals,
  medicineSchedule,
  medicines,
  messages,
  remedies,
} from '../data/dummyData'

export function fetchDashboardData() {
  return simulateRequest({
    appointments,
    habitItems,
    medicineSchedule,
    remedies,
  })
}

export function fetchBookingData() {
  return simulateRequest({
    appointments,
    doctors,
    hospitals,
  })
}

export function fetchPharmacyData() {
  return simulateRequest(medicines)
}

export function fetchPersonalHealthData() {
  return simulateRequest({
    healthMetrics,
    habitItems,
    medicineSchedule,
  })
}

export function fetchMessagesData() {
  return simulateRequest(messages)
}
