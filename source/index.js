function source({ src, options }) {
  if (
    this.type === 'd' &&
    typeof options === 'string' &&
    typeof src[options] === 'string'
  ) {
    return parseDate(src[options])
  }
  throw new Error('Invalid type or data')
}

const months = {
  января: '01',
  февраля: '02',
  марта: '03',
  апреля: '04',
  мая: '05',
  июня: '06',
  июля: '07',
  августа: '08',
  сентября: '09',
  октября: '10',
  ноября: '11',
  декабря: '12',
  'янв.': '01',
  'фев.': '02',
  'мар.': '03',
  'апр.': '04',
  'май.': '05',
  'июн.': '06',
  'июл.': '07',
  'авг.': '08',
  'сен.': '09',
  'окт.': '10',
  'ноя.': '11',
  'дек.': '12'
}

function parseDate(dateString) {
  let utc = null

  dateString = dateString.replace(
    /www\.ru|;|\sгода|\sчасов|в\s|г\.|\s*\(по\s+[а-яё]+ому времени\)|[«»"]/g,
    ''
  )

  const monthMatch = dateString.match(
    /(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря|янв.|фев.|мар.|апр.|май.|июн.|июл.|авг.|сен.|окт.|ноя.|дек.)/
  )

  if (monthMatch) {
    const month = monthMatch[0]
    const monthNumber = months[month]
    dateString = dateString.replace(` ${month} `, `.${monthNumber}.`)
  }

  dateString = dateString.replace(
    /(\d{1,2})[./-](\d{1,2})[./-](\d{4})/,
    '$3-$2-$1'
  )

  dateString = dateString.replace(/(\d{4})[.](\d{1,2})[.](\d{1,2})/, '$1-$2-$3')

  if (dateString.endsWith('.')) {
    dateString = dateString.slice(0, -1)
  }

  dateString = dateString
    .split(' ')
    .filter(Boolean)
    .map((part) => {
      if (!part.includes('-')) return part
      return part
        .split('-')
        .map((subPart) =>
          subPart.length === 4 ? subPart : subPart.padStart(2, '0')
        )
        .join('-')
    })
    .join(' ')

  if (dateString.includes('+')) {
    utc = dateString.split('+')[1]
    dateString = dateString.split('+')[0]
  }

  if (!dateString.includes('T')) {
    const date = dateString.split(' ')
    dateString = date[0]
    dateString += date[1] ? `T${date[1]}` : 'T00:00:00'
  }

  if (!dateString.includes('Z')) {
    dateString += 'Z'
  }

  const parsedDate = new Date(dateString).toISOString()

  return utc ? parsedDate.replace('Z', `+${utc}`) : parsedDate
}

module.exports = source
