import { Injectable } from '@angular/core';
import * as Twig from 'twig/twig.min.js';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import * as numeral from 'numeral';

@Injectable({
  providedIn: 'root'
})
export class TwigService {

  private Twig: Twig = Twig;

  constructor() {
    this.twigExtendFunctions(this.Twig);
  }

  render(template: string): string {
    try {
      var twigTemplate = this.Twig.twig({
        data: template,
        rethrow: true
      });

      return twigTemplate.render();
    } catch (e) {
      return e;
    }
  }

  twigExtendFunctions(Twig: Twig): void {
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

    Twig.extendFunction("orderBy", (array, by, direction) => {
      _.forEach(array, (value) => {
        if (value[by]) {
          value[by] = value[by].trim();
        }
      });

      return _.orderBy(array, by, direction);
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

    Twig.extendFunction("htmlLineBreaks", function(content) {
    	var content = content.replace(/(?:\r\n|\r|\n)/g, '<br>');
    	return content;
    });

    Twig.extendFunction("lodashTemplate", function(template) {
      var compiled = _.template(template);

      return compiled({numeral: numeral, moment: moment, _: _});
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

    Twig.extendFunction("truncateString", function(string, length, ending = '') {
      if (string.length > length) {
        string = string.substring(0,length);
        if (ending != '') {
          string += ending;
        }
      }
      return string;
    });

    // This uses moment durations
    Twig.extendFunction("subtractDates", function(date1String, date2String, durationFormat) {
      var durationTime = moment.duration(moment(date1String).diff(moment(date2String)));

      durationTime = moment.duration(durationTime).get(durationFormat);

      return durationTime;
    });
    // ---------------------------------------------
  }

}
