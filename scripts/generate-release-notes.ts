#!/usr/bin/env bun

/**
 * Generates rich release notes for GitHub releases.
 * Runs in CI with access to GITHUB_TOKEN for API calls.
 * Outputs formatted markdown to stdout.
 */

const REPO = process.env.GITHUB_REPOSITORY ?? 'torrescereno/hollow'
const CURRENT_TAG = process.env.GITHUB_REF_NAME ?? ''
const GH_TOKEN = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? ''

interface CommitInfo {
  hash: string
  type: string
  scope: string | undefined
  description: string
  author: string
  prNumber: number | null
}

const SECTION_CONFIG: Array<{ types: string[]; title: string }> = [
  { types: ['feat'], title: 'Features' },
  { types: ['fix'], title: 'Bug Fixes' },
  { types: ['perf'], title: 'Performance' },
  { types: ['docs'], title: 'Documentation' },
  { types: ['refactor'], title: 'Refactoring' },
  { types: ['chore', 'ci', 'build', 'test', 'style', 'revert'], title: 'Internal' }
]

function run(args: string[]): string {
  const result = Bun.spawnSync(args, { stdout: 'pipe', stderr: 'pipe' })
  return new TextDecoder().decode(result.stdout).trim()
}

function getPreviousTag(): string | null {
  const tags = run(['git', 'tag', '--sort=-version:refnum'])
  const tagList = tags.split('\n').filter(Boolean)
  const currentIndex = tagList.indexOf(CURRENT_TAG)

  if (currentIndex === -1) {
    return tagList.length > 0 ? tagList[0] : null
  }

  return tagList[currentIndex + 1] ?? null
}

async function ghApi<T>(endpoint: string): Promise<T | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json'
  }
  if (GH_TOKEN) {
    headers.Authorization = `Bearer ${GH_TOKEN}`
  }

  try {
    const resp = await fetch(`https://api.github.com/${endpoint}`, { headers })
    if (!resp.ok) return null
    return (await resp.json()) as T
  } catch {
    return null
  }
}

async function getCommitAuthor(hash: string): Promise<string> {
  const data = await ghApi<{
    author?: { login: string }
    commit?: { author?: { name: string } }
  }>(`repos/${REPO}/commits/${hash}`)

  return data?.author?.login ?? data?.commit?.author?.name ?? 'unknown'
}

async function getCommitPR(hash: string): Promise<number | null> {
  const data = await ghApi<Array<{ number: number }>>(`repos/${REPO}/commits/${hash}/pulls`)
  return data?.[0]?.number ?? null
}

// --- Main ---

if (!CURRENT_TAG) {
  console.error('GITHUB_REF_NAME is not set.')
  process.exit(1)
}

const previousTag = getPreviousTag()
const range = previousTag ? `${previousTag}..${CURRENT_TAG}` : CURRENT_TAG

const SEP = '---SEP---'
const log = run(['git', 'log', `--pretty=format:%H${SEP}%s`, '--no-merges', range])

if (!log) {
  console.log(`Release ${CURRENT_TAG}`)
  process.exit(0)
}

const rawCommits = log.split('\n').map((line) => {
  const sepIndex = line.indexOf(SEP)
  const hash = line.substring(0, sepIndex)
  const subject = line.substring(sepIndex + SEP.length)
  return { hash, subject }
})

const commits: CommitInfo[] = await Promise.all(
  rawCommits.map(async ({ hash, subject }) => {
    const match = subject.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)/)
    const [author, prNumber] = await Promise.all([getCommitAuthor(hash), getCommitPR(hash)])

    return {
      hash,
      type: match?.[1] ?? 'other',
      scope: match?.[2],
      description: match?.[4] ?? subject,
      author,
      prNumber
    }
  })
)

// Build release notes
const lines: string[] = []
const contributors = new Set<string>()

for (const { types, title } of SECTION_CONFIG) {
  const filtered = commits.filter((c) => types.includes(c.type))
  if (filtered.length === 0) continue

  lines.push(`### ${title}`)
  for (const c of filtered) {
    contributors.add(c.author)
    const scope = c.scope ? `**${c.scope}:** ` : ''
    const pr = c.prNumber ? ` PR #${c.prNumber}` : ''
    const by = ` by @${c.author}`
    lines.push(`- ${scope}${c.description}.${pr}${by}.`)
  }
  lines.push('')
}

if (contributors.size > 0) {
  lines.push('### Contributors')
  for (const author of [...contributors].sort()) {
    lines.push(`- @${author}`)
  }
  lines.push('')
}

console.log(lines.join('\n'))
