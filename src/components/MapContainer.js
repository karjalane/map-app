import { React, useState } from 'react'
import { GoogleMap, LoadScript, Marker, InfoBox } from '@react-google-maps/api'
import { v4 as uuid_v4 } from 'uuid'
import Fuse from 'fuse.js'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import { fade, makeStyles } from '@material-ui/core/styles'
import { AppBar
  , Toolbar
  , IconButton
  , InputBase
  , Typography } from '@material-ui/core' 

  const mapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
    topBar: {
      background: 'linear-gradient(45deg, #FF6B8B 30%, #DD1D53 90%)',
    }
  }));

const MapContainer = ({ locations = [] }) => {
  const [coordinates, setCoordinates] = useState({})
  const [query, updateQuery] = useState('')

  let defaultCenter = {lat: 62.897968, lng: 27.678171}

  const classes = useStyles()

  const mapStyles = 
    {height: '550px'
    , width: '100%'}

  const fuse = new Fuse(locations, {
    keys: [
      'streetName'
      , 'street'
      , 'buildingNumber'
      , 'city'
      , 'zipcode'
      , 'country'
      , 'county_code'
    ], includeScore: true
  })

  const filteredData = fuse.search(query)
  const markers = query ? filteredData.map(l => l.item) : locations

  const onSelect = (i) => {
    setCoordinates(getLocation(i))
    console.log(coordinates)
  }

  const getLocation = (position) => {
    const latitude = position.latitude
    const longitude = position.longitude
    const selectedPosition = {
      lat: latitude
      , lng: longitude
    }
    return selectedPosition
  }

  const onSearch = ({ currentTarget }) => {
    updateQuery(currentTarget.value)
  }

  return (
    <div>
      <div className={classes.root}>
        <AppBar className={classes.topBar} position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              Mappy Mappage
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                type="text"
                value={ query }
                onChange={ onSearch }
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <div style={ { width: '100%', height: '100%' } }>
        <LoadScript
          googleMapsApiKey={ mapsAPIKey }>
          <GoogleMap 
            mapContainerStyle={ mapStyles }
            zoom={ 2 }
            center={ defaultCenter }>
            {
              locations && markers.map(i => {
                return (
                  <Marker key={ uuid_v4() } 
                    position={ getLocation(i) }
                    onClick={ () => onSelect(i) }
                  >
                    <InfoBox
                      position={ getLocation(i) }
                    >
                      <div>{ i.streetName }</div>
                    </InfoBox>
                  </Marker>
                )
              })
            }
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  )
}

export default MapContainer