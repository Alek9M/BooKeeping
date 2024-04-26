import withObservables from '@nozbe/with-observables';
import ServicePriceModel from '../../../../data/servicePriceModel';

const enhanceWithService = withObservables(
  ['price'],
  ({price}: {price: ServicePriceModel}) => ({
    price: price,
    sale: price,
  }),
);

export default enhanceWithService(ServiceDetail);
