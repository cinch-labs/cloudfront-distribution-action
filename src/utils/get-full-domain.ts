type GetFullDomain = (subdomainPrefix: string, route53ZoneName: string) => string

const getFullDomain: GetFullDomain = (subdomainPrefix, route53ZoneName) =>
  subdomainPrefix.length >= 1 ? `${subdomainPrefix}.${route53ZoneName}` : route53ZoneName

export { getFullDomain }
