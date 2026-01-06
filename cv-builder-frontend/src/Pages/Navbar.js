import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Avatar,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../Redux/features/auth/authThunks";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await dispatch(logoutUser());
        handleClose();
        navigate("/login");
    };

    return (
        <AppBar
            position="sticky"
            color="default"
            elevation={1}
            sx={{
                backgroundColor: "rgb(var(--color-primary))",
                color: "#fff",
            }}
        >
            <Toolbar className="flex justify-between px-4 md:px-8">
                {/* Logo / Title */}
                <Typography
                    variant="h6"
                    className="cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    CV Builder
                </Typography>

                {/* Right actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <IconButton
                        color="primary"
                        className="sm:hidden"
                        onClick={() => navigate("/editor/new")}
                    >
                        <AddIcon />
                    </IconButton>

                    {/* Profile avatar */}
                    <IconButton onClick={handleProfileClick}>
                        <Avatar>
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                        </Avatar>
                    </IconButton>

                    {/* Profile menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <MenuItem disabled>
                            <Typography variant="body2">
                                {user?.email}
                            </Typography>
                        </MenuItem>

                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon fontSize="small" className="mr-2" />
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
