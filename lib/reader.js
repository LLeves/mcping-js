class MinecraftBufferReader {
  constructor (buffer) {
    this._buffer = buffer
    this._offset = 0
  }

  readVarInt () {
    let val = 0
    let count = 0

    // yes, this can crash readUInt8.
    try {
      while (true) {
        const b = this._buffer.readUInt8(this._offset++)
        
        val |= (b & 0x7F) << count++ * 7;
        
        if ((b & 0x80) != 128) {
          break
        }
      }
    } catch (error) {
      console.log("readVarInt()", error);
      return undefined;
    }

    return val
  }

  readString () {
    const length = this.readVarInt()
    if(length === undefined)
    {
      return undefined
    }
    const val = this._buffer.toString('UTF-8', this._offset, this._offset + length)

    // Advance the reader index forward by the string length
    this._offset += length

    return val
  }

  offset () {
    return this._offset
  }
}

module.exports = MinecraftBufferReader