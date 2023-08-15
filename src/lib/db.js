import mongoose from "mongoose";
import { DB_URI } from "$env/static/private";
await mongoose.connect(DB_URI);
const { Schema, SchemaTypes, model } = mongoose;

const memberSchema = new Schema({
  name: String,
  roll_no: Number,
  class: String,
});

const bookSchema = new Schema({
  title: String,
  author: String,
  isbn: String,
  publisher: String,
  num_pages: Number,
});

const transactionSchema = new Schema({
  book: { type: SchemaTypes.ObjectId, ref: "Book", required: true },
  member: { type: SchemaTypes.ObjectId, ref: "Member", required: true },
  borrowed: Date,
  due_on: Date,
  returned: Date,
  comments: String,
});

export const Member = model("Member", memberSchema);
export const Book = model("Book", bookSchema);
export const Transaction = model("Transaction", transactionSchema);
