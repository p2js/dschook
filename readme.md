Simple convenience library for type-safe interaction with discord's Webhook API.

Includes a functional API for componentsV2 objects.

## Usage

Install:

```sh
pnpm install discord-webhook # or npm, bun, ...
```

Use:

```js
import { Webhook } from "discord-webhook";
const hook = new Webhook("https://discord.com/api/webhooks/...");
```

## Currently supported

Sending regular text messages:

```js
hook.send_text("Hello!");
```

Sending ComponentsV2 (via the static `Webhook.components` and `Webhook.colors` APIs):

```js
const { container, text } = Webhook.components;
const { rgb } = Webhook.colors;

hook.send_components(
    text("Hello"),
    container(rgb(100, 0, 0), false, [
        text("I'm stuck inside a red-lined container!")
    ])
);
```

Sending polls:

```js
hook.send_poll(
    "What's your favourite color?",
    ["Red", "Orange", "Yellow", { text: "green", emoji_name: "💚" }],
    // Optional arguments: poll duration in hours and whether to allow selecting multiple options
    5, true
);
```

Sending 1-10 embed objects:

```js
hook.send_embed({
    color: Webhook.colors.rgb(100, 0, 0)
    author: { name: "github user" },
    fields: [
        { name: "foo", value: "bar" }
    ]
});
```
*(Note: While sending embeds is supported, using message components is the recommended modern approach.)*

Sending multiple content types in one message:
```js
hook.send({
    text: "foo",
    embeds: [/* ... */]
});
```

## Currently unsupported

PRs welcome!
- Uploading attachments and/or files
- Editing and deleting uploaded webhooks