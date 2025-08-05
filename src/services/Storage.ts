export interface LiveStreamer {
  user_name: string;
  title: string;
  started_at: string;
}

export interface Token {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface StorageData {
  liveStreamers: LiveStreamer[];
  token: Token;
}

