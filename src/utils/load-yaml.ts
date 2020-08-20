// import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'

type LoadYAML = (input: string) => string

const loadYaml: LoadYAML = (input) => {
  const yamlPath = path.join(__dirname, input)

  let templateBody

  try {
    templateBody = fs.readFileSync(yamlPath, 'utf-8')
  } catch (error) {
    throw new Error(
      `Unable to parse CloudFormation template yaml file
    ${error}
    `,
    )
  }

  return templateBody
}

export { loadYaml }
