import mongoose from 'mongoose'

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiredAt: {
    type: Date,
    required: true,
    // MongoDB tự động xóa document khi đến thời điểm expiredAt (TTL index)
    index: { expires: 0 }
  }
})

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema)

export default TokenBlacklist