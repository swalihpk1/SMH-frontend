import React, { useEffect, useState } from 'react';
import { Box, Container, Stack, Typography, Grid, Snackbar, Alert, Button } from "@mui/material";
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ConnectedBTN } from './Styles';
import { useDispatch, useSelector } from 'react-redux';
import { updatePages, updateUser } from '../../features/auth/CredSlice';
import { RootState } from '../../app/store';
import SocialAccountBox from '../../components/SocialAccountBox';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FBAccountListModal from '../../components/FBAccountListModal';

const Connect: React.FC = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();
    const [openFbPagesModal, setOpenFbPagesModal] = useState(false);
    const [userPages, setUserPages] = useState([]);
    const [fbUserData, setFbUserData] = useState(null);
    const location = useLocation();

    const isFromSignup = location.state && location.state.fromSignup;

    const handleSocialLogin = (provider: string) => {

        if (userInfo?.socialAccounts && userInfo.socialAccounts[provider]) {
            setSnackbarMessage('Already connected');
            setSnackbarOpen(true);
        } else {
            window.location.href = `https://backend.frostbay.online/connect/${provider}`;
            // window.location.href = `http://localhost:3001/connect/${provider}`;
        }
    };


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userParam = params.get('user');

        if (userParam) {
            try {
                const User = JSON.parse(decodeURIComponent(userParam));

                if (User.userProfile) {
                    setFbUserData(User.userProfile);
                    setUserPages(User.userPages || []);
                    setOpenFbPagesModal(true);
                } else {
                    dispatch(updateUser({
                        provider: User.provider,
                        profileName: User.profileName,
                        profilePicture: User.profilePicture
                    }));
                    navigate('/connect');
                }
            } catch (error) {
                console.error('Error parsing user data', error);
            }
        } else {
            console.error('Data parameter is missing in URL');
        }
    }, [dispatch, navigate]);

    const handleModalClose = () => {
        setOpenFbPagesModal(false);
        navigate('/connect');
    };

    const handleModalConfirm = (selectedPages) => {
        if (fbUserData) {
            const pagesData = selectedPages.map(page => ({
                pageName: page.pageName,
                pageImage: page.pageImage,
            }));

            dispatch(updatePages({
                provider: fbUserData.provider,
                userPages: pagesData
            }));

            localStorage.setItem('userPages', JSON.stringify(pagesData));

            setOpenFbPagesModal(false);
            navigate('/connect');
        }
    };

    const handleNext = () => {
        if (isNextButtonEnabled) {
            if (isFromSignup) {
                navigate('/success');
            } else {
                navigate('/dashboard');
            }
        }
    };




    useEffect(() => {

        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');

        console.log('accessToken', accessToken);

        if (accessToken) {
            axios.get('http://localhost:3000/connect/instagram/token', {
                params: { access_token: accessToken }
            })
                .then(response => {
                    console.log('Response from backend:', response.data);
                })
                .catch(error => {
                    console.error('Error sending access token to backend:', error);
                });
        } else {
            console.error('Access token not found in URL fragment');
        }
    }, [navigate]);

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const isNextButtonEnabled = Object.keys(userInfo?.socialAccounts || {}).length >= 2;

    return (
        <Container
            component="main"
            maxWidth={false}
            disableGutters
            sx={{
                background: 'linear-gradient(90deg, #43528C, #203170)',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}
        >
            <Stack
                sx={{
                    m: 5,
                    border: '2px solid white',
                    borderRadius: 2,
                    width: { xs: '95%', sm: '85%' },
                    height: { xs: '95%', sm: '85%' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    boxSizing: 'border-box',
                }}
            >
                <Box
                    sx={{
                        width: { xs: '100%', sm: '50%' },
                        height: { xs: '50%', sm: '100%' },
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <img src="LoginImage.jpg" alt="" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '10px' }} />
                </Box>
                <Stack
                    spacing={3}
                    sx={{
                        width: { xs: '100%', sm: '50%' },
                        height: { xs: '50%', sm: '100%' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '20px',
                        position: 'relative',
                    }}
                >
                    <Box>
                        <Typography variant="h6" color='whitesmoke'>
                            Step 2 of 2
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <Box sx={{ width: '100px', height: '4px', backgroundColor: 'whitesmoke' }} />
                            <Box sx={{ width: '100px', height: '4px', backgroundColor: '#57D7FF' }} />
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'left',
                        }}
                    >
                        <Typography
                            sx={{
                                color: 'white',
                                fontSize: { xs: 'large', sm: 'x-large' },
                                fontWeight: 100,
                                marginBottom: 0,
                            }}
                        >
                            Let’s add some{' '}
                            <Typography component='span'
                                sx={{
                                    color: '#FF7AC3',
                                    fontSize: { xs: 'large', sm: 'x-large' },
                                    fontWeight: 500
                                }}
                            >
                                Social accounts
                            </Typography>
                        </Typography>

                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: 'small',
                                    marginTop: 0,
                                    color: 'white',
                                    fontWeight: '100',
                                    textDecoration: 'none',
                                }}
                            >
                                You at-least add
                                <Typography
                                    component="span"
                                    sx={{ fontWeight: 'bold', color: 'white' }}
                                >
                                    {' '}two social accounts{' '}
                                </Typography>
                                right now. You can always add more later!
                            </Typography>
                        </Box>

                        <Stack spacing={2} sx={{ mt: 3 }}>
                            <Typography
                                sx={{
                                    marginTop: 0,
                                    color: 'white',
                                    fontWeight: '400',
                                    textDecoration: 'none',
                                }}
                            >
                                Choose a social network to add an account
                            </Typography>

                            {Object.keys(userInfo?.socialAccounts || {}).length === 1 && (
                                <Typography
                                    sx={{
                                        marginTop: 1,
                                        color: 'white',
                                        fontWeight: '400',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Add another social account :
                                </Typography>
                            )}

                            <Grid container rowGap={2} sx={{ width: { xs: '100%', sm: '60%' }, margin: 'auto' }}>
                                <Grid item xs={6}>
                                    <ConnectedBTN
                                        variant="contained"
                                        startIcon={<FacebookRoundedIcon sx={{ fontSize: { xs: '24px', sm: '30px' }, color: '#1877F2' }} />}
                                        onClick={() => handleSocialLogin('facebook')}
                                    >
                                        Facebook
                                    </ConnectedBTN>
                                </Grid>
                                <Grid item xs={6}>
                                    <ConnectedBTN
                                        variant="contained"
                                        startIcon={<InstagramIcon sx={{ fontSize: { xs: '24px', sm: '30px' }, color: '#EE1973' }} />}
                                        onClick={() => handleSocialLogin('instagram')}
                                    >
                                        Instagram
                                    </ConnectedBTN>
                                </Grid>

                                <Grid item xs={6}>
                                    <ConnectedBTN
                                        variant="contained"
                                        startIcon={<LinkedInIcon sx={{ fontSize: { xs: '24px', sm: '30px' }, color: '#1877F2' }} />}
                                        onClick={() => handleSocialLogin('linkedin')}
                                    >
                                        LinkedIn
                                    </ConnectedBTN>
                                </Grid>

                                <Grid item xs={6}>
                                    <ConnectedBTN
                                        variant="contained"
                                        startIcon={<XIcon sx={{ fontSize: { xs: '24px', sm: '30px' }, color: '#00000' }} />}
                                        onClick={() => handleSocialLogin('twitter')}
                                    >
                                        Twitter X
                                    </ConnectedBTN>
                                </Grid>
                            </Grid>

                            {Object.keys(userInfo?.socialAccounts || {}).length > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CheckCircleIcon sx={{ fontSize: 'medium', marginRight: 1, background: 'white', color: 'green', borderRadius: '10px' }} />
                                    <Typography
                                        sx={{
                                            marginTop: 0,
                                            color: 'white',
                                            fontWeight: '400',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {Object.keys(userInfo?.socialAccounts || {}).length} account added
                                    </Typography>
                                </Box>
                            )}
                            <Grid container gap={2}>
                                {Object.entries(userInfo?.socialAccounts || {}).map(([provider, accountData]) => {
                                    const { profileName, profilePicture, userPages = [] } = accountData;
                                    return (
                                        <Grid item xs={12} sm={6} md={3} key={provider}>
                                            <SocialAccountBox
                                                provider={provider}
                                                profileName={profileName}
                                                profilePicture={profilePicture}
                                                userPages={userPages}
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>

                        </Stack>
                    </Box>

                    <FBAccountListModal
                        open={openFbPagesModal}
                        onClose={handleModalClose}
                        pages={userPages}
                        onConfirm={handleModalConfirm}
                        fbUser={fbUserData}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                            color: 'white',
                            width: '70px',
                            border: isNextButtonEnabled ? '1px solid white' : '1px solid grey',
                            backgroundColor: isNextButtonEnabled ? 'rgba(217, 217, 217, 0.2)' : 'rgba(217, 217, 217, 0.9)',
                            pointerEvents: isNextButtonEnabled ? 'auto' : 'none',
                        }}
                        disabled={!isNextButtonEnabled}
                        onClick={handleNext}
                    >
                        Next
                    </Button>


                </Stack>
            </Stack>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container >

    );
}

export default Connect;
