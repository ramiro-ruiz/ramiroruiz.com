
Buttons express what action will occur when the user clicks or taps on it. Buttons are used to initialize an action, either in the background or foreground of an experience. Each page can have one or two primary buttons. Any remaining calls-to-action should be represented as secondary buttons or another variation.

## Base style
The base `c-btn` looks like a plain text link. It removes all the styling of the native button.

{{< button class="c-btn" >}}Button text{{</ button >}}
```tpl
{{</* button class="c-btn" */>}}Button text{{</* /button */>}}
```

## Link buttons
Buttons can be styled links that can lead to local page or external link.

{{< button href="/" class="my-class" >}}Homepage link{{< /button >}}{{< button class="c-btn" >}}Button text{{</ button >}}
{{< button href="https://twitter.com/ramiroruiz" target="blank">}}External link{{< /button >}}
```tpl
{{</* button href="/" class="my-class" */>}}Homepage link{{</* /button */>}}
{{</* button href="https://twitter.com/ramiroruiz" target="blank" */>}}External link{{</* /button */>}}
```