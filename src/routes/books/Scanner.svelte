<script>
    import {setFormField, setSelectField} from "$lib/helpers.js";
    import {onDestroy, onMount} from 'svelte';

    export let publishers, authors, languages, categories;

    async function getBookDetails(decodedText) {
        scanner.pause();
        let res = await fetch(
            "https://www.googleapis.com/books/v1/volumes?q=isbn:" + decodedText,
        );
        let item = (await res.json()).items[0];
        let volumeInfo = item.volumeInfo;
        //   Populate form fields with request data
        setFormField("title", volumeInfo.title);
        setFormField("subtitle", volumeInfo.subtitle);
        setFormField("no_of_pages", volumeInfo.pageCount);
        setFormField("remarks", volumeInfo.description);
        setFormField("publication_year", volumeInfo.publishedDate?.split("-")[0]);
        setFormField("purchase_price", item.saleInfo.listPrice?.amount);
        setFormField("purchase_details", item.saleInfo.listPrice?.buyLink);
        setFormField("isbn", decodedText);

        setSelectField('publisher', publishers, volumeInfo.publisher);
        setSelectField('authors', authors, volumeInfo.authors, true);
        setSelectField('languages', languages, [volumeInfo.language], true);
        setSelectField('categories', categories, volumeInfo.categories, true);
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
