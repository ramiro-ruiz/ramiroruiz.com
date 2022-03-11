---
date: 2022-03-11T15:51:10-06:00
title: 'Processes in digital design'
slug: 'blog/processes-in-digital-design'
type: 'blog'
tags:
- Processes
- Design applications
- Flash
- Web design
- My beginnings
- Fireworks
lang: 'en'
weather: '76.27°F'
weather_summary: 'Clear'
weather_icon: 'clear-day'
lat: '25.75544457401456'
long: '-100.4021383453246'
location_dms: '25° N, 100° W'


tweet_id: ''
---
Since I started designing and creating digital projects at the end of 2008 I have seen many changes in the processes and tools to design and build for the web. And looking back, I realize how noticeable the changes are due to needs or the arrival of new technology. In the end, everyone decides the way that works best for them, but I firmly believe that the processes that stray the least from the code are the ones that obtain the best and fastest results.

Like many in those years, he wanted to create innovative and surprising solutions. So [Flash](https://web.archive.org/web/20081216065809/http://www.adobe.com/products/flash/?promoid=BPDEE) was generally used, those famous intros and transitions. The truth is that it felt a lot of freedom that you could create anything you could imagine. Obviously ignoring the UX and accessibility very strongly as usual in those times.

## My process in the beginning
1. I would sketch in detail the structure and a bit about the interactions or animations that I wanted to add.
2. I used Photoshop to bring the sketch to life with details, colors, and typography.
3. I would pick the elements that would require animation or interaction (a header with a dropdown menu) to export those layers to Flash.
4. Already in Flash I created the interactions and animations to export it in an swf.
5. The remaining layers were exported to images in order to add them to [Dreamweaver](https://www.adobe.com/mx/products/dreamweaver.html?sdid=KQPSG&mv=search&ef_id=15d129eefa9f1a2a8cae4bc57d778a54:G:s&s_kwcid=AL!3085!10!79164972611964!79164849730820), creating a structure with tables that, together with the resulting Flash swf, and exported the code to test it in a browser and then upload the site via [FTP](https://en.wikipedia.org/wiki/File_Transfer_Protocol).

With all those steps, it was an application switcher headache, to try to achieve what one wanted to see in the browser without looking at the resulting code much.

It didn't last long doing this, luckily I started when the web standards movement was already strong. Once I started to read a little about it, my way of working and the way I see the web changed completely. I forced myself to lose my fear of code and started learning HTML and CSS.

## My process knowing the basics
1. I sketched the structure in detail.
2. I would take Fireworks to bring the sketch to life with details, colors, and typography.
3. I created images of the different states of buttons and links like hover, active, etc.
4. Assets were exported so they could be used in code.
5. Back in Dreamweaver but now only using the code view, I started building the designed pages in HTML and CSS.

The benefits were obvious, I had more freedom and flexibility in my designs as I finally understood the code that was used to create them. It saved me the time it took me in Flash and took advantage of the advantages that Fireworks had at that time over Photoshop, being a focused application for the web.

There you could have various states of the elements, better export of images; like transparency in gifs that worked in [IE6](https://en.wikipedia.org/wiki/Internet_Explorer_6) and also being able to work with vectors. Unfortunately, Adobe did not give enough attention and resources to Fireworks.

During those years Photoshop kept updating and Fireworks was left behind. And considering that [skeuomorphic design](https://en.wikipedia.org/wiki/Skeuomorph#Virtual_examples) was booming, going back to photoshop was the obvious choice.

Over time I also came across a much better text editor [Coda](https://panic.com/coda/) and my process changed again.

## My process for Skeuomorphic
1. Basically sketched the structure.
2. I opened Photoshop to finalize the design with lots of details, gradients, colors, and typography.
3. Assets were exported to images so they could be used in code.
4. And I ended up at Coda writing the necessary HTML and CSS to build the layouts.

At that time, a large part of the time was spent in Photoshop, as well as the technique of cropping images and optimizing their size to prevent a page with so many images from becoming too heavy. It was a real challenge to create rounded corners to containers as well as adding them shadows.

Still taking all that into account, it was one of the phases that I enjoyed the most, it had a great focus on graphic details. And there was a lot of creativity in how to come up with amazing designs within the constraints of current browsers.

Then the term [designing in the browser](https://duckduckgo.com/?q=designing+in+your+browser&t=ipad&ia=web) began to become very popular, which seemed quite logical to me, there was already better CSS support in browsers and some were beginning to include some CSS3.

## My process with more focus on code
1. I rarely sketched, I went straight to the text editor.
2. Assets were exported to images so they could be used in code.
3. And I ended up at Coda writing the necessary HTML and CSS to put together the layouts.

I definitely felt a big change in speed, a better deliverable by being just as flexible as the web medium itself and quicker to make changes.

The strong boom of [responsive web design](https://en.wikipedia.org/wiki/Responsive_web_design) was already happening so it helped to use the browser as soon as possible to show the adaptation to the different sizes that were going to be supported.

One problem I found was that I ended up with inauthentic designs, subconsciously building the site into relatively easy-to-do layouts. I resorted to the familiar, I consider that in the code it is easier to iterate and create many alternate versions of the same. But not so much for the initial design experimentation phase.

Fortunately, digital design software began to grow rapidly, starting with [Sketch](https://www.sketch.com/). Finally there was a program focused 100% on web design and digital products, where it integrated several essential tools that made the process much easier.

## My current process
1. Sketch the main ideas
2. I add detail and text in [Figma](https://www.figma.com)
3. I write the code to build the design in [VS Code](https://code.visualstudio.com)

Speaking of CSS, I resorted to using a [preprocessor](https://es.wikipedia.org/wiki/Sass) and adopted the architecture of [ITCSS](https://www.xfive.co/blog/itcss-scalable -maintainable-css-architecture/) created by [Harry Roberts](https://twitter.com/csswizardry). That made a big difference in the organization of my code and the ease of finding exactly what I was looking to make changes to. As well as not having to deal with [specificity](https://developer.mozilla.org/en/docs/Web/CSS/Specificity) issues.

With the wave of new digital design apps, they helped reduce the time that step took, as well as start creating design systems using *symbols* in Sketch or *components* in Figma. Now it made sense to maintain and iterate the design in those apps.

A couple of years ago I switched to using Figma as my design app of choice, there are several things I can talk about what contributed to that decision but I will only mention the strongest one. And it is its collaborative nature, I am a firm believer that collaboration produces better results than designs in isolation.

It was an interesting exercise to remember the steps I took before and how my process has changed over the years. Because the field of digital design has to change along with technology, I’m sure my process will too.