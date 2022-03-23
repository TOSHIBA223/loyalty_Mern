/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  Box,
  Button,
} from '@material-ui/core';
import moment from 'moment';
import {
  Camera as PhotoIcon,
} from 'react-feather';
import { useTable, usePagination } from 'react-table';
import { NavigateBeforeSharp } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  tableTag: {
    borderSpacing: 0,
    border: '1px solid black',
    borderBottom: 0,
    borderRight: 0,
  },
  trTag: {
    // '& > :last-child': {
    //   borderBottom: 0,
    // }
  },
  thTdTag: {
    margin: 0,
    padding: '0.5rem',
    borderBottom: '1px solid black',
    borderRight: '1px solid black',
    // '& > :last-child': {
    //   borderRight: 0,
    // },
  },
  inputTag: {
    fontSize: '1rem',
    padding: 0,
    margin: 0,
    border: 0,
  },
  cellBtn: {
    borderRadius: '0',
    backgroundColor: '#efefef',
    color: '#000',
  },
  cellBtnTwo: {
    borderRadius: '0',
    backgroundColor: '#efefef',
    color: '#000',
    marginRight: '5px',
  },
  cellWrapper: {
    display: 'flex',
  },
  cellLabelWH: {
    width: '150px',
    paddingTop: '8px',
  }
}));
function newRecord(columns) {
  const rtn = {};
  // eslint-disable-next-line array-callback-return
  columns.map((item) => {
    rtn[item.accessor] = '';
  });
  return rtn;
}

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

function makeData(columns, ...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    // eslint-disable-next-line no-unused-vars
    return range(len).map((d) => ({
      ...newRecord(columns),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }));
  };

  return makeDataLevel();
}

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  selectMyData,
  columnWidths,
}) => {
  const classes = useStyles();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={classes.inputTag}
      id={`id_${index}_${id}`}
      style={{ width: columnWidths ? columnWidths[id] : '' }}
    />
  );
};

// Create an editable cell renderer
const NonEditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  columnWidths,
}) => {
  const classes = useStyles();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
    // updateMyData(index, id, value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // convert to 10/01/2021 13:44:00 format
  let valueFormatted = '';
  try {
    if (initialValue !== '') {
      valueFormatted = moment(initialValue).format('MM/DD/YYYY HH:mm:ss');
    }
  // eslint-disable-next-line no-empty
  } catch (ex) {
  }

  return (
    <input
      value={valueFormatted}
      onChange={onChange}
      onBlur={onBlur}
      className={classes.inputTag}
      readOnly
      style={{ width: columnWidths ? columnWidths[id] : '' }}
    />
  );
};

// Create an editable cell renderer
const NonEditableCellPhoto = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  columnWidths,
  onPhotoViewClick,
}) => {
  const classes = useStyles();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
    // updateMyData(index, id, value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // convert to 10/01/2021 13:44:00 format
  let valueFormatted = '';
  try {
    if (initialValue !== '') {
      valueFormatted = moment(initialValue).format('MM/DD/YYYY HH:mm:ss');
    }
  // eslint-disable-next-line no-empty
  } catch (ex) {
  }

  return (
    <div
      value={value}
      id={`id_${index}_${id}`}
      style={{ minWidth: '64px' }}
    >
      {initialValue === '' && (
        <span>&nbsp;</span>
      )}
      {initialValue !== '' && (
        <Button
          onClick={() => onPhotoViewClick(index)}
        >
          <PhotoIcon />
        </Button>
      )}
    </div>
  );
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
  NonEditableCell,
  NonEditableCellPhoto,
};

// Be sure to pass our updateMyData and the skipPageReset option
function EditableTablePhoto({
  columns, data, updateMyData, skipPageReset, onSelectClick, customPageSize = 50, handleDeleteRow, selectMyData, columnWidths, onPhotoViewClick
}) {
  const classes = useStyles();
  // For this example, we're using pagination to illustrate how to stop
  // the current page from resetting when our data changes
  // Otherwise, nothing is different here.
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    // canPreviousPage,
    // canNextPage,
    // pageOptions,
    // pageCount,
    // gotoPage,
    // nextPage,
    // previousPage,
    setPageSize,
    // eslint-disable-next-line no-unused-vars
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      onSelectClick,
      selectMyData,
      columnWidths,
      onPhotoViewClick,
    },
    usePagination
  );

  React.useEffect(() => {
    setPageSize(customPageSize);
  }, []);

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()} className={classes.tableTag}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className={classes.trTag}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className={classes.thTdTag}>{column.render('Header')}</th>
              ))}
              <th className={classes.thTdTag}>Action</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className={classes.trTag}>
                {row.cells.map(
                  (cell, colIdx) => {
                    if (colIdx === 0) {
                      return <td {...cell.getCellProps()} className={classes.thTdTag}>{cell.render('NonEditableCellPhoto')}</td>;
                    }
                    if (colIdx === 1) {
                      return <td {...cell.getCellProps()} className={classes.thTdTag}>{cell.render('NonEditableCell')}</td>;
                    }
                    return <td {...cell.getCellProps()} className={classes.thTdTag}>{cell.render('Cell')}</td>;
                  }
                )}
                <td className={classes.thTdTag}>
                  <Button
                    className={classes.cellBtnTwo}
                    onClick={() => onSelectClick(i)}
                  >
                    ...
                  </Button>
                  <Button
                    className={classes.cellBtn}
                    onClick={() => handleDeleteRow(i)}
                  >
                    del
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

EditableCell.propTypes = {
  value: PropTypes.number,
  row: PropTypes.number,
  column: PropTypes.number,
  updateMyData: PropTypes.func,
  selectMyData: PropTypes.func,
  columnWidths: PropTypes.any,
};

NonEditableCell.propTypes = {
  value: PropTypes.number,
  row: PropTypes.number,
  column: PropTypes.number,
  updateMyData: PropTypes.func,
  columnWidths: PropTypes.any,
};

NonEditableCellPhoto.propTypes = {
  value: PropTypes.number,
  row: PropTypes.number,
  column: PropTypes.number,
  updateMyData: PropTypes.func,
  columnWidths: PropTypes.any,
  onPhotoViewClick: PropTypes.func,
};

EditableTablePhoto.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  updateMyData: PropTypes.func,
  skipPageReset: PropTypes.bool,
  customPageSize: PropTypes.number,
  onSelectClick: PropTypes.func,
  handleDeleteRow: PropTypes.func,
  selectMyData: PropTypes.func,
  columnWidths: PropTypes.any,
  onPhotoViewClick: PropTypes.func,
};

export {
  EditableTablePhoto, makeData as makeDataPhoto, newRecord as newRecordPhoto
};
