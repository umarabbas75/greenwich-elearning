import React from 'react';

const StatusComponent = ({ status }: any) => {
  // Convert camelCase status to normal text
  const formattedStatus = status
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Insert spaces before capital letters
    .replace(/([A-Z])/g, ' $1')
    // Capitalize the first letter
    .replace(/^./, (str: any) => str.toUpperCase());

  let statusClass = '';

  // Determine the class based on the status
  switch (status.toLowerCase()) {
    case 'completed':
      statusClass = 'bg-green-100 text-green-700';
      break;
    case 'seen':
      statusClass = 'bg-blue-100 text-blue-700';
      break;
    case 'notopened':
      statusClass = 'bg-red-100 text-red-700';
      break;
    case 'in progress':
      statusClass = 'bg-yellow-100 text-yellow-700';
      break;
    case 'active':
      statusClass = 'bg-blue-100 text-blue-700';
      break;
    case 'inactive':
      statusClass = 'bg-gray-100 text-gray-700';
      break;
    default:
      statusClass = 'bg-gray-100 text-gray-700';
      break;
  }

  return (
    <div className={`inline-block px-3 py-1 min-w-[115px] rounded border ${statusClass}`}>
      {formattedStatus}
    </div>
  );
};

export default StatusComponent;
