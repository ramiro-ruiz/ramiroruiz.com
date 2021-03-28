---
title: "Nuevo sitio"
date: 2018-04-02T00:00:00Z
draft: false
section: "post"
slug: "nuevo-sitio"
excerpt: "Esta mañana lancé mi nuevo sitio web. Solía ​​ser uno de esos diseñadores que nunca reservaba tiempo para mi branding, solo trabajaba para clientes y nunca para mí. Como resultado, nunca me he sentido realmente orgulloso de mi sitio. Quería velocidad con el contenido principal en una página."
tags: ["diseño", "CSS", "hugo", "static site", "netlify"]
categories: "diseño"
post_color: ""
post_image: "new-website.jpg"
post_bg: ""
photo_link: ""
photo_name: ""
---
Esta mañana lancé mi nuevo sitio web. Solía ​​ser uno de esos diseñadores que nunca reservaba tiempo para mi branding, que solo trabajaba para clientes y nunca para mí. Como resultado, nunca me he sentido realmente orgulloso de mi sitio.

Debo regresar un poco en la historia a mi primer portafolio web, que lancé supersticiosamente el 9 de septiembre de 2009 (09/09/09) buscando un poco de suerte, una llovia de clientes o algún tipo de ayuda. No utilizaba solo mi nombre en aquel entonces, era popular crear un nombre de agencia y dar la impresión de que eras más de uno, _ "suena más profesional" _ solía pensar.

{{< figure src="/i/blog/mirdum.jpg" alt="Mi primer portafolio web" >}}

[Mirdum](http://es.mirdum.com/) era el nombre de mi estudio de una persona, algunas cosas están rotas, pero puedes aun ir al sitio y ver mi trabajo inicial, no he cambiado nada desde 2009, así que esta muy desactualizado, el uso estricto de XHTML era lo que se estaba usando, antes de HTML5, lo desarrolle en [WordPress](http://wordpress.org) con campos personalizados y algunos plugins geniales para que sea flexible y fácil de actualizar.
No fue así.

Cuando traté de agregar una nueva pieza de trabajo, perdí mucho tiempo para publicarla; eso y mi mentalidad de _"constrúyelo y ellos vendrán"_ tampoco ayudó. Así que prácticamente abandoné mi sitio.

Luego compré ramiroruiz.com ya que solía ser propiedad de un caballero en Brasil con el mismo nombre. Esa vez solo quería una tarjeta de presentación web, un sitio vCard, inspirado por el increíble trabajo de [Tim Van Damme](http://www.timvandamme.com).

{{< figure src="/i/blog/timvandamme.jpg" alt="Tim Van Damme sitio vCard" >}}

Utilice WordPress de nuevo, en aquel entonces la función de multisite era bastante nueva, así que creé un grupo de sitios experimentales en ese dominio, uno de esos era un blog personal. Y a pesar de mis intenciones de comenzar un nuevo hábito de escribir y crear más, solo publiqué una vez y también lo termine por abandonar.

{{< figure src="/i/blog/old-personalsite.jpg" alt="Mi segundo portafolio web" >}}

## Nueva esperanza
Ahora, muchos años después, vuelvo más decidido que nunca. Ciertamente mi motivación fue gracias al gran interés que comenzó en [generadores de sitios estáticos](https://www.smashingmagazine.com/2015/11/modern-static-website-generators-next-big-thing/) y aprender un poco sobre ellos. Son tan flexibles y simples, eso es lo que he estado buscando. No necesito configurar bases de datos, instalar docenas de plugins o actualizarlo frecuentemente para evitar hacks en mi sitio.

Una vez que decidí construir mi nuevo sitio en un generador de sitios estáticos, comencé a investigar sobre los mejores que había para ayudarme a decidir sobre uno. Termine eligiendo a [Hugo](http://gohugo.io) por su increíble velocidad y porque es relativamente fácil de aprender, amigable para un diseñador diría yo.

## Planeación
Todavía me gusta el principio básico del estilo vCard, cuando visito un sitio personal, estoy buscando una forma rápida de obtener más información sobre ¿quiénes son?, ¿qué hacen?, ¿y dónde más puedo encontrarlos?

Así que me centré en cubrir esas preguntas de inmediato, escribiendo como sería la página de incial.

- Simple información del acerca
  - Links a redes sociales
- Trabajo destacado
  - Lista de trabajos seleccionados
- Nueva publicación del blog
  - Lista de publicaciones recientes

Estaba buscando la velocidad de un sitio de una sola página al tener rápidamente el contenido principal pero en un formato diferente, quería una experiencia como las pestañas de aplicaciones móviles. Así que hice una lista horizontal con las 3 secciones clave, donde puedes desplazarte o navegar con los enlaces de ID y también en el móvil puedes deslizarte de una pestaña a otra en la página principal gracias a [Swiper](http://idangero.us/swiper/), y la navegación está en la parte inferior para facilitar el acceso, manteniendo una sensación más nativa y natural.

{{< figure src="/i/blog/website-slide.gif" alt="Interacción del sitio móvil" class="no-full">}}

Integrar las plantillas de mi diseño a Hugo no fue tan difícil como pensaba, una vez que pierdes el miedo a usar terminal es muy sencillo y tiene una gran [comunidad](http://discourse.gohugo.io) que puede ayudarte si te llegas a atascar en algo.

Otro dolor de cabeza era hacerlo bilingüe, Hugo lo hace muy fácil con sus herramientas integradas. Adiós a los plugins de traducción de WordPress. No agregué ninguna redirección esta vez, el sitio por default es en inglés, pero está muy claro dónde está la versión en español.

Cuando estaba aprendiendo sobre el uso de Hugo, no quería complicar demasiado las cosas, es por eso que planeaba subir por FTP manualmente la carpeta pública y listo, pero sabía que no era la manera más rápida y amigable de actualizar el sitio o agregar nuevas publicaciones, así que volví para aprender más sobre el uso de [GitHub](http://github.com/) y [Netlify](http://netlify.com) para deploys automáticos, y tengo que decir, estoy muy contento de haberme tomado ese tiempo para aprender e implementarlo correctamente. Es otro mundo, tan rápido y fácil de actualizar el sitio que ahora solo quiero construir los próximos de manera similar.

{{< figure src="/i/blog/netlify.jpg" alt="Netlify" >}}

Era el momento perfecto para jugar y experimentar con las funciones de CSS, como Grid layout, feature queries, animaciones, and transiciones. Y me sorprendió enormemente CSS grid, es tan fácil una vez que te acostumbras. No me veo haciendo sitios con floats de nuevo.

{{< figure src="/i/blog/case-study-grid.jpg" alt="CSS grid" >}}

## Cosas por hacer
Como al principio que pensaba hacer un sitio muy simple, comencé a construirlo con solo CSS y, a medida que se hizo más grande, seguí agregando más. Así que no estoy muy orgulloso de mi organización de mis estilos en este momento, probablemente voy a migrar a SASS ya que quiero jugar y probar bourbon también.

Webmentions en los artículos, con el uso intensivo de las redes sociales, creo que es una mejor interacción que solo comentarios. Así que voy a hacer mi tarea y aprender sobre ellos para poder implementarlos.

Más iteraciones, ahora que es tan fácil hacer cambios en mi sitio, estaré constantemente haciendo pequeñas mejoras, por lo que cualquier feedback es más que bienvenido.


{{< figure src="/i/blog/new-website.jpg" alt="Nuevo sitio" >}}
