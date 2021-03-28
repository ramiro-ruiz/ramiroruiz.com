Buttons are styled links that can lead to local page or external link.

```tpl
{{</* button relref="/" [class="..."] */>}}Get Home{{</* /button */>}}
{{</* button href="https://github.com/thegeeklab/hugo-geekdoc" */>}}Contribute{{</* /button */>}}
```

## Example

<!-- spellchecker-disable -->

{{< button relref="/" class="myClass" >}}Get Home with class{{< /button >}}
{{< button relref="/" >}}Get Home{{< /button >}}
{{< button href="https://github.com/thegeeklab/hugo-geekdoc" >}}Contribute{{< /button >}}

<!-- spellchecker-enable -->
