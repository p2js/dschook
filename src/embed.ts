type Embed = {
    title?: string,
    type: "rich",
    description?: string,
    url?: string,
    timestamp?: string, // TODO: ISO8601Timestamp type
    color?: number, // TODO: expose utility functions for this
    footer?: EmbedFooter,
    image?: EmbedImage,
    thumbnail?: EmbedImage,
    video?: EmbedVideo,
    provider?: EmbedProvider,
    author?: EmbedAuthor,
    fields?: EmbedField[]
}

type EmbedFooter = {};
type EmbedImage = {};
type EmbedVideo = {};
type EmbedProvider = {};
type EmbedAuthor = {};
type EmbedField = {};