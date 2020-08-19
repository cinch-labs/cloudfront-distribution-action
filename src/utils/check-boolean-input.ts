import * as core from '@actions/core'

import { Input } from '../types'

type CheckBooleanInput = (inputValue: string, inputLabel: Input) => boolean | undefined

const checkBooleanInput: CheckBooleanInput = (inputValue, inputLabel) => {
  if (inputValue.toLowerCase() !== 'true' && inputValue.toLowerCase() !== 'false') {
    core.setFailed(`Value for '${inputLabel}' is not a boolean but it should be`)
  }

  return inputValue.toLowerCase() === 'true' ? true : false
}

export { checkBooleanInput }
