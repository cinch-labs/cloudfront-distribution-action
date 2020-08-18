import * as core from '@actions/core'

import { Input } from '../types'

type CheckInputContent = (inputValue: string, inputLabel: Input) => string

const checkInputContent: CheckInputContent = (inputValue, inputLabel) => {
  if (inputValue.length < 1) {
    core.setFailed(`Value for '${inputLabel}' is empty. Are you sure you passed in its value correctly?`)
  }
  return inputValue
}

export { checkInputContent }
