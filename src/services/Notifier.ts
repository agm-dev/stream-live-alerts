import { getLiveStreamers, saveStreamers } from "../config/store"
import { LiveStreamer } from "./Storage"
import { sendTelegramMessage } from "./Telegram"

function formatStreamData(data: LiveStreamer): LiveStreamer {
  return {
    user_name: data.user_name.replace(/ /img, '').toLowerCase(),
    title: data.title,
    started_at: data.started_at,
    subscribers: [...data.subscribers],
  }
}

type Hours = number
type Minutes = number

function calculateHours(stringDate: string): [Hours, Minutes] {
  const startedAt = new Date(stringDate).getTime()
  const now = new Date().getTime()
  const diff = now - startedAt
  const diffInHours = diff / (1000 * 60 * 60)
  const hours = Math.floor(diffInHours)
  const decimal = diffInHours - Math.floor(diffInHours)
  const minutes = Math.floor(decimal * 60)
  return [hours, minutes]
}

export function processStreams(streams: LiveStreamer[]): LiveStreamer[] {
  const formatted = streams.map(formatStreamData)

  const streamingNow = formatted.filter(stream => {
    const isOnSavedOnes = getLiveStreamers().some(i => i.user_name === stream.user_name)
    return !isOnSavedOnes
  })

  notify(streamingNow, true)

  const endedStream = getLiveStreamers().filter(stream => {
    const isOnCurrent = formatted.some(i => i.user_name === stream.user_name)
    return !isOnCurrent
  })

  notify(endedStream, false)

  saveStreamers(formatted);

  return formatted;
}

export function notify(streams: LiveStreamer[], starting: boolean) {
  streams.forEach(stream => {
    const { user_name, title, started_at, subscribers } = stream
    const [ hours, minutes ] = calculateHours(started_at)
    const text = starting ?
      `${user_name} is on streaming now!\n\n${title}\n\nhttps://twitch.tv/${user_name}` :
      `${user_name} streaming has finished.\n\n${user_name} has been streaming during ${hours}h${minutes}min`

      subscribers.forEach(user_id => {
        const options = { disable_notification: !starting };
        sendTelegramMessage(text, user_id, options)
          .then(response => console.log('send notification response: ', response))
          .catch(err => console.log('error on sending notification: ', err))
      });
  })
}
