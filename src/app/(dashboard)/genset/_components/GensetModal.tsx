import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import Modal from '@/components/common/Modal';
import ReactSelect from '@/components/common/ReactSelect';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import { useFetchCustomerList } from '@/lib/dashboard/client/customer';
import {
  useAddGenset,
  useEditGenset,
  useFetchGenset,
} from '@/lib/dashboard/client/genset';
import { useFetchGensetTypeList } from '@/lib/dashboard/client/gensetType';
import { useFetchSubscriptionList } from '@/lib/dashboard/client/subscription';
import { gensetModalAtom } from '@/store/modals';
const GensetModal = () => {
  const [genState, setGenState] = useAtom(gensetModalAtom);
  const { toast } = useToast();

  const defaultValues = {
    type: null,
    genset_id: '',
    registration_number: '',
    serial_number: '',
    customer: null,
    subscription: null,
    iot_ready: false,
  };

  const validationSchema = Yup.object().shape({
    type: Yup.object().required('required').nullable(), // Allows null or any value
    genset_id: Yup.string().required('Genset ID is required'),
    registration_number: Yup.string().required(
      'Registration Number is required',
    ),
    serial_number: Yup.string().required('Serial Number is required'),
    customer: Yup.mixed().nullable(), // Allows null or any value
    subscription: Yup.mixed().nullable(), // Allows null or any value
    iot_ready: Yup.boolean(),
  });

  const form = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const handleSuccess = () => {
    form.reset(defaultValues);
    setGenState({
      ...genState,
      status: false,
      data: null,
    });
    toast({
      variant: 'success',

      description: 'Record saved successfully',
    });
  };

  const {
    mutate: addGenset,
    isLoading: addingGenset,
    isError: isAddError,
    error: addError,
  } = useAddGenset(handleSuccess);
  const {
    mutate: editGenset,
    isLoading: editingGenset,
    isError: isEditError,
    error: editError,
  } = useEditGenset(handleSuccess);

  const closeModal = () => {
    setGenState({
      ...genState,
      status: false,
      data: null,
    });
  };

  const { data: gensetData, isLoading: fetchingGenset } = useFetchGenset({
    variables: {
      id: genState?.data?.id,
    },
    onSuccessCallback: (data: any) => {
      console.log('gensetCustt', data);
      form.reset({
        genset_id: data?.genset_id,
        registration_number: data?.registration_number,
        serial_number: data?.serial_number,
        customer: data?.customer,
        type: data?.type,
        subscription: data?.subscription,
        iot_ready: data?.iot_ready,
      });
    },
  });

  const { data: customerListData } = useFetchCustomerList();
  const { data: gensetTypeListData } = useFetchGensetTypeList();

  const { data: subscriptionListData } = useFetchSubscriptionList();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const onSubmit = (values: any) => {
    const payload = {
      ...values,
      uid: genState?.data?.id,
      customer: values?.customer?.id ?? null,
      subscription: values?.subscription?.id ?? null,
      type: values?.type?.id ?? null,
    };
    gensetData
      ? editGenset(payload as any)
      : addGenset({
          ...values,
          customer: values?.customer?.id ?? null,
          subscription: values?.subscription?.id ?? null,
          type: values?.type?.id ?? null,
        });
  };

  return (
    <Modal
      open={genState.status}
      onClose={() => {}}
      title={gensetData ? 'Edit Genset' : 'New Genset'}
    >
      {fetchingGenset ? (
        <Spinner />
      ) : (
        <>
          {(isEditError || isAddError) && (
            <AlertDestructive error={editError || addError} />
          )}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="genset_id"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <FormItem>
                        <FormLabel>Genset ID</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        <FormMessage>{errors.genset_id?.message}</FormMessage>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={control}
                  name="serial_number"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <FormItem>
                        <FormLabel>Serial Number</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        <FormMessage>
                          {errors.serial_number?.message}
                        </FormMessage>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="registration_number"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        <FormMessage>
                          {errors.registration_number?.message}
                        </FormMessage>
                      </FormItem>
                    );
                  }}
                />
                <div className="space-y-2">
                  <FormLabel>Customer</FormLabel>
                  <Controller
                    name="customer"
                    control={control}
                    render={({
                      field: { onChange, value },
                      formState: { errors },
                    }) => {
                      return (
                        <>
                          <ReactSelect
                            options={customerListData?.results ?? []}
                            value={value}
                            onChange={(val) => {
                              onChange(val);
                            }}
                            getOptionLabel={(option: any) => option.company} // Use 'type' as label
                            getOptionValue={(option: any) => option.id} // Use 'value' as value
                          />
                          <FormMessage>{errors.customer?.message}</FormMessage>
                        </>
                      );
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel>Type</FormLabel>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <>
                          <ReactSelect
                            options={gensetTypeListData?.results ?? []}
                            value={value}
                            onChange={(val) => onChange(val)}
                            getOptionLabel={(option: any) => option.name} // Use 'type' as label
                            getOptionValue={(option: any) => option.id} // Use 'value' as value
                          />
                          <FormMessage>{errors.type?.message}</FormMessage>
                        </>
                      );
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <FormLabel>Subscription</FormLabel>
                  <Controller
                    name="subscription"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <ReactSelect
                          options={subscriptionListData?.results ?? []}
                          value={value}
                          onChange={(val) => onChange(val)}
                          getOptionLabel={(option: any) => option.name} // Use 'type' as label
                          getOptionValue={(option: any) => option.id} // Use 'value' as value
                        />
                      );
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <FormLabel>Iot Ready</FormLabel>
                  <Controller
                    name="iot_ready"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <div>
                          <Switch
                            checked={value}
                            onClick={() => onChange(!value)}
                          />
                        </div>
                      );
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant={'outline'} onClick={closeModal}>
                  Cancel
                </Button>

                <LoadingButton
                  loading={addingGenset || editingGenset}
                  type="submit"
                  variant="default"
                >
                  Submit
                </LoadingButton>
              </div>
            </form>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default GensetModal;
