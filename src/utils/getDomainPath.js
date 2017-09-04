const {host, pathname} = window.location
export const path = host.split('.').includes('github', 'io') ? `/${pathname.split('/')[1]}/` : '/'
