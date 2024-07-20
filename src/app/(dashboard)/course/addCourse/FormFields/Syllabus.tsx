import axios from 'axios';
import { Trash } from 'lucide-react';
import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { Controller } from 'react-hook-form';

import Spinner from '@/components/common/Spinner';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

const Syllabus = ({ control, syllabus, appendSyllabus, removeSyllabus }: any) => {
  const [imageLoading, setImageLoading] = useState(false);
  return (
    <div className="relative">
      {imageLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[#ffffff36] z-[99999999]">
          <div className="w-full h-full flex justify-center items-center">
            <Spinner className="!text-primary w-16 h-16" />
          </div>
        </div>
      )}
      <div className="col-span-2">
        <FormLabel className="mb-3 block">Syllabus</FormLabel>

        <Controller
          control={control}
          name={`syllabusOverview`}
          render={({ field: { onChange, value } }) => (
            <ReactQuill
              id="overview"
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
              value={value}
              onChange={(data: string) => {
                onChange(data);
              }}
            />
          )}
        />

        <div className="mt-4">
          {syllabus?.map((el: any, syllabusIndex: any) => {
            return (
              <div className="flex gap-2 items-end mb-4" key={el.id}>
                <div>
                  <FormField
                    control={control}
                    name={`syllabus[${syllabusIndex}].file`}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <FormItem className="flex-1">
                          <FormLabel>File</FormLabel>
                          <div>
                            <FileUploader
                              classes="upload-doc !w-full !min-w-full"
                              multiple={false}
                              handleChange={async (value: any) => {
                                const selectedFile = value;
                                if (selectedFile) {
                                  const formData = new FormData();
                                  formData.append('file', selectedFile);
                                  formData.append('upload_preset', 'my_uploads');
                                  formData.append('cloud_name', 'dp9urvlsz');
                                  try {
                                    setImageLoading(true);
                                    const response = await axios.post(
                                      'https://api.cloudinary.com/v1/image/upload',
                                      formData,
                                      {
                                        headers: {
                                          'Content-Type': 'multipart/form-data',
                                        },
                                      },
                                    );
                                    setImageLoading(false);
                                    const { url } = response.data;
                                    onChange(url);
                                  } catch (error) {
                                    setImageLoading(false);
                                  }
                                }
                              }}
                              name="file"
                              value={value}
                              // disabled={true}
                              types={['pdf']}
                            />
                            {value && (
                              <div className="flex justify-between items-center border border-gray-200 p-2 border-dashed">
                                <a href={value} className=" rounded-full text-themeBlue underline">
                                  Syllabus file - {syllabusIndex + 1}
                                </a>
                                <Trash
                                  className="cursor-pointer hover:text-red-500"
                                  onClick={() => {
                                    onChange('');
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div>
                  <FormField
                    control={control}
                    name={`syllabus[${syllabusIndex}].name`}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <FormItem className="flex-1">
                          <FormLabel>File name</FormLabel>
                          <FormControl>
                            <Input
                              onChange={(e) => {
                                const value = e.target.value;
                                onChange(value);
                              }}
                              value={value}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <Trash
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => {
                    removeSyllabus(el.id);
                  }}
                />
              </div>
            );
          })}

          <button
            className="border border-dashed border-gray-400 rounded-md px-4 py-2 w-full"
            type="button"
            onClick={() => {
              appendSyllabus({
                file: '',
                name: '',
                type: '',
              });
            }}
          >
            Add Syllabus files
          </button>
        </div>
      </div>
    </div>
  );
};

export default Syllabus;
