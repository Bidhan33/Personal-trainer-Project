import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Typography } from '@mui/material';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchTrainingsForCustomer } from "../components/api";


const localizer = momentLocalizer(moment);

function MyCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const trainingResponse = await fetchTrainingsForCustomer();
        const trainingList = trainingResponse._embedded?.trainings || [];
        
        


        const calendarEvents = trainingList.map((training) => ({
          id: training.id,
          title: training.activity,
          start: new Date(training.date), 

          end: new Date(new Date(training.date).getTime() + training.duration * 60000), 
        }));

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  
  const handleSelectEvent = (event) => {
    alert(`Event: ${event.title}`);
  };

  
  const handleSelectSlot = (slotInfo) => {
    const title = prompt('Enter title for new event:');
    if (title) {
      setEvents([
        ...events,
        {
          id: events.length + 1,
          title,
          start: slotInfo.start,
          end: slotInfo.end,
        },
      ]);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '19px', marginTop: '5px', gap: '12px' }}>
        <CalendarTodayIcon style={{ fontSize: '40px', marginRight: '10px' }} /> 
        <Typography variant="h5" component="h1">Calendar</Typography>
      </div>
      <div style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
}

export default MyCalendar;
