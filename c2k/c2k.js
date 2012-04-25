/**
 * @author kairos
 */
var C2K = {};

(function() {
	var INVALID_MSG = "잘못된 크론식";
	
	var SECOND = 0;
	var MINUTE = 1;
	var HOUR = 2;
	var DAY_OF_MONTH = 3;
	var MONTH = 4;
	var DAY_OF_WEEK = 5;
	var YEAR = 6;
	
	var ORDER = [MONTH, DAY_OF_MONTH, DAY_OF_WEEK, HOUR, MINUTE, SECOND];
	var UNIT = ["초", "분", "시", "일", "월", "", "년"];
	var UNIT_LIMIT = [59, 59, 23, 31, 12, 7, 2099];
	var MONTH_MAP = {JAN:1,FEB:2,MAR:3,APR:4,MAY:5,JUN:6,JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12};
	var DAY_MAP = {SUN:"일요일",MON:"월요일",TUE:"화요일",WED:"수요일",THU:"목요일",FRI:"금요일",SAT:"토요일",1:"일요일",2:"월요일",3:"화요일",4:"수요일",5:"목요일",6:"금요일",7:"토요일"};
	var NTH_MAP = {1:"첫번째",2:"두번째",3:"세번째",4:"네번째",5:"다섯번째"};
	
	function getKor(token, type) {
        if ("*" == token) {
            if (type == DAY_OF_WEEK) {
                return "매" + UNIT[DAY_OF_MONTH] + " ";
            } else {
                return "매" + UNIT[type] + " ";
            }
        }
        
        if ("?" == token) {
            return "";
        }
        
        if (type == MONTH) {
            token = token.replace(/[A-Z]{3}/gi, function(matchStr) {
                return MONTH_MAP[matchStr];
            });
        } else if (type == DAY_OF_MONTH) {
            token = token.replace("LW", "마지막 평");
            token = token.replace(/[1-9]{1,2}W/gi, function(matchStr) {
                return matchStr.substring(0, matchStr.length-1) + "일에서 가장 가까운 평";
            });
            token = token.replace("L", "마지막");
        } else if (type == DAY_OF_WEEK) {
            token = token.replace(/[A-Z]{3}/gi, function(matchStr) {
                return DAY_MAP[matchStr];
            });
            token = token.replace(/([1-7])L/gi, function(matchStr) {
                return "마지막 " + DAY_MAP[matchStr[0]];
            });
            token = token.replace(/[1-7]#[1-5]/g, function(matchStr) {
                return NTH_MAP[matchStr[2]] + " " + DAY_MAP[matchStr[0]];
            });
            token = token.replace(/[1-7]/g, function(matchStr) {
                return DAY_MAP[matchStr];
            });
        }
        
        token = token.replace(/(\d+)\/(\d+)/g, function(matchStr) {
            var start = Number(matchStr[0]);
            var incFlag = Number(matchStr[2]);
            var incStr = [];
            while(start <= UNIT_LIMIT[type] && incStr.length < 4) {
                incStr.push(start);
                start += incFlag;
            }
            if (start <= UNIT_LIMIT[type]) {
                incStr.push("…");
            }
            
            return incStr.join(",");
        });
        
        return token + UNIT[type] + " ";
    }
    
	function toKorean(cronExpr) {
		var exprArr = cronExpr.split(/[ \t]/);
	
		if (exprArr.length < YEAR || exprArr.length > YEAR+1) {
			return INVALID_MSG;
		}
		if ("?" != exprArr[DAY_OF_MONTH] && "?" != exprArr[DAY_OF_WEEK]) {
			return INVALID_MSG;
		}
		
		var resultArr = [];
		
		if (exprArr.length == YEAR+1 && exprArr[YEAR].indexOf("*") == -1) {
			resultArr.push(getKor(exprArr[YEAR], YEAR));
		}
		
		var startOrder = 0;
		
		if (exprArr[MONTH].indexOf("*") != -1 && ((exprArr[DAY_OF_MONTH] == "*" && exprArr[DAY_OF_WEEK] == "?") || (exprArr[DAY_OF_MONTH] == "?" && exprArr[DAY_OF_WEEK] == "*"))) {
			startOrder++;
			
			if (exprArr[HOUR].indexOf("*") != -1) {
				startOrder += 2;
				
				if (exprArr[MINUTE].indexOf("*") != -1) {
					startOrder++;
					
					if (exprArr[SECOND].indexOf("*") != -1) {
						startOrder++;
					}
				}
			}
		}
		
		for (startOrder; startOrder < ORDER.length; startOrder++) {
			resultArr.push(getKor(exprArr[ORDER[startOrder]], ORDER[startOrder]));
		}
			
		return resultArr.join("").trim();
	}
	
	C2K.toKorean = toKorean;
})();
