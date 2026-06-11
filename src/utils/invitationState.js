export const invitationStateLabel = (state) => {
    if (state === true) return 'Acceptée';
    if (state === false) return 'Refusée';
    return 'En attente';
};
