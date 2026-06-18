// centralisation des appels API
// l'url de l'api est dans le .env
const URL = import.meta.env.VITE_API_URL

// Lit le message d'erreur renvoyé par le serveur
const extractError = async (response, fallback) => {
    try {
        const data = await response.json();
        return data && data.message ? data.message : fallback;
    } catch {
        return fallback;
    }
};

// --- AUTH ---

export const login = async (email, password) => {
    const response = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password }),
    });
    if (!response.ok) {
        throw new Error("Email ou mot de passe incorrect");
    }
    const temp=await response.json();
    console.log(temp);
    return temp;
};

// --- CHANNEL ---

// state : "all" = tous, "owner" = mes salons, "usertarget" = ceux où je suis invité
export const getUserChannels = async (userId, page, size, state = "all") => {
    const response = await fetch(`${URL}/channels?userId=${userId}&state=${state}&page=${page}&size=${size}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    // 404 = aucun salon : on renvoie une page vide
    if (response.status === 404) {
        return { content: [], page: 0, totalPages: 0, totalElements: 0 };
    }
    if (!response.ok) {
        throw new Error("Error fetching user channels");
    }
    return await response.json();
};

export const createChannel = async (channelData) => {
    const response = await fetch(`${URL}/channels`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(channelData),
    });

    if (!response.ok) {
        throw new Error(await extractError(response, "Erreur lors de la création du salon"));
    }
    return await response.json();
};

export const updateChannel = async (idChannel, channelData) => {
    const response = await fetch(`${URL}/channels/${idChannel}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(channelData),
    });

    if (!response.ok) {
        throw new Error(await extractError(response, "Erreur lors de la modification du salon"));
    }
    return await response.json();
};

export const deleteChannel = async (idChannel) => {
    const response = await fetch(`${URL}/channels/${idChannel}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error("Error during delete channels");
    }
    return true;
};

// Retire un membre d'un salon
export const leaveChannel = async (channelId, userId) => {
    const response = await fetch(`${URL}/channels/${channelId}/members/${userId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(await extractError(response, "Erreur en quittant le salon"));
    }
    return true;
};

// --- USER ---

// excludeId : utilisateur a exclure
export const getUsers = async (excludeId) => {
    const query = excludeId != null ? `?exclude=${excludeId}` : '';
    const response = await fetch(`${URL}/users${query}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 404) {
        return [];
    }
    if (!response.ok) {
        throw new Error("Error fetching users");
    }
    return await response.json();
};

// --- INVITATION ---
// Clé compose : (idUser, idUserTarget, idChannel) = qui invite, qui est invité, dans quel salon

// Invitations reçues par un user
export const getInvitations = async (idUserTarget, page, size) => {
    const response = await fetch(`${URL}/invitations?userTarget=${idUserTarget}&page=${page}&size=${size}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 404) {
        return { content: [], page: 0, totalPages: 0, totalElements: 0 };
    }
    if (!response.ok) {
        throw new Error("Error during get invitations");
    }
    return await response.json();
};

// Invitations envoyées par un user
export const getSentInvitations = async (ownerId, page, size) => {
    const response = await fetch(`${URL}/invitations/sent?owner=${ownerId}&page=${page}&size=${size}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 404) {
        return { content: [], page: 0, totalPages: 0, totalElements: 0 };
    }
    if (!response.ok) {
        throw new Error("Error during get sent invitations");
    }
    return await response.json();
};

export const refuseInvitation = async (idUser, idUserTarget, idChannel) => {
    const response = await fetch(`${URL}/invitations/${idUser}/${idUserTarget}/${idChannel}/refuse`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error("Error during refuse invitation");
    }
    return await response.json();
};

export const getInvitation = async (idUser, idUserTarget, idChannel) => {
    const response = await fetch(`${URL}/invitations/${idUser}/${idUserTarget}/${idChannel}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error("Invitation unfind");
    }
    return await response.json();
};

export const createInvitation = async (invitationData) => {
    const response = await fetch(`${URL}/invitations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(invitationData),
    });

    if (!response.ok) {
        throw new Error("Error during create invitation");
    }
    return await response.json();
};

export const updateInvitation = async (idUser, idUserTarget, idChannel, invitationData) => {
    const response = await fetch(`${URL}/invitations/${idUser}/${idUserTarget}/${idChannel}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(invitationData),
    });

    if (!response.ok) {
        throw new Error("Error during update invitation");
    }
    return await response.json();
};

export const acceptInvitation = async (idUser, idUserTarget, idChannel) => {
    const response = await fetch(`${URL}/invitations/${idUser}/${idUserTarget}/${idChannel}/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error("Error during accept invitation");
    }
    return await response.json();
};

export const deleteInvitation = async (idUser, idUserTarget, idChannel) => {
    const response = await fetch(`${URL}/invitations/${idUser}/${idUserTarget}/${idChannel}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error("Error during delete invitation");
    }
    return true;
};
