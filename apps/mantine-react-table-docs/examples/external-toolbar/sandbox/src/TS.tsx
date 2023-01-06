import React, { FC, useReducer, useRef, useState } from 'react';
import MantineReactTable, {
  DensityState,
  MRT_ColumnDef,
  MRT_FullScreenToggleButton,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_TableInstance,
  MRT_TablePagination,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToolbarAlertBanner,
} from 'mantine-react-table';
import type {
  PaginationState,
  RowSelectionState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  alpha,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { data, Person } from './makeData';

//column definitions...
const columns: MRT_ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
  },
];
//end

const Example: FC = () => {
  //we need a table instance ref to pass as a prop to the MRT Toolbar buttons
  const tableInstanceRef = useRef<MRT_TableInstance<Person>>(null);

  //we will also need some weird re-render hacks to force the MRT_ components to re-render since ref changes do not trigger a re-render
  const rerender = useReducer(() => ({}), {})[1];

  //we need to manage the state that should trigger the MRT_ components in our custom toolbar to re-render
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [density, setDensity] = useState<DensityState>('md');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [showColumnFilters, setShowColumnFilters] = useState(false);

  return (
    <Box sx={{ border: 'gray 2px dashed', padding: '1rem' }}>
      {/* Our Custom External Top Toolbar */}
      {tableInstanceRef.current && (
        <Toolbar
          sx={(theme) => ({
            backgroundColor: alpha(theme.palette.secondary.light, 0.2),
            borderRadius: '4px',
            display: 'flex',
            flexDirection: {
              xs: 'column',
              lg: 'row',
            },
            gap: '1rem',
            justifyContent: 'space-between',
            padding: '1.5rem 0',
          })}
        >
          <Box>
            <Button
              color="primary"
              onClick={() => {
                alert('Add User');
              }}
              variant="contained"
            >
              Crete New Account
            </Button>
          </Box>
          <MRT_GlobalFilterTextField table={tableInstanceRef.current} />
          <Box>
            <MRT_ToggleFiltersButton table={tableInstanceRef.current} />
            <MRT_ShowHideColumnsButton table={tableInstanceRef.current} />
            <MRT_ToggleDensePaddingButton table={tableInstanceRef.current} />
            <Tooltip arrow title="Print">
              <IconButton onClick={() => window.print()}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <MRT_FullScreenToggleButton table={tableInstanceRef.current} />
          </Box>
        </Toolbar>
      )}
      <Typography padding="1rem 4px">
        {
          "Hey I'm some page content. I'm just one of your normal components between your custom toolbar and the MRT Table below"
        }
      </Typography>
      {/* The MRT Table */}
      <MantineReactTable
        columns={columns}
        data={data}
        enableBottomToolbar={false}
        enableRowSelection
        enableTopToolbar={false}
        initialState={{ showGlobalFilter: true }}
        // See the Table State Management docs for why we need to use the updater function like this
        onColumnVisibilityChange={(updater) => {
          setColumnVisibility((prev) =>
            updater instanceof Function ? updater(prev) : updater,
          );
          queueMicrotask(rerender); //hack to rerender after state update
        }}
        onDensityChange={(updater) => {
          setDensity((prev) =>
            updater instanceof Function ? updater(prev) : updater,
          );
          queueMicrotask(rerender); //hack to rerender after state update
        }}
        onRowSelectionChange={(updater) => {
          setRowSelection((prev) =>
            updater instanceof Function ? updater(prev) : updater,
          );
          queueMicrotask(rerender); //hack to rerender after state update
        }}
        onPaginationChange={(updater) => {
          setPagination((prev) =>
            updater instanceof Function ? updater(prev) : updater,
          );
          queueMicrotask(rerender); //hack to rerender after state update
        }}
        onShowFiltersChange={(updater) => {
          setShowColumnFilters((prev) =>
            updater instanceof Function ? updater(prev) : updater,
          );
          queueMicrotask(rerender); //hack to rerender after state update
        }}
        state={{
          columnVisibility,
          density,
          rowSelection,
          pagination,
          showColumnFilters,
        }}
        tableInstanceRef={tableInstanceRef} //get access to the underlying table instance ref
      />
      {/* Our Custom Bottom Toolbar */}
      {tableInstanceRef.current && (
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <MRT_TablePagination table={tableInstanceRef.current} />
          <Box sx={{ display: 'grid', width: '100%' }}>
            <MRT_ToolbarAlertBanner
              stackAlertBanner
              table={tableInstanceRef.current}
            />
          </Box>
        </Toolbar>
      )}
    </Box>
  );
};

export default Example;