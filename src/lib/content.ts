import { getCollection, type CollectionKey } from 'astro:content';
import { isPublishable } from './publication';
import { sortProducts } from './products';

export async function getPublished<C extends CollectionKey>(collection: C) {
  return getCollection(collection, ({ data }) => isPublishable(data));
}

export async function getPublishedProducts() {
  return sortProducts(await getPublished('products'));
}
