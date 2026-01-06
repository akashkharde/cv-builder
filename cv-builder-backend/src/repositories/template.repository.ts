/**
 * Template repository - Data access layer for Template model
 */

import { ITemplate, Template } from '../models/Template';
import { PaginationParams, PaginatedResponse } from '../types';
import { DEFAULT_PAGINATION } from '../utils/constants';

/**
 * Template repository class
 */
export class TemplateRepository {
  /**
   * Find template by ID
   * @param templateId - Template ID
   * @returns Template document or null
   */
  async findById(templateId: string): Promise<ITemplate | null> {
    return Template.findById(templateId).exec();
  }

  /**
   * Find all public templates with pagination
   * @param params - Pagination parameters
   * @returns Paginated templates
   */
  async findPublic(params: PaginationParams = {}): Promise<PaginatedResponse<ITemplate>> {
    const limit = Math.min(params.limit || DEFAULT_PAGINATION.LIMIT, DEFAULT_PAGINATION.MAX_LIMIT);

    const query: { isActive: boolean; public?: boolean; _id?: { $lt: string } } = {
      isActive: true,
    };

    if (params.cursor) {
      query._id = { $lt: params.cursor };
    }

    const templates = await Template.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .exec();

    const hasMore = templates.length > limit;
    const data = hasMore ? templates.slice(0, limit) : templates;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1]._id.toString() : undefined;

    return {
      data,
      nextCursor,
      hasMore,
    };
  }

  /**
   * Create a new template
   * @param templateData - Template data
   * @returns Created template document
   */
  async create(templateData: Partial<ITemplate>): Promise<ITemplate> {
    const template = new Template(templateData);
    return template.save();
  }
}

