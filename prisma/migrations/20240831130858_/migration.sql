-- CreateTable
CREATE TABLE "Library" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "administrator_id" INTEGER NOT NULL,
    "settings_id" INTEGER NOT NULL,

    CONSTRAINT "Library_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "item_shortcuts" TEXT[],

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "no_of_days" INTEGER NOT NULL,
    "no_of_books" INTEGER NOT NULL,
    "deposit" INTEGER,
    "annual_price" INTEGER,
    "half_yearly_price" INTEGER,
    "library_slug" TEXT NOT NULL,

    CONSTRAINT "SubscriptionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" SERIAL NOT NULL,
    "type_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "details" TEXT,
    "purchased_on" TIMESTAMP(3) NOT NULL,
    "valid_till" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "passage_id" TEXT,
    "name" TEXT NOT NULL,
    "email_address" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "about" TEXT,
    "phone_number" TEXT,
    "date_of_birth" DATE,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "library_slug" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "library_slug" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publisher" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "library_slug" TEXT NOT NULL,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" INTEGER NOT NULL,
    "subtitle" TEXT,
    "publication_year" INTEGER,
    "edition" TEXT,
    "isbn" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Magazine" (
    "id" INTEGER NOT NULL,
    "sc_no" INTEGER NOT NULL,
    "issn" TEXT,
    "volume" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Magazine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "acc_no" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "publisher_id" INTEGER NOT NULL,
    "reference" BOOLEAN NOT NULL,
    "call_no" DOUBLE PRECISION,
    "no_of_pages" INTEGER,
    "purchase_price" INTEGER NOT NULL DEFAULT 0,
    "purchase_details" TEXT,
    "purchased_on" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "library_slug" TEXT NOT NULL,
    "level" TEXT,
    "image_url" TEXT,
    "remarks" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL,
    "due_at" TIMESTAMP(3) NOT NULL,
    "returned_at" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "subscription_id" INTEGER,
    "price" INTEGER,
    "fine" INTEGER,
    "comments" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mark" (
    "id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comments" TEXT,
    "borrow_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibrarySubscription" (
    "id" SERIAL NOT NULL,
    "library_slug" TEXT NOT NULL,
    "recurrence" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "issues_per_volume" INTEGER,
    "reference" BOOLEAN NOT NULL,
    "ends_on" DATE NOT NULL,
    "no_of_weeks" INTEGER DEFAULT 52,
    "purchase_details" TEXT,
    "purchase_price" INTEGER DEFAULT 0,
    "call_no" DOUBLE PRECISION,
    "publisher_id" INTEGER NOT NULL,

    CONSTRAINT "LibrarySubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AuthorToBook" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToItem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToLibrarySubscription" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LanguageToLibrarySubscription" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ItemToLanguage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Library_name_key" ON "Library"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Library_settings_id_key" ON "Library"("settings_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionType_library_slug_name_key" ON "SubscriptionType"("library_slug", "name");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscription_type_id_user_id_key" ON "UserSubscription"("type_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_passage_id_key" ON "User"("passage_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_address_key" ON "User"("email_address");

-- CreateIndex
CREATE UNIQUE INDEX "Author_library_slug_name_key" ON "Author"("library_slug", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_library_slug_name_key" ON "Category"("library_slug", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Publisher_library_slug_name_key" ON "Publisher"("library_slug", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Item_library_slug_acc_no_key" ON "Item"("library_slug", "acc_no");

-- CreateIndex
CREATE UNIQUE INDEX "Mark_item_id_key" ON "Mark"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorToBook_AB_unique" ON "_AuthorToBook"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorToBook_B_index" ON "_AuthorToBook"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToItem_AB_unique" ON "_CategoryToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToItem_B_index" ON "_CategoryToItem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToLibrarySubscription_AB_unique" ON "_CategoryToLibrarySubscription"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToLibrarySubscription_B_index" ON "_CategoryToLibrarySubscription"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LanguageToLibrarySubscription_AB_unique" ON "_LanguageToLibrarySubscription"("A", "B");

-- CreateIndex
CREATE INDEX "_LanguageToLibrarySubscription_B_index" ON "_LanguageToLibrarySubscription"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToLanguage_AB_unique" ON "_ItemToLanguage"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToLanguage_B_index" ON "_ItemToLanguage"("B");

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_administrator_id_fkey" FOREIGN KEY ("administrator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "Settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionType" ADD CONSTRAINT "SubscriptionType_library_slug_fkey" FOREIGN KEY ("library_slug") REFERENCES "Library"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "SubscriptionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_library_slug_fkey" FOREIGN KEY ("library_slug") REFERENCES "Library"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_library_slug_fkey" FOREIGN KEY ("library_slug") REFERENCES "Library"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publisher" ADD CONSTRAINT "Publisher_library_slug_fkey" FOREIGN KEY ("library_slug") REFERENCES "Library"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_id_fkey" FOREIGN KEY ("id") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Magazine" ADD CONSTRAINT "Magazine_id_fkey" FOREIGN KEY ("id") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_library_slug_fkey" FOREIGN KEY ("library_slug") REFERENCES "Library"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "UserSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibrarySubscription" ADD CONSTRAINT "LibrarySubscription_library_slug_fkey" FOREIGN KEY ("library_slug") REFERENCES "Library"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibrarySubscription" ADD CONSTRAINT "LibrarySubscription_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToBook" ADD CONSTRAINT "_AuthorToBook_A_fkey" FOREIGN KEY ("A") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToBook" ADD CONSTRAINT "_AuthorToBook_B_fkey" FOREIGN KEY ("B") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToItem" ADD CONSTRAINT "_CategoryToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToItem" ADD CONSTRAINT "_CategoryToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToLibrarySubscription" ADD CONSTRAINT "_CategoryToLibrarySubscription_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToLibrarySubscription" ADD CONSTRAINT "_CategoryToLibrarySubscription_B_fkey" FOREIGN KEY ("B") REFERENCES "LibrarySubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageToLibrarySubscription" ADD CONSTRAINT "_LanguageToLibrarySubscription_A_fkey" FOREIGN KEY ("A") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageToLibrarySubscription" ADD CONSTRAINT "_LanguageToLibrarySubscription_B_fkey" FOREIGN KEY ("B") REFERENCES "LibrarySubscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToLanguage" ADD CONSTRAINT "_ItemToLanguage_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToLanguage" ADD CONSTRAINT "_ItemToLanguage_B_fkey" FOREIGN KEY ("B") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
