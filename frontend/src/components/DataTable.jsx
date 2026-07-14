import  { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Table, Checkbox, Divider, Empty } from 'antd';
import { useQuery } from 'react-query';
import { makeGetRequest } from '../api/client';
import { baseColumns } from '../utils';

export default function DataTable({ filters, page, setPage, rowsPerPage, setRowsPerPage }) {
  const [sort, setSort] = useState({ field: null, order: undefined });

  const defaultCheckedList = baseColumns.map((item) => item.key);
  
  const [checkedList, setCheckedList] = useState(() => {
    try {
      const saved = localStorage.getItem('antd_table_columns');
      return saved ? JSON.parse(saved) : defaultCheckedList;
    } catch {
      return defaultCheckedList;
    }
  });

  const ordering = sort.order
    ? `${sort.order === 'descend' ? '-' : ''}${sort.field}`
    : undefined;

  const queryParams = {
    ...filters,
    page,
    limit: rowsPerPage,
    ...(ordering ? { ordering } : {}),
  };

  const { data, isLoading, error, isFetching } = useQuery(
    ['analytics', queryParams],
    () => makeGetRequest('/analytics/', {}, queryParams),
    { keepPreviousData: true }
  );

  const handleTableChange = (pagination, _tableFilters, sorter) => {
    const nextSort = { field: sorter.field, order: sorter.order };
    const nextOrdering = sorter.order
      ? `${sorter.order === 'descend' ? '-' : ''}${sorter.field}`
      : undefined;

    const sortChanged = nextOrdering !== ordering;

    if (sortChanged) {
      setSort(nextSort);
      setPage(1);
    } else {
      setPage(pagination.current);
    }
    setRowsPerPage(pagination.pageSize);
  };

  const handleCheckChange = (list) => {
    setCheckedList(list);
    localStorage.setItem('antd_table_columns', JSON.stringify(list));
  };

  if (error) return <Typography color="error">Failed to load data</Typography>;

  const activeColumns = baseColumns
    .filter((col) => checkedList.includes(col.key))
    .map((col) => ({
      ...col,
      sortOrder: sort.field === col.key ? sort.order : undefined,
    }));

  const options = baseColumns.map(({ key, title }) => ({ label: title, value: key }));

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Box sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
        <Divider style={{ marginTop: 0, marginBottom: 12 }}>Columns Displayed</Divider>
        <Checkbox.Group value={checkedList} options={options} onChange={handleCheckChange} />
      </Box>

      {activeColumns.length === 0 ? (
        <Box sx={{ py: 10, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Empty description="Please select at least one column to display data." />
        </Box>
      ) : (
        <Table
          columns={activeColumns}
          dataSource={data?.results || []}
          rowKey="id"
          loading={isFetching || isLoading}
          onChange={handleTableChange}
          size="small"
          scroll={{ y: 600 }}
          pagination={{
            placement: ['bottomCenter'],
            current: page,
            pageSize: rowsPerPage,
            total: data?.count || 0,
            showSizeChanger: true,
            pageSizeOptions: ['50', '100', '250', '500'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      )}
    </Box>
  );
}
