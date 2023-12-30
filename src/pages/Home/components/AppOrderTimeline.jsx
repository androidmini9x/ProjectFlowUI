import { format } from 'date-fns';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

export default function AnalyticsOrderTimeline({
  title,
  subheader,
  list,
  fetched,
  ...other
}) {
  const filterTask = list
    .filter((e) => {
      const start = new Date(`${e.task.start} 00:00:00`);
      // start.setTime(start.getTime() + 24 * 60 * 60 * 1000);
      const today = new Date();
      return today < start;
    })
    .sort(
      (a, b) =>
        new Date(`${a.task.start} 00:00:00`) -
        new Date(`${b.task.start} 00:00:00`),
    )
    .slice(0, 5);

  // const filterTask = list.sort(
  // (a, b) => new Date(`${a.task.start}:00:00:00`) - new Date(`${b.task.start}:00:00:00`))

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      {fetched && filterTask.length === 0 && (
        <Typography
          variant="body1"
          sx={{ pt: 4, textAlign: 'center', color: 'text.secondary' }}
        >
          There is no Upcoming Tasks.
        </Typography>
      )}

      <Timeline
        sx={{
          m: 0,
          p: 3,
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {filterTask.map((item, index) => (
          <OrderItem
            key={item.task.id}
            type={index}
            item={item}
            projectName={item.project_name}
            lastTimeline={index === list.length - 1}
          />
        ))}
      </Timeline>
    </Card>
  );
}

AnalyticsOrderTimeline.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
  fetched: PropTypes.bool,
};

// ----------------------------------------------------------------------

function OrderItem({ item, lastTimeline, type, projectName }) {
  const { task } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (type === 0 && 'primary') ||
            (type === 1 && 'success') ||
            (type === 2 && 'info') ||
            (type === 3 && 'warning') ||
            'error'
          }
        />
        {lastTimeline ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle2">{task.name}</Typography>

        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {format(new Date(`${task.start} 00:00:00`), 'dd MMM yyyy')}
          <Typography sx={{ fontStyle: 'italic' }}>{projectName}</Typography>
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

OrderItem.propTypes = {
  item: PropTypes.object,
  lastTimeline: PropTypes.bool,
  type: PropTypes.number,
  projectName: PropTypes.string,
};
