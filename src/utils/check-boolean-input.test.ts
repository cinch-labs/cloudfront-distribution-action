import * as core from '@actions/core'

import { Input } from '../types'
import { checkBooleanInput } from './check-boolean-input'

jest.mock('@actions/core')

describe('checkInputContent', () => {
  it('throws an error when the input is not a boolean', () => {
    const input = '123'

    checkBooleanInput(input, Input.CERTIFICATE_HAS_WILDCARD_PREFIX)

    expect(core.setFailed).toBeCalledWith(
      `Value for '${Input.CERTIFICATE_HAS_WILDCARD_PREFIX}' is not a boolean but it should be`,
    )
  })

  it('returns true for permutations of true', () => {
    const inputs = ['true', 'TrUe', 'TRUE']

    inputs.forEach((input) => {
      expect(checkBooleanInput(input, Input.CERTIFICATE_HAS_WILDCARD_PREFIX)).toEqual(true)
      expect(core.setFailed).not.toBeCalled()
    })
  })

  it('returns false for permutations of false', () => {
    const inputs = ['false', 'FalSe', 'FALSE']

    inputs.forEach((input) => {
      expect(checkBooleanInput(input, Input.CERTIFICATE_HAS_WILDCARD_PREFIX)).toEqual(false)
      expect(core.setFailed).not.toBeCalled()
    })
  })
})
