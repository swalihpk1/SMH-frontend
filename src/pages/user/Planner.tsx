import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Stack, Button, IconButton, Select, MenuItem, FormControl, Divider, DialogContentText } from '@mui/material';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useFetchSheduledPostsQuery, useReschedulePostMutation } from '../../api/ApiSlice';
import XIcon from '@mui/icons-material/X';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const muiTheme = createTheme({
    palette: {
        background: {
            default: '#fff',
        },
    },
});

const CustomToolbar = ({
    currentView, onViewChange, onPrev, onNext, onMonthChange, onYearChange, selectedMonth, selectedYear, selectedDate
}) => {
    const yearRange = [2023, 2024, 2025];
    const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'long' }));

    return (
        <Box sx={{ backgroundColor: '#fff' }}>
            <Box sx={{ borderBottom: '1px solid #e0e0e0', padding: 1 }}>
                <Typography variant="h6" fontWeight='bold'>Calendar</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, backgroundColor: '#fff' }}>

                <FormControl sx={{ minWidth: 120, maxWidth: 170 }}>
                    <Select defaultValue="" displayEmpty size="small" sx={{ background: '#C3CBD8', borderRadius: '2rem', color: '#203170' }}>
                        <MenuItem value="">Social accounts</MenuItem>
                        <MenuItem value="facebook">Facebook</MenuItem>
                        <MenuItem value="instagram">Instagram</MenuItem>
                        <MenuItem value="linkedin">LinkedIn</MenuItem>
                    </Select>
                </FormControl>

                <Divider orientation="vertical" flexItem />


                <FormControl sx={{ minWidth: 100, maxWidth: 140 }}>
                    <Select value={selectedMonth} onChange={onMonthChange} size="small" sx={{ background: '#C3CBD8', borderRadius: '2rem', color: '#203170' }}>
                        {months.map((month, index) => (
                            <MenuItem key={index} value={index}>{month}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Divider orientation="vertical" flexItem />

                <FormControl sx={{ minWidth: 80, maxWidth: 100 }}>
                    <Select value={selectedYear} onChange={onYearChange} size="small" sx={{ background: '#C3CBD8', borderRadius: '2rem', color: '#203170' }}>
                        {yearRange.map((year) => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Divider orientation="vertical" flexItem />



                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={onPrev} size="small"><ArrowBackIosNewIcon fontSize="small" /></IconButton>
                    <Box sx={{ textAlign: 'center', minWidth: 150 }}>
                        <Typography variant="h6" fontWeight='bold'>
                            {`${new Date(selectedDate).toLocaleString('default', { month: 'long' })} ${new Date(selectedDate).getFullYear()}`}
                        </Typography>
                    </Box>
                    <IconButton onClick={onNext} size="small"><ArrowForwardIosIcon fontSize="small" /></IconButton>
                </Box>

                <Divider orientation="vertical" flexItem />

                <FormControl sx={{ minWidth: 120, maxWidth: 130 }}>
                    <Select defaultValue="" displayEmpty size="small" sx={{ background: '#C3CBD8', borderRadius: '2rem', color: '#203170' }}>
                        <MenuItem value="">All posts</MenuItem>
                        <MenuItem value="facebook">Drafts</MenuItem>
                    </Select>
                </FormControl>

                <Divider orientation="vertical" flexItem />

                <Box sx={{ display: 'flex', gap: 1, background: '#C3CBD8' }}>
                    <IconButton
                        onClick={() => onViewChange('dayGridMonth')}
                        size="small"
                        sx={{
                            backgroundColor: currentView === 'dayGridMonth' ? '#203170' : 'transparent',
                            color: currentView === 'dayGridMonth' ? '#fff' : 'inherit',
                            borderRadius: '0',
                            '&:hover': { backgroundColor: '#2031703d' }
                        }}
                    >
                        <CalendarViewMonthIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                        onClick={() => onViewChange('timeGridWeek')}
                        size="small"
                        sx={{
                            backgroundColor: currentView === 'timeGridWeek' ? '#203170' : 'transparent',
                            color: currentView === 'timeGridWeek' ? '#fff' : 'inherit',
                            borderRadius: '0',
                            '&:hover': { backgroundColor: '#2031703d' }
                        }}
                    >
                        <CalendarViewWeekIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                        onClick={() => onViewChange('timeGridDay')}
                        size="small"
                        sx={{
                            backgroundColor: currentView === 'timeGridDay' ? '#203170' : 'transparent',
                            color: currentView === 'timeGridDay' ? '#fff' : 'inherit',
                            borderRadius: '0',
                            '&:hover': { backgroundColor: '#2031703d' }
                        }}
                    >
                        <CalendarViewDayIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Divider orientation="vertical" flexItem />

                <FormControl sx={{ minWidth: 120, maxWidth: 150 }}>
                    <Select defaultValue="" displayEmpty size="small" sx={{ background: '#C3CBD8', borderRadius: '2rem', color: '#203170' }}>
                        <MenuItem value="">Post status</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>

            </Box>

        </Box>
    );
};


const FullPageCalendar = () => {
    const [events, setEvents] = useState([]);
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [calendarApi, setCalendarApi] = useState(null);
    const [currentView, setCurrentView] = useState('dayGridMonth');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [rescheduleInfo, setRescheduleInfo] = useState(null);
    const [draggingEvent, setDraggingEvent] = useState(null);

    const { data, isLoading, error } = useFetchSheduledPostsQuery(undefined);
    const [reschedulePost] = useReschedulePostMutation();


    console.log("DAta", data);

    useEffect(() => {
        if (data) {
            const formattedEvents = data.flatMap((post) =>
                post.platforms.map((platform) => ({
                    id: `${post._id}-${platform}`,
                    title: post.content[platform] || Object.values(post.content)[0],
                    start: new Date(post.scheduledTime),
                    extendedProps: {
                        imageUrl: post.image,
                        platform: platform,
                        userId: post.userId,
                        status: post.status,
                        jobId: post.jobId, 
                    },
                }))
            );
            console.log("Events", formattedEvents);
            setEvents(formattedEvents);
        }
    }, [data]);

    useEffect(() => {
        if (calendarApi) {
            updateToolbarState(calendarApi.getDate());
        }
    }, [calendarApi]);

    const updateToolbarState = (date) => {
        setSelectedDate(date);
    };

    const handleEventClick = ({ event }) => {
        setSelectedEvent(event);
        setShowEventDetails(true);
    };

    const handleEventDragStart = (info) => {
        setDraggingEvent(info.event);
    };

    const handleEventDrop = (info) => {
        const jobId = info.event.extendedProps.jobId;
        const reScheduleTime = info.event.start;

        setRescheduleInfo({ jobId, reScheduleTime, originalEvent: draggingEvent });
        setOpenConfirmModal(true);
    };


    const handleConfirmReschedule = () => {
        if (rescheduleInfo) {
            const { jobId, reScheduleTime } = rescheduleInfo;

            reschedulePost({ jobId, reScheduleTime: reScheduleTime.toISOString() })
                .unwrap()
                .then(() => {
                    console.log('Post rescheduled successfully');
                })
                .catch((error) => {
                    console.error('Error rescheduling post:', error);
                    // Revert the event to its original position
                    if (calendarApi) {
                        const event = calendarApi.getEventById(rescheduleInfo.originalEvent.id);
                        event.setStart(rescheduleInfo.originalEvent.start);
                    }
                });
        }

        setOpenConfirmModal(false);
        setRescheduleInfo(null);
    };

    const handleCancelReschedule = () => {
        if (calendarApi && rescheduleInfo) {
            const event = calendarApi.getEventById(rescheduleInfo.originalEvent.id);
            event.setStart(rescheduleInfo.originalEvent.start);
        }
        setOpenConfirmModal(false);
        setRescheduleInfo(null);
    };

    const handleViewChange = (view) => {
        setCurrentView(view);
        if (calendarApi) {
            calendarApi.changeView(view);
            updateToolbarState(calendarApi.getDate());
        }
    };

    const handlePrev = () => {
        if (calendarApi) {
            calendarApi.prev();
            updateToolbarState(calendarApi.getDate());
        }
    };

    const handleNext = () => {
        if (calendarApi) {
            calendarApi.next();
            updateToolbarState(calendarApi.getDate());
        }
    };

    const handleMonthChange = (event) => {
        const newMonth = event.target.value;
        const newDate = new Date(selectedDate.getFullYear(), newMonth, 1);
        handleDateChange(newDate);
    };

    const handleYearChange = (event) => {
        const newYear = event.target.value;
        const newDate = new Date(newYear, selectedDate.getMonth(), 1);
        handleDateChange(newDate);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (calendarApi) {
            calendarApi.gotoDate(date);
        }
    };

    const renderEventContent = (eventInfo) => {
        const { event, view } = eventInfo;
        const platform = event.extendedProps.platform;

        const getPlatformIcon = (platform) => {
            switch (platform) {
                case 'facebook':
                    return <FacebookRoundedIcon sx={{ fontSize: '1rem', color: '#1877F2' }} />;
                case 'twitter':
                    return <XIcon sx={{ fontSize: '1rem', color: 'black' }} />;
                case 'instagram':
                    return <InstagramIcon sx={{ fontSize: '1rem', color: '#E4405F' }} />;
                case 'linkedin':
                    return <LinkedInIcon sx={{ fontSize: '1rem', color: '#0A66C2' }} />;
                default:
                    return null;
            }
        };

        const formatTime = (date) => {
            return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
        };

        const truncateText = (text, maxLength) => {
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        };

        if (view.type === 'dayGridMonth') {
            return (
                <Box
                    className="month-view-event"
                    display="flex"
                    flexDirection="column"
                    sx={{
                        padding: '4px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        width: '100%',
                        margin: '3px 10px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Stack
                        direction="column"
                        spacing={0.5}
                        sx={{ width: '100%' }}
                    >

                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            {getPlatformIcon(platform)}
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 'bold', lineHeight: 1 }}>
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </Typography>
                        </Stack>

                        <Typography variant="caption" sx={{ fontSize: '0.7rem', lineHeight: 1, margin: ' 1px 1.5rem !important', bgcolor: '#ffa50069', borderRadius: '1rem', padding: '2px 4px' }}>
                            {event.extendedProps.status}
                        </Typography>
                    </Stack>

                    {event.extendedProps.imageUrl && (
                        <Box
                            component="img"
                            src={event.extendedProps.imageUrl}
                            alt="Event"
                            sx={{
                                width: '100%',
                                height: '3rem',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                marginTop: '2px',
                            }}
                        />
                    )}

                    <Typography className="event-title" sx={{ fontSize: '0.6rem', lineHeight: 1.2, marginTop: '2px' }}>
                        {truncateText(event.title, 20)}
                    </Typography>
                    <Typography className="event-time" sx={{ fontSize: '0.6rem', fontWeight: 'bold', color: 'text.secondary', lineHeight: 1 }}>
                        {formatTime(event.start)}
                    </Typography>
                </Box>

            );
        } else if (view.type === 'timeGridWeek') {
            return (
                <Box
                    className="week-view-event"
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    bgcolor="#fff"
                    borderRadius="8px"
                    overflow="hidden"
                    sx={{ boxShadow: '-7px 0px 2px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)' }}
                >
                    <Stack direction='row' justifyContent='flex-start' alignItems='center' gap={1} sx={{ width: '100%', pl: '2px' }}>
                        {getPlatformIcon(platform)}
                        <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'black' }}>
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Typography>
                    </Stack>
                    {event.extendedProps.imageUrl && (
                        <Box
                            component="img"
                            src={event.extendedProps.imageUrl}
                            alt="Event"
                            sx={{
                                width: '100%',
                                height: '3rem',
                                objectFit: 'cover',
                                borderRadius: '7px',
                                marginTop: '2px',
                                px: '4px'
                            }}
                        />
                    )}
                    <Box className="event-details" p='2px'>
                        <Typography
                            className="event-title"
                            color='black'
                            fontSize="0.6rem"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {event.title}
                        </Typography>
                        <Typography className="event-time" fontSize="12px" fontWeight='bold' color="text.secondary">
                            {formatTime(event.start)}
                        </Typography>
                    </Box>
                </Box>
            );
        } else if (view.type === 'timeGridDay') {
            return (
                <Box
                    className="day-view-event"
                    display="flex"
                    flexDirection="row"
                    height="90%"
                    width="100%"
                    bgcolor="background.paper"
                    borderRadius="8px"
                    overflow="hidden"
                    margin="7px"
                    boxShadow={1}
                >
                    {event.extendedProps.imageUrl && (
                        <Box
                            component="img"
                            src={event.extendedProps.imageUrl}
                            alt="Event"
                            sx={{
                                width: '30%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    )}
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        sx={{
                            width: event.extendedProps.imageUrl ? '70%' : '100%',
                            p: 1
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1}>
                            {getPlatformIcon(platform)}
                            <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'black' }}>
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </Typography>
                        </Stack>

                        <Box>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', lineHeight: 1, color: 'black', bgcolor: '#ffa50069', borderRadius: '1rem', padding: '2px 4px' }}>
                                {event.extendedProps.status}
                            </Typography>
                        </Box>


                        <Typography
                            className="event-title"
                            color="black"
                            sx={{
                                fontSize: '0.8rem',
                                fontWeight: 'medium',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {event.title}
                        </Typography>
                        <Typography className="event-time" fontSize="0.9rem" fontWeight="bold" color="text.secondary">
                            {formatTime(event.start)}
                        </Typography>
                    </Box>
                </Box>
            );
        }
    };

    const renderDayHeader = (info) => {
        if (info.view.type === 'timeGridWeek') {
            return (
                <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
                    <Typography sx={{ fontSize: '40px', fontWeight: 'light' }}>
                        {info.date.getDate()}
                    </Typography>
                    <Typography sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        fontSize: '12px',
                    }}>
                        {info.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </Typography>
                    <Typography
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            fontSize: '12px',
                            backgroundColor: 'antiquewhite',
                            border: '1px solid gray',
                            color: 'black',
                            padding: '0px 4px',
                            borderRadius: '4px',
                        }}
                    >
                        0
                    </Typography>
                </Box>
            );
        }
        return info.text;
    };

    return (
        <MUIThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Box sx={{ height: '100vh', background: '#ffff' }}>
                <CustomToolbar
                    currentView={currentView}
                    onViewChange={handleViewChange}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onMonthChange={handleMonthChange}
                    onYearChange={handleYearChange}
                    selectedMonth={selectedDate.getMonth()}
                    selectedYear={selectedDate.getFullYear()}
                    selectedDate={selectedDate}
                />
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView={currentView}
                    editable
                    events={events}
                    eventClick={handleEventClick}
                    eventDragStart={handleEventDragStart}
                    eventDrop={handleEventDrop}
                    headerToolbar={false}
                    eventContent={renderEventContent}
                    dayHeaderContent={renderDayHeader}
                    eventOverlap={true}
                    slotMinTime="06:00:00"
                    slotMaxTime="22:00:00"
                    height="auto"
                    contentHeight="auto"
                    slotLabelFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                        meridiem: 'short',
                    }}
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: 'short',
                    }}
                    views={{
                        timeGridDay: {
                            allDaySlot: false,
                            slotDuration: '01:00:00',
                            snapDuration: '00:05:00',
                            slotEventOverlap: true,
                            slotEventGap: false,
                        },
                        timeGridWeek: {
                            allDaySlot: false,
                            slotDuration: '01:00:00',
                            snapDuration: '00:05:00',
                            slotEventOverlap: true,
                        },
                    }}
                    ref={(el) => {
                        if (el) setCalendarApi(el.getApi());
                    }}
                    datesSet={(dateInfo) => {
                        updateToolbarState(dateInfo.start);
                    }}
                />

                <Dialog
                    open={openConfirmModal}
                    onClose={handleCancelReschedule}
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: 3,
                        }
                    }}
                >
                    <DialogTitle sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        padding: 1,
                        background:'#43528C'
                    }}>
                        <CalendarTodayIcon />
                        <Typography variant="h6">Reschedule Post</Typography>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 2 }}>
                        <DialogContentText>
                            Are you sure you want to reschedule this post?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button
                            onClick={handleCancelReschedule}
                            color="inherit"
                            variant="outlined"
                            sx={{ borderRadius: 28 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmReschedule}
                            color="primary"
                            variant="contained"
                            autoFocus
                            sx={{ borderRadius: 28 }}
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <style jsx global>{`
                .fc-timegrid-slot {
                    height: 120px !important;
                }
                .fc-event {
                    border: none !important;
                    background: transparent !important;
                }
                .fc-daygrid-day-events {
                    max-height: 8rem;
                    overflow-y: auto;
                }
                .fc-direction-ltr .fc-timegrid-col-events {
                    margin: 0px;
                    width: 100%;
                }
                .fc .fc-daygrid-day.fc-day-today,
                .fc .fc-timegrid-col.fc-day-today {
                    background-color: #efefef !important;
                }
                .fc-view-harness {
                    background-color: #efefef !important;
                }
                .fc .fc-col-header-cell-cushion{
                    background: aliceblue !important;
                    width:100%
                }
                .fc .fc-timegrid-axis {
                    background-color: #efefef;
                }
                .fc-dayGridMonth-view .fc-col-header-cell,
                .fc-timeGridDay-view .fc-col-header-cell {
                    background-color: inherit;
                    color: inherit;

                }
            `}</style>
        </MUIThemeProvider>
    );
};

export default FullPageCalendar;