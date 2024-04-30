// Import file-saver to save files
import { File } from 'lucide-react';
import React from 'react';
const Assessment = () => {
  const FileCard = ({ fileName, fileType, seen }: any) => {
    return (
      <a
        target="_blank"
        href="https://drive.google.com/file/d/1lsVqpVn4aJPjs3s-GT8M6bo0pAkuWOIE/view?usp=sharing"
        className="bg-white block shadow-md rounded-lg p-4 w-64 cursor-pointer hover:bg-black/10"
      >
        <div className="flex items-center mb-3">
          <File className="w-12 h-12 mr-2" />
          <span className="text-base font-semibold">{fileName}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <span>{fileType}</span>
        </div>
        {seen && (
          <div className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-3">
            Seen
          </div>
        )}
      </a>
    );
  };

  return (
    <div className=" p-4 rounded-xl border bg-white">
      <h1 className="text-primary text-xl font-bold mb-3">Procedure</h1>
      The International Diploma in Environmental Management is divided into two units: Both units are
      mandatory, and there are no optional units. You may choose to take the units together or at different
      times. Unit ED1: Controlling environmental aspects Unit ED1 is a taught unit which is assessed by a
      3-hour written examination. The written examination consists of eight ‘long-answer’ questions (20 marks
      each). Candidates choose which five questions to answer out of the eight. Student scripts are marked by
      external examiners appointed by NEBOSH A sample examination question paper can be found below. Unit
      IDEM2: Environmental regulation Unit NDEM2 consists of a written assignment set by NEBOSH. The report
      should be approximately 8000 words in total, excluding the references, bibliography and appendices. No
      penalty will be applied to reports which exceed 8000 words but students should aim to keep their word
      count under 12000. Submission dates for Diploma assignments are in February, May, August and November
      each year. The assignment is marked by external examiners appointed by NEBOSH.
      <h1 className="text-primary text-xl font-bold mt-6 mb-3">PDF Files</h1>
      <div className="flex flex-wrap gap-2">
        <FileCard
          fileName="digital-assessment-technical-learner-guide"
          fileType="pdf document"
          seen={false}
        />{' '}
        <FileCard
          fileName="digital-assessment-technical-learner-guide"
          fileType="pdf document"
          seen={false}
        />{' '}
        <FileCard
          fileName="digital-assessment-technical-learner-guide"
          fileType="pdf document"
          seen={false}
        />{' '}
        <FileCard
          fileName="digital-assessment-technical-learner-guide"
          fileType="pdf document"
          seen={false}
        />{' '}
        <FileCard
          fileName="digital-assessment-technical-learner-guide"
          fileType="pdf document"
          seen={false}
        />
      </div>
    </div>
  );
};

export default Assessment;
