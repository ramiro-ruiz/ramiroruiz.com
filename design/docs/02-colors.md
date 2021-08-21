---
title: Colors

context:

  primaryColors:
    - variable: --color-dark
      hex: '#1d1d1e'
    - variable: --color-grey-500
      hex: '#999999'
    - variable: --color-grey-100
      hex: '#F5F5F5'

---
## Brand colors

<ul style="padding: 0;list-style:none;display: grid;grid-template-columns: repeat(auto-fill,minmax(200px, 1fr));grid-gap:1rem;" class="color__container">
  {{#each primaryColors}}
    <li class="color__item" style="list-style:none; text-align: center;" >
      <div style="height: 60px; margin-bottom: 4px; background-color: {{ hex }};"></div>
      <p class="color__info color__variable">{{ variable }}</p>
      <p class="color__info color__hex">{{ hex }}</p>
    </li>
  {{/each}}
</ul>