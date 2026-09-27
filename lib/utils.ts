export function formatPKRPrice(price: number): string {
  if (price >= 10000000) {
    const crore = price / 10000000
    return `PKR ${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2)} Crore`
  } else if (price >= 100000) {
    const lakh = price / 100000
    return `PKR ${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} Lakh`
  } else {
    return `PKR ${price.toLocaleString('en-PK')}`
  }
}

export function formatAreaUnit(size: number, unit: string): string {
  const formattedUnit = unit.toLowerCase() === 'marla' ? 'Marla' : unit.toLowerCase() === 'kanal' ? 'Kanal' : 'Sq. Ft.'
  return `${size} ${formattedUnit}`
}
