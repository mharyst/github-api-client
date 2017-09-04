export const filtersNormalizer = obj => ({
  hasIssues: obj.has_open_issues !== undefined,
  hasTopics: obj.has_open_topics !== undefined,
  starred: (obj.starred_gt && Number(obj.starred_gt)) ? obj.starred_gt : 0
})

export const sortNormalizer = obj => {
  const getSortBy = () => {
    switch (obj.sort) {
      case 'updated':
        return 'Updated date'
      case 'stars':
        return 'Stars count'
      case 'issues':
        return 'Open issues count'
      default:
        return 'Repo name'
    }
  }
  return {
    sortBy: getSortBy(),
    sortOrder: obj.order === 'asc' ? 'asc' : 'desc'
  }
}
