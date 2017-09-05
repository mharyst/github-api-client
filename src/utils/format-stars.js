export const formatStars = stars => {
  const formatedStars = stars > 1000 ? `${parseFloat(stars / 1000, -1).toFixed(1)} K` : stars

  return formatedStars
}
