import localForage from 'localforage'
import { Base64 } from 'js-base64'

class AlbumSet {
  /** @param {string} key Storage key */
  constructor(key) {
    this.key = key
    /** @type {Set<string>} */
    this._set = new Set()
  }

  /** Size in bytes */
  get size() {
    return this._set.size * 17
  }

  async load() {
    this._set.clear()
    /** @type {Uint8Array | null} */
    const byteArray = await localForage.getItem(this.key)
    if (!byteArray) return

    for (let i = 0; i < byteArray.length; i += 17) {
      const bytes = byteArray.slice(i, i + 17)
      const id = Base64.fromUint8Array(bytes).slice(0, -2)
      this._set.add(id)
    }
  }

  persist = async () => {
    const byteArray = new Uint8Array(this.size)
    let i = 0

    for (const id of this._set) {
      const bytes = Base64.toUint8Array(id + 'A=')
      byteArray.set(bytes, i)
      i += 17
    }

    await localForage.setItem(this.key, byteArray)
  }

  clear = async () => {
    this._set.clear()
    await localForage.removeItem(this.key)
  }

  /** @param {string} id */
  has(id) {
    return this._set.has(id)
  }

  /** @param {string} id */
  add(id) {
    this._set.add(id)
  }

  /** @param {AlbumSet} albumSet */
  append(albumSet) {
    for (const id of albumSet._set) this._set.add(id)
  }

  toArray() {
    return Array.from(this._set)
  }
}

export const albumsNew = new AlbumSet('albums:new')
export const albumsHistory = new AlbumSet('albums:history')
