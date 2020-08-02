import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  IconButton
} from '@material-ui/core';
import { DragIndicator, DeleteForeverOutlined } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import ListInput from './ListInput'

function getItemList () {
  const storageList = JSON.parse(window.localStorage.getItem('list'));

  if (storageList === null || storageList === undefined) {
    let itemList = [];
  
    for (let i = 0; i < 100; i++) {
      itemList.push({
        id: i,
        value: `Item ${ i + 1 }`
      })
    };
  
    return itemList;
  } else {
    return storageList;
  }
};

function replaceListItem (list, from, to) {
  let newList = [...list];
  const startIndex = to < 0 ? newList.length + to : to;
  
	if (startIndex >= 0 && startIndex < newList.length) {
    const item = newList.splice(from, 1)[0];

		newList.splice(startIndex, 0, item);
  }
  
  return newList;
};

function updateListItem (list, itemId, value) {
  let editedList = [...list];

  editedList.find(item => item.id === itemId).value = value;

  return editedList;
};

function deleteListItem (list, itemId) {
  let newList = [...list];
  const itemIndex = newList.findIndex(item => item.id === itemId);

  newList.splice(itemIndex, 1)

  return newList
};

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  table: {
    width: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
    display: 'flex',
    'justify-content': 'center',
  },
  rowContainer: {
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'flex-end'
  },
  dragIcon: {
    fontSize: 30,
  }
});

// Placed here because it throws a JS error if defined in a render function (https://github.com/clauderic/react-sortable-hoc/issues/549)
const SortableItem = SortableElement(({ row, handleInputChange, classList, handleDelete }) => (
  <TableRow key={row.id}>
    <TableCell scope="row" readOnly>
      <div className={classList.rowContainer}>
        <DragIndicator className={classList.dragIcon} />
        <ListInput value={row.value} rowId={row.id} handleInputChange={handleInputChange} />
        <IconButton
          onClick={handleDelete.bind(this, row.id)}
          aria-label="Delete button" >
          <DeleteForeverOutlined />
        </IconButton>
      </div>
    </TableCell>
  </TableRow>
));

// Placed here because it throws a JS error if defined in a render function (https://github.com/clauderic/react-sortable-hoc/issues/549)
const SortableList = SortableContainer(({ rows, rowsPerPage, page, emptyRows, handleInputChange, classList, handleDelete }) => {
  return (
    <TableBody>
      {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
        <SortableItem
          row={row}
          key={`item-${row.id}`}
          index={rows.findIndex(item => item === row)}
          handleInputChange={handleInputChange}
          handleDelete={handleDelete}
          classList={classList} />
      ))}
      {emptyRows > 0 && (
        <TableRow style={{ height: 48 * emptyRows }}>
          <TableCell colSpan={6}/>
        </TableRow>
      )}
    </TableBody>
  );
});

class PaginationTable extends React.Component {
  state = {
    rows: getItemList(),
    page: 0,
    rowsPerPage: 10
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  onSortEnd = ({oldIndex, newIndex}) => {
    const newList = replaceListItem(this.state.rows, oldIndex, newIndex)

    this.setState(() => ({
      rows: newList,
    }));

    this.setListToLocalStorage(newList)
  };

  handleInputChange = (rowId, value) => {
    const newList = updateListItem(this.state.rows, rowId, value)
  
    this.setState(() => ({
      rows: newList
    }));

    this.setListToLocalStorage(newList)
  };

  handleDelete = itemId => {
    const newList = deleteListItem(this.state.rows, itemId)

    this.setState(() => ({
      rows: newList
    }));

    this.setListToLocalStorage(newList)
  };

  setListToLocalStorage = newList => {
    window.localStorage.setItem('list', JSON.stringify(newList))
  };

  render() {
    const { classes } = this.props;
    const { rows, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <SortableList 
              rows={rows}
              rowsPerPage={rowsPerPage}
              page={page} emptyRows={emptyRows}
              onSortEnd={this.onSortEnd}
              handleInputChange={this.handleInputChange}
              handleDelete={this.handleDelete}
              classList={classes}
              lockAxis={'y'}
              pressDelay={200}
            />

            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    native: true,
                  }}
                  onChangePage={this.handleChangePage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

PaginationTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaginationTable);
