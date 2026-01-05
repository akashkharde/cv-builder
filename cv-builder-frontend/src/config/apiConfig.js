
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `/auth/register`,
    LOGIN: `/auth/login`,
    LOGOUT: `/auth/logout`,
  },

  USERS: {
    PROFILE: `/users/me`,
    ME: `/users/me`,

  },

  CVS: {
    LIST: `/cvs`,
    CREATE: `/cvs`,
    UPDATE: (id) => `/cvs/${id}`,
    DELETE: (id) => `/cvs/${id}`,
  },

  TEMPLATES: {
    LIST: `/templates`,
  },

  PAYMENTS: {
    CREATE_INTENT: `/payments/create-intent`,
  },
};
