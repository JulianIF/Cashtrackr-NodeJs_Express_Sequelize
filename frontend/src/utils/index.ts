export function formatCurrency(amount: number)
{
    return new Intl.NumberFormat('en-US', 
    {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}

export function formatDate(isoString: string)
{
    const date = new Date(isoString)
    const formattedDate = Intl.DateTimeFormat('en-US',
    {
        day: '2-digit',
        year: 'numeric',
        month: 'long'
    }
    ).format(date)
    return formattedDate
}