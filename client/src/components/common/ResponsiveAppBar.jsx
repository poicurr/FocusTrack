import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TagIcon from '@mui/icons-material/Tag';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NoteIcon from '@mui/icons-material/Note';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import axios from 'axios';

const drawerWidth = 240;

const ResponsiveAppBar = (props) => {
  const { children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const onLogout = () => {
    axios.post(`http://localhost:5000/api/auth/logout`, {}, {
      withCredentials: true, // クッキーを含めるために必要
    }).then(() => {
      setAnchorEl(null);
      setMenuOpen(false);
      navigate("/login");
    });
  }

  const navigate = useNavigate();

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem key={0} disablePadding>
          <ListItemButton onClick={() => { navigate("/tasks"); }}>
            <ListItemIcon><FormatListBulletedIcon /></ListItemIcon>
            <ListItemText primary="Tasks" />
          </ListItemButton>
        </ListItem>
        <ListItem key={1} disablePadding>
          <ListItemButton onClick={() => { navigate("/report"); }}>
            <ListItemIcon><AnalyticsIcon /></ListItemIcon>
            <ListItemText primary="Report" />
          </ListItemButton>
        </ListItem>
        <ListItem key={2} disablePadding>
          <ListItemButton onClick={() => { navigate("/note"); }}>
            <ListItemIcon><NoteIcon /></ListItemIcon>
            <ListItemText primary="Note" />
          </ListItemButton>
        </ListItem>
        <ListItem key={3} disablePadding>
          <ListItemButton>
            <ListItemIcon><TagIcon /></ListItemIcon>
            <ListItemText primary="Tags" />
          </ListItemButton>
        </ListItem>
        <ListItem key={4} disablePadding>
          <ListItemButton onClick={() => { navigate("/notification"); }}>
            <ListItemIcon><NotificationsIcon /></ListItemIcon>
            <ListItemText primary="Notification" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem key={5} disablePadding>
          <ListItemButton onClick={() => { navigate("/settings"); }}>
            <ListItemIcon><SettingsIcon/></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: "100%" },
          zIndex: 9000,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <img src="logo.png" style={{width: 64, height: 64}} alt="logo" />
          <Typography variant="h6" noWrap component="div">
            FocusTrack
          </Typography>
          <IconButton
            color="inherit"
            aria-controls={menuOpen ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
            onClick={handleClick}
            sx={{ ml: 'auto' }}
          >
            <AccountCircleIcon/>
          </IconButton>
          <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              sx = {{ zIndex: 9100 }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={onLogout}>Logout</MenuItem>
            </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      {/* mainコンテンツ */}
      <Box component="main" style={{ flexGrow: 1, padding: '20px', marginTop: '20px' }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default ResponsiveAppBar;