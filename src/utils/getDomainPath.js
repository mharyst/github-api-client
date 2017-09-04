export const path = () => {
  const {host, pathname} = window.location
  return host.split('.').includes('github', 'io') ? pathname.split('/')[1] : '/'
}
