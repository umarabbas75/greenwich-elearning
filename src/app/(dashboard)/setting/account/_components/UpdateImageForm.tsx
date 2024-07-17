import axios from 'axios';
import { DeleteIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

import LoadingButton from '@/components/common/LoadingButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';

const UpdateImageForm = ({ isEdit, setIsEdit }: { isEdit: boolean; setIsEdit: any }) => {
  const { data: session, update } = useSession();
  const { toast } = useToast();

  const [file, setFile] = useState<any>({});

  console.log({ file });

  const updatePhoto = async () => {
    await update({
      photo: file?.photo,
      photoBase64: file?.photoBase64,
    });
    toast({
      variant: 'success',
      title: 'Name Updated',
    });
    setIsEdit(false);
    setFile({});
  };

  return (
    <div className="grid grid-cols-3  items-center py-4 border-b ">
      <div className="col-span-3 md:col-span-1">
        <h3 className="text-xl font-bold">Photo</h3>
        <p className="text-accent">Update your profile picture</p>
      </div>
      <div className="col-span-3 md:col-span-2 ">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Avatar className="h-28 w-28">
              <AvatarImage
                src={file?.photo ? file?.photo : session?.user?.photo ?? ''}
                alt="user profile pic"
              />
              <AvatarFallback className="text-2xl">{session?.user?.firstName}</AvatarFallback>
            </Avatar>

            <FileUploader
              disabled={!isEdit}
              classes="custom-file-uploader"
              multiple={false}
              handleChange={async (value: any) => {
                const file = value;
                const reader = new FileReader();
                reader.onload = (e: any) => {
                  const base64 = e.target.result;
                  setFile({ ...file, photoBase64: base64 });
                };

                reader.readAsDataURL(file);

                const selectedFile = value;
                if (selectedFile) {
                  const formData = new FormData();
                  formData.append('file', selectedFile);
                  formData.append('upload_preset', 'my_uploads');
                  formData.append('cloud_name', 'dp9urvlsz');
                  try {
                    const response = await axios.post(
                      'https://api.cloudinary.com/v1/image/upload',
                      formData,
                      {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                        },
                      },
                    );
                    const { url } = response.data;
                    setFile((prev: any) => ({
                      ...prev,
                      photo: url,
                    }));
                  } catch (error) {
                    console.error('Error uploading image:', error);
                  }
                }
              }}
              name="file"
              value={file}
              types={['jpeg', 'png', 'jpg', 'svg+xml', 'webp']}
            />
            {isEdit && file && (
              <div className="flex justify-between mt-1 p-2 hover:bg-gray-200 cursor-pointer">
                <DeleteIcon className="cursor-pointer" onClick={() => setFile({})} />
              </div>
            )}
          </div>
          {isEdit && (
            <LoadingButton onClick={updatePhoto} className="w-fit" variant="default">
              Submit
            </LoadingButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateImageForm;
