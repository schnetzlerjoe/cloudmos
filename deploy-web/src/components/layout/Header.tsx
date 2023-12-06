import React, { ReactNode, useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../shared/ErrorFallback";
import { accountBarHeight, drawerWidth } from "@src/utils/constants";
import { Badge, Button, IconButton, styled, useMediaQuery, useTheme } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { WalletStatus } from "./WalletStatus";
import Link from "next/link";
import { UrlService } from "@src/utils/urlUtils";
import { useRouter } from "next/router";
import SearchBar from "./SearchBar";
import { AccountMenu } from "./AccountMenu";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { AkashConsoleBetaLogoDark, AkashConsoleBetaLogoLight } from "../icons/AkashConsoleLogo";

type Props = {
  isMobileOpen: boolean;
  handleDrawerToggle: () => void;
  children?: ReactNode;
};

const useStyles = makeStyles()(theme => ({
  accountBar: {
    height: `${accountBarHeight}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderBottom: `1px solid ${theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[300]}`,
    backgroundColor: theme.palette.background.paper
  }
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.light,
    boxShadow: `0 0 0 2px ${theme.palette.secondary.main}`,
    right: 0,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""'
    }
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1
    },
    "100%": {
      transform: "scale(3)",
      opacity: 0
    }
  }
}));

export const Header: React.FunctionComponent<Props> = ({ children, isMobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const { classes } = useStyles();
  const router = useRouter();
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [isMobileSearch, setIsMobileSearch] = useState(false);

  return (
    <AppBar position="fixed" color="default" elevation={0} component="header">
      <Toolbar variant="dense" className={classes.accountBar}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            {!isMobileSearch && (
              <Box
                href={UrlService.home()}
                component={Link}
                sx={{ display: "inline-flex", alignItems: "center", minWidth: { xs: 0, sm: 0, md: `calc(${drawerWidth}px - 1rem)` } }}
              >
                {theme.palette.mode === "dark" ? <AkashConsoleBetaLogoDark /> : <AkashConsoleBetaLogoLight />}
              </Box>
            )}

            {(isMobileSearch || !smallScreen) && <SearchBar isMobileSearch={isMobileSearch} onSearchClose={() => setIsMobileSearch(false)} />}
          </Box>

          <Box>
            {smallScreen && !isMobileSearch && (
              <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={() => setIsMobileSearch(true)} sx={{ display: { md: "none" } }}>
                <SearchIcon />
              </IconButton>
            )}

            {!isMobileSearch && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { md: "none" }, marginLeft: ".5rem" }}
              >
                {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            )}
          </Box>

          <Box sx={{ maxHeight: `${accountBarHeight}px`, alignItems: "center", display: { xs: "none", sm: "none", md: "flex" } }}>
            <div>
              <Link passHref href={UrlService.getStarted()}>
                <StyledBadge overlap="circular" anchorOrigin={{ vertical: "top", horizontal: "right" }} variant="dot">
                  <Button
                    variant="text"
                    sx={{
                      textTransform: "initial",
                      color: router.pathname === UrlService.getStarted() ? theme.palette.secondary.main : "",
                      fontSize: "1rem"
                    }}
                    disableRipple
                  >
                    Get Started
                  </Button>
                </StyledBadge>
              </Link>
            </div>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ marginLeft: "1rem" }}>
                <WalletStatus />
              </Box>

              {/* <AccountMenu /> */}
            </Box>
          </Box>
        </ErrorBoundary>
      </Toolbar>
    </AppBar>
  );
};
