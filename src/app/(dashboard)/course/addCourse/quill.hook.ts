import axios from 'axios';
import { useEffect, useRef } from 'react';

const useQuillHook = ({ fetchingCourse, setImageLoading }: any) => {
  const quillRef: any = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      try {
        const quill = quillRef.current?.getEditor();
        quill.getModule('toolbar').addHandler('image', imageHandler);

        // quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node: any, delta: any) => {
        //   // Iterate through the delta operations and filter out images
        //   delta.ops = delta.ops.filter(
        //     (op: any) => !op.insert || typeof op.insert !== 'object' || !op.insert.image,
        //   );
        //   return delta;
        // });
      } catch (error) {
        console.log({ error });
      }
    }
  }, [quillRef, quillRef.current, fetchingCourse]);

  const imageHandler = () => {
    try {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const selectedFile = input?.files?.[0];
        if (selectedFile) {
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('upload_preset', 'my_uploads');
          formData.append('cloud_name', 'dp9urvlsz');
          try {
            setImageLoading(true);
            const response = await axios.post('https://api.cloudinary.com/v1/image/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            const url = response.data.url;
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', url);
            setImageLoading(false);
          } catch (error) {
            setImageLoading(false);

            console.error('Error uploading image:', error);
          }
        }
      };
    } catch (error) {
      console.log({ error });
    }
  };
  return { quillRef };
};

export default useQuillHook;
