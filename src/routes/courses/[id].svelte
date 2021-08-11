<script context="module">
    export async function load({ page: { params: { id } } }) {
        return { props: { id }};
    }
</script>

<script>
import Header from "../../components/Header.svelte";
import Footer from "../../components/Footer.svelte";

    export let id;
    console.log(id);
</script>

<Header />
<section>
    <h1>{ id }</h1>
</section>

<iframe src="/ex-how-to-install-your-tracking-code/story.html" width="100%" height="700" title="{id}"></iframe>
<Footer />

<style>
    h1 {
        font-size: 50px;
        text-align: center;
        margin-bottom: 50px;
    }
</style>