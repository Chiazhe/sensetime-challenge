import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import PropTypes from "prop-types";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { baseUrl } from "../shared/baseURL";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

/** This Function is used to Create One Single Line of Data. */
function createData(type, name, ppu, student) {
  return { type, name, ppu, student };
}

/** This is the Data for the Table Head Cells. */
const headCells = [
  {
    id: "type",
    numeric: false,
    disablePadding: true,
    label: "Type",
  },
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "ppu", numeric: true, disablePadding: false, label: "PPU" },
  { id: "student", numeric: false, disablePadding: false, label: "Student" },
];

/** This Function Defines the Head Cell of the Table. */
function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="center"></TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

/** This Function Defines the Styling of the Title of the Table. */
const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

/** This Function Defines the Title of the Table. */
const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();

  return (
    <Toolbar>
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Table
      </Typography>
    </Toolbar>
  );
};

/** This Function Defines the Style Used by other Component of the Table. */
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

/** This Function Defines the Table Page. */
function TableQuestion() {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [changed, setChanged] = useState(true);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [ppu, setPpu] = useState("");
  const [student, setStudent] = useState("");
  const [emptyError, setEmptyError] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [reset, setReset] = useState(false);
  const [backup, setBackup] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [filterValueArray, setFilterValueArray] = useState([]);
  const handleChange = (event) => {
    setFilterValue(event.target.value);
  };

  /** This Function is Used to Handle Sorting Request. */
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  /** This Function is Used to Handle Change Page Request. */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /** This Function is Used to Handle Changing Number of Rows Shown Per Page Request. */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  /** This Hook is Used to Keep Track of whether there is Any Filter Applied. */
  useEffect(() => {
    let tempArr = [...tableData, ...backup];
    let tempDeleted = [];
    let i = 0;
    while (i < tempArr.length) {
      if (tempArr[i].type !== filterValue) {
        tempDeleted.push(...tempArr.splice(i, 1));
      } else {
        i++;
      }
    }
    setBackup(tempDeleted);
    setTableData(tempArr);
    setChanged(!changed);
  }, [filterValue]);

  /** This Hook is Used to Keep Track of whether there is Any Changes(Add/Delete) on The Data. */
  useEffect(() => {
    getTypeValue();
    checkppu();
  }, [tableData]);

  
  /** For Some Reason, the useEffect for tableData isn't working when second time rerendering.
   * I use this extra state to keep track of the changes. */
  useEffect(() => {
    getTypeValue();
    checkppu();
  }, [changed]);

  
  /** This Hook is Used to Fetch Data from Server During Initial Loading. */
  useEffect(() => {
    axios
      .get(baseUrl + "table")
      .then((response) => setTableData(response.data));
  }, []);

  /** This Function is Used in Sorting. */
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  /** This Function is Used in Sorting. */
  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  /** This Function is Used in Sorting. */
  function stableSort(comparator) {
    let tempArray = [...tableData];
    const stabilizedThis = tempArray.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  /** This Function is Used in when Adding New Data. */
  function handleSubmit(event) {
    event.preventDefault();
    if (
      type.trim() === "" ||
      name.trim() === "" ||
      ppu.trim() === "" ||
      student.trim() === ""
    ) {
      setEmptyError(true);
    } else {
      setType("");
      setName("");
      setPpu("");
      setStudent("");
      setEmptyError(false);
      setChanged(!changed);
      let tempArr = tableData;
      tempArr.unshift(createData(type, name, ppu, student));
      setTableData(tempArr);
      alert("Item Added");
    }
  }

  /** This Function is Used in when Deleting Data. */
  function deleteData(id) {
    setChanged(!changed);
    let tempArr = tableData;
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].id === id) {
        tempArr.splice(i, 1);
        break;
      }
    }
    setTableData(tempArr);
  }

  
  /** This Function is Used to Check Whether is thee Any Duplicated ppu. */
  function checkppu() {
    let tempArr = tableData;
    tempArr.sort((a, b) => (a.ppu > b.ppu ? 1 : -1));
    let i = 0;
    while (i < tempArr.length - 1) {
      if (tempArr[i].ppu == tempArr[i + 1].ppu) {
        tempArr.splice(i, 1);
        setReset(true);
      } else {
        i++;
      }
    }
    if (reset) {
      setTableData(tempArr);
      setChanged(!changed);
      setReset(false);
    }
  }

  /** This Function is Used to Keep Track of the Filters for Type Value. */
  function getTypeValue() {
    let tempArr = [...tableData, ...backup];
    tempArr.sort((a, b) => (a.type > b.type ? 1 : -1));
    let i = 0;
    while (i < tempArr.length - 1) {
      if (tempArr[i].type == tempArr[i + 1].type) {
        tempArr.splice(i, 1);
      } else {
        i++;
      }
    }
    let tempFilterValue = [];
    for (let j = 0; j < tempArr.length; j++) {
      tempFilterValue.push(tempArr[j].type);
    }
    setFilterValueArray(tempFilterValue);
  }

  return (
    <div>
      <div className="head">
        <div className="page-title">Table</div>
        <Button variant="contained" color="primary" href="#contained-buttons">
          <Link to="/">Home Page</Link>
        </Button>
        <Button variant="contained" color="primary" href="#contained-buttons">
          <Link to="/tree">Tree Page</Link>
        </Button>
      </div>
      <div className="container">
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <EnhancedTableToolbar />
            <TableContainer>
              <Table
                size="small"
                className={classes.table}
                aria-labelledby="tableTitle"
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={tableData.length}
                />
                <TableBody>
                  {stableSort(getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.name}
                        >
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            align="center"
                          >
                            {row.type}
                          </TableCell>
                          <TableCell align="center">{row.name}</TableCell>
                          <TableCell align="center">{row.ppu}</TableCell>
                          <TableCell align="center">{row.student}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Delete">
                              <IconButton aria-label="delete">
                                <DeleteIcon
                                  onClick={() => deleteData(row.id)}
                                />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
          <div className="add-new-item-area">
            <h2>Filter</h2>
            <FormControl className="filter">
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterValue}
                onChange={handleChange}
              >
                {filterValueArray.map((filter, i) => {
                  return <MenuItem value={filter}>{filter}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </div>
          <div className="add-new-item-area">
            <h2>Adding a new item</h2>
            {emptyError && (
              <h5 className="error">Please fill in the blank before adding!</h5>
            )}
            <form className={classes.root} noValidate autoComplete="off">
              <span className="input-area">
                <TextField
                  id="standard-textarea"
                  label="Type"
                  placeholder="type"
                  multiline
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </span>
              <span className="input-area">
                <TextField
                  id="standard-textarea"
                  label="Name"
                  placeholder="name"
                  multiline
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </span>
              <span className="input-area">
                <TextField
                  id="standard-textarea"
                  label="PPU"
                  placeholder="PPU"
                  multiline
                  value={ppu}
                  onChange={(e) => setPpu(e.target.value)}
                />
              </span>
              <span className="input-area">
                <TextField
                  id="standard-textarea"
                  label="Student"
                  placeholder="student"
                  multiline
                  value={student}
                  onChange={(e) => setStudent(e.target.value)}
                />
              </span>
            </form>
            <Button
              style={{ margin: "20px" }}
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
            >
              Add item
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableQuestion;
