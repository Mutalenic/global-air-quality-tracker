import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Switch,
} from '@mui/material';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';
import CloudIcon from '@mui/icons-material/Cloud';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = ({ mode, setMode }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isPollutionPage = location.pathname.includes('pollution');

  const toggleMobileMenu = () => setIsMobileMenuOpen((open) => !open);
  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  // Optionally: update document body or context for theme
  useEffect(() => {
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ mb: 2 }}>
      <Toolbar>
        {isPollutionPage && (
          <IconButton component={NavLink} to="/countries" edge="start" color="inherit" aria-label="back">
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          component={NavLink}
          to="/"
          sx={{
            textDecoration: 'none', color: 'inherit', flexGrow: 1, display: 'flex', alignItems: 'center',
          }}
        >
          <PublicIcon sx={{ mr: 1 }} />
          Air Quality Tracker
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <IconButton component={NavLink} to="/" color="inherit">
            <HomeIcon />
          </IconButton>
          <IconButton component={NavLink} to="/countries" color="inherit">
            <PublicIcon />
          </IconButton>
          <IconButton component={NavLink} to="/weather" color="inherit">
            <CloudIcon />
          </IconButton>
        </Box>
        <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit" aria-label="toggle theme">
          {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          sx={{ display: { md: 'none' } }}
          onClick={toggleMobileMenu}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer anchor="right" open={isMobileMenuOpen} onClose={toggleMobileMenu}>
        <Box sx={{ width: 220 }} role="presentation" onClick={toggleMobileMenu}>
          <List>
            <ListItem button component={NavLink} to="/">
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={NavLink} to="/countries">
              <ListItemIcon><PublicIcon /></ListItemIcon>
              <ListItemText primary="Countries" />
            </ListItem>
            <ListItem button component={NavLink} to="/weather">
              <ListItemIcon><CloudIcon /></ListItemIcon>
              <ListItemText primary="Weather" />
            </ListItem>
            <ListItem>
              <ListItemIcon>{mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}</ListItemIcon>
              <Switch checked={mode === 'dark'} onChange={toggleTheme} />
              <ListItemText primary={mode === 'light' ? 'Dark Mode' : 'Light Mode'} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

Navbar.propTypes = {
  mode: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
};

export default Navbar;
