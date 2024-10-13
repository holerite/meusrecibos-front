export interface ITablePagination {
    pageSize: number;
    pageIndex: number;
}
export interface IDataPagination {
    total_records: number;
    total_pages: number;
    current_page: string;
    next_page: number;
    prev_page: number;
}
