<script>
    import {enhance} from "$app/forms";
    import Select from "svelte-select";

    export let publishers, languages, categories, authors;
    let publisher = '', language = '', category = '', author = '';
    let languageValues = null, categoryValues = null, authorValues = null;

    function createNewPublisher(e) {
        if (e.detail.length === 0 && publisher.length > 0) {
            const prev = publishers.filter((i) => !i.created);
            publishers = [...prev, {id: publisher, name: publisher, in_creation: true, created: true}];
        }
    }

    function createNewLanguage(e) {
        if (languageValues?.find(i => i.name === language)) return;
        if (e.detail.length === 0 && language.length > 0) {
            const prev = languages.filter((i) => !i.created);
            languages = [...prev, {code: language, name: language, in_creation: true, created: true}];
        }
    }

    function createNewCategory(e) {
        if (categoryValues?.find(i => i.name === category)) return;
        if (e.detail.length === 0 && category.length > 0) {
            const prev = categories.filter((i) => !i.created);
            categories = [...prev, {id: category, name: category, in_creation: true, created: true}];
        }
    }

    function createNewAuthor(e) {
        if (authorValues?.find(i => i.name === author)) return;
        if (e.detail.length === 0 && author.length > 0) {
            const prev = authors.filter((i) => !i.created);
            authors = [...prev, {id: author, name: author, in_creation: true, created: true}];
        }
    }

    function handlePublisherChange(e) {
        publishers = publishers.filter(i => i.in_creation !== true);
    }


    function handleCategoriesChange(e) {
        categories = categories.filter(i => i.in_creation !== true);
    }

    function handleLanguagesChange(e) {
        languages = languages.filter(i => i.in_creation !== true);

    }

    function handleAuthorsChange(e) {
        authors = authors.filter(i => i.in_creation !== true);
    }
</script>

<form action="?/create" method="post" use:enhance={() => {
          return async ({ update }) => {
            update({ reset: false });
          };
        }}>
    <div class="row g-3">
        <div class="col-md-6">
            <label for="acc_no">Accession Number</label>
            <input
                    class="form-control"
                    id="acc_no"
                    name="acc_no"
                    required
                    type="number"
            />
        </div>
        <div class="col-md-6">
            <label for="title">Title</label>
            <input
                    class="form-control"
                    id="title"
                    name="title"
                    required
                    type="text"
            />
        </div>
        <div class="col-md-6">
            <label for="call_no">Call Number</label>
            <input
                    class="form-control"
                    id="call_no"
                    name="call_no"
                    required
                    step="0.01"
                    type="number"
            />
        </div>
        <div class="col-md-6">
            <label for="publisher_id">Publisher</label>
            <Select
                    bind:filterText={publisher}
                    id="publisher_id"
                    items={publishers}
                    label="name"
                    name="publisher_id"
                    on:change={handlePublisherChange}
                    on:filter={createNewPublisher}
            >
                <div let:item slot="item">
                    {item.in_creation ? 'Add new publisher: ' : ''}
                    {item.name}
                </div>
            </Select>
        </div>
        <div class="col-md-6">
            <label for="languages">Languages</label>
            <Select
                    bind:filterText={language}
                    bind:value={languageValues}
                    id="languages"
                    itemID="name"
                    items={languages}
                    label="code"
                    multiple
                    name="languages"
                    on:change={handleLanguagesChange}
                    on:filter={createNewLanguage}
            >
                <div let:item slot="item">
                    {item.in_creation ? 'Add new language: ' : ''}
                    {item.name}
                </div>
            </Select>
        </div>
        <div class="col-md-6">
            <label for="categories">Categories</label>
            <Select
                    bind:filterText={category}
                    bind:value={categoryValues}
                    id="categories"
                    items={categories}
                    label="name"
                    multiple
                    name="categories"
                    on:change={handleCategoriesChange}
                    on:filter={createNewCategory}
            >
                <div let:item slot="item">
                    {item.in_creation ? 'Add new category: ' : ''}
                    {item.name}
                </div>
            </Select>
        </div>
        <div class="col-lg-3 col-md-4">
            <label for="no_of_pages">Number of Pages</label>
            <input
                    class="form-control"
                    id="no_of_pages"
                    name="no_of_pages"
                    type="text"
            />
        </div>
        <div class="col-lg-3 col-md-4">
            <label for="level">Level</label>
            <input class="form-control" id="level" name="level" type="text"/>
        </div>
        <div class="col-lg-3 col-md-4">
            <label for="purchase_price">Purchased price (INR)</label>
            <input
                    class="form-control"
                    id="purchase_price"
                    name="purchase_price"
                    type="text"
            />
        </div>
        <div class="col-lg-3 col-md-4">
            <label for="purchase_details">Purchase details</label>
            <input
                    class="form-control"
                    id="purchase_details"
                    name="purchase_details"
                    type="text"
            />
        </div>
        <div class="col-12">
            <label for="remarks">Remarks</label>
            <textarea class="form-control" id="remarks" name="remarks"
            ></textarea>
        </div>
        <div class="col-6">
            <div class="form-check">
                <input
                        class="form-check-input"
                        id="reference"
                        name="reference"
                        type="checkbox"
                />
                <label class="form-check-label" for="reference">Reference</label>
            </div>
        </div>
        <div class="col-6">
            <div class="form-check">
                <input
                        class="form-check-input"
                        id="cd_available"
                        name="cd_available"
                        type="checkbox"
                />
                <label class="form-check-label" for="cd_available"
                >CD Available</label
                >
            </div>
        </div>
        <h2>Book</h2>
        <div class="col-md-6">
            <label for="subtitle">Subtitle</label>
            <input
                    class="form-control"
                    id="subtitle"
                    name="subtitle"
                    type="text"
            />
        </div>
        <div class="col-md-6">
            <label for="authors">Authors</label>
            <Select
                    bind:filterText={author}
                    bind:value={authorValues}
                    id="authors"
                    items={authors}
                    label="name"
                    multiple
                    name="authors"
                    on:change={handleAuthorsChange}
                    on:filter={createNewAuthor}
            >
                <div let:item slot="item">
                    {item.in_creation ? 'Add new author: ' : ''}
                    {item.name}
                </div>
            </Select>
        </div>
        <div class="col-md-6">
            <label for="isbn">ISBN</label>
            <input
                    class="form-control"
                    id="isbn"
                    name="isbn"
                    required
                    type="text"
            />
        </div>
        <div class="col-lg-3 col-md-4">
            <label for="publication_year">Year of Publication</label>
            <input
                    class="form-control"
                    id="publication_year"
                    name="publication_year"
                    required
                    type="text"
            />
        </div>
        <div class="col-lg-3 col-md-4">
            <label for="edition">Edition</label>
            <input
                    class="form-control"
                    id="edition"
                    name="edition"
                    type="text"
            />
        </div>
    </div>
    <div class="d-grid gap-2 my-3">
        <input class="btn btn-outline-success" type="submit" value="Add"/>
    </div>
</form>
