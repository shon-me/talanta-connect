export const formatMoney = (amount) => `${amount < 0 ? '-' : ''}KSh ${Math.abs(amount).toLocaleString('en-KE')}`

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

export function formatRelative(value) {
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  return days < 8 ? `${days} day${days === 1 ? '' : 's'} ago` : formatDate(value)
}

// Saves text as a file (used for receipts until the backend serves real PDFs)
export function downloadTextFile(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}
