export const formatDate = date => {
  const dd = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  const mm = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  const yy = date.getFullYear() % 100 < 10 ? `0${date.getFullYear() % 100}` : date.getFullYear() % 100

  return `${dd}.${mm}.${yy}`
}
