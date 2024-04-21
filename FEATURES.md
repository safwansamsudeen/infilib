## Members

- Create member
  - This creates a member if the member doesn't exist.
  - If the member exists, it will add the subscription details to that member.
- View member details
  - View all members (table with pagination and search).
  - See and update a member's details, along with their borrows.
  - Delete member.

## Items

- InfiLib supports both books and magazines.
- We also support reference (not borrowable) and non reference books
- Add Items
  - By scanning or entering the ISBN of an item, you can autofill details for most books.
  - For magazines, we support library subscriptions - just select this to autofill most details. See more in [Settings](#settings).
- View items
  - By default, popular items and recent arrivals. You can view all items by clicking a link, though.
  - Table display _and_ card display.
  - Filter by books or magazines
- Search items
  - Basic and advanced search
  - Quick "goto" where you put ISBN/ISSN or accession number to go to the detail page.
- Item details
  - See all borrows
  - Update fields

## Circulate

- This is the page where you view your transactions.
- By default, a month's worth is shown, but you can change this using the "Filter" option.
- Quickly return or delete transactions.
  - Note that for security reasons, we never delete a transaction - we just hide it from you. **Should a library owner request the deleted transaction data, we will provide it**.
- Borrowing:
  - Items can be borrowed at the touch of a button from either the all item or detail view. Clicking borrow on a member also takes you to the borrow form, with that member's name being filled in.
  - Your members can "mark" books for borrow from the Public Portal, which you can "pop" when you hand over the item.
  - We don't enforce the return date - but we default it to that user's subscription's number of borrowing days.
  - Our default price is 10% of the item's price for the "Membership" (default) subscription. For any other subscription plan, the price defaults to 0.

## Statistics

- Just check it out, it's brilliant! We're working on it to give you something even better.
- We currently support both a textual "report" and charts.

## Settings

- Add a subscription "type" - by default, every library has a Membership subscription. Different member can have different subscriptions, which will affect item prices, the number of items a member can have at once, and the number of days the user can have it for.
- Add a library subscription - little confusing with the same name, but this refers to _you_, the librarian, subscribing for a magazine or periodical. This can be used to autofill magazine details later on when you add them.
- The actual settings
  - Free Library? If checked, converts your library into a library that is free to borrow from. Useful for school or office libraries.

## Other nice titbits

- Quick navigation: you can go to an item or member from any table or form when you select that record.
- Support for free libraries
- All tables can be viewed in full screen.
- Users can view and mark books for borrow at a specific time while sitting in their houses - using the **Public Portal**.
- Importing is available.
- In the circulation page, you have color marking for items that are due.

## Upcoming

- Leaderboards
- Far better customization in Library Settings
- Improved Public Portal
- Readathons
- Better subscription models
- Improved statistics
- Item filtering and shortcuts
- Better design (!)
- User "connections" with each other, and so much more!

As always, we'd love to hear from you! [Email us](mailto:hello.infilib@gmail.com) to suggest a feature or report a bug. You can also [open an issue](https://github.com/safwansamsudeen/infilib/issues/new) right here in GitHub.
