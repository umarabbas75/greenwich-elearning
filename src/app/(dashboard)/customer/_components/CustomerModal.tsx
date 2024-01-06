import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CountryData } from 'react-phone-input-2';
import * as Yup from 'yup';

import AddressSearchField from '@/components/common/AddressSearchField';
import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import Modal from '@/components/common/Modal';
import PhoneInput2 from '@/components/common/PhoneInput2';
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
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import {
  useAddCustomer,
  useCheckCustomerId,
  useEditCustomer,
  useFetchCustomer,
} from '@/lib/dashboard/client/customer';
import { customerModalAtom } from '@/store/modals';

const validationSchema = Yup.object().shape({
  customer_id: Yup.number()
    .positive('Customer id must be a positive number')
    .required('Customer id is required'),
  company: Yup.string().required('Company is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('email is required'),
  phone: Yup.string().required('phone is required'),
});

const CustomerModal = () => {
  const oldCustomerIdRef = useRef(null);
  const [customerState, setCustomerState] = useAtom(customerModalAtom);
  const [isManualAddress, setIsManualAddress] = useState(false);
  const [customerIdExist, setCustomerIdExist] = useState(false);
  const { toast } = useToast();

  const handleSuccess = () => {
    closeModal();
    toast({
      variant: 'success',
      description: 'Data added successfully',
    });
  };

  const {
    mutate: addCustomer,
    isLoading: addingCustomer,
    isError: isAddError,
    error: addError,
  } = useAddCustomer(handleSuccess);

  const { mutate: checkCustomerId, isLoading: checkingCustomerId } =
    useCheckCustomerId((data: any) => {
      if (
        data.data &&
        Number(oldCustomerIdRef.current) !== Number(getValues()?.customer_id)
      ) {
        setCustomerIdExist(true);
        toast({
          variant: 'destructive',
          description: 'Customer ID already exists',
        });
      } else {
        setCustomerIdExist(false);
      }
    });

  const {
    mutate: editCustomer,
    isLoading: editingCustomer,
    isError: isEditError,
    error: editError,
  } = useEditCustomer(handleSuccess);

  const closeModal = () => {
    oldCustomerIdRef.current = null;
    setCustomerState({
      ...customerState,
      status: false,
      data: null,
    });
  };

  const defaultValues = {
    customer_id: null,
    company: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: {},
    custom_address: '',
  };

  useEffect(() => {
    customerState?.data?.custom_address
      ? setIsManualAddress(true)
      : setIsManualAddress(false);
    oldCustomerIdRef.current = customerState?.data?.customer_id;
    form.reset(customerState?.data);
  }, [customerState?.data]);

  const form = useForm<TypesCustomerFormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema) as any,
  });

  const { data, isLoading: fetchingCustomer } = useFetchCustomer({
    variables: {
      id: customerState?.data?.id,
    },
    onSuccessCallback: (data: any) => {
      data?.custom_address
        ? setIsManualAddress(true)
        : setIsManualAddress(false);
      form.reset(data);
    },
  });

  const { handleSubmit, control, getValues } = form;

  const onCustomerBlur = async (e: any) => {
    const value = e.target.value;
    if (value) {
      checkCustomerId({ customer_id: value });
    }
  };

  const onSubmit = async (values: TypesCustomerFormValues) => {
    if (customerIdExist) {
      toast({
        variant: 'destructive',
        description: 'Customer ID already exists',
      });
      return;
    }
    const payload = {
      ...values,
      custom_address: isManualAddress ? values.custom_address : null,
      location: isManualAddress ? null : values.location,
      uid: customerState?.data?.id,
    };
    data ? editCustomer(payload as any) : addCustomer({ ...values });
  };

  const getMsg = (errors: any) => {
    return errors?.customer_id?.message;
  };

  return (
    <Modal
      open={customerState.status}
      title={'New Customer'}
      className="w-full md:w-[300px] "
    >
      {fetchingCustomer ? (
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
                  name="customer_id"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <FormItem>
                        <FormLabel>Customer ID</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            onChange={onChange}
                            onBlur={onCustomerBlur}
                            value={value}
                          />
                        </FormControl>

                        <FormMessage>{getMsg(errors)}</FormMessage>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={control}
                  name="company"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        <FormMessage>{errors.company?.message}</FormMessage>
                      </FormItem>
                    );
                  }}
                />{' '}
                <FormField
                  control={control}
                  name="first_name"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        <FormMessage>{errors.first_name?.message}</FormMessage>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={control}
                  name="last_name"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        <FormMessage>{errors.last_name?.message}</FormMessage>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={control}
                  name="email"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        <FormMessage>{errors.email?.message}</FormMessage>
                      </FormItem>
                    );
                  }}
                />
                <div className="col-span-1">
                  <FormField
                    control={control}
                    name="phone"
                    render={({
                      field: { onChange, value },
                      formState: { errors },
                    }) => {
                      return (
                        <>
                          <div className="space-y-2">
                            <FormLabel>Phone</FormLabel>
                            <PhoneInput2
                              value={value}
                              onChange={(
                                value: string,
                                countryData: CountryData,
                              ) => {
                                let formattedValue = value;
                                const { dialCode } = countryData;

                                if (formattedValue.startsWith(dialCode)) {
                                  const phoneNumberWithoutDialCode =
                                    formattedValue.substring(dialCode.length);

                                  if (
                                    phoneNumberWithoutDialCode.startsWith('0')
                                  ) {
                                    // Remove leading zero
                                    formattedValue =
                                      dialCode +
                                      phoneNumberWithoutDialCode.substring(1);
                                  }
                                }
                                onChange(formattedValue);
                              }}
                              message={errors.phone?.message}
                            />
                          </div>
                        </>
                      );
                    }}
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex items-center space-x-2 my-3 mb-4">
                    <Switch
                      id="manual_address"
                      checked={isManualAddress}
                      onClick={() => setIsManualAddress(!isManualAddress)}
                    />
                    <Label>Manual Address</Label>
                  </div>
                  {isManualAddress ? (
                    <FormField
                      control={control}
                      name="custom_address"
                      render={({
                        field: { onChange, value },
                        formState: { errors },
                      }) => {
                        return (
                          <div className="flex flex-col w-full">
                            <FormLabel className="mb-3">Location</FormLabel>
                            <Input
                              onChange={onChange}
                              value={typeof value === 'string' ? value : ''}
                            />
                            <FormMessage>
                              {errors.custom_address?.message}
                            </FormMessage>
                          </div>
                        );
                      }}
                    />
                  ) : (
                    <FormField
                      control={control}
                      name="location"
                      render={({
                        field: { onChange, value },
                        formState: { errors },
                      }) => {
                        return (
                          <div className="flex flex-col w-full">
                            <FormLabel className="mb-3">Location</FormLabel>
                            <AddressSearchField
                              value={value}
                              onChange={onChange}
                            />
                            <FormMessage>
                              {errors.location?.message}
                            </FormMessage>
                          </div>
                        );
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant={'outline'} onClick={closeModal}>
                  Cancel
                </Button>

                <LoadingButton
                  loading={
                    addingCustomer || editingCustomer || checkingCustomerId
                  }
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

export default CustomerModal;
