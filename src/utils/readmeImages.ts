export function transformReadmeImages(
  content: string,
  username: string,
  repoName: string,
  branch: string = 'main'
): string {
  const rawBase = `https://raw.githubusercontent.com/${username}/${repoName}/${branch}`
  const blobBase = `https://github.com/${username}/${repoName}/blob/${branch}`

  // Transform relative image src in markdown ![alt](./path) or ![alt](path)
  return content
    .replace(/!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g, (_match, alt, src) => {
      const cleanSrc = src.startsWith('./') ? src.slice(2) : src
      return `![${alt}](${rawBase}/${cleanSrc})`
    })
    // Transform relative links [text](./path)
    .replace(/\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g, (_match, text, href) => {
      if (href.startsWith('#')) return _match
      const cleanHref = href.startsWith('./') ? href.slice(2) : href
      return `[${text}](${blobBase}/${cleanHref})`
    })
}
