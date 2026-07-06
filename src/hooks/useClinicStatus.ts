import { useEffect, useState } from 'react'
import { clinic, hours } from '../data/clinic'

export interface ClinicStatus {
  open: boolean
  label: string
  sub: string
  color: string
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatHour(h: number): string {
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12} ${period}`
}

// Current wall-clock time in the clinic's timezone.
function nowInClinicTz(): { day: number; hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: clinic.timezone,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(new Date())

  const lookup = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }
  const day = weekdayMap[lookup('weekday')] ?? 0
  let hour = parseInt(lookup('hour'), 10)
  if (hour === 24) hour = 0
  const minute = parseInt(lookup('minute'), 10)
  return { day, hour, minute }
}

function computeStatus(): ClinicStatus {
  const { day, hour, minute } = nowInClinicTz()
  const now = hour + minute / 60
  const today = hours[day]

  if (today && now >= today.open && now < today.close) {
    return {
      open: true,
      label: 'Open now',
      sub: `Until ${formatHour(today.close)}`,
      color: '#6B7A3F',
    }
  }

  // Find the next day (including later today) that has opening hours.
  if (today && now < today.open) {
    return {
      open: false,
      label: 'Closed',
      sub: `Opens today ${formatHour(today.open)}`,
      color: '#B08D57',
    }
  }

  for (let i = 1; i <= 7; i++) {
    const idx = (day + i) % 7
    const next = hours[idx]
    if (next) {
      const when = i === 1 ? 'tomorrow' : DAY_NAMES[idx]
      return {
        open: false,
        label: 'Closed',
        sub: `Opens ${when} ${formatHour(next.open)}`,
        color: '#B08D57',
      }
    }
  }

  return { open: false, label: 'Closed', sub: 'Call for hours', color: '#B08D57' }
}

export function useClinicStatus(): ClinicStatus {
  const [status, setStatus] = useState<ClinicStatus>(computeStatus)

  useEffect(() => {
    const id = setInterval(() => setStatus(computeStatus()), 60_000)
    return () => clearInterval(id)
  }, [])

  return status
}
