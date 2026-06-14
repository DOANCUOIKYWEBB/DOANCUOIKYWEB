import mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Nội dung banner là bắt buộc'],
      trim: true,
      maxlength: [300, 'Nội dung không được vượt quá 300 ký tự']
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'danger'],
      default: 'info'
    },
    active: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Banner = mongoose.model('Banner', bannerSchema)

export default Banner