import { readFileSync, write, writeFileSync } from 'node:fs';
import { STORE_FILE, STREAMER_WATCHED_CSV_HEADER, STREAMER_WATCHED_FILE } from "./vars";
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

function getOneColumnCsvLines(filePath: string): string[] {
  const csvContent = readFileSync(filePath, 'utf-8');
  const lines = csvContent.split('\n')
    .slice(1) // Skip the header line
    .map(line => line.trim())
    .filter(line => !!line.length);

  return lines.map(line => (line.split(',')[0] || '').trim());
}

export function getWatchedStreamers(): string[] {
  const lines = getOneColumnCsvLines(STREAMER_WATCHED_FILE);
  return lines.filter(line => line !== '' && !line.startsWith('#'));
}

export const getToken = () => token?.access_token ?? '';

export const getLiveStreamers = () => liveStreamers

export function addWatchedStreamer(channel: string) {
  const formerLines = getOneColumnCsvLines(STREAMER_WATCHED_FILE);

  const alreadyExists = formerLines.some(line => line.toLowerCase() === channel.toLowerCase());

  if (alreadyExists) {
    return;
  }

  const newLines = [...formerLines, channel];

  const csvContent = [STREAMER_WATCHED_CSV_HEADER, ...newLines].join('\n');

  writeFileSync(STREAMER_WATCHED_FILE, csvContent, 'utf-8');
}

export function removeWatchedStreamer(channel: string) {
  const formerLines = getOneColumnCsvLines(STREAMER_WATCHED_FILE);

  const newLines = formerLines.filter(line => line.toLowerCase() !== channel.trim().toLowerCase());

  const csvContent = [STREAMER_WATCHED_CSV_HEADER, ...newLines].join('\n');

  writeFileSync(STREAMER_WATCHED_FILE, csvContent, 'utf-8');

  const updatedStreamers = liveStreamers.filter(data => data.user_name !== channel);
  saveStreamers(updatedStreamers);
}
