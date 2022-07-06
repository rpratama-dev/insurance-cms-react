import React from 'react';
/* eslint-disable react/require-default-props */
import { Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface';

export type TPG = TablePaginationConfig;
export type TFT = Record<string, FilterValue | null>;
export type TST<R extends object> = SorterResult<R> | SorterResult<R>[];
export type TET<R extends object> = TableCurrentDataSource<R>;

export type TableConfig<RT extends object> = {
  cols: ColumnsType<RT>;
  rows: RT[];
  page: number;
  perPage: number;
  totalRow: number;
  loading: boolean;
  onChangePagination?: (page: number, pageSize: number) => void;
  onChangeTable?: (pagination: TPG, filters: TFT, sorter: TST<RT>, extra: TET<RT>) => void;
};

function AntdTable<RecordType extends object>(props: TableConfig<RecordType>): JSX.Element {
  const { onChangePagination, onChangeTable, ...other } = props;
  const newRows: RecordType[] = other.rows.map((el) => {
    const element = el as any;
    element.key = element.id;
    return element;
  });
  return (
    <Table
      className='table table-sm'
      size='small'
      loading={other.loading}
      pagination={{
        current: other.page,
        pageSize: other.perPage,
        total: other.totalRow,
        size: 'default',
        showTotal: (ttl: number, rg: [number, number]) => `${rg[0]}-${rg[1]} of ${ttl} items`,
        onChange: onChangePagination,
        pageSizeOptions: [10, 15, 25, 50],
      }}
      columns={other.cols}
      dataSource={newRows}
      onChange={onChangeTable}
      scroll={{ x: '100vw', y: 'calc(100vh - 250px)' }}
    />
  );
}

export default AntdTable;
