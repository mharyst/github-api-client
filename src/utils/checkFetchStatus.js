/*eslint no-alert: 0*/
export const checkStatus = response => {
  const {statusText, status} = response
  if (status === 404) {
    throw new Error(statusText)
  }
  if (status === 403) {
    alert('You exceed the rate limit (60/hour), please try again later')
    throw new Error(statusText)
  }
  return response
}
