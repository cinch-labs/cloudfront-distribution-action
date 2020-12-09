module.exports = {
  hooks: {
    'pre-commit': 'lint-staged && npm test && npm run build && npm run package && git add dist',
    'post-merge': 'npm i',
  },
}
