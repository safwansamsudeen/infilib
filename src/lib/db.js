import mongoose from "mongoose";
import { DB_URI } from "$env/static/private";
await mongoose.connect(DB_URI);

console.log("Connected to database", DB_URI);
const { Schema, SchemaTypes, model } = mongoose;

const memberSchema = new Schema({
  _id: Number,
  name: String,
  grade: String,
  section: String,
  gender: String,
});

const bookSchema = new Schema({
  _id: Number,
  title: String,
  subtitle: String,
  authors: [String],
  subjects: [String],
  level: String,
  publication_year: String,
  edition: String,
  isbn: String,
  call_no: Number,
  no_of_pages: Number,
  purchase_price: Number,
  purchase_details: String,
  publisher_name: String,
  publisher_address: String,
  languages: [String],
  remarks: String,
  reference: Boolean,
  cd_available: Boolean,
});

const transactionSchema = new Schema({
  book: { type: SchemaTypes.Number, ref: "Book", required: true },
  member: { type: SchemaTypes.Number, ref: "Member", required: true },
  borrowed: Date,
  due_on: Date,
  returned: Date,
  comments: String,
});

export const Member = model("Member", memberSchema);
export const Book = model("Book", bookSchema);
export const Transaction = model("Transaction", transactionSchema);
