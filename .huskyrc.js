module.exports = {
  hooks: {
    'pre-commit': 'lint-staged && yarn test && yarn build && yarn package && git add dist',
    'post-merge': 'yarn',
  },
}
