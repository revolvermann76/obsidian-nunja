# obsidian-nunja

A plugin for obsidian, to use nunjucks templates

## Description

Nunja is a Obsidian plugin and offers the possibility to use templates. The underlying template engine is Nunjucks. Templates can be used to create entire notes or to insert snippets into existing notes. After installing the plugin, it is advisable to first define a location in the settings where the corresponding templates will be stored. It is also useful to set the "Default output path" for notes. In the settings, you can then generate some useful example templates initially.

Through the command palette, you can either insert a snippet into the current note ("Nunja: Insert Snippet") or create a new note based on a template ("Nunja: New note from template").

## Structure of a Template

A template is described by a codefence labeled "yaml nunja-template". The corresponding properties then describe the template.

### type: 

There are two types of templates, "snippet" and "note". If no `type` is specified, it assumes it is a snippet.  

### title: 

Each template should have a unique "title" under which it can be selected later.  

### alias: 
Sometimes it may be useful to make a template known under different names. These names can be stored as a list under the "alias" property.  

### fields: 

Fields are different properties that are queried from the user before applying a template to customize it. Fields come in four different types: "text", "area", "boolean", and "choice".  

### monitor: 

Templates of type "note" can have the "monitor" property. Here, a folder path is specified that will be monitored from now on. Once a new file is created in this folder, the corresponding template is applied directly.  

### javascript: 

Here, JavaScript can be stored that is executed before applying a template and influences the context with which the template is filled.  

### template: 

This property stores the actual Nunjucks template. Refer to the official Nunjucks documentation to determine the syntax.  

### open: 

This property only exists for templates of type "note". It determines whether a newly created note should be opened or not. Permissible values are `true`, `false`, or `"tab"`. `"tab"` opens the note in a new tab.


## Nunja codefences

Nunja offers the possibility to use a code fence with the label "nunja". A Nunjucks template string stored there is rendered directly and displayed on the page.

```nunja
{{' //Javascript
console.log(this)
new obsidian.Notice("Whatever");
nunja.addGlobal("linksFlat", context.links().map((l)=>l.link));
return "# Test";
' | js}}

|                                | Meaning                     | Result                   |
| ------------------------------ | --------------------------- | ------------------------ |
| basename                       |                             | {{ basename  }}          |
| name                           |                             | {{ name  }}              |
| path                           |                             | {{ path  }}              |
| extension                      |                             | {{ extension  }}         |
| global<br>global.Math.random() | Access the global Namespace | {{global.Math.random()}} |
| nunja<br>nunja.test()          | this plugin                 | {{ nunja.test() }}       |
| title()                        |                             | {{ title() }}            |
| tags()                         |                             | {{tags()}}               |
| timestamp()                    | YYYYMMDDHHmmSS              | {{ timestamp() }}        |
| timestamp(true)                | UNIX timestamp              | {{ timestamp(true) }}    |
| time()                         | HH:mm                       | {{ time() }}             |
| time(true)                     | HH:mm:SS                    | {{ time(true) }}         |
| date()                         | YYYY-MM-DD                  | {{ date() }}             |
| app<br>app.appId               | access app object           | {{app.appId}}            |
| linksFlat                      |                             | {{linksFlat}}            |
### links()
<pre>
{{links() | dump(2) | safe }}
</pre>
### metadata
<pre>
{{metadata | dump(2) | safe }}
</pre> 
```


## How to use

- Clone this repo.
- Make sure your NodeJS is at least v16 (`node --version`).
- `npm i` or `yarn` to install dependencies.
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-nunja/`.


