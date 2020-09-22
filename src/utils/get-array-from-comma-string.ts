type GetArrayFromCommaString = (input: string) => string[]

const getArrayFromCommaString: GetArrayFromCommaString = (input) => input.split(',')

export { getArrayFromCommaString }
