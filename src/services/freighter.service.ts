export class FreighterService {
  async checkConnection(): Promise<boolean> {
    return typeof window !== 'undefined' && 'freighter' in window;
  }

  async connect(): Promise<string> {
    try {
      const isAvailable = await this.checkConnection();
      if (!isAvailable) {
        throw new Error('Freighter wallet not installed');
      }
      return 'GXXX...DEMO';
    } catch (error) {
      throw new Error('Failed to connect to Freighter wallet');
    }
  }
}
