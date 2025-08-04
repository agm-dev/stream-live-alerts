import { readFileSync, writeFileSync } from 'node:fs';
import { STORE_FILE, STREAMER_WATCHED_FILE } from "./vars";
import { LiveStreamer, Token } from '../services/Storage';

let liveStreamers: LiveStreamer[] = [];
let token: Token | null = null;

export function loadStoreData() {
  try {
    const jsonContent = readFileSync(STORE_FILE, 'utf-8')
    const data = JSON.parse(jsonContent)
    liveStreamers = data.liveStreamers ?? [];
    token = data.token
  } catch (err) {
    console.log('there is no saved data in the store')
  }
}

export function saveStreamers(streamers: LiveStreamer[]) {
  liveStreamers = [...streamers];

  const data = JSON.stringify({ liveStreamers, token }, null, 2);

  try {
    writeFileSync(STORE_FILE, data, 'utf-8')
  } catch (err) {
    console.log('error on saving data', err)
  }
}

export function saveToken(newToken: Token) {
  token = newToken

  const data = JSON.stringify({ liveStreamers, token }, null, 2);

  try {
    writeFileSync(STORE_FILE, data, 'utf-8')
  } catch (err) {
    console.log('error on saving data', err)
  }
}

export function getWatchedStreamers(): string[] {
  const csvContent = readFileSync(STREAMER_WATCHED_FILE, 'utf-8');

  const lines = csvContent.split('\n')
    .slice(1) // Skip the header line
    .map(line => line.trim())
    .filter(line => line !== '' && !line.startsWith('#'));

  return lines.map(line => line.split(',')[0].trim());
}

export const getToken = () => token?.access_token ?? '';

export const getLiveStreamers = () => liveStreamers
