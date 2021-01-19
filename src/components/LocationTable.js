import React, { useState, useMemo } from 'react'
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, usePagination, useSortBy } from 'react-table'
import { makeStyles } from '@material-ui/core/styles'
import { Table as MaUTable
  , TableBody
  , TableCell
  , TableHead
  , TableRow
  , Button
  , ButtonGroup
  , TextField
  , Select
  , MenuItem
  , InputBase, Container, Box, Grid, FormControl, InputLabel } from '@material-ui/core'

//Styles
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    padding: '2%',
    background: '#F6FFFC',
  },
  globalFil: {
    border: 0,
    borderRadius: 3,
    background: '#F3F3F3'
  },
  globalFilBox: {
    padding: 3,
    border: '2px solid darkgray',
    borderRadius: 3,
    background: '#F3F3F3'
  },
  mauTable: {
    flexGrow: 1,
    width: '100%'
  },
  pageBtns: {
    paddingTop: 15
  },
  pageNrs: {
    position: 'center'
  },
  pageCTRL: {
    
  },
  gotoPage: {
    paddingLeft: 15,
  }
  
}))

// Global filter
const GlobalFilter = ({
  preGlobalFilteredRows
  , globalFilter
  , setGlobalFilter
}) => {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      Search:{ ' ' }
      <InputBase 
        className='form-control'
        value={ value || '' }
        onChange={e => {
          setValue(e.target.value)
          onChange(e.target.value)
        } }
        placeholder={`${ count } locations...`}
      />
    </span>
  )
}

// Column filter
const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {

  return (
    <input style={{ width: "100%" }}
      className='form-control'
      value={ filterValue || '' }
      onChange={ e => {
        setFilter(e.target.value || undefined )
      } }
      placeholder={ `filter...` }
    />
  )
}

// Render table with filters and pagination
const Table = ({ columns, data }) => {
  const classes = useStyles()
  
  const defaultColumn = useMemo(() => ({
    Filter: DefaultColumnFilter
  }), [])

  const {
    getTableProps
    , getTableBodyProps
    , headerGroups
    , rows
    , prepareRow
    , page
    , canPreviousPage
    , canNextPage
    , pageOptions
    , pageCount
    , gotoPage
    , nextPage
    , previousPage
    , setPageSize
    , state
    , state: {pageIndex, pageSize}
    , preGlobalFilteredRows
    , setGlobalFilter
  } = useTable({
    columns
    , data
    , defaultColumn
    , initialState: { pageIndex: 0, pageSize: 5 }
  },
  useFilters
  , useGlobalFilter
  , useSortBy
  , usePagination
  )

return (
    <Container className={classes.root}>
      <Box className={classes.globalFilBox}>
        <Box className={classes.globalFil}>
          <GlobalFilter
            preGlobalFilteredRows={ preGlobalFilteredRows }
            globalFilter={ state.globalFilter }
            setGlobalFilter={ setGlobalFilter }
          />
        </Box>
      </Box>
      <Box className={classes.mauTable}>
        <MaUTable style={{ width: "100%" }} { ...getTableProps() }>
            <TableHead style={{ width: "100%" }}>
              { headerGroups.map(hGroup => (
                <TableRow style={{ width: "100%" }} { ...hGroup.getHeaderGroupProps() }>
                  { hGroup.headers.map(col => (
                    <TableCell { ...col.getHeaderProps(col.getSortByToggleProps()) }>
                      { col.render('Header') }
                      <div>
                        { col.canFilter ? col.render('Filter') : null }
                      </div>
                      <span>
                        {col.isSorted
                          ? col.isSortedDesc
                            ? ' '
                            : ' '
                          : ''}
                      </span>
                    </TableCell>
                  )) }
                </TableRow>
              )) }
            </TableHead>
            <TableBody { ...getTableBodyProps() }>
              { page.map((row, i) => {
                prepareRow(row)
                return (
                  <TableRow { ...row.getRowProps() }>
                    { row.cells.map(c => {
                      return <TableCell { ...c.getCellProps() }>
                        { c.render('Cell') }
                      </TableCell>
                    }) }
                  </TableRow>
                )
              }) }
            </TableBody>
        </MaUTable>
      </Box>
      <br />
      <Box>Showing { pageSize } out of { rows.length } locations</Box>
      { /* Pagination */}
      <Box>
        <Box className={classes.pageBtns}>
          <Container className={classes.pageCtrl}>
            <ButtonGroup>
              <Button onClick={ () => gotoPage(0) } disabled={ !canPreviousPage }>Go to first</Button>
              <Button onClick={ () => previousPage() } disabled={ !canPreviousPage }>{ '<' }</Button>
              <Button onClick={ () => nextPage() } disabled={ !canNextPage }>{ '>' }</Button>
              <Button className='page-item' onClick={ () => gotoPage(pageCount -1) } disabled={ !canNextPage }>Go to last</Button>
            </ButtonGroup>
            <FormControl className={classes.gotoPage}>
              <Grid>
                <TextField id="outlined-basic" label="Go to page"
                  type='number'
                  defaultValue={ pageIndex + 1 }
                  onChange={ e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                    gotoPage(page)
                  } }
                  style={ { width: '100px', height: '20px' } }
                />
                <FormControl>
                <InputLabel>Show</InputLabel>
                <Select
                  onChange={ e => {
                    setPageSize(Number(e.target.value))
                  } }
                  value={ pageSize }
                  label="Show"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
                </FormControl>
              </Grid>
            </FormControl>
            <Box className={classes.pageNrs}>
              Page{ ' ' }
              <strong>
                {pageIndex + 1} of { pageOptions.length }
              </strong>{ ' ' }
            </Box>
          </Container>
        </Box> 
      </Box>
  </Container>
  )
}

const LocationTable = ({ data = [] }) => {
  console.log(data)
  
  // Column names and accessors
  const columns = useMemo(() => [
    {
      Header: 'Street Name'
      , accessor: 'streetName'
    },
    {
      Header: 'Street'
      , accessor: 'street'
    },
    {
      Header: 'Building No'
      , accessor: 'buildingNumber'
    },
    {
      Header: 'City'
      , accessor: 'city'
    },
    {
      Header: 'Zip Code'
      , accessor: 'zipcode'
    },
    {
      Header: 'Country'
      , accessor: 'country'
    },
    {
      Header: 'County Code'
      , accessor: 'county_code'
    },
  ], [])
  
  return (
    <Table columns={ columns } data={ data }/>  
  )

}

export default LocationTable