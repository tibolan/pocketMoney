export default function toCurrency (value, currency = "€") {
    return (parseFloat(value).toFixed(2)).replace('.', ',') + currency
}
