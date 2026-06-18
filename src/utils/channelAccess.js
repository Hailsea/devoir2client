export const getChannelAccess = (channel) => {
    const now = new Date();
    const start = new Date(channel.startChannel);
    const end = new Date(channel.endChannel);

    if (now < start)
        return {
            open: false,
            status: 'upcoming',
            label: 'À venir'
        };
    if (now > end)
        return {
            open: false,
            status: 'closed',
            label: 'Terminé'
        };
    return {
        open: true,
        status: 'open',
        label: 'Ouvert'
    };
};
