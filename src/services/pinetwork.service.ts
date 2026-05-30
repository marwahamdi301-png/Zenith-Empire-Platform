import { ENV } from '../config/env';

export class PiNetworkService {
  private subdomain = 'bayota3839';

  async authenticateUser(authToken: string) {
    try {
      console.log('Pi Network auth:', this.subdomain);
      return null;
    } catch (error) {
      return null;
    }
  }
}
