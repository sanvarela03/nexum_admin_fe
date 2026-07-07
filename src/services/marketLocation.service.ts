import { MarketLocation, MarketLocationList } from '@app-types/market_location';
import api from '../api/axios';

class MarketLocationService {
  async addMarketLocation(marketLocations: MarketLocation[]) {
    return await api.post('market-locations', marketLocations);
  }

  async getMarketLocations(): Promise<MarketLocationList> {
    const marketLocations = await api.get('market-locations/with-geometry');
    return marketLocations.data;
  }
}

export default new MarketLocationService();
