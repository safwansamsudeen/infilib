import mongoose from "mongoose";
import { DB_URI } from "$env/static/private";
await mongoose.connect(DB_URI);

console.log("Connected to database", DB_URI)
const { Schema, SchemaTypes, model } = mongoose;
// Create schema for publisher
const publisherSchema = new Schema({
    name: String,
    address: String,
})

const memberSchema = new Schema({
  name: String,
  grade: String,
  section: String,
  admn_no: String,
  gender: String,
});

const bookSchema = new Schema({
  title: String,
  subject: String,
  publication_year: String,
  author: String,
  edition: String,
  isbn: String,
  call_no: Number,
  acc_no: Number,
  reference: Boolean,
  purchase_price: Number,
  purchase_details: String,
  publisher: { type: SchemaTypes.ObjectId, ref: "Publisher", required: true },
  no_of_pages: Number,
  languages: [String],
  remarks: String,
  level: String,
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
export const Publisher = model("Publisher", publisherSchema);
export const Book = model("Book", bookSchema);
export const Transaction = model("Transaction", transactionSchema);
