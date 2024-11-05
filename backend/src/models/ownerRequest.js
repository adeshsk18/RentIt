import mongoose from "mongoose";
const { Schema } = mongoose;

const requestSchema = new Schema({
  requesterId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  status: {
    type: String,
    enum: ["pending", "rejected"],
    default: "pending",
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const terminalStates = ["rejected"];
requestSchema.pre("save", function (next) {
  if (this.isModified("status") && terminalStates.includes(this.status)) {
    this.date = Date.now();
  }
  next();
});

export const OwnerRequestModel = mongoose.model("ORequest", requestSchema);
