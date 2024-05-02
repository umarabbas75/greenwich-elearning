import { Trash } from 'lucide-react';
import React from 'react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

const Assessment = ({ control, assessments, appendAssessment, removeAssessment }: any) => {
  return (
    <>
      <div className="col-span-2">
        <FormLabel className="mb-3 block">Assessment</FormLabel>

        <Controller
          control={control}
          name={`assessment`}
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
          {assessments?.map((el: any, assessmentIndex: any) => {
            return (
              <div className="flex gap-2 items-end mb-4" key={el.id}>
                <div>
                  <FormField
                    control={control}
                    name={`assessments[${assessmentIndex}].file`}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <FormItem className="flex-1">
                          <FormLabel>File url</FormLabel>
                          <FormControl>
                            <Input onChange={onChange} value={value} />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div>
                  <FormField
                    control={control}
                    name={`assessments[${assessmentIndex}].name`}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <FormItem className="flex-1">
                          <FormLabel>File name</FormLabel>
                          <FormControl>
                            <Input onChange={onChange} value={value} />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div>
                  <FormField
                    control={control}
                    name={`assessments[${assessmentIndex}].type`}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <FormItem className="flex-1">
                          <FormLabel>File type</FormLabel>
                          <FormControl>
                            <Input onChange={onChange} value={value} />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <Trash
                  className="cursor-pointer"
                  onClick={() => {
                    removeAssessment(el.id);
                  }}
                />
              </div>
            );
          })}

          <Button
            type="button"
            onClick={() => {
              appendAssessment({
                file: '',
                name: '',
                type: '',
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

export default Assessment;
