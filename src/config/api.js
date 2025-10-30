export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL,

    TIMEOUT: 30000,

    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
    },
};

export const API_ENDPOINTS = {
    REGISTER: '/register',
    LOGIN: '/login',
    ADMIN_LOGIN: '/admin/login',
    ATENDENTE_LOGIN: '/atendente/login',

    PROFILE: '/protected/profile',

    PETS: '/protected/pets',
    PET_DETAIL: (id) => `/protected/pets/${id}`,
    PET_IMAGE: (id) => `/protected/pets/${id}/imagem`,

    AGENDAMENTOS: '/protected/agendamentos',
    AGENDAMENTO_DETAIL: (id) => `/protected/agendamentos/${id}`,
    AGENDAMENTO_CANCEL: (id) => `/protected/agendamentos/${id}/cancel`,
    HORARIOS_DISPONIVEIS: '/protected/agendamentos/horarios-disponiveis',

    HISTORICOS: '/protected/historicos',
    HISTORICOS_PET: (petId) => `/protected/historicos/pet/${petId}`,
    HISTORICOS_PET_COMPLETO: (petId) => `/protected/historicos/pet/${petId}/completo`,
    HISTORICO_DETAIL: (id) => `/protected/historicos/${id}`,

    PRODUTOS: '/protected/produtos',
    PRODUTO_DETAIL: (id) => `/protected/produtos/${id}`,
    PRODUTO_AJUSTAR_ESTOQUE: (id) => `/protected/produtos/${id}/estoque`,
    PRODUTOS_RELATORIO_ESTOQUE: '/protected/produtos/relatorio',

    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_VETERINARIOS: '/admin/veterinarios',
    ADMIN_VETERINARIO_DETAIL: (id) => `/admin/veterinarios/${id}`,
    ADMIN_CLIENTES: '/admin/clientes',
    ADMIN_CLIENTE_DETAIL: (id) => `/admin/clientes/${id}`,
    ADMIN_RELATORIO: '/admin/relatorio',

    ATENDENTE_CLIENTES: '/atendente/clientes',
    ATENDENTE_CLIENTE_DETAIL: (id) => `/atendente/clientes/${id}`,
    ATENDENTE_AGENDAMENTOS: '/atendente/agendamentos',
    ATENDENTE_AGENDAMENTO_STATUS: (id) => `/atendente/agendamentos/${id}/status`,
    ATENDENTE_VETERINARIOS: '/atendente/veterinarios',
    ATENDENTE_PRODUTOS: '/atendente/produtos',

    VETERINARIOS_PUBLIC: '/veterinarios',
    VETERINARIO_PUBLIC_DETAIL: (id) => `/veterinarios/${id}`,
};
