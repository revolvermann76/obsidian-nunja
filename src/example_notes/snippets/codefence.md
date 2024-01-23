# Codefence

```yaml nunja-template
# a nunja template-type can be `note` or `snippet`
# if no type is given, `snippet` is the default
type: snippet  

# you can set the title for the template
# if no title is given, the filename is used as 
# the title. when there are more than one template 
# in a file, a title is mandatory
title: codefence

# the template will show some input-fields to gather more info for the template
# there are four types of fields "text", "area", "boolean" and "choice"
fields:
- title: Language
  type: text
  preset: ''
  key: language
  items: 
    AsciiDoc: asciidoc
    Basic: basic
    Bash: bash
    Batch: batch
    BBCode: bbcode
    CMake: cmake
    C++: cpp
    C-Sharp: csharp
    CSS Cascading Style Sheets: css
    CSV Comma-separated values: csv
    CoffeeScript: coffeescript
    JavaScript: javascript
    Handlebars: handlebars
    HTML: html
    INI configuration: ini
    Java: java
    JSON: json
    JSONC: jsonc
    Kotlin: kotlin
    Markdown: markdown
    Mermaid: mermaid
    PHP: php
    Python: python
    SASS: sass
    SCSS: scss
    SQL: sql
    TypeScript: typescript
    YAML: yaml
  
# the nunjucks template
template: |
  ```{{language}}
  {{selection}}{{cursor}}
  ```
```

```yaml nunja-template
type: snippet  
title: codefence Bash
template: |
  ```bash
  {{selection}}{{cursor}}
  ```
```

```yaml nunja-template
type: snippet  
title: codefence CSS
template: |
  ```css
  {{selection}}{{cursor}}
  ```
```

```yaml nunja-template
type: snippet  
title: codefence DataviewJS
template: |
  ```dataviewjs
  {{selection}}{{cursor}}
  ```
```

```yaml nunja-template
type: snippet  
title: codefence HTML
template: |
  ```html
  {{selection}}{{cursor}}
  ```
```

```yaml nunja-template
type: snippet  
title: codefence JavaScript
template: |
  ```javascript
  {{selection}}{{cursor}}
  ```
```

```yaml nunja-template
type: snippet  
title: codefence Python
template: |
  ```python
  {{selection}}{{cursor}}
  ```
```

```yaml nunja-template
type: snippet  
title: codefence RunJS
template: |
  ```javascript RunJS="{n:'path/name', t:'s'}"
  {{selection}}{{cursor}}
  ```
```

```yaml nunja-template
type: snippet  
title: codefence TypeScript
template: |
  ```typescript
  {{selection}}{{cursor}}
  ```
```

