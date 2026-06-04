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