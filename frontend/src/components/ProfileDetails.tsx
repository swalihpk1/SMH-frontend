import React, { useState } from 'react';
import { Box, Typography, IconButton, Stack, Dialog, CircularProgress, DialogContent, TextField, Dialog as ConfirmDialog, DialogTitle, DialogActions, Button } from '@mui/material';
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
import { useRemoveSocialAccountMutation, useUpdateUserNameMutation } from '../api/ApiSlice';
import { removeSocialAccount, logout, updateUserName as updateUserNameAction } from '../features/auth/CredSlice';
import { UserInfo } from '../types/Types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Snackbar from '../components/Snackbar';
import AddSocialModal from './AddSocialModal';

interface ProfileDetailsProps {
    onClose: () => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [removeSocialAccountApi] = useRemoveSocialAccountMutation();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarProps, setSnackbarProps] = useState({
        message: '',
        severity: 'info',
    });
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [updateUserName] = useUpdateUserNameMutation();
    const userInfo: UserInfo = useSelector((state: RootState) => state.auth.userInfo);
    const [name, setName] = useState(userInfo?.name || '');

    const [isAddSocialModalOpen, setIsAddSocialModalOpen] = useState(false);

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedProviderToRemove, setSelectedProviderToRemove] = useState<string | null>(null);

    const handleAddAccountClick = () => {
        setIsAddSocialModalOpen(true);
    };

    const handleAddSocialModalClose = () => {
        setIsAddSocialModalOpen(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        if (!name) return;

        try {
            const result = await updateUserName({ name }).unwrap();
            dispatch(updateUserNameAction(result.name));
            setIsEditing(false);

            setSnackbarProps({
                message: 'Name updated successfully',
                severity: 'success',
            });
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Failed to update user name:", error);
            setSnackbarProps({
                message: 'Failed to update user name',
                severity: 'error',
            });
            setSnackbarOpen(true);
        }
    };

    const handleRemoveClick = (provider: string) => {
        setSelectedProviderToRemove(provider);
        setConfirmDialogOpen(true);
    };

    const handleConfirmRemove = async () => {
        if (!selectedProviderToRemove) return;

        try {
            await removeSocialAccountApi({ provider: selectedProviderToRemove }).unwrap();
            dispatch(removeSocialAccount(selectedProviderToRemove));

            setSnackbarProps({
                message: `${selectedProviderToRemove} account removed successfully`,
                severity: 'success',
            });
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Failed to remove social account:', error);
            setSnackbarProps({
                message: `Failed to remove ${selectedProviderToRemove} account`,
                severity: 'error',
            });
            setSnackbarOpen(true);
        } finally {
            setConfirmDialogOpen(false);
            setSelectedProviderToRemove(null);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
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

    const getIcon = (provider: string) => {
        const commonStyles = {
            fontSize: { xs: '20px', sm: '25px' },
            backgroundColor: 'white',
            borderRadius: '10px',
        };

        switch (provider) {
            case 'linkedin':
                return <LinkedInIcon sx={{ ...commonStyles, color: '#1877F2' }} />;
            case 'facebook':
                return <FacebookRoundedIcon sx={{ ...commonStyles, color: '#1877F2' }} />;
            case 'twitter':
                return <XIcon sx={{ ...commonStyles, color: 'black' }} />;
            case 'instagram':
                return <InstagramIcon sx={{ ...commonStyles, color: '#EE1973' }} />;
            default:
                return null;
        }
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
                <Typography variant="h6" sx={{ color: 'white', ml: 6 }}>
                    {isEditing ? (
                        <>
                            <TextField
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                variant="outlined"
                                size="small"
                                autoFocus
                                sx={{
                                    input: { color: 'white' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            border: 'none',
                                        },
                                        '&:hover fieldset': {
                                            border: 'none',
                                        },
                                        '&.Mui-focused fieldset': {
                                            border: 'none',
                                        },
                                    },
                                }}
                            />
                            <IconButton onClick={handleSaveClick}>
                                <CheckCircleIcon sx={{ color: 'white' }} />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            {userInfo?.name || 'No name'}
                            <IconButton onClick={handleEditClick}>
                                <EditRoundedIcon sx={{ color: '#c2c2c2', cursor: 'pointer' }} />
                            </IconButton>
                        </>
                    )}
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
                                    background: '#fefefe33!important',
                                    border: '1px solid white',
                                    color: 'white!important',
                                    display: 'flex',
                                    padding: '0 1rem',
                                    cursor: 'text'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                                    {getIcon(provider)}
                                    <Typography sx={{ marginLeft: '0.5rem' }}>
                                        {displayName || provider.charAt(0).toUpperCase() + provider.slice(1)}
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={() => handleRemoveClick(provider)}
                                    sx={{
                                        color: '#dfdfdf',
                                    }}
                                >
                                    <DeleteIcon sx={{ cursor: 'pointer' }} />
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

                    {/* AddSocialModal component */}
                    <AddSocialModal
                        open={isAddSocialModalOpen}
                        handleClose={handleAddSocialModalClose}
                    />
                </Box>
            </Box>
            <Box sx={{ p: '2rem' }}>
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
            </Box>

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

            <Snackbar
                open={snackbarOpen}
                message={snackbarProps.message}
                severity={snackbarProps.severity}
                onClose={handleCloseSnackbar}
            />

            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '1rem',
                    }
                }}
            >
                <DialogTitle>
                    Are you sure you want to remove this {selectedProviderToRemove} account?
                </DialogTitle>
                <DialogActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                    <Button
                        onClick={() => setConfirmDialogOpen(false)}
                        variant="outlined"
                        sx={{
                            color: '#203170',
                            borderColor: '#203170',
                            marginRight: '1rem',
                            '&:hover': {
                                borderColor: '#203170',
                                backgroundColor: 'rgba(32, 49, 112, 0.04)',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmRemove}
                        variant="contained"
                        sx={{
                            backgroundColor: '#ff3737',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#d63030',
                            },
                        }}
                    >
                        Remove
                    </Button>
                </DialogActions>
            </ConfirmDialog>
        </Stack>
    );
};

export default ProfileDetails;
