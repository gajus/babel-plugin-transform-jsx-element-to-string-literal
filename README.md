# babel-plugin-transform-jsx-element-to-string-literal

[![Travis build status](http://img.shields.io/travis/gajus/babel-plugin-transform-jsx-element-to-string-literal/master.svg?style=flat-square)](https://travis-ci.org/gajus/babel-plugin-transform-jsx-element-to-string-literal)
[![NPM version](http://img.shields.io/npm/v/babel-plugin-transform-jsx-element-to-string-literal.svg?style=flat-square)](https://www.npmjs.org/package/babel-plugin-transform-jsx-element-to-string-literal)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Transforms JSX elements to a string literal.

The default behaviour is to convert only `<heredoc>` elements (see [Configuration](#configuration)).

* [Example transpilation](#example-transpilation)
* [Motivation](#motivation)
* [Configuration](#configuration)

## Example transpilation

Input:

```js
const foo = <heredoc>Hello, World!</heredoc>;

const bar = <heredoc>
  Hello,
  World!
</heredoc>;

```

Output:

```js
const foo = "Hello, World!";

const bar = "\n  Hello,\n  World!\n";

```

## Motivation

My primary use case for this plugin is to enable writing multi-line MySQL queries.

In MySQL, if an [identifier](https://dev.mysql.com/doc/refman/5.5/en/identifiers.html) contains special characters or is a reserved word, you must quote it whenever you refer to it. The identifier quote character is the backtick (`` ` ``).

Nonreserved keywords are permitted as identifiers without quoting. However, it is a healthy habit to quote all identifiers to prevent accidental collision with [keywords, reserved words](https://dev.mysql.com/doc/refman/5.5/en/keywords.html) and names of [built-in functions](http://dev.mysql.com/doc/refman/5.7/en/functions.html).

There is no problem writing single-line MySQL queries because you can use single or double quotes, e.g.

```js
const = 'SELECT `p1`.`id`, `p1`.`name`, `t1`.`id` `tagId`, `t1`.`name` `tagName` FROM `page` `p1` INNER JOIN `page_tag` `pt1` ON `pt1`.`page_id` = `p1`.`id` GROUP BY `p1`.`id` HAVING COUNT(`pt1`.`id`) = 4';

```

However, writing a long query on a single line hurts the readability of the query. You cannot use [template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals) because the syntax clashes with the MySQL identifier quote character.

A proponent of the template literals syntax will argue that you can escape the backtick character, e.g.

```js
const = `
SELECT
  \`p1\`.\`id\`,
  \`p1\`.\`name\`,
  \`t1\`.\`id\` \`tagId\`,
  \`t1\`.\`name\` \`tagName\`
FROM
  \`page\` \`p1\`
INNER JOIN
  \`page_tag\` \`pt1\`
ON
  \`pt1\`.\`page_id\` = \`p1\`.\`id\`
GROUP BY
  \`p1\`.\`id\`
HAVING
  COUNT(\`pt1\`.\`id\`) = 4
`;

```

However, this approach has several disadvantages:

* It makes it hard to read the query.
* You cannot copy back and forth the query between your IDE and an SQL client (as is often the workflow).

As a result, the [established practise for writing MySQL queries that span multiple lines](http://gajus.com/blog/8/using-mysql-in-node-js#queries-that-span-multiple-lines) is to store them in a separate file. This is a good approach, esp. for very long queries. However, sometimes you want to have queries in-file, e.g. when prototyping or if you simply prefer to.

This is where the `babel-plugin-transform-jsx-element-to-string-literal` comes in. You can declare any query using JSX elements:

```js
const = <sql>
SELECT
  `p1`.`id`,
  `p1`.`name`,
  `t1`.`id` `tagId`,
  `t1`.`name` `tagName`
FROM
  `page` `p1`
INNER JOIN
  `page_tag` `pt1`
ON
  `pt1`.`page_id` = `p1`.`id`
GROUP BY
  `p1`.`id`
HAVING
  COUNT(`pt1`.`id`) = 4
</sql>;

```

> Note:
> The above example is using `{"tagNames": ["sql"]}` configuration.

## Configuration

|Name|Default|Description|
|---|---|---|
|`tagNames`|`["heredoc"]`|List of JSX element names that need to be transpiled to a string.|
