/// <reference types="vite/client" />
/// <reference types="@yandex/ymaps3-types" />

declare module "*.module.scss" {
    const content: Record<string, string>;
    export default content;
}