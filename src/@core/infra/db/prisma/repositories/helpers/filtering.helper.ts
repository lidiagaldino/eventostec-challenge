import { Filtering } from "../../../../../domain/interfaces/filtering.interface";

export const getEventFiltering = (filter: Filtering[]) => {
  if (!filter) return {}
  const where = { AND: [] }

  const mappedFilter = filter.map(item => {
    if (item.property == "date") {
      return {
        date: { [item.rule]: new Date(item.value) }
      }
    }

    if (item.property == "title") {
      return {
        title: { [item.rule]: item.value }
      }
    }

    if (item.property == "uf") {
      return {
        address: {
          uf: item.value
        }
      }
    }

    if (item.property == "city") {
      return {
        address: {
          city: item.value
        }
      }
    }
  })

  where.AND = mappedFilter
  return where
}
