import React from 'react';
import FormInputResource from '../../../components/display/resources/FormInputResource';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store/StoreProvider';
import AntdTable from '../../../components/control/table/AntdTable';
import TableHeader from '../../../components/control/table/TableHeader';
import { string } from 'joi';

type Timeouts = {
  fetchIndex: any;
  fetchAll: any;
};

const timeouts: Timeouts = {
  fetchIndex: 0,
  fetchAll: 0,
};

function Resource(): React.ReactElement {
  const { resourceStore } = useStore();

  React.useEffect(() => {
    if (timeouts.fetchIndex) clearTimeout(timeouts.fetchIndex);
    resourceStore.setLoading(true, 'loading');
    timeouts.fetchIndex = setTimeout(async () => {
      await Promise.all([resourceStore.getAll(), resourceStore.getParent()]);
    }, 1000);
  }, []);

  React.useEffect(() => {
    if (timeouts.fetchAll) clearTimeout(timeouts.fetchAll);
    timeouts.fetchAll = setTimeout(async () => {
      await Promise.all([resourceStore.getAll()]);
    }, 1000);
  }, [resourceStore.filters]);

  const handleRefresh = async () => {
    resourceStore.handleRefresh();
  };

  const handleClickListItem = () => {
    resourceStore.handleOpen('formResource');
  };

  const handleChangeKeyword = (value: string) => {
    resourceStore.handleKeyword(value);
  };

  return (
    <>
      <div className='card card-default'>
        <div className='card-header'>
          <TableHeader
            handleShowForm={handleClickListItem}
            handleRefresh={handleRefresh}
            handleChangeKeyword={handleChangeKeyword}
          />
        </div>
        <div className='card-body'>
          <AntdTable {...resourceStore.tableConfig} />
        </div>
        <div className='card-footer'>
          Visit <a href='https://www.dropzonejs.com'>dropzone.js documentation</a> for more examples and information
          about the plugin.
        </div>
      </div>

      <FormInputResource {...resourceStore.formConfig} />
    </>
  );
}

export default observer(Resource);
