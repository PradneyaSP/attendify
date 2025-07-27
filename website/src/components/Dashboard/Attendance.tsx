'use client';
import { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Grid, Paper, Button, CircularProgress } from '@mui/material';
import { format, getDay } from 'date-fns';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';

type TimetableEntry = {
  daysOfWeek?: string;
  courseName: string;
  classroom: string;
  startTime: string;
  endTime: string;
};

const dayAcronyms = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Attendance = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchTimetable = async () => {
      if (user) {
        setLoading(true);
        const q = query(collection(db, 'timetable'), where('userId', '==', user.uid));
        try {
          const querySnapshot = await getDocs(q);
          const timetableData: TimetableEntry[] = [];

          querySnapshot.forEach((doc) => {
            const docData = doc.data();
            if (docData.timetableEntries) {
              timetableData.push(...docData.timetableEntries);
            }
          });

          setTimetable(timetableData);
        } catch (error) {
          console.error('Error fetching timetable:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTimetable();
  }, [user]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const markAttendance = (subject: string, status: string) => {
    console.log(`Marked ${subject} as ${status}`);
    // Implement actual attendance marking logic here
  };

  const todayAcronym = dayAcronyms[getDay(new Date())];

  return (
    <Box sx={{ width: '100%', marginTop: 2 }}>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        centered
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          marginBottom: 2,
        }}
      >
        <Tab label="Today's Classes" sx={{ fontWeight: 'bold' }} />
        <Tab label="All Classes" sx={{ fontWeight: 'bold' }} />
      </Tabs>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TabPanel value={tabIndex} index={0}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Classes for Today ({todayAcronym})
            </Typography>
            <Grid container spacing={2}>
              {timetable
                .filter((entry) => entry.daysOfWeek && entry.daysOfWeek.includes(todayAcronym))
                .map((entry, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                      <Typography variant="h6" color="primary">
                        {entry.courseName}
                      </Typography>
                      <Typography variant="body1">
                        Classroom: {entry.classroom}
                      </Typography>
                      <Typography variant="body2">
                        Time: {entry.startTime} - {entry.endTime}
                      </Typography>
                      <Box mt={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => markAttendance(entry.courseName, 'Present')}
                          sx={{ marginRight: 1 }}
                        >
                          Present
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => markAttendance(entry.courseName, 'Absent')}
                          sx={{ marginRight: 1 }}
                        >
                          Absent
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => markAttendance(entry.courseName, 'Leave')}
                        >
                          Leave
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              All Classes
            </Typography>
            <Grid container spacing={2}>
              {timetable.map((entry, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {entry.courseName}
                    </Typography>
                    <Typography variant="body1">
                      Days: {entry.daysOfWeek || 'N/A'}
                    </Typography>
                    <Typography variant="body1">
                      Classroom: {entry.classroom}
                    </Typography>
                    <Typography variant="body2">
                      Time: {entry.startTime} - {entry.endTime}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </>
      )}
    </Box>
  );
};

// Tab Panel Component for Conditional Rendering
function TabPanel(props: { children: React.ReactNode; value: number; index: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
      style={{ padding: value === index ? '16px' : '0' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default Attendance;
