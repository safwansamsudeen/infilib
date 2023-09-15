<script>
    import {setFormField} from "$lib/helpers.js";
    import {onDestroy, onMount} from 'svelte';

    async function getBookDetails(decodedText, decodedResult) {
        scanner.pause();
        let res = await fetch(
            "https://www.googleapis.com/books/v1/volumes?q=isbn:" + decodedText,
        );
        let item = (await res.json()).items[0];
        let volumeInfo = item.volumeInfo;
        //   Populate form fields with request data
        setFormField("title", volumeInfo.title);
        setFormField("subtitle", volumeInfo.subtitle);
        setFormField("authors", volumeInfo.authors?.join(", "));
        setFormField("no_of_pages", volumeInfo.pageCount);
        setFormField("publisher_name", volumeInfo.publisher);
        setFormField("publication_year", volumeInfo.publishedDate?.split("-")[0]);
        setFormField("languages", volumeInfo.language);
        setFormField("subjects", volumeInfo.categories?.join(", "));
        setFormField("purchase_price", item.saleInfo.listPrice?.amount);
        setFormField("purchase_details", item.saleInfo.listPrice?.buyLink);
        setFormField("isbn", decodedText);
    }


    let scanner;
    onMount(() => {
        scanner = new Html5QrcodeScanner(
            "reader",
            {fps: 10, qrbox: {width: 250, height: 250}},
            true,
        );
        scanner.render(getBookDetails);
    })
    onDestroy(() => {
        scanner.clear();
        document.getElementById("reader").innerHTML = "";
    })
</script>
<div id="reader" width="600px"></div>
