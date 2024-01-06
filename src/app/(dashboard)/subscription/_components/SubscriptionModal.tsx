import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import LoadingButton from '@/components/common/LoadingButton';
import Modal from '@/components/common/Modal';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';
import {
  useAddSubscription,
  useEditSubscription,
  useFetchFeatures,
  useFetchSubscription,
} from '@/lib/dashboard/client/subscription';
import { subscriptionModalAtom } from '@/store/modals';

import FeatureFormItem from './FeatureFormItem';

const SubscriptionModal = () => {
  const [subscriptionState, setSubscriptionState] = useAtom(
    subscriptionModalAtom,
  );
  const { toast } = useToast();

  const handleSuccess = () => {
    closeModal();
    toast({
      variant: 'success',
      title: 'Success ',
      description: 'operation successful!',
    });
  };
  const handleError = (data: any) => {
    toast({
      variant: 'destructive',
      title: 'Error ',
      description: data?.response?.data?.type?.[0] ?? 'Some error occured',
    });
  };
  const { mutate: addSubscription, isLoading: addingSubscription } =
    useAddSubscription(handleSuccess, handleError);
  const { mutate: editSubscription, isLoading: editingSubscription } =
    useEditSubscription(handleSuccess, handleError);

  const closeModal = () => {
    setSubscriptionState({
      ...subscriptionState,
      status: false,
      data: null,
    });
  };

  const defaultValues = {
    name: '',
    price: '',
    feature_list: [],
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('name is required'),
    price: Yup.string().required('price is required'),
    feature_list: Yup.array().required('price is required'),
  });

  const form = useForm<SubscriptionFormTypes>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { data, isLoading: fetchingSubscription } = useFetchSubscription({
    variables: {
      id: subscriptionState?.data?.id,
    },
    onSuccessCallback: (data: any) => {
      console.log({ data });

      form.reset({
        ...data,
        feature_list: data?.feature_list?.map((item: any) => item.feature),
      });
    },
  });
  const { data: featuresList, isLoading: fetchingSubscriptionFeatures } =
    useFetchFeatures();
  console.log({ featuresList });
  const { handleSubmit, control } = form;

  console.log('form.getValues', form.getValues());

  const onSubmit = (values: SubscriptionFormTypes) => {
    const feature_list = values.feature_list.map((item) => {
      return {
        id: item,
      };
    });
    const payload = {
      ...values,
      uid: subscriptionState?.data?.id,
      feature_list,
    };
    data
      ? editSubscription(payload as any)
      : addSubscription({ ...values, feature_list });
  };

  return (
    <Modal
      open={subscriptionState.status}
      onClose={() => {}}
      title={'New Subscription'}
    >
      {fetchingSubscription ? (
        <Spinner />
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="name"
                render={({
                  field: { onChange, value },
                  formState: { errors },
                }) => {
                  return (
                    <FormItem>
                      <FormLabel>Package Name</FormLabel>
                      <FormControl>
                        <Input onChange={onChange} value={value} />
                      </FormControl>

                      <FormMessage>{errors.name?.message}</FormMessage>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={control}
                name="price"
                render={({
                  field: { onChange, value },
                  formState: { errors },
                }) => {
                  return (
                    <FormItem>
                      <FormLabel>Package price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          onChange={onChange}
                          value={value}
                          startIcon={'€'}
                        />
                      </FormControl>

                      <FormMessage>{errors.price?.message}</FormMessage>
                    </FormItem>
                  );
                }}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="feature_list"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Features</FormLabel>
                      <FormDescription>
                        please select the features assigned to this
                        subscription.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {!fetchingSubscriptionFeatures &&
                        featuresList.results.map((item: feature) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="feature_list"
                            render={({ field }) => {
                              return (
                                <FeatureFormItem
                                  item={item}
                                  field={field}
                                  edit={true}
                                />
                              );
                            }}
                          />
                        ))}
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant={'outline'} onClick={closeModal}>
                Cancel
              </Button>

              <LoadingButton
                loading={addingSubscription || editingSubscription}
                type="submit"
                variant="default"
              >
                Submit
              </LoadingButton>
            </div>
          </form>
        </Form>
      )}
    </Modal>
  );
};

export default SubscriptionModal;
