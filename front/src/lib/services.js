export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN')
}

export const calculateStoryTime = (date) => {
    const storyDate = new Date(date);
    const now = new Date();

    const diffMilliseconds = now - storyDate;
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 1) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    return `${diffHours} giờ trước`;
};
