import { StyleSheet, Page, View, Text, Image } from '@react-pdf/renderer';
import React from 'react';

const PDFReport = ({
  courseName,
  courseProgressState,
  instituteName,
  instituteAddress,
  columns,
  grades,
  userDetails,
  startDate,
}: any) => {
  const styles = StyleSheet.create({
    page: {
      width: '210mm', // A4 size width
      height: '297mm', // A4 size height
      padding: '20px',
    },
    courseReport: {
      display: 'flex',
      flexDirection: 'row',

      backgroundColor: 'white',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind shadow-md
      borderRadius: '8px', // Tailwind rounded-lg
      overflow: 'hidden',
    },
    studentInfo: {
      padding: '24px',
      display: 'flex',
      width: '35%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6', // Tailwind bg-gray-100
    },
    userInfo: {
      fontSize: '16px', // Tailwind text-xl
      fontWeight: 'bold',
      color: '#374151', // Tailwind text-gray-800
      marginBottom: '8px',
    },
    userEmail: {
      fontSize: '12px', // Tailwind text-sm
      color: '#4b5563', // Tailwind text-gray-600
      marginTop: '8px',
    },
    courseDetails: {
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '65%',
    },
    courseName: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#374151',
      width: '200px',
    },
    progress: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '8px',
    },
    progressBar: {
      flex: 1,
      backgroundColor: '#E5E7EB', // Tailwind bg-gray-200
      borderRadius: '9999px', // Large value to make it round
      height: '2px',
      overflow: 'hidden',
    },
    progressBarFill: {
      backgroundColor: '#10B981', // Tailwind bg-green-500
      height: '100%',
    },
    instituteInfo: {
      color: '#374151',
    },
    date: {
      textAlign: 'right',
      color: '#6B7280', // Tailwind text-gray-500
      fontSize: '8px', // Tailwind text-xs
    },
    tableContainer: {
      paddingVertical: '24px',
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeaderCell: {
      padding: '8px 12px',

      borderBottomWidth: 2,
      borderBottomColor: '#E5E7EB',
      backgroundColor: '#F3F4F6',
      color: '#374151',
      fontSize: '8px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    tableBodyCell: {
      padding: '8px 2px',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      color: '#4B5563',
      fontSize: '11px',
      width: 'auto',
    },
    oddRow: {
      backgroundColor: '#F9FAFB',
    },
    evenRow: {
      backgroundColor: '#FFFFFF',
    },
  });
  const formatCamelCase = (status: any) => {
    const formattedStatus = status
      // Replace underscores with spaces
      .replace(/_/g, ' ')
      // Insert spaces before capital letters
      .replace(/([A-Z])/g, ' $1')
      // Capitalize the first letter
      .replace(/^./, (str: any) => str.toUpperCase());

    return formattedStatus;
  };
  const getStyles = (status: any) => {
    const styles = {
      completed: {
        backgroundColor: '#D1FAE5', // Tailwind bg-green-100
        color: '#34D399', // Tailwind text-green-700
      },
      seen: {
        backgroundColor: '#BFDBFE', // Tailwind bg-blue-100
        color: '#60A5FA', // Tailwind text-blue-700
      },
      notopened: {
        backgroundColor: '#FEE2E2', // Tailwind bg-red-100
        color: '#EF4444', // Tailwind text-red-700
      },
      inProgress: {
        backgroundColor: '#FEF3C7', // Tailwind bg-yellow-100
        color: '#FBBF24', // Tailwind text-yellow-700
      },
      active: {
        backgroundColor: '#BFDBFE', // Tailwind bg-blue-100
        color: '#60A5FA', // Tailwind text-blue-700
      },
      inactive: {
        backgroundColor: '#F3F4F6', // Tailwind bg-gray-100
        color: '#374151', // Tailwind text-gray-700
      },
      defaultStatus: {
        backgroundColor: '#F3F4F6', // Tailwind bg-gray-100
        color: '#374151', // Tailwind text-gray-700
      },
    };
    let statusClass: any = '';
    switch (status?.toLowerCase()) {
      case 'completed':
        statusClass = styles.completed;
        break;
      case 'seen':
        statusClass = styles.seen;

        break;
      case 'notopened':
        statusClass = styles.notopened;

        break;
      case 'in progress':
        statusClass = styles.inProgress;

        break;
      case 'active':
        statusClass = styles.active;

        break;
      case 'inactive':
        statusClass = styles.inactive;
        break;
      default:
        statusClass = styles.defaultStatus;
        break;
    }
    return statusClass;
  };
  const renderQuizGrade = (row: any) => {
    const percentage = (row._count?.QuizAnswer * 100) / row?._count?.quizzes;
    return isNaN(percentage) ? 0 : percentage?.toFixed(2);
  };
  const renderStatus = (row: any) => {
    const status =
      row?._count?.LastSeenSection > 0 ? (+row?.progress === 100 ? 'completed' : 'Inprogress') : 'notOpened';
    return status;
  };
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.courseReport}>
        <View style={styles.studentInfo}>
          {userDetails?.photoBase64 && (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image
              src={userDetails?.photoBase64}
              style={{ borderRadius: '50%', width: '50px', height: '50px' }}
              // alt="user profile"
            />
          )}
          <Text style={styles.userInfo}>{`${userDetails?.firstName} ${userDetails?.lastName}`}</Text>
          <Text style={styles.userEmail}>{userDetails?.email}</Text>
          <Text style={styles.userEmail}>{userDetails?.phone}</Text>
        </View>

        <View style={styles.courseDetails}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Text style={styles.courseName}>{courseName}</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '8px',
              }}
            >
              <Text style={{ color: '#4B5563', fontSize: '10px' }}>Status:</Text>
              <Text style={{ color: '#374151', fontSize: '11px' }}>
                {courseProgressState === 100 ? 'Completed' : 'In progress'}
              </Text>
            </View>
          </View>
          <View style={styles.progress}>
            <Text style={{ color: '#4B5563', fontSize: '10px' }}>Progress:</Text>
            <Text style={{ color: '#374151', fontSize: '14px' }}>
              {courseProgressState ? courseProgressState?.toFixed(2) : 0}%
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressBarFill, { width: `${courseProgressState}%` }]}></View>
            </View>
          </View>
          <View style={styles.instituteInfo}>
            <Text>{instituteName}</Text>
            <Text>{instituteAddress}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={styles.date}>Course start date: {startDate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tableContainer}>
        <View style={{ flexDirection: 'row' }}>
          {columns.map((column: any, index: any) => (
            <View key={index} style={[styles.tableHeaderCell, { ...(index === 0 && { width: '180px' }) }]}>
              <Text>{column}</Text>
            </View>
          ))}
        </View>
        {grades?.map((item: any, index: any) => (
          <React.Fragment key={index}>
            <View style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ ...styles.tableBodyCell, fontWeight: 'bold' }}>
                  <Text>{item.title}</Text>
                </View>
                {Array.from({ length: columns.length - 1 }).map((_, i) => (
                  <View key={i} style={styles.tableBodyCell}></View>
                ))}
              </View>
            </View>
            {item.chapters.map((row: any, rowIndex: any) => (
              <View
                key={rowIndex}
                style={
                  rowIndex % 2 === 0
                    ? { ...styles.evenRow, flexDirection: 'row' }
                    : { ...styles.oddRow, flexDirection: 'row' }
                }
              >
                <View style={[styles.tableBodyCell, { width: '150px' }]}>
                  <Text>{row.title}</Text>
                </View>
                <View style={[styles.tableBodyCell, { width: '80px', textAlign: 'center' }]}>
                  <Text
                    style={[
                      getStyles(renderStatus(row)),
                      {
                        padding: '2px',
                        width: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        borderRadius: '5px',
                      },
                    ]}
                  >
                    {formatCamelCase(renderStatus(row))}
                  </Text>
                </View>
                <View style={[styles.tableBodyCell, { flex: 1 }]}>
                  <Text>{isNaN(row?.progress) ? 0 : row.progress}%</Text>
                </View>
                <View style={[styles.tableBodyCell, { width: '100px' }]}>
                  <Text>{row.contribution}%</Text>
                </View>
                <View style={[styles.tableBodyCell, { flex: 1 }]}>
                  <Text>
                    {row._count?.QuizAnswer}/{row._count?.quizzes}
                  </Text>
                </View>

                <View style={[styles.tableBodyCell, { flex: 1 }]}>
                  <Text>{renderQuizGrade(row)}%</Text>
                </View>
              </View>
            ))}
          </React.Fragment>
        ))}
      </View>
    </Page>
  );
};

export default PDFReport;
