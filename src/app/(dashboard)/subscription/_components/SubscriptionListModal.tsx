import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Modal from '@/components/common/Modal';

//import { useAddCategory } from '@/lib/dashboard/client/useGensetsData';

import { Form, FormField } from '@/components/ui/form';
import { useFetchFeatures } from '@/lib/dashboard/client/subscription';
import { subscriptionListModalAtom } from '@/store/modals';

import FeatureFormItem from './FeatureFormItem';

type FormProps = {
  feature_list: string[];
};

const SubscriptionListModal = () => {
  const [subscriptionListState, setSubscriptionListState] = useAtom(
    subscriptionListModalAtom,
  );

  const { data: featuresList, isLoading: fetchingSubscriptionFeatures } =
    useFetchFeatures();

  const closeModal = () => {
    setSubscriptionListState({
      ...subscriptionListState,
      status: false,
      data: null,
    });
  };
  const form = useForm<FormProps>({
    defaultValues: {
      feature_list: [],
    },
  });

  useEffect(() => {
    if (subscriptionListState.data) {
      form.reset({
        feature_list: subscriptionListState.data.map(
          (item: any) => item?.feature,
        ),
      });
    }
  }, [subscriptionListState]);

  return (
    <Modal
      open={subscriptionListState.status}
      onClose={() => closeModal()}
      title={'View Subscription List'}
      width="min-w-[60rem]"
    >
      <Form {...form}>
        <div className="grid grid-cols-3 gap-3 items-center">
          {!fetchingSubscriptionFeatures &&
            featuresList.results?.map((item: feature) => {
              return (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="feature_list"
                  render={({ field }) => {
                    return (
                      <FeatureFormItem item={item} field={field} edit={false} />
                    );
                  }}
                />
              );
            })}
        </div>
      </Form>
    </Modal>
  );
};

export default SubscriptionListModal;
