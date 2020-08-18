import * as core from '@actions/core'

import { Input } from '../types'
import { checkInputContent } from './check-input-content'

jest.mock('@actions/core')

describe('checkInputContent', () => {
  it('returns the input if its length is greater than or equal to 1', () => {
    const input = 'An input I am'

    expect(checkInputContent(input, Input.AWS_REGION)).toEqual(input)
  })

  it('calls core.setFailed if the input length is less than 1', () => {
    const input = ''

    checkInputContent(input, Input.AWS_REGION)

    expect(core.setFailed).toBeCalledWith(
      `Value for '${Input.AWS_REGION}' is empty. Are you sure you passed in its value correctly?`,
    )
  })
})
