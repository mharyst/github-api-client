export const findUsers = username => {
  fetch(`https://api.github.com/search/users?q=${username}`).then(result => {
    return result
  })
}
