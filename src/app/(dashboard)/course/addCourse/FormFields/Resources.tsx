import { Trash } from 'lucide-react';
import React from 'react';
import { Controller } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

const Resources = ({ control, resources, appendResources, removeResources }: any) => {
  return (
    <>
      <div className="col-span-2">
        <FormLabel className="mb-3 block">Resources</FormLabel>

        <Controller
          control={control}
          name={`resourcesOverview`}
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
          {resources?.map((el: any, resourcesIndex: any) => {
            return (
              <div className="flex gap-2 items-end mb-4" key={el.id}>
                <div>
                  <FormField
                    control={control}
                    name={`resources[${resourcesIndex}].file`}
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
                    name={`resources[${resourcesIndex}].name`}
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
                    name={`resources[${resourcesIndex}].type`}
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
                    removeResources(el.id);
                  }}
                />
              </div>
            );
          })}

          <button
            className="border border-dashed border-gray-400 rounded-md px-4 py-2 w-full"
            type="button"
            onClick={() => {
              appendResources({
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
    </>
  );
};

export default Resources;
