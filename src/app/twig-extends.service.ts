import { Injectable } from '@angular/core';
import * as libPhoneNumber from 'libphonenumber-js';
import * as pluralize from 'pluralize';
import * as pixelWidth from 'string-pixel-width';
import * as Twig from 'twig/twig.min.js';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import * as numeral from 'numeral';

@Injectable({
  providedIn: 'root'
})
export class TwigExtendsService {

  constructor() { }

  twigExtendFunctions(Twig: Twig): void {
    Twig.extendFunction('covertToInternationalPhone', (phoneNumber, countryCode) => {
      return this.internationalise(phoneNumber, countryCode);
    });

    Twig.extendFunction('covertToNationalPhone', (phoneNumber, countryCode = null) => {
      return this.nationalise(phoneNumber, countryCode);
    });

    Twig.extendFunction("datelte", (date1, date2, timezone = "Australia/Sydney", date1AddSymbol = null, date1AddNumber = null, date1AddType = null) => {
      var currentMoment = null;
      var date1Moment = null;
      var date2Moment = null;

      if (date1 && (date1 == "now" || date1.includes("+") || date1.includes("Z") || date1.includes("z"))) {
        if (date1 && date1 == "now") {
          date1Moment = moment().tz(timezone);
        } else if (date1) {
          date1Moment = moment(date1).tz(timezone);
        }
      } else {
        date1Moment = moment(date1);
      }

      if (date2 && (date2 == "now" || date2.includes("+") || date2.includes("Z") || date2.includes("z"))) {
        if (date2 && date2 == "now") {
          date2Moment = moment().tz(timezone);
        } else if (date2) {
          date2Moment = moment(date2).tz(timezone);
        }
      } else {
        date2Moment = moment(date2);
      }

      if (date1Moment) {
        if (date1AddSymbol && date1AddNumber && date1AddType) {
          if (date1AddType == 'days') {
            date1AddType = 'day';
          }

          if (date1AddSymbol == '+') {
            date1Moment.add(date1AddNumber, date1AddType);
          } else if (date1AddSymbol == '-') {
            date1Moment.add(date1AddNumber, date1AddType);
          }
        }
      }

      var diff = date1Moment.diff(date2Moment, 'days')

      if (diff > 0) {
        return false;
      }
      return true;

    });

    Twig.extendFunction("datetime", (value, format, timezone = "Australia/Sydney", addSymbol = null, addNumber = null, addType = null) => {

        var currentMoment = null;

        if(value && (value == "now" || value.includes("+") || value.includes("Z") || value.includes("z"))) {
          if(value && value == "now") {
            currentMoment = moment().tz(timezone);
          } else if(value) {
            currentMoment = moment(value).tz(timezone);
          }
        } else {
          currentMoment = moment(value);
        }

        if(currentMoment) {
          if(addSymbol && addNumber && addType) {
            if(addType == 'days') {
              addType = 'day';
            }

            if(addSymbol == '+') {
              currentMoment.add(addNumber, addType);
            } else if (addSymbol == '-') {
              currentMoment.add(addNumber, addType);
            }
          }

          return currentMoment.format(format)
        }

        return '';
    });

    Twig.extendFunction("gstCalc", (excl, gst, incl) => {
      var gstCalc: {excl: any, gst: any, incl: any} = {excl: null, gst: null, incl: null};

      if (!(excl && incl) && (excl || incl) && gst) {
        if (excl) {
          gstCalc.excl = excl;
          gstCalc.gst = numeral(excl).multiply(numeral(gst).divide(100).value()).value();
          gstCalc.incl = numeral(excl).multiply(numeral(gst).divide(100).add(1).value()).value();
        } else if (incl) {
          gstCalc.excl = numeral(incl).divide(numeral(gst).divide(100).add(1).value()).value();
          gstCalc.gst = numeral(incl).divide(numeral(gst).divide(100).add(1).value()).multiply(numeral(gst).divide(100).value()).value();
          gstCalc.incl = incl;
        }
      }

      return gstCalc;
    });

    Twig.extendFunction("htmlLineBreaks", function(content) {
      var content = content.replace(/(?:\r\n|\r|\n)/g, '<br>');
      return content;
    });

    Twig.extendFunction('isPlural', (item) => {
      return pluralize.isPlural(item);
    });

    Twig.extendFunction("jsonParse", (json) => {
      try {
        return JSON.parse(json);
      } catch (e) {
        return null;
      }
    });

    Twig.extendFunction("lodashTemplate", function(template, imports = {}) {
      var compiler = _.template(template, {imports: {moment: moment, numeral: numeral, _: _}});

      return compiler(imports);
    });

    Twig.extendFunction('moment', (value = undefined, type = undefined) => moment(value, type));

    Twig.extendFunction('numeral', (value) => numeral(value));

    Twig.extendFunction("orderBy", (array, by, direction) => {
      _.forEach(array, (value) => {
        if (value[by]) {
          value[by] = value[by].trim();
        }
      });

      return _.orderBy(array, by, direction);
    });

    Twig.extendFunction('pluralise', (item, number = undefined) => {
      return pluralize(item, number);
    });

    Twig.extendFunction('pluralize', (item, number = undefined) => {
      return pluralize(item, number);
    });

    Twig.extendFunction('printAddress', (address, format = 'un/li, su ci, cu st po co', currentCountry = '') => {
      /*
        Address format codes:
          na: name
          un: unit
          li: line1
          l2: line2
          l3: line3
          l4: line4
          su: suburb
          ci: city
          cu: county
          st: state - abbrev name
          ST: state - full name
          po: postcode
          co: country - if not match currentCountry
          CO: country - always display
      */

      let states = {
        // Australian States
        'australia capital territory': 'ACT',
        'australian capital territory': 'ACT',
        'new south wales': 'NSW',
        'northern territory': 'NT',
        'queensland': 'QLD',
        'south australia': 'SA',
        'tasmania': 'TAS',
        'victoria': 'VIC',
        'western australia': 'WA',

        // American States
        'alabama': 'AL',
        'alaska': 'AK',
        'arizona': 'AZ',
        'arkansas': 'AR',
        'california': 'CA',
        'colorado': 'CO',
        'connecticut': 'CT',
        'delaware': 'DE',
        'florida': 'FL',
        'georgia': 'GA',
        'hawaii': 'HI',
        'idaho': 'ID',
        'illinois': 'IL',
        'indiana': 'IN',
        'iowa': 'IA',
        'kansas': 'KS',
        'kentucky': 'KY',
        'louisiana': 'LA',
        'maine': 'ME',
        'maryland': 'MD',
        'massachusetts': 'MA',
        'michigan': 'MI',
        'minnesota': 'MN',
        'mississippi': 'MS',
        'missouri': 'MO',
        'montana': 'MT',
        'nebraska': 'NE',
        'nevada': 'NV',
        'new hampshire': 'NH',
        'new jersey': 'NJ',
        'new mexico': 'NM',
        'new york': 'NY',
        'north carolina': 'NC',
        'north dakota': 'ND',
        'ohio': 'OH',
        'oklahoma': 'OK',
        'oregon': 'OR',
        'pennsylvania': 'PA',
        'rhode island': 'RI',
        'south carolina': 'SC',
        'south dakota': 'SD',
        'tennessee': 'TN',
        'texas': 'TX',
        'utah': 'UT',
        'vermont': 'VT',
        'virginia': 'VA',
        'washington': 'WA',
        'west virginia': 'WV',
        'wisconsin': 'WI',
        'wyoming': 'WY',
      };

      let name = '';
      let unit = '';
      let line1 = '';
      let line2 = '';
      let line3 = '';
      let line4 = '';
      let suburb = '';
      let city = '';
      let county = '';
      let state = '';
      let fullState = '';
      let postcode = '';
      let country = '';
      let fullCountry = '';

      let output = '';

      if (!format || !format.length) format = 'un/li, su ci, cu st po co';

      if (address) {
        if (Array.isArray(address) && address[0]) address = address[0];

        if (address.name) name += address.name;

        if (address.unit) unit += address.unit;

        if (address.line1) {
          line1 += address.line1;
        } else if (address.streetNo || address.streetNumber || address.streetName) {
          if (address.streetNo) {
            line1 += address.streetNo + ' ';
          } else if (address.streetNumber) {
            line1 += address.streetNumber + ' ';
          }

          if (address.streetName) {
            line1 += address.streetName;
          }

          if (address.streetType) {
            line1 += ' ' + address.streetType;
          }
        }

        if (address.line2) line2 += address.line2;

        if (address.line3) line3 += address.line3;

        if (address.line4) line4 += address.line4;

        if (address.suburb) suburb += address.suburb;

        if (address.city) city += address.city;

        if (address.county) county += address.county;

        if (address.state) {
          if (states[address.state.toLowerCase()]) {
            state += states[address.state.toLowerCase()];
          } else {
            state += address.state;
          }

          fullState = address.state;
        }

        if (address.postcode) postcode += address.postcode;

        if (address.countryQld) {
          if (address.countryQld != currentCountry) country = address.countryQld;

          fullCountry = address.countryQld;
        } else if (address.country) {
          if (address.country != currentCountry) country = address.country;

          fullCountry = address.country;
        }
      }

      if (!name) format = format.replace(/na *(?:, *)? */, '');
      if (!unit) format = format.replace(/un *\/? */, '');
      if (!line1) format = format.replace(/li *(?:, *)?/, '');
      if (!line2) format = format.replace(/l2 *(?:, *)?/, '');
      if (!line3) format = format.replace(/l3 *(?:, *)?/, '');
      if (!line4) format = format.replace(/l4 *(?:, *)?/, '');
      if (!suburb) format = format.replace(/su *(?:, *)?/, '');
      if (!city) format = format.replace(/ci *(?:, *)?/, '');
      if (!county) format = format.replace(/(?:, *)?cu *(?:, *)/, '');
      if (!state) format = format.replace(/st *(?:, *)?/, '');
      if (!fullState) format = format.replace(/ST *(?:, *)?/, '');
      if (!postcode) format = format.replace(/po *(?:, *)?/, '');
      if (!country) format = format.replace(/co *(?:, *)?/, '');
      if (!fullCountry) format = format.replace(/CO *(?:, *)?/, '');

      output = format;

      output = output.replace(/na|un|li|l2|l3|l4|su|ci|cu|st|ST|po|co|CO/g, (matched) => {
        if (matched === 'na') return name;
        if (matched === 'un') return unit;
        if (matched === 'li') return line1;
        if (matched === 'l2') return line2;
        if (matched === 'l3') return line3;
        if (matched === 'l4') return line4;
        if (matched === 'su') return suburb;
        if (matched === 'ci') return city;
        if (matched === 'cu') return county;
        if (matched === 'st') return state;
        if (matched === 'ST') return fullState;
        if (matched === 'po') return postcode;
        if (matched === 'co') return country;
        if (matched === 'CO') return fullCountry;
      });

      return output;
    });

    // Dummy function to stop error when rendering twig with qrcode
    Twig.extendFunction('qrcode', (content) => {
      return `qrcode(${content})`;
    });

    // Custom functions which are needed for VIC BDM
    Twig.extendFunction("regexMatch", function(stringToMatch, regexString) {
      var regex = new RegExp(regexString);
      return regex.exec(stringToMatch) ? true : false;
    });

    Twig.extendFunction("regexReplace", function(stringToMatch, regexString, replaceString) {
      var regex = new RegExp(regexString, 'g');
      return stringToMatch.replace(regex, replaceString);
    });

    Twig.extendFunction("sortChildren", function(children) {
      return _.orderBy(children, ['dob'], ['asc']);
    });

    Twig.extendFunction("sortSiblings", function(siblings) {
      return _.orderBy(siblings, ['dob'], ['asc']);
    });

    // This uses moment durations
    Twig.extendFunction("subtractDates", function(date1String, date2String, durationFormat) {
      var durationTime = moment.duration(moment(date1String).diff(moment(date2String)));

      durationTime = moment.duration(durationTime).get(durationFormat);

      return durationTime;
    });
    // ---------------------------------------------

    Twig.extendFunction("textWidth", (text, size = 12, bold = false, italic = false, font = 'Helvetica') => {
      if (!text) return null;

      return pixelWidth(text, {font: font, size: size, bold: bold, italic: italic});
    });

    Twig.extendFunction("timelte", function(date1, date2, timezone = "Australia/Sydney", date1AddSymbol = null, date1AddNumber = null, date1AddType = null) {
      var currentMoment = null;
      var date1Moment = null;
      var date2Moment = null;

      if (date1 && (date1 == "now" || date1.includes("+") || date1.includes("Z") || date1.includes("z"))) {
        if (date1 && date1 == "now") {
          date1Moment = moment().tz(timezone);
        } else if (date1) {
          date1Moment = moment(date1).tz(timezone);
        }
      } else {
        date1Moment = moment(date1);
      }

      if (date2 && (date2 == "now" || date2.includes("+") || date2.includes("Z") || date2.includes("z"))) {
        if (date2 && date2 == "now") {
          date2Moment = moment().tz(timezone);
        } else if (date2) {
          date2Moment = moment(date2).tz(timezone);
        }
      } else {
        date2Moment = moment(date2);
      }

      if (date1Moment) {
        if (date1AddSymbol && date1AddNumber && date1AddType) {
          if (date1AddType == 'days') {
            date1AddType = 'day';
          }

          if (date1AddSymbol == '+') {
            date1Moment.add(date1AddNumber, date1AddType);
          } else if (date1AddSymbol == '-') {
            date1Moment.add(date1AddNumber, date1AddType);
          }
        }
      }

      var diff = date1Moment.diff(date2Moment, 'seconds')

      if (diff > 0) {
        return false;
      }
      return true;
    });

    Twig.extendFunction("truncateString", function(string, length, ending = '') {
      if (string.length > length) {
        string = string.substring(0,length);
        if (ending != '') {
          string += ending;
        }
      }
      return string;
    });
  }

