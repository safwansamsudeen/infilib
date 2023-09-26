-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "email_address" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "details" TEXT,
    "is_admin" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Publisher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT
);

-- CreateTable
CREATE TABLE "Language" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Cd" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Periodical" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Book" (
    "acc_no" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subtitle" TEXT,
    "publication_year" INTEGER NOT NULL,
    "edition" TEXT,
    "isbn" TEXT NOT NULL,
    CONSTRAINT "Book_acc_no_fkey" FOREIGN KEY ("acc_no") REFERENCES "Item" ("acc_no") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Magazine" (
    "acc_no" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sc_no" INTEGER NOT NULL,
    "volume" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "from" DATETIME NOT NULL,
    "to" DATETIME NOT NULL,
    CONSTRAINT "Magazine_acc_no_fkey" FOREIGN KEY ("acc_no") REFERENCES "Item" ("acc_no") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "acc_no" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "publisher_id" INTEGER NOT NULL,
    "reference" BOOLEAN NOT NULL,
    "call_no" TEXT NOT NULL,
    "no_of_pages" INTEGER NOT NULL,
    "purchase_price" INTEGER NOT NULL,
    "purchase_details" TEXT,
    "level" TEXT,
    "remarks" TEXT,
    "cdId" INTEGER,
    CONSTRAINT "Item_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publisher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Item_cdId_fkey" FOREIGN KEY ("cdId") REFERENCES "Cd" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "issued_at" DATETIME NOT NULL,
    "due_at" DATETIME NOT NULL,
    "returned_at" DATETIME,
    "comments" TEXT,
    CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("acc_no") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "acc_no" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "borrow_time" DATETIME NOT NULL,
    CONSTRAINT "Mark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Mark_acc_no_fkey" FOREIGN KEY ("acc_no") REFERENCES "Item" ("acc_no") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AuthorToBook" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AuthorToBook_A_fkey" FOREIGN KEY ("A") REFERENCES "Author" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AuthorToBook_B_fkey" FOREIGN KEY ("B") REFERENCES "Book" ("acc_no") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CategoryToItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CategoryToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item" ("acc_no") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ItemToLanguage" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ItemToLanguage_A_fkey" FOREIGN KEY ("A") REFERENCES "Item" ("acc_no") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ItemToLanguage_B_fkey" FOREIGN KEY ("B") REFERENCES "Language" ("code") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Mark_acc_no_key" ON "Mark"("acc_no");

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorToBook_AB_unique" ON "_AuthorToBook"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorToBook_B_index" ON "_AuthorToBook"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToItem_AB_unique" ON "_CategoryToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToItem_B_index" ON "_CategoryToItem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToLanguage_AB_unique" ON "_ItemToLanguage"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToLanguage_B_index" ON "_ItemToLanguage"("B");
