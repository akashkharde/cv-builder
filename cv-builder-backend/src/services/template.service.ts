/**
 * Template service - Business logic for template operations
 */

import { ITemplate } from '../models/Template';
import { TemplateRepository } from '../repositories/template.repository';
import { NotFoundError } from '../utils/errors';
import { PaginationParams, PaginatedResponse } from '../types';

const templateRepository = new TemplateRepository();

/**
 * Template service class
 */
export class TemplateService {
  /**
   * Get all public templates with pagination
   * @param params - Pagination parameters
   * @returns Paginated templates
   */
  async getTemplates(params: PaginationParams): Promise<PaginatedResponse<ITemplate>> {
    return templateRepository.findPublic(params);
  }

  /**
   * Get template by ID
   * @param templateId - Template ID
   * @returns Template document
   */
  async getTemplateById(templateId: string): Promise<ITemplate> {
    const template = await templateRepository.findById(templateId);
    if (!template) {
      throw new NotFoundError('Template');
    }
    return template;
  }
}

