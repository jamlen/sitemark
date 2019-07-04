# sitemark [![Coverage Status](https://img.shields.io/coveralls/jamlen/sitemark.svg)](https://coveralls.io/r/jamlen/sitemark?branch=master) [ ![Codeship Status for jamlen/sitemark](https://www.codeship.io/projects/7c253ce0-2a43-0132-843e-76f9ef90f262/status)](https://www.codeship.io/projects/38228)

[![Join the chat at https://gitter.im/jamlen/sitemark](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jamlen/sitemark?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Convention based, simple website using Markdown. Branched from the super simple [codeblog](https://github.com/martinrue/codeblog) by [Martin Rue](https://github.com/martinrue)

<p align="center">
  <a href="http://sitemark.io">
    <img src="https://github.com/jamlen/sitemark/raw/master/screenshot.png" />
  </a>
</p>

## Websites based upon code-blog

Take the simplified principles of [code-blog](https://github.com/martinrue/codeblog) and build a simple website CMS from it. (CMS in very loose terms!) This gives a simple, conventionalised structure and editors only need to learn how to edit markdown. Their workflow can be even more simplified if they use a tool which can publish direct to GitHub, like the excellent [stackedit](https://stackedit.io), as they do not have learn git. Add to this a CI environment like [CodeShip](https://www.codeship.io/) and automated deployments to some Application Hosting like [Heroku](https://www.heroku.com/), then you 'publish' an article via StackEdit and within a few minutes it is available on the site.

## How
Simply create `your-blog-post.md` files in the `/content` directory and you're done. GitHub flavoured markdown is supported and code blocks are automatically highlighted.

### Navigation
The navigation menu is driven from the folder structure you choose inside `/content`. This currently only generates 2 levels deep and only for directories, not files. For example:

```
./
└── content
    ├── section-1                     <- menu created
    │   ├── subsection-1              <- menu created
    │   │   └── article-005.md
    │   └── subsection-2              <- menu created
    │       ├── article-002.md
    │       ├── article-003.md
    │       └── article-001.md
    ├── section-2                     <- menu created
    │   └── subsection-1              <- menu created
    │       └── subsubsection-1
    │       │   └── article-006.md
    │       └── article-006.md
    ├── section-3                     <- menu created
    │   └── article-004.md
    ├── section-4                     <- menu created
    │   └── index.md                  <- define template and content sections
    └── index.md                      <- defines template and content sections for homepage
```

### Meta
The first few lines of an article define the metadata about it. These must be followed by `---` to indicate the content start.

#### Available Meta Properties

| Property  | Required | Description                         |
| --------- |:--------:| ----------------------------------- |
| `title`   | yes      | the page title                      |
| `date`    | yes      | publish date for the article        |
| `preview` | no       | a short preview text of the article |
| `tags`    | no       | tags for an article                 |
| `author`  | no       | the name of the author              |
| `image`   | no       | an image for the article            |

#### Example `index.md`

```markdown
tags: tag1 tag2 tag3
title: Blog Post Title
preview: A quick introduction of what the post is about.
date: Jan 1 2013
---
```

The markdown body of the post should follow the `---` line. The preview also supports markdown.


### Templates

Each section can use a different template for rendering. Just add an index.md which dictates which template to use and the content for the sections.

#### Conventions used in `index.md` files

The meta properties supported for template use are:

| Property | Required | Description                                                                            |
| -------- |:--------:| -------------------------------------------------------------------------------------- |
| `use`    | yes      | the name of the template to use. These should be located in `./views/templates/*.jade` |
| `title`  | yes      | the page title                                                                         |

Below the main meta properties are the sections. Sections also use conventions... The sections are divided by the same `---` that is used by the meta properties. 

Inside the section a section name is required followed by a `===` delimiter, and then the section content.

#### Example `index.md`

```markdown
use: profile
title: Councillor Joe Bloggs Profile
---
section: contact
===
[joe@bloggs.com](mailto:joe@bloggs.com)
01234 556 677
---
section: bio
===
# Joe Bloggs
Labore in eu reprehenderit excepteur aliqua eiusmod ad sunt. Occaecat pariatur est aliqua sint magna laboris aute esse. Cupidatat aliquip ipsum ipsum nulla cillum exercitation ipsum in eu nostrud elit amet ut qui. 
---
section: image
===
![](http://img1.wikia.nocookie.net/__cb20100810183425/familyguy/images/2/2f/Lobot.png 'Lobot')
```

### Code Highlighting
To highlight a block of code, surround the code with three backticks and a language specifier:

```javascript
console.log('Hello World');
```

To force the code block to have no highlighting, use the language specifier `no-highlight`.

### Images

If links to images are required then either use a cloud service like [cloudinary](https://cloudinary.com), or add them into `./public/img/content` and then use a relative link in the markdown.
For a file uploaded to:

```
.
└── public
    └── img
        └── my-image-001.png
```
You would reference it in markdown as:

```markdown
![alt text](/img/my-image-001.png "Title")
```

### Config
Before deploying your own copy, please change the options in the [config.js](https://github.com/jamlen/sitemark/blob/master/config.js) file:

```javascript
module.exports = {
  email: 'gravatar@somedomain.com', // used to generate the blog image
  title: 'Blog Title Here',         // the page title and the blog header text
  style: 'monokai'                  // the syntax highlighting theme to use
};
```

#### Supported Styles
You can set the `style` config to any of the following values: `arta` `ascetic` `brown_paper` `dark` `default` `far` `github` `googlecode` `idea` `ir_black` `magula` `monokai` `pojoaque` `rainbow` `school_book` `solarized_dark` `solarized_light` `sunburst` `tomorrow-night-blue` `tomorrow-night-bright` `tomorrow-night-eighties` `tomorrow-night` `tomorrow` `vs` `xcode` `zenburn`.

## Running Locally
Simply clone the repo, install dependencies and run `node sitemark.js`:

```bash
git clone git@github.com:jamlen/sitemark.git
cd sitemark
npm install
node sitemark.js
```

Now hit `http://localhost:9111` and you should be running your own sitemark website.

## License
Copyright (c) 2014-2019 James Allen (jamlen)
Licensed under the MIT license.
