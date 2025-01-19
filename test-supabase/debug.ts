export const debug = {
  info: (message: string, data?: any) => {
    console.log(`\n[INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '')
  },
  error: (message: string, data?: any) => {
    console.error(`\n[ERROR] ${message}`, data ? JSON.stringify(data, null, 2) : '')
  },
  warn: (message: string, data?: any) => {
    console.warn(`\n[WARN] ${message}`, data ? JSON.stringify(data, null, 2) : '')
  }
} 