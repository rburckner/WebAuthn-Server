"use strict";
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const methods = require("./methods");
const pre = require("./pre");
const statics = require("./statics");
const virtuals = require("./virtuals");

const SCHEMA_OPTIONS = {
  timestamps: true,
  statics,
};

const schema = new Schema(
  {
    webauthn: {
      challenges: [
        {
          challenge: { type: String },
          createdAt: { type: Date, default: Date.now() },
        },
      ],
      credentials: [
        {
          id: { type: String },
          publicKey: { type: String },
          publicKeyAlgorithm: { type: Number },
          signCount: { type: Number },
          transports: [String],
          type: { type: String },
          createdAt: { type: Date, default: Date.now() },
        },
      ],
    },
  },
  SCHEMA_OPTIONS
);

schema.methods = methods;
pre(schema);
virtuals(schema);

module.exports = mongoose.model("Identity", schema);
