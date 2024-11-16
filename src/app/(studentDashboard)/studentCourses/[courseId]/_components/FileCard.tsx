import { CheckCircle, File } from 'lucide-react';

const FileCard = ({ fileName, fileType, seen, onClick, file, item }: any) => {
  return (
    <div
      className={`bg-white dark:bg-black border dark:border-white block shadow-md rounded-lg p-4 w-64 cursor-pointer hover:bg-black/10 ${
        seen ? 'border border-green-500' : ''
      }`}
      onClick={() => {
        onClick?.(item ?? '');
        window.open(file, '_blank');
      }}
    >
      <div className="flex items-center flex-col mb-3">
        <File className="h-12 w-12 min-w-12 min-h-12 mr-2 text-primary" size={40} />
        <span className=" text-sm font-semibold dark:text-white/80">{fileName}</span>
      </div>
      <div className="flex items-center text-gray-500 text-sm mb-3">
        <span>{fileType}</span>
      </div>
      {seen && (
        <div className="flex items-center text-green-500 text-xs font-semibold mb-3">
          <CheckCircle className="w-4 h-4 mr-1" />
          <span>Seen</span>
        </div>
      )}
    </div>
  );
};
export default FileCard;
