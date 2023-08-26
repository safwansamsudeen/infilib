<script>
  import { page } from "$app/stores";
</script>

<header>
  <nav>
    <ul>
      <li aria-current={$page.url.pathname === "/" ? "page" : undefined}>
        <a href="/">Home</a>
      </li>
      <li aria-current={$page.url.pathname === "/members" ? "page" : undefined}>
        <a href="/members">Members</a>
      </li>
      <li
        aria-current={$page.url.pathname.startsWith("/books")
          ? "page"
          : undefined}
      >
        <a href="/books">Books</a>
      </li>
      <li
        aria-current={$page.url.pathname.startsWith("/circulation")
          ? "page"
          : undefined}
      >
        <a href="/circulation">Circulation</a>
      </li>
    </ul>
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
  }
  nav {
    width: 100%;
    display: flex;
    justify-content: center;
    --background: rgba(255, 255, 255, 0.7);
  }
  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  li {
    position: relative;
    height: 100%;
  }

  li[aria-current="page"]::before {
    --size: 6px;
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid black;
  }

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 1.75rem;
    color: black;
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
