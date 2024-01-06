import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { useFieldArray, useForm } from 'react-hook-form';
import { CountryData } from 'react-phone-input-2';
import soft from 'timezone-soft';
import * as Yup from 'yup';

import AddressSearchField from '@/components/common/AddressSearchField';
import { AlertDestructive } from '@/components/common/FormError';
import LoadingButton from '@/components/common/LoadingButton';
import Modal from '@/components/common/Modal';
import PhoneInput2 from '@/components/common/PhoneInput2';
import ReactSelect from '@/components/common/ReactSelect';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';

import {
  useAddServiceDealer,
  useEditServiceDealer,
  useFetchServiceDealer,
} from '@/lib/dashboard/client/seriveDealer';
import { serviceDealerModalAtom } from '@/store/modals';
const ServiceDealerModal = () => {
  const [serviceDealerState, setServiceDealerState] = useAtom(
    serviceDealerModalAtom,
  );
  const { toast } = useToast();

  console.log('soft', soft('Europe'));

  const defaultValues = {
    station_name: '',
    phone: '',
    location: {},

    opening_hours: [
      {
        label: 'Monday',
        available: false,
        start_time: '',
        end_time: '',
      },
      {
        label: 'Tuesday',
        available: false,
        start_time: '',
        end_time: '',
      },
      {
        label: 'Wednesday',
        available: false,
        start_time: '',
        end_time: '',
      },
      {
        label: 'Thursday',
        available: false,
        start_time: '',
        end_time: '',
      },
      {
        label: 'Friday',
        available: false,
        start_time: '',
        end_time: '',
      },
      {
        label: 'Saturday',
        available: false,
        start_time: '',
        end_time: '',
      },
      {
        label: 'Sunday',
        available: false,
        start_time: '',
        end_time: '',
      },
    ],
  };

  const validationSchema = Yup.object().shape({
    station_name: Yup.string().required('Station name is required'),
    phone: Yup.string().required('Phone is required'),
    location: Yup.object().required('Location is required'),
    timezone: Yup.object({
      iana: Yup.string().required('Timezone is required'),
    }).required('Timezone is required'),
    opening_hours: Yup.array().optional(),
  });

  const form = useForm<Yup.InferType<typeof validationSchema>>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'opening_hours' as any,
  });
  interface ControlledField {
    id: string; // Replace with the actual type of id
    label: string;
    available: boolean;
    timezone: any;
    start_time: string;
    end_time: string;
  }
  const watchFieldArray = form.watch('opening_hours');
  const controlledFields: ControlledField[] = fields.map((field, index) => {
    const watchField = watchFieldArray?.[index]; // Use optional chaining

    if (watchField) {
      return {
        ...field,
        ...watchField,
      };
    }

    return field; // If watchField is undefined, return field as is
  });

  console.log({ controlledFields });

  const {
    mutate: addSeriveDealer,
    isLoading: addingSeriveDealer,
    isError: isAddError,
    error: addError,
  } = useAddServiceDealer(() => {
    form.reset(defaultValues);
    closeModal();
    toast({
      variant: 'success',
      description: 'Record Addedd successfully',
    });
  });
  const {
    mutate: editGensetType,
    isLoading: editingSericeDealer,
    isError: isEditError,
    error: editError,
  } = useEditServiceDealer(() => {
    form.reset(defaultValues);
    closeModal();
    toast({
      variant: 'success',
      description: 'Record Edit successfully',
    });
  });

  const closeModal = () => {
    setServiceDealerState({
      ...serviceDealerState,
      status: false,
      data: null,
    });
  };

  const { data, isLoading: fetchingServiceDealer } = useFetchServiceDealer({
    variables: {
      id: serviceDealerState?.data?.id,
    },
    onSuccessCallback: (data: any) => {
      form.reset({
        ...data,
        timezone: {
          iana: data?.timezone,
        },
      });
    },
  });

  const { handleSubmit, control } = form;

  const onSubmit = (values: Yup.InferType<typeof validationSchema>) => {
    const payload = {
      ...values,
      timezone: values.timezone?.iana,
      uid: serviceDealerState?.data?.id,
    };
    data ? editGensetType(payload as any) : addSeriveDealer({ ...values });
  };
  return (
    <Modal
      open={serviceDealerState.status}
      onClose={() => closeModal()}
      title={'New Service Dealer'}
    >
      {fetchingServiceDealer ? (
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
                  name="station_name"
                  render={({
                    field: { onChange, value },
                    formState: { errors },
                  }) => {
                    return (
                      <FormItem>
                        <FormLabel>Station name</FormLabel>
                        <FormControl>
                          <Input onChange={onChange} value={value} />
                        </FormControl>

                        <FormMessage>
                          {errors.station_name?.message}
                        </FormMessage>
                      </FormItem>
                    );
                  }}
                />
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

              <FormField
                control={control}
                name="timezone"
                render={({
                  field: { onChange, value },
                  formState: { errors },
                }) => {
                  return (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <FormControl>
                        <ReactSelect
                          options={soft('Europe') ?? []}
                          value={value}
                          onChange={(val) => {
                            onChange(val);
                          }}
                          getOptionLabel={(option: any) => option.iana}
                        />
                      </FormControl>

                      <FormMessage>{errors.timezone?.message}</FormMessage>
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={control}
                name="location"
                render={({
                  field: { onChange, value },
                  formState: { errors },
                }) => {
                  return (
                    <div className="flex flex-col ">
                      <FormLabel className="mb-3">Address</FormLabel>
                      <AddressSearchField value={value} onChange={onChange} />
                      <FormMessage>{errors.location?.message}</FormMessage>
                    </div>
                  );
                }}
              />
              <div>
                <FormLabel className="mb-4">Opening Hours</FormLabel>
                <div className="flex flex-col gap-4 mt-4">
                  {controlledFields.map((day, index) => {
                    return (
                      <div
                        key={day.id}
                        className="grid grid-cols-3 gap-3 items-center"
                      >
                        <div className="flex items-center gap-3 ">
                          <FormField
                            control={form.control}
                            name={`opening_hours[${index}].available` as any}
                            render={({ field: { value, onChange } }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={value}
                                    onCheckedChange={(value) => {
                                      onChange(value);
                                      if (value === false) {
                                        form.setValue(
                                          `opening_hours[${index}].start_time` as any,
                                          '',
                                        );
                                        form.setValue(
                                          `opening_hours[${index}].end_time` as any,
                                          '',
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <span>{day.label}</span>
                        </div>

                        <FormField
                          control={form.control}
                          name={`opening_hours[${index}].start_time` as any}
                          render={({ field: { value, onChange } }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <input
                                  type="time"
                                  className="border px-3 py-1 rounded"
                                  value={value}
                                  onChange={onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`opening_hours[${index}].end_time` as any}
                          render={({ field: { value, onChange } }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <input
                                  type="time"
                                  className="border px-3 py-1 rounded"
                                  value={value}
                                  onChange={onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* <button type="button" onClick={() => remove(index)}>
                      Remove Day
                    </button> */}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant={'outline'} onClick={closeModal}>
                  Cancel
                </Button>

                <LoadingButton
                  loading={addingSeriveDealer || editingSericeDealer}
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

export default ServiceDealerModal;
