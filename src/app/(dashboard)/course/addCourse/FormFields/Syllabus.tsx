import { Trash } from 'lucide-react';
import React from 'react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

const Syllabus = ({ control, syllabus, appendSyllabus, removeSyllabus }: any) => {
  return (
    <>
      <div className="col-span-2">
        <FormLabel className="mb-3 block">Syllabus</FormLabel>

        <Controller
          control={control}
          name={`syllabusOverview`}
          render={({ field: { onChange, value } }) => (
            <ReactQuill
              id="quill"
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
                <FormField
                  control={control}
                  name={`syllabus[${syllabusIndex}].file`}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormLabel>File</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                <Trash
                  className="cursor-pointer"
                  onClick={() => {
                    removeSyllabus(el.id);
                  }}
                />
              </div>
            );
          })}

          <Button
            type="button"
            onClick={() => {
              appendSyllabus({
                file: '',
                isSeen: false,
              });
            }}
          >
            Add more files
          </Button>
        </div>
      </div>
    </>
  );
};

export default Syllabus;
