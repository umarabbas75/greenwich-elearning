import { useAtom } from 'jotai';
import { DeleteIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

import LoadingButton from '@/components/common/LoadingButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useApiMutation } from '@/lib/dashboard/client/user';
import { userPhotoAtom } from '@/store/course';

const UpdateImageForm = ({ isEdit, setIsEdit }: { isEdit: boolean; setIsEdit: any }) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [userPhotoState, setUserPhotoAtom] = useAtom(userPhotoAtom);

  const [file, setFile] = useState<string>(userPhotoState);

  useEffect(() => {
    if (userPhotoState) {
      setFile(userPhotoState);
    }
  }, [userPhotoState]);

  const { mutate: editUser, isLoading } = useApiMutation<any>({
    endpoint: `/users/${session?.user?.id}`,
    method: 'put',
    config: {
      onSuccess: async () => {
        setUserPhotoAtom(file);
        setIsEdit(false);
        toast({
          variant: 'success',
          title: 'Profile Picture Updated',
        });
        setFile('');
      },
    },
  });
  const updatePhoto = () => {
    if (file) {
      const payload = {
        photo: file,
      };
      if (session?.user?.id) {
        editUser(payload);
      }
    }
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
              <AvatarImage src={file ? file : session?.user?.photo ?? ''} alt="user profile pic" />
              <AvatarFallback className="text-2xl">{session?.user?.firstName}</AvatarFallback>
            </Avatar>

            <FileUploader
              disabled={!isEdit}
              classes="custom-file-uploader"
              multiple={false}
              maxSize={1}
              handleChange={(value: any) => {
                const file = value;
                const reader = new FileReader();
                reader.onload = (e: any) => {
                  const base64 = e.target.result;
                  setFile(base64);
                };

                reader.readAsDataURL(file);
              }}
              name="file"
              value={file}
              types={['jpeg', 'png', 'jpg', 'svg+xml', 'webp']}
            />
            {isEdit && file && (
              <div className="flex justify-between mt-1 p-2 hover:bg-gray-200 cursor-pointer">
                <DeleteIcon className="cursor-pointer" onClick={() => setFile('')} />
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
