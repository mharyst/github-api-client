export const ParseGithubLink = (header) => {
  if (header === null || header.length === 0) {
    return {}
  }

  // Split parts by comma
  const parts = header.split(',')
  // Parse each part into a named link
  return parts.reduce((result, part) => {
    const section = part.split(';')
    if (section.length !== 2) {
      throw new Error('section could not be split on \';\'')
    }
    const url = section[0].replace(/<(.*)>/, '$1').trim()
    const name = section[1].replace(/rel="(.*)"/, '$1').trim()
    return {...result, [name]: url}
  }, {})
}
