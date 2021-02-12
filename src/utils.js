export const api = async (endpoint, appId, token, body, method = 'POST') => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Parse-Application-Id': appId || 1,
    'X-Parse-Session-Token': token || ''
  }

  const appendant = {
    method,
    mode: 'cors',
    headers,
    body
  }

  let response = await fetch(endpoint, appendant)
  return response.json()
}

export const formatMoney = (
  amount,
  decimalCount = 2,
  decimal = '.',
  thousands = ','
) => {
  try {
    decimalCount = Math.abs(decimalCount)
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount

    const negativeSign = amount < 0 ? '-' : ''

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString()
    let j = i.length > 3 ? i.length % 3 : 0

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : '')
    )
  } catch (e) {
    //console.log(e)
  }
}