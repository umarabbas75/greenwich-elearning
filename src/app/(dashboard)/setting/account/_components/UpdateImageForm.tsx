import { AxiosResponse } from 'axios';
import { DeleteIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

import LoadingButton from '@/components/common/LoadingButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useUpdateImage } from '@/lib/dashboard/client/user';

const UpdateImageForm = ({ isEdit }: { isEdit: boolean }) => {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const [file, setFile] = useState<File | undefined>();

  const { mutate, isLoading } = useUpdateImage({
    onSuccess: async (res: AxiosResponse) => {
      await update({ photo: res?.data?.photo });
      toast({
        variant: 'success',
        title: 'Profile Picture Updated',
      });
      setFile(undefined);
    },
  });

  const updatePhoto = () => {
    const addFormData = new FormData();
    if (file instanceof File) {
      addFormData.append('photo', file as File);
      if (session?.user?.id) {
        mutate({ formData: addFormData, id: session.user.id });
      }
    }
  };

  return (
    <div className="grid grid-cols-3  items-center py-4 border-b ">
      <div className="col-span-1">
        <h3 className="text-xl font-bold">Photo</h3>
        <p className="text-accent">Update your profile picture</p>
      </div>
      <div className="col-span-2 ">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-28 w-28">
              <AvatarImage
                src={file ? URL.createObjectURL(file) : session?.user?.photo ?? ''}
                alt="user profile pic"
              />
              <AvatarFallback className="text-2xl">{session?.user?.first_name || 'A'}</AvatarFallback>
            </Avatar>

            <FileUploader
              disabled={!isEdit}
              classes="custom-file-uploader"
              multiple={false}
              handleChange={(e: any) => {
                if (e) {
                  setFile(e);
                }
              }}
              name="file"
              value={file}
              types={['jpeg', 'png', 'jpg', 'svg+xml', 'webp']}
            />
            {file && (
              <div className="flex justify-between mt-1 p-2 hover:bg-gray-200 cursor-pointer">
                {file.name && <span> {file.name}</span>}

                <DeleteIcon className="cursor-pointer" onClick={() => setFile(undefined)} />
              </div>
            )}
          </div>
          {isEdit && (
            <LoadingButton loading={isLoading} onClick={updatePhoto} className="w-fit" variant="default">
              Submit
            </LoadingButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateImageForm;
