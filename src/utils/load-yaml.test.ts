import { loadYaml } from './load-yaml'

describe('loadYaml', () => {
  it('successfully returns a matching snapshot when given a valid yaml file path', () => {
    expect(loadYaml('../templates/cloudfront-distribution.yml')).toMatchSnapshot()
  })

  it('throws an error when given an incorrect path', () => {
    expect(() => {
      loadYaml('../foo-bar.yml')
    }).toThrowError()
  })
})
