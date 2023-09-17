<script>
    import {enhance} from "$app/forms";
    import CustomSelect from '$lib/components/CustomSelect.svelte'

    export let publishers, languages, categories, authors;
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
        <CustomSelect items={publishers} label="Publisher" name="publisher"/>
        <CustomSelect items={languages} label="Languages" multiple name="languages"/>
        <CustomSelect items={categories} label="Categories" multiple name="categories"/>
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
        <CustomSelect items={authors} label="Authors" multiple name="authors"/>
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
