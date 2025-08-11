import { or, gte, lte, eq, ilike } from 'drizzle-orm'
import { MoviesListParams } from '../schemas/list'
import { movies } from '../../../db/schemas/movies'

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export const applyMoviesFiltersHelper = (
  query: any,
  filter: MoviesListParams,
): any => {
  if (filter.duration) {
    if (filter.duration.min !== undefined)
      query = query.where(gte(movies.duration, filter.duration.min))
    if (filter.duration.max !== undefined)
      query = query.where(lte(movies.duration, filter.duration.max))
  }
  if (filter.release) {
    if (filter.release.start)
      query = query.where(
        gte(movies.releaseDate, formatDate(filter.release.start)),
      )
    if (filter.release.end)
      query = query.where(
        lte(movies.releaseDate, formatDate(filter.release.end)),
      )
  }
  if (filter.genre) query = query.where(eq(movies.genre, filter.genre))
  if (filter.searchTerm) {
    const term = `%${filter.searchTerm.toLowerCase()}%`
    query = query.where(
      or(ilike(movies.title, term), ilike(movies.originalTitle, term)),
    )
  }
  return query
}
