# Mini GitHub API client
[Demo](https://mharyst.github.io/github-api-client/)
[Demo with owner & filters](https://mharyst.github.io/github-api-client/facebook/?sort=updated&order=desc&has_open_issues&starred_gt=200)

## Build
Auto deploy on master from source branch on every commit
``` bash
# production build with minification
npm run build

# deploy (push ./build to master, run automatic on every commit)
npm run deploy
```
