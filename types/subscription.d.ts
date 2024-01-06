type SubscriptionType = {
  name: string;
  status: SubscriptionStatus;
  price: string;
  total_assigned: number;
  feature_list: formObj[];
};
type SubscriptionStatus = 'Active' | 'Inactive';
type SubscriptionData = {
  count: number;
  next: null;
  previous: null;
  results: SubscriptionType[];
};

type formObj = {
  feature: number;
};

type SubscriptionFormTypes = {
  name: string;
  price: string;
  feature_list: number[];
};
type feature = {
  description: string;
  id: number;
  name: string;
  logo: string;
};
