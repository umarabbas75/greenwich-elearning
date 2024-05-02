import { File } from 'lucide-react';

const FileCard = ({ fileName, fileType, seen, onClick, file }: any) => {
  return (
    <div
      className="bg-white block shadow-md rounded-lg p-4 w-64 cursor-pointer hover:bg-black/10"
      onClick={() => {
        onClick?.();
        window.open(file, '_blank');
      }}
    >
      <div className="flex items-center mb-3">
        <File className="w-12 h-12 mr-2 text-primary" />
        <span className="text-base font-semibold">{fileName}</span>
      </div>
      <div className="flex items-center text-gray-500 text-sm mb-3">
        <span>{fileType}</span>
      </div>
      {seen && (
        <div className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-3">Seen</div>
      )}
    </div>
  );
};
export default FileCard;
