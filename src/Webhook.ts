import { Attachment } from "./attachment.js";
import { colors } from "./color.js";
import { Component, components, IS_COMPONENTS_V2 } from "./components.js";

export class Webhook {
    /** Declarative, functional API for composing ComponentsV2. */
    static components = components;
    /** Utility functions for Discord's integer color formatting. */
    static colors = colors;
    // Internal fields and modifiers
    #url: string;
    #tts?: boolean = undefined;
    #as_user: User = {};
    #in_thread: Thread = {};
    /** @param url Discord webhook URL */
    constructor(url: string) {
        this.#url = url;
    }
    /**
     * Send the next message with a different username and/or avatar.
     * Re-returns the Webhook instance for method chaining.
     */
    as_user(username?: string, avatar_url?: string) {
        this.#as_user.username = username;
        if (avatar_url) this.#as_user.avatar_url = avatar_url;
        return this;
    }
    /**
     * Send the next message in a new thread.
     * Note: Will only work if the webhook is in a forum.
     * @param thread_name name for the new created thread
     * @param applied_tags Snowflakes for forum tags to be applied to the thread
     */
    in_thread(thread_name: string, applied_tags?: string[]) {
        this.#in_thread.thread_name = thread_name;
        if (applied_tags) this.#in_thread.applied_tags = applied_tags;
        return this;
    }
    /**
     * Enable/disable TTS for the next message.
     * Re-returns the Webhook instance for method chaining.
     */
    with_tts(tts: boolean = true) {
        this.#tts = tts;
        return this;
    }
    /**
     * Send a message with one or more content types.
     * Note that the presence of components will override any other contents.
     */
    send(contents: WebhookContents) { this.#send_raw(contents) }
    /** Send a text message. */
    send_text(content: string) { this.#send_raw({ content }) }
    /** Send a message with 1-10 rich embeds. */
    send_embed(...embeds: Embed[]) { this.#send_raw({ embeds }) }
    /**
     * Send a message with one or more ComponentsV2.
     * Use the static `Webhook.components` for a declarative functional API for constructing components.
     */
    send_components(...components: Component[]) { this.#send_raw({ components }) }
    /** Send a poll message. */
    send_poll(
        question: string,
        answers: (string | { text: string, emoji_id?: string, emoji_name?: string })[],
        duration_hours?: number,
        allow_multiselect?: boolean,
    ) {
        let poll_answers: PollAnswer[] = answers.map((answer, i) => {
            if (typeof answer == "string") return { poll_media: { text: answer } };
            let ans: PollAnswer = { poll_media: { text: answer.text } };
            if (answer.emoji_name) ans.poll_media.emoji = { name: answer.emoji_name };
            if (answer.emoji_id) ans.poll_media.emoji = { id: answer.emoji_id };
            return ans;
        })

        let poll: Poll = { question: { text: question }, answers: poll_answers };
        if (typeof duration_hours == "number") poll.duration = duration_hours;
        if (typeof allow_multiselect == "boolean") poll.allow_multiselect = allow_multiselect;

        this.#send_raw({ poll });
    }
    // Internal send function that sets the appropriate parameters and resets temporary modifiers after making the request.
    #send_raw(body: WebhookBody) {
        let url = this.#url;
        if (body.components) {
            url += "?with_components=true";
            body.flags = (body.flags ?? 0) | IS_COMPONENTS_V2;
        }
        if (typeof this.#tts == "boolean") body.tts = this.#tts;

        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...this.#as_user,
                ...this.#in_thread,
                ...body
            })
        }).then(async response => {
            if (response.status > 399) console.warn(
                "[DiscordWebhook] Webhook execution returned error code",
                response.status, await response.json()
            );
        });
        this.#as_user = this.#in_thread = {};
        this.#tts = undefined;
    }
}

type User = { username?: string, avatar_url?: string }
type Thread = { thread_name?: string, applied_tags?: string[] }

export { Component }
export type WebhookBody = WebhookContents & {
    username?: string,
    avatar_url?: string,
    tts?: boolean,
    allowed_mentions?: {},
    payload_json?: string,
    attachments?: Attachment[],
    flags?: number,
    thread_name?: string,
    applied_tags?: string[]
}
export type WebhookContents = Partial<{
    content: string,
    embeds: Embed[],
    files: File[],
    poll: Poll,
    components: Component[]
}>


// Types for poll and embed

export type Poll = {
    question: { text: string },
    answers: PollAnswer[],
    duration?: number,
    allow_multiselect?: boolean
}

export type PollAnswer = { poll_media: { text: string, emoji?: Partial<{ name: string, id: string }> } }

export type Embed = {
    title?: string,
    description?: string,
    url?: string,
    timestamp?: string, // TODO: ISO8601Timestamp type
    color?: number, // TODO: expose utility functions for this
    footer?: EmbedFooter,
    image?: EmbedMedia,
    thumbnail?: EmbedMedia,
    video?: EmbedMedia,
    provider?: EmbedProvider,
    author?: EmbedAuthor,
    fields?: EmbedField[]
}

type EmbedFooter = {
    text: string,
    icon_url?: string,
    proxy_icon_url?: string
}

type EmbedMedia = {
    url: string,
    proxy_url?: string,
    height?: number,
    width?: number,
    content_type?: number,
    placeholder?: string,
    placeholder_version?: number,
    description?: string,
    flags?: 32
}

type EmbedProvider = {
    name?: string,
    url?: string
}

type EmbedAuthor = {
    name: string,
    url?: string,
    icon_url?: string,
    proxy_icon_url?: string
}

type EmbedField = {
    name: string,
    value: string,
    inline?: boolean
}