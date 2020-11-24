import countries from './countries.json'
import _uniqBy from 'lodash/unionBy'
import { isSameWeek, isSameMonth, isToday, isSameYear, format as formatDate } from 'date-fns'
import _upperFirst from 'lodash/upperFirst'

const helper = {
  formatConversationTime(timestamp) {
    const datetime = new Date(timestamp)

    let fm = 'P'
    if (isToday(datetime)) {
      fm = 'p'
    } else if (isSameWeek(datetime, new Date())) {
      fm = 'eee'
    } else if (isSameMonth(datetime, new Date())) {
      fm = 'LLL dd'
    } else if (isSameYear(datetime, new Date())) {
      fm = 'LLL dd'
    }
    return formatDate(datetime, fm)
  },

  getCountries() {
    // https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;callingCodes;capital;timezones;currencies;flag
    return countries
  },

  getCountryByCode(code) {
    return countries.find((item) => item.alpha2Code == code)
  },

  uniqBy(obj, callback) {
    return _uniqBy(obj, callback)
  },

  upperFirst(string) {
    return _upperFirst(string)
  },
}

export default helper
