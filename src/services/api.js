const URL = 'http://localhost:8080/api/v1'

// AUTH

export const login = async (email, password) => {
    const response = await fetch(`${URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return await response.json();
};

// CHANNEL
export const getUserChannels = async (userId, start, end, state = "all") => {
    const response = await fetch(`${URL}/channels/user/${userId}/${start}/${end}?state=${state}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

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
        throw new Error("Error during create channel");
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
        throw new Error("Erreur lors de la mise à jour du canal");
    }
    return await response.json();
};

export const deleteChannel = async (idChannel) => {
    const response = await fetch(`${URL}/channels/${idChannel}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error("Erreur serveur lors de la suppression du canal");
    }
    return true;
};

// INVITATION

export const getInvitations = async (idUserTarget, start, end) => {
    const response = await fetch(`${URL}/invitations/userTarget/${idUserTarget}/${start}/${end}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des invitations");
    }
    return await response.json();
};

export const getInvitation = async (idUser, idUserTarget, idChannel) => {
    const response = await fetch(`${URL}/invitations/${idUser}/${idUserTarget}/${idChannel}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error("Invitation introuvable");
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
        throw new Error("Erreur lors de la création de l'invitation");
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
        throw new Error("Erreur lors de la mise à jour de l'invitation");
    }
    return await response.json();
};

export const deleteInvitation = async (idUser, idUserTarget, idChannel) => {
    const response = await fetch(`${URL}/invitations/${idUser}/${idUserTarget}/${idChannel}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'invitation");
    }
    // Pas de parsing JSON pour un code 204 No Content
    return true;
};