import React from "react";
import Logo from '../../Logo/Logo';
import NavigationItems from '../../Navigation/NavigationItems/NavigationItems';
import DrawerToggle from "../NavigationItems/SideDrawer/DrawerToggle/DrawerToggle";
import classes from './Toolbar.css';

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <DrawerToggle clicked={props.drawerToggleClicked}/>
        <div className={classes.Logo}>
            <Logo />
        </div>
        <nav className={classes.DesktopOnly}>
            <NavigationItems isAuthenticated={props.isAuth}/>
        </nav>
    </header>
);
export default toolbar;
