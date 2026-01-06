/**
 * CV related types
 */

/**
 * Basic details structure
 */
export interface BasicDetails {
  image?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  introductoryParagraph?: string;
}

/**
 * Education entry
 */
export interface Education {
  degreeName?: string;
  institution?: string;
  percentage?: number;
  startDate?: Date;
  endDate?: Date;
  fieldOfStudy?: string;
}

/**
 * Experience entry
 */
export interface Experience {
  organizationName?: string;
  joiningLocation?: string;
  position?: string;
  ctc?: string;
  joiningDate?: Date;
  leavingDate?: Date;
  duration?: string;
  technologies?: string[];
  description?: string;
}

/**
 * Project entry
 */
export interface Project {
  projectTitle?: string;
  teamSize?: number;
  duration?: string;
  technologies?: string[];
  description?: string;
}

/**
 * Skill entry
 */
export interface Skill {
  skillName?: string;
  perfection?: number; // percentage
  category?: 'technical' | 'interpersonal';
}

/**
 * Social profile entry
 */
export interface SocialProfile {
  platformName?: string;
  profileLink?: string;
}

/**
 * CV data structure
 */
export interface CVData {
  basicDetails?: BasicDetails;
  education?: Education[];
  experience?: Experience[];
  projects?: Project[];
  skills?: Skill[];
  socialProfiles?: SocialProfile[];
}

/**
 * Create CV request
 */
export interface CreateCVRequest {
  title: string;
  layoutId: string;
  data?: CVData;
}

/**
 * Update CV request
 */
export interface UpdateCVRequest {
  title?: string;
  layoutId?: string;
  data?: CVData;
  version?: number;
}

/**
 * Autosave CV request
 */
export interface AutosaveCVRequest {
  data?: CVData;
}

