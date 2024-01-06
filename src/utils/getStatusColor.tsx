export type Status =
  | 'Offline'
  | 'Running'
  | 'Active'
  | 'Inactive'
  | 'Working'
  | 'ERROR'
  | 'Stop';

type StatusColorMap = {
  [key in Status]: string;
};

const statusColorMap: StatusColorMap = {
  Offline: '#ffbb77',
  Running: '#d6ecb9',
  Active: '#d6ecb9',
  Inactive: 'gray',
  Working: '#76d4ff',
  ERROR: '#ff0000',
  Stop: '#ff0000',
};

const getStatusColor = (status: Status): string => {
  return statusColorMap[status] || 'gray';
};

export default getStatusColor;
