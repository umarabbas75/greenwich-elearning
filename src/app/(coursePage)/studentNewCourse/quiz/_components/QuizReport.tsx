import React from 'react';

const QuizReport = ({ allQuizzes }: any) => {
  console.log({ allQuizzes });
  const passingPercentage = 70;
  const totalQuizzesLength = allQuizzes.data?.length;
  const correctAnswers = allQuizzes.data?.filter((item: any) => item?.isAnswerCorrect);
  const quizPercentage = (correctAnswers.length * 100) / totalQuizzesLength;

  const isPassed = quizPercentage >= passingPercentage ? true : false;
  console.log({ totalQuizzesLength, correctAnswers, quizPercentage, isPassed });
  return (
    <div className="w-full bg-white shadow-xl rounded-lg p-8 my-10 border border-gray-200">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">🎉 Quiz Result Summary 🎉</h2>
        <p className="text-gray-600 mt-2">Here is how you performed in the quiz!</p>
      </div>

      {/* Result Status */}
      <div className="mt-6 text-center">
        <div className={`py-4 px-6  ${isPassed ? 'bg-green-100' : 'bg-red-100'} rounded-lg shadow-sm`}>
          <h3 className={`text-xl font-semibold  ${isPassed ? 'text-green-600' : 'text-red-500'}`}>
            You have <span className="underline">{isPassed ? `Passed` : 'Failed'}</span> the quiz!
          </h3>
          <p className="mt-1 text-blue-600">{isPassed ? 'Well done! Keep up the great work! 👏' : ''}</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="flex justify-between items-center bg-gray-50 mt-8 rounded-lg p-4 shadow-sm">
        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-600">Your Score</h4>
          <p className="text-2xl font-bold text-gray-800">{quizPercentage?.toFixed(2)}%</p>
        </div>
        <div className="text-center">
          <h4 className="text-sm font-medium text-gray-600">Passing Criteria</h4>
          <p className="text-2xl font-bold text-gray-800">{passingPercentage}%</p>
        </div>
      </div>

      {/* Answer Summary */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800">Answer Summary</h3>
        <div className="mt-4 space-y-4">
          {allQuizzes?.data?.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className={`p-4 rounded-lg shadow-sm ${
                  item.isAnswerCorrect
                    ? 'bg-green-100 border border-green-300'
                    : 'bg-red-100 border border-red-300'
                }`}
              >
                <p className="text-gray-800">
                  <span className="font-semibold">Q{index + 1}:</span> {item.question}
                </p>
                <p
                  className={`mt-2 text-sm font-medium ${
                    item.isAnswerCorrect ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {item.isAnswerCorrect ? '✅ Correct' : '❌ Incorrect'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Section */}
      {/* <div className="mt-8 flex justify-center text-center">
        <button
          className={`bg-[#36394D] mt-4 text-white flex items-center gap-1 justify-center rounded-sm  px-4 py-2 `}
        >
          Retake Quiz
        </button>
      </div> */}
    </div>
  );
};

export default QuizReport;
