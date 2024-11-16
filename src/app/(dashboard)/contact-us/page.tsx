'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';

import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { Icons } from '@/utils/icon';

import ContactUsTable from './ContactUsTable';

const Page = () => {
  const { data: userData } = useSession();
  const queryClient = useQueryClient();

  const validationSchema = Yup.object().shape({
    message: Yup.string().required('message is required'),
  });
  const defaultValues = {
    message: '',
  };
  const form = useForm<any>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });
  const { handleSubmit, control, reset } = form;
  const { toast } = useToast();

  const {
    mutate: createMessage,
    isLoading: creatingMessage,
    isError: isAddError,
    error: addError,
  } = useApiMutation<any>({
    endpoint: `/users/contact-us-message`,
    method: 'post',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-contact-us-message', userData?.user?.id] });
        reset({ message: '' });
        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Message sent successfully!',
        });
      },
    },
  });

  const onSubmit = (values: any) => {
    const payload = {
      message: values?.message,
    };
    createMessage(payload);
  };

  const { data: contactUsMessages, isLoading } = useApiGet<any, Error>({
    endpoint: `/users/contact-message`,
    queryKey: ['get-contact-us-message', userData?.user?.id],
  });

  return (
    <div className="container mx-auto p-3 sm:p-6">
      {isAddError && <AlertDestructive error={addError} />}

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Column 1: Contact Information */}
        <div className="space-y-4 md:col-span-2">
          <div className="bg-white dark:bg-black p-6 rounded-lg shadow-md flex items-center">
            {/* <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 mr-4" size="2x" /> */}
            <Icons iconName="mail" className="text-blue-500 mr-4 w-8 h-8" />
            <div>
              <p className="text-lg text-gray-700 font-semibold dark:text-primary">Email us on:</p>
              <p className="text-gray-500 dark:text-white">info@greenwichtc.com</p>
            </div>
          </div>
          <div className="bg-white dark:bg-black p-6 rounded-lg shadow-md flex items-center">
            <Icons iconName="phone" className="text-green-500 mr-4 w-8 h-8" />

            <div>
              <p className="text-lg text-gray-700 font-semibold dark:text-primary">Call us on:</p>
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-white">+92-51-8890705 </p>
                <p className="text-gray-500 dark:text-white">+92-312-5343061 </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-black p-6 rounded-lg shadow-md flex items-center">
            <Icons iconName="marker" className="text-red-500 mr-4 w-8 h-8" />

            <div>
              <p className="text-lg text-gray-700 font-semibold dark:text-primary">Our office address:</p>
              <p className="text-gray-500 dark:text-white">
                Suite no. 02, Ground Floor, Twin City Plaza, I-8/4 Ext. Islamabad
              </p>
            </div>
          </div>
        </div>

        {/* Column 2: Contact Form */}
        <div className="md:col-span-4 bg-white dark:bg-black p-6 rounded-lg shadow-md">
          <p className="text-xl font-semibold mb-4 text-gray-700 dark:text-primary">Send us a message</p>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <FormField
                  control={control}
                  name="message"
                  render={({ field: { onChange, value }, formState: { errors } }) => {
                    return (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea value={value} rows={8} placeholder="Type here..." onChange={onChange} />
                        </FormControl>

                        <FormMessage>{errors.title?.message as string}</FormMessage>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex justify-center space-x-4">
                <LoadingButton loading={creatingMessage} type="submit">
                  <Icons iconName="send" className=" mr-4" />
                  Send Message
                </LoadingButton>
                <Button
                  type="reset"
                  variant="outline"
                  onClick={() => {
                    reset({ message: '' });
                  }}
                >
                  <Icons iconName="undo" className=" mr-2" />
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <div className="mt-6">
        {contactUsMessages && contactUsMessages?.data?.length > 0 && (
          <ContactUsTable data={contactUsMessages} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default Page;
