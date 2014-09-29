# sitemark [ ![Codeship Status for jamlen/sitemark](https://www.codeship.io/projects/7c253ce0-2a43-0132-843e-76f9ef90f262/status)](https://www.codeship.io/projects/38228)
Convention based, simple website using Markdown. Branched from the super simple [codeblog](https://github.com/martinrue/codeblog) by [Martin Rue](https://github.com/martinrue)

<p align="center">
  <a href="http://code.martinrue.com">
    <img src="https://github.com/jamlen/sitemark/raw/master/screenshot.png" />
  </a>
</p>

## Websites based upon code-blog

Take the simplified principles of [code-blog](https://github.com/martinrue/codeblog) and build a simple website CMS from it. (CMS in very loose terms!) This gives a simple, conventionalised structure
and editors only need to learn how to edit markdown. Especially if they use a tool which can publish direct to github, like the excellent [stackedit](https://stackedit.io).

If links to images are required then either use a cloud service like [cloudinary](https://cloudinary.com), or add them into `./public/img/content` and then use a relative link in the markdown.
For a file uploaded to:

```
.
└── public
    └── img
        └── my-image-001.png
```
You would reference it in markdown as:

<pre>
![alt text](/img/my-image-001.png "Title")
</pre>

## Installation

> __NOTE:__ This has not been pushed to the npm registry yet, please just `git clone` until then...

Installation is simple:

1. Run `npm install sitemark`
2. Edit the [`config.js`](#config)
3. Use your node process runner of choice, or `node sitemark.js`
4. Browse

## How
Simply create `your-blog-post.md` files in the `/content` directory and you're done. GitHub flavoured markdown is supported and code blocks are automatically highlighted.

### Navigation
The navigation menu is driven from the folder structure you choose inside `/content`. This currently only generates 2 levels deep and only for directories, not files. For example:

```
.
└── content
    ├── section-3                     <- menu created
    │   ├── subsection-1              <- menu created
    │   │   └── article-005.md
    │   └── subsection-2              <- menu created
    │       ├── article-002.md
    │       ├── article-003.md
    │       └── article-001.md
    ├── section-2                     <- menu created
    │   └── subsection-1              <- menu created
    │       └── subsubsection-1
    │       │   └── article-006.md
    │       └── article-006.md
    └── section-3                     <- menu created
        └── article-004.md
```

### Meta
The first three lines of any post should look like the following:

```
tags: tag1 tag2 tag3
title: Blog Post Title
preview: A quick introduction of what the post is about.
date: Jan 1 2013
---
```

The markdown body of the post should follow the `---` line. The preview also supports markdown.

## Code Highlighting
To highlight a block of code, surround the code with three backticks and a language specifier:

<pre>
```javascript
console.log('Hello World');
```
</pre>

To force the code block to have no highlighting, use the language specifier `no-highlight`.

## Config
Before deploying your own copy, please change the options in the [config.js](https://github.com/jamlen/sitemark/blob/master/config.js) file:

```javascript
module.exports = {
  email: 'gravatar@somedomain.com', // used to generate the blog image
  title: 'Blog Title Here',         // the page title and the blog header text
  style: 'monokai'                  // the syntax highlighting theme to use
};
```

### Supported Styles
You can set the `style` config to any of the following values: `arta` `ascetic` `brown_paper` `dark` `default` `far` `github` `googlecode` `idea` `ir_black` `magula` `monokai` `pojoaque` `rainbow` `school_book` `solarized_dark` `solarized_light` `sunburst` `tomorrow-night-blue` `tomorrow-night-bright` `tomorrow-night-eighties` `tomorrow-night` `tomorrow` `vs` `xcode` `zenburn`.

## Running Locally
Simply clone the repo, install dependencies and run `node sitemark.js`:

```
git clone git@github.com:jamlen/sitemark.git
cd sitemark
npm install
node sitemark.js
```

Now hit `http://localhost:9111` and you should be running your own sitemark website.
