export {}

declare global {
  interface Window {
    refreshFeedingHistory?: () => void
  }
}