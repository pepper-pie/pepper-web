
export const formatMoney = (value: number) => {
    const formattedAmount = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(value || 0);
    return formattedAmount;
};


export const formattedDate = (value: string) => new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
}).replace(/\//g, "-"); // Replace slashes with dashes