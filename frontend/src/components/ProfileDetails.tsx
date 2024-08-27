import React, { useState } from 'react';
import { Box, Typography, IconButton, Stack, Snackbar, Alert, Dialog, CircularProgress, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { ConnectedBTN } from '../pages/user/Styles';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { useRemoveSocialAccountMutation } from '../api/ApiSlice';
import { removeSocialAccount, logout } from '../features/auth/CredSlice';

interface ProfileDetailsProps {
    onClose: () => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [removeSocialAccountApi] = useRemoveSocialAccountMutation();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const userInfo = useSelector((state: RootState) => state.auth.userInfo);

    const handleRemove = async (provider: string) => {
        try {
            await removeSocialAccountApi({ provider }).unwrap();
            dispatch(removeSocialAccount(provider));
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Failed to remove social account:', error);
        }
    };

    const handleLogout = () => {
        setLogoutDialogOpen(true); 
        setLoggingOut(true);

        setTimeout(() => {
            setLoggingOut(false);
            dispatch(logout());
            sessionStorage.clear();
            localStorage.clear();
            setTimeout(() => {
                setLogoutDialogOpen(false); 
                navigate('/login'); 
            }, 1000); 
        }, 2000); 
    };


    const handleAddAccountClick = () => {
        navigate('/connect');
    };

    const getIcon = (provider: string) => {
        switch (provider) {
            case 'linkedin':
                return <LinkedInIcon sx={{ fontSize: { xs: '20px', sm: '25px' }, color: '#1877F2' }} />;
            case 'facebook':
                return <FacebookRoundedIcon sx={{ fontSize: { xs: '20px', sm: '25px' }, color: '#1877F2' }} />;
            case 'twitter':
                return <XIcon sx={{ fontSize: { xs: '20px', sm: '25px' }, color: 'black' }} />;
            case 'instagram':
                return <InstagramIcon sx={{ fontSize: { xs: '20px', sm: '25px' }, color: '#EE1973' }} />;
            default:
                return null;
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Stack sx={{ height: '97vh' }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem' }}>
                <IconButton sx={{ alignSelf: 'flex-end', background: '#fdfdfd82' }} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '1rem',
                    }}
                >
                    <AccountCircleRoundedIcon sx={{ width: '100px', height: '100px', color: 'white', background: '#203170', borderRadius: '2rem' }} />
                </Box>
                <Typography variant="h6" sx={{ color: 'white', pl: '1.7rem' }}>
                    {userInfo?.username || 'No name'} <EditRoundedIcon sx={{ color: '#c2c2c2' }} />
                </Typography>

                <Typography variant="body1" sx={{ color: '#b5b5b5' }}>
                    {userInfo?.email}
                </Typography>
            </Box>
            <Box sx={{ p: '2rem', flexGrow: 1 }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                    Accounts
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', pt: '1rem' }}>
                    {userInfo?.socialAccounts && Object.keys(userInfo.socialAccounts).map((provider) => {
                        const account = userInfo.socialAccounts[provider];
                        const displayName = provider === 'facebook' && account.userPages && account.userPages.length > 0
                            ? account.userPages[0].pageName
                            : account.profileName;

                        return (
                            <ConnectedBTN
                                key={provider}
                                variant="contained"
                                sx={{
                                    width: '100%',
                                    height: '2.5rem',
                                    background: '#fefefe63!important',
                                    border: '1px solid white',
                                    color: 'white!important',
                                    display: 'flex',
                                    padding: '0 1rem',
                                    '&:hover': {
                                        background: '#fefefe90!important',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                                    {getIcon(provider)}
                                    <Typography sx={{ marginLeft: '0.5rem' }}>
                                        {displayName || provider.charAt(0).toUpperCase() + provider.slice(1)}
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={() => handleRemove(provider)}
                                    sx={{
                                        color: '#dfdfdf',
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ConnectedBTN>
                        );
                    })}

                    <ConnectedBTN
                        variant="contained"
                        sx={{
                            width: '100%',
                            height: '2.5rem',
                            background: '#fefefe63!important',
                            border: '1px solid white',
                            color: 'white!important',
                            display: 'flex',
                            padding: '0 1rem',
                            '&:hover': {
                                background: '#fefefe90!important',
                            },
                        }}
                        onClick={handleAddAccountClick}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                            <PersonAddAlt1Icon />
                            <Typography sx={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>
                                Add account
                            </Typography>
                        </Box>
                    </ConnectedBTN>
                </Box>
            </Box>
            <ConnectedBTN
                variant="contained"
                onClick={handleLogout}
                sx={{
                    width: '100%',
                    height: '2.5rem',
                    background: '#ffff !important',
                    border: '1px solid white',
                    display: 'flex',
                    marginLeft: '1rem',
                    '&:hover': {
                        background: '#e0dfdf !important',
                    },
                    mt: 'auto',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                    <ExitToAppIcon sx={{ color: 'red' }} />
                    <Typography sx={{ marginLeft: '0.5rem', color: '#ff3737' }}>
                        Log Out
                    </Typography>
                </Box>
            </ConnectedBTN>

            <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '300px', padding: '2rem' }}>
                    {loggingOut ? (
                        <>
                            <CircularProgress sx={{ marginBottom: '1rem' }} />
                            <Typography variant="h6">Logging out...</Typography>
                        </>
                    ) : (
                        <Typography variant="h6" color="success.main">
                            Logout successfully!
                        </Typography>
                    )}
                </DialogContent>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Social account removed successfully!
                </Alert>
            </Snackbar>
        </Stack>
    );
};

export default ProfileDetails;
