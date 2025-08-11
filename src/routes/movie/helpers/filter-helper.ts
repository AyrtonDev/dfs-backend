import { or } from 'drizzle-orm'

export const applyFiltersHelper = (
  query: any,
  filter: any,
  schema: any,
): any => {
  if (filter.duration) {
    if (filter.duration.min !== undefined)
      query = query.where(schema.duration.gte(filter.duration.min))
    if (filter.duration.max !== undefined)
      query = query.where(schema.duration.lte(filter.duration.max))
  }
  if (filter.release) {
    if (filter.release.start)
      query = query.where(
        schema.releaseDate.gte(new Date(filter.release.start)),
      )
    if (filter.release.end)
      query = query.where(schema.releaseDate.lte(new Date(filter.release.end)))
  }
  if (filter.genre) query = query.where(schema.genre.eq(filter.genre))
  if (filter.searchTerm) {
    const term = `%${filter.searchTerm.toLowerCase()}%`
    query = query.where(
      or(schema.title.ilike(term), schema.originalTitle(term)),
    )
  }
  return query
}
