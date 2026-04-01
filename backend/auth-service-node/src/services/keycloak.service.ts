import axios from 'axios';

export class KeycloakService {
  private baseUrl: string;
  private realm: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.baseUrl = process.env.KEYCLOAK_URL || 'http://localhost:8080';
    this.realm = process.env.KEYCLOAK_REALM || 'microservices';
    this.clientId = process.env.KEYCLOAK_CLIENT_ID || 'auth-service';
    this.clientSecret = process.env.KEYCLOAK_CLIENT_SECRET || '';
  }

  async createUser(userData: any) {
    const adminToken = await this.getAdminToken();

    const response = await axios.post(
      `${this.baseUrl}/admin/realms/${this.realm}/users`,
      {
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        enabled: true,
        credentials: [
          {
            type: 'password',
            value: userData.password,
            temporary: false,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const userId = response.headers.location?.split('/').pop();
    return { id: userId };
  }

  async login(username: string, password: string) {
    const response = await axios.post(
      `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: 'password',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        username,
        password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
    };
  }

  async refreshToken(refreshToken: string) {
    const response = await axios.post(
      `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
    };
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await axios.post(
        `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token/introspect`,
        new URLSearchParams({
          token,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return true;
    } catch {
      return false;
    }
  }

  private async getAdminToken(): Promise<string> {
    const response = await axios.post(
      `${this.baseUrl}/realms/master/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  }
}
