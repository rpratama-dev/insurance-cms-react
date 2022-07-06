import * as React from 'react';
import { DataGrid, GridSortModel, GridColDef } from '@mui/x-data-grid';
import { observer } from 'mobx-react-lite';

type Props<R extends object, C extends GridColDef> = {
  rows: R[];
  cols: C[];
  handleSort: (model: GridSortModel) => void;
};

function MyTable<R extends object, C extends GridColDef>(props: Props<R, C>) {
  const { rows, cols, handleSort } = props;

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={cols}
        pageSize={5}
        checkboxSelection
        rowsPerPageOptions={[10, 20, 50]}
        pagination
        autoPageSize
        sortingMode='server'
        disableColumnFilter
        onPageChange={(page, details) => console.log({ page, details })}
        onPageSizeChange={(pageSize, details) => console.log({ pageSize, details })}
        onRowDoubleClick={(params) => console.log({ params })}
        onSelectionModelChange={(selectionModel, details) => console.log({ selectionModel, details })}
        onSortModelChange={(model) => handleSort(model)}
        onFilterModelChange={(model, details) => console.log({ model, details })}
      />
    </div>
  );
}

export default observer(MyTable);
