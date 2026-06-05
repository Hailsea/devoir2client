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
    console.log(channelData);
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
        throw new Error("Error during update channel");
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

// INVITATION

export const getInvitations = async (idUserTarget, start, end) => {
    const response = await fetch(`${URL}/invitations/userTarget/${idUserTarget}/${start}/${end}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error("Error during get invitations");
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

export const deleteInvitation = async (idUser, idUserTarget, idChannel) => {
    const response = await fetch(`${URL}/invitations/${idUser}/${idUserTarget}/${idChannel}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error("Error during delete invitation");
    }
    return true;
};