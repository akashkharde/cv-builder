/**
 * CV validation schemas
 */

import Joi from 'joi';

/**
 * Basic details validation schema
 */
const basicDetailsSchema = Joi.object({
  image: Joi.string().uri().optional().allow(''),
  name: Joi.string().max(100).optional().allow(''),
  email: Joi.string().email().optional().allow(''),
  phone: Joi.string().optional().allow(''),
  address: Joi.string().max(200).optional().allow(''),
  city: Joi.string().max(50).optional().allow(''),
  state: Joi.string().max(50).optional().allow(''),
  pincode: Joi.string().max(10).optional().allow(''),
  introductoryParagraph: Joi.string().max(1000).optional().allow(''),
});

/**
 * Education entry validation schema
 */
const educationEntrySchema = Joi.object({
  degreeName: Joi.string().max(100).optional().allow(''),
  institution: Joi.string().max(200).optional().allow(''),
  percentage: Joi.number().min(0).max(100).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  fieldOfStudy: Joi.string().max(100).optional().allow(''),
});

/**
 * Experience entry validation schema
 */
const experienceEntrySchema = Joi.object({
  organizationName: Joi.string().max(200).optional().allow(''),
  joiningLocation: Joi.string().max(100).optional().allow(''),
  position: Joi.string().max(100).optional().allow(''),
  ctc: Joi.string().max(50).optional().allow(''),
  joiningDate: Joi.date().optional(),
  leavingDate: Joi.date().optional(),
  duration: Joi.string().max(50).optional().allow(''),
  technologies: Joi.array().items(Joi.string()).optional(),
  description: Joi.string().max(1000).optional().allow(''),
});

/**
 * Project entry validation schema
 */
const projectEntrySchema = Joi.object({
  projectTitle: Joi.string().max(200).optional().allow(''),
  teamSize: Joi.number().min(1).optional(),
  duration: Joi.string().max(50).optional().allow(''),
  technologies: Joi.array().items(Joi.string()).optional(),
  description: Joi.string().max(2000).optional().allow(''),
});

/**
 * Skill entry validation schema
 */
const skillEntrySchema = Joi.object({
  skillName: Joi.string().max(100).optional().allow(''),
  perfection: Joi.number().min(0).max(100).optional(),
  category: Joi.string().valid('technical', 'interpersonal').optional(),
});

/**
 * Social profile entry validation schema
 */
const socialProfileEntrySchema = Joi.object({
  platformName: Joi.string().max(50).optional().allow(''),
  profileLink: Joi.string().uri().optional().allow(''),
});

/**
 * CV data validation schema
 */
export const cvDataSchema = Joi.object({
  basicDetails: basicDetailsSchema.optional(),
  education: Joi.array().items(educationEntrySchema).optional(),
  experience: Joi.array().items(experienceEntrySchema).optional(),
  projects: Joi.array().items(projectEntrySchema).optional(),
  skills: Joi.array().items(skillEntrySchema).optional(),
  socialProfiles: Joi.array().items(socialProfileEntrySchema).optional(),
});

/**
 * Create CV validation schema
 */
export const createCVSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  layoutId: Joi.string().hex().length(24).required(),
  data: cvDataSchema.optional(),
});

/**
 * Update CV validation schema
 */
export const updateCVSchema = Joi.object({
  title: Joi.string().min(1).max(100).optional(),
  layoutId: Joi.string().hex().length(24).optional(),
  data: cvDataSchema.optional(),
  version: Joi.number().optional(),
});

/**
 * Autosave CV validation schema
 */
export const autosaveCVSchema = Joi.object({
  data: cvDataSchema.optional(),
});

