import { get, USE_MOCK } from './api'
import { toFeedItem } from './feedService'
import { mockDirectoryPage } from '@/mocks/feedData'

export async function fetchDirectory(kind, { role, cursor = null }) {
  // BACKEND: GET /api/brands/?cursor=<opaque string>   and   GET /api/creators/?cursor=<opaque string>
  //   Auth is optional (send the session so the server knows who is asking).
  //   -> { results: [ ...same fields as the feed items ], next_cursor: string | null }
  //   Signed in: pages of about 10, as many pages as there are.
  //   Anonymous: one smaller page (about 6) and next_cursor always null.
  //   Keep a stable order (newest or best match first) so paging does not repeat items.
  if (USE_MOCK) return mockDirectoryPage(kind, role, cursor)

  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
  const data = await get(`/${kind}s/${query}`)
  return { items: data.results.map((raw) => toFeedItem({ ...raw, type: kind })), nextCursor: data.next_cursor ?? null }
}
