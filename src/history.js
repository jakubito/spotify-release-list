import localForage from 'localforage'
import { Base64 } from 'js-base64'

const storageKey = 'albums-history'

export async function load() {
  /** @type {AlbumsHistory} */
  const history = new Set()
  /** @type {Uint8Array | null} */
  const byteArray = await localForage.getItem(storageKey)
  if (!byteArray) return history

  for (let i = 0; i < byteArray.length; i += 17) {
    const bytes = byteArray.slice(i, i + 17)
    const id = Base64.fromUint8Array(bytes).slice(0, -2)
    history.add(id)
  }

  return history
}

/** @param {AlbumsHistory} history */
export function persist(history) {
  const byteArray = new Uint8Array(history.size * 17)
  let i = 0

  for (const id of history) {
    const bytes = Base64.toUint8Array(id + 'A=')
    byteArray.set(bytes, i)
    i += 17
  }

  return localForage.setItem(storageKey, byteArray)
}

export function clear() {
  return localForage.removeItem(storageKey)
}

export async function size() {
  /** @type {Uint8Array | null} */
  const byteArray = await localForage.getItem(storageKey)
  return byteArray?.length ?? 0
}
