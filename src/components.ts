export const IS_COMPONENTS_V2 = 1 << 15;

export type Component = Section | TextDisplay | Thumbnail | MediaGallery | File | Separator | Container;

type Section = { type: 9, components: Component[] }
type TextDisplay = { type: 10, content: string }
type Thumbnail = { type: 11, media: UnfurledMediaItem, description?: string, spoiler?: boolean }
type MediaGallery = { type: 12, items: MediaGalleryItem[] }
type File = { type: 13, file: UnfurledMediaItem, spoiler?: boolean }
type Separator = { type: 14, divider?: boolean, spacing?: 1 | 2 }
type Container = { type: 17, components: ContainerChild[], accent_color?: number, spoiler?: boolean }

type UnfurledMediaItem = { url: string };
type MediaGalleryItem = { media: UnfurledMediaItem, description?: string, spoiler?: boolean }
type ContainerChild = Section | TextDisplay | MediaGallery | Separator | File;

export const components = {
    section: (components: Component[]): Section => ({ type: 9, components }),
    text: (content: string): TextDisplay => ({ type: 10, content }),
    thumbnail: (url: string, description?: string, spoiler?: boolean) => {
        let thumbnail: Thumbnail = { type: 11, media: { url } };
        if (description) thumbnail.description = description;
        if (typeof spoiler == "boolean") thumbnail.spoiler = spoiler;
        return thumbnail;
    },
    media: (url: string, description?: string, spoiler?: boolean): MediaGalleryItem => {
        let item: MediaGalleryItem = { media: { url } };
        if (description) item.description = description;
        if (typeof spoiler == "boolean") item.spoiler = spoiler;
        return item;
    },
    media_gallery: (...items: MediaGalleryItem[]): MediaGallery => ({ type: 12, items }),
    file: (url: string, spoiler?: boolean) => {
        let file: File = { type: 13, file: { url } };
        if (typeof spoiler == "boolean") file.spoiler = spoiler;
        return file;
    },
    separator: (divider?: boolean, spacing?: 1 | 2): Separator => {
        let separator: Separator = { type: 14 }
        if (divider) separator.divider = divider;
        if (spacing) separator.spacing = spacing;
        return separator;
    },
    container: (accent_color?: number, spoiler?: boolean, ...components: ContainerChild[]): Container => {
        let container: Container = { type: 17, components };
        if (typeof accent_color == "number") container.accent_color = accent_color;
        if (typeof spoiler == "boolean") container.spoiler = spoiler;
        return container;
    }
}