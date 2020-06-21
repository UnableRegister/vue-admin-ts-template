export default class PaginationPage {
  page: number
  limit: number
  total: number

  constructor(total = 0, page = 0, limit = 30) {
    this.total = total
    this.limit = limit
    this.page = page
  }
}
