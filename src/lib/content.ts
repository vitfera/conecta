import { getCollection, type CollectionKey } from 'astro:content';
import { isPublishable } from './publication';

export async function getPublished<C extends CollectionKey>(collection: C) {
  return getCollection(collection, ({ data }) => isPublishable(data));
}
