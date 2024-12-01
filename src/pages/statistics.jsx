import { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Typography, Card, CardContent } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';


const Statistics = () => {
  const [data, setData] = useState([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalTrainings, setTotalTrainings] = useState(0);

  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const response = await axios.get(
          'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings'
        );

        const trainings = response.data._embedded?.trainings || [];

        setTotalMinutes(_.sumBy(trainings, 'duration'));
        setTotalTrainings(trainings.length);

        const groupedData = _.groupBy(trainings, 'activity');
        const chartData = _.map(groupedData, (activities, activityName) => ({
          name: activityName || 'Unknown',
          minutes: _.sumBy(activities, 'duration'),
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching training data:', error);
      }
    };

    fetchTrainingData();
  }, []);

  return (
    <div className="statistics-container" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
        <BarChartIcon style={{ fontSize: '30px', marginRight: '10px' }} />
        <Typography variant="h5" component="h1" style={{ fontWeight: 100 }}>
          Training Statistics
        </Typography>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '30px',
          gap: '20px',
        }}
      >
        <Card
          style={{
            flex: 1,
            backgroundColor: '#f75990',
          }}
        >
          <CardContent>
            <Typography variant="h6" style={{ fontWeight: 600, color: 'black' }}>
              Total Minutes
            </Typography>
            <Typography variant="h4" style={{ fontWeight: 700, color: 'black' }}>
              {totalMinutes}
            </Typography>
          </CardContent>
        </Card>

        <Card
          style={{
            flex: 1,
            backgroundColor: '#8458B3',
            color: 'white',
          }}
        >
          <CardContent>
            <Typography variant="h6" style={{ fontWeight: 600, color: 'white' }}>
              Total Sessions
            </Typography>
            <Typography variant="h4" style={{ fontWeight: 700, color: 'white' }}>
              {totalTrainings}
            </Typography>
          </CardContent>
        </Card>
      </div>

      <Typography variant="h6" style={{ fontWeight: 600, marginBottom: '20px' }}>
        Total Minutes by Activity
      </Typography>

      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="minutes" fill=" #0049B7" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistics;
