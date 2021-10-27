import moment from 'moment'

export function calendarDate(date, format?) {
  return moment(date).calendar(null, {
    lastDay: '[Yesterday] hh:mm A',
    sameDay: 'hh:mm A',
    nextDay: '[Tomorrow]',
    lastWeek: 'dddd',
    nextWeek: 'dddd',
    sameElse: format ? format : 'ddd MMM DD, hh:mm A',
  })
}