  nationalise(phoneNumber, countryCode) {
  if (!phoneNumber || !phoneNumber.length) {
    throw 'internationalise(): No phone number provided.';
  }

  if (countryCode && !libPhoneNumber.isSupportedCountry(countryCode)) {
    throw 'internationalise(): Country code not supported.';
  }

  try {
    const parsedPhoneNumber = libPhoneNumber.parsePhoneNumberFromString(phoneNumber, countryCode);

    if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
      let message = 'Invalid phone number provided.';

      if (!countryCode) {
        message += ' A national phone number must have a country code provided.';
      } else {
        message += ' A national phone number must have an area code.'
      }

      throw 'internationalise(): ' + message;
    }

    const nationalPhoneNumber = parsedPhoneNumber.formatNational();

    return nationalPhoneNumber;
  } catch (error) {
    throw error.message;
  }
}

internationalise(phoneNumber, countryCode) {
  if (!phoneNumber || !phoneNumber.length) {
    throw 'internationalise(): No phone number provided.';
  }

  if (!countryCode || !countryCode.length) {
    throw 'internationalise(): No country code provided.';
  } else if (!libPhoneNumber.isSupportedCountry(countryCode)) {
    throw 'internationalise(): Country code not supported.';
  }

  try {
    const parsedPhoneNumber = libPhoneNumber.parsePhoneNumberFromString(phoneNumber, countryCode);

    if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
      throw 'internationalise(): Invalid phone number provided. A national phone number must have an area code.';
    }

    const internationalPhoneNumber = parsedPhoneNumber.formatInternational();

    return internationalPhoneNumber;
  } catch (error) {
    throw error;
  }
}

}
