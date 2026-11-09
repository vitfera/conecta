export interface Publication {
  publish?: boolean;
  publicationStatus?: string;
  reviewedAt?: Date;
}

/** A revisão é uma decisão explícita; ausência de campos nunca libera conteúdo. */
export function isPublishable(data: Publication, now = new Date()): boolean {
  return data.publish === true
    && data.publicationStatus === 'aprovado'
    && data.reviewedAt instanceof Date
    && Number.isFinite(data.reviewedAt.getTime())
    && data.reviewedAt.getTime() <= now.getTime();
}
