/**
 * @fileOverview ADA项目JS采集
 * @author <a href="mailto:gaoyingjian@chinamobile.com">高英健</a>
 * @rewrite <a href="mailto:syzx9801@163.com">钱锟</a>
 * @version 2.0
 */
if(typeof setting == 'undefined') {
	setting = {
		url: [
			'http://183.131.26.200:8081/JSProbeService/accept'
		],
		type:"1"
	};
}
(function(window) {
	if(typeof setting == 'undefined' || !setting.url) return;
	var TRUE = true, FALSE = false, NULL = null;
	var appId = getAppId();
	if(!window.ada_appList) {
		window.ada_appList = {};
		window.ada_appList[appId] = 1;
	} else if(window.ada_appList[appId]) {
		return;
	} else {
		window.ada_appList[appId] = 1;
	}
//	var domain = getDomain(.location.hostname);
	var domain = getDomain(document.location.hostname);
	var cookie = {
		ok: navigator.cookieEnabled,	//true
		pre: '_ada_',  //Cookie前缀
		domain: domain, //域名
		//age: 630720000000, //访问者Cookie生存期（20年）
		t30: 1800000  //Session Cookie生存期（30分）
	};
	var referrer = getRefer().replace(/&/g,"|");
	var ec = new Evercookie();
	var pageInfo = {"999":{},"998":{"997":[]}};
	var pageInfoNow = {'66':[],'67':[]};
	var sendUrl = '';
	var ada_sid = '';
	var pageId = createUUID();
	var autoPageview = TRUE;
	var apiEnable = TRUE;
	

	//以下精准营销使用
	// 需要配置的变量
	
	var adEnable = window.CMCC_HY_DSP ? FALSE : TRUE;
	var cmcc = {
		adNum: 0,
		registed: {
			pageId: '',
			channelId: '',
			fieldTemplateId: '',
			fieldId: '',
			clientType: 'web',
			callback: 'CMCC_HY_DSP.ad'
		}, regist: function(pageId, channelId, fieldTemplateId, fieldId) {
			var registed = this.registed;
			registed.pageId = pageId;
			registed.channelId = channelId;
			registed.fieldTemplateId += fieldTemplateId + ',';
			registed.fieldId += fieldId + ',';
			this.adNum ++;
			window.getElementById(idPrefix + fieldId).parentNode.style.background = '#fff url(' + placeholder + ') no-repeat center center';
		},
		ad: function(data) {
			try {
				var ads, e;
				if(typeof data == 'object' && data.successSign) {
					ads = data.map;
					for(var id in ads) {
						e = document.getElementById(idPrefix + id).parentNode;
						e.style.background = 'none';
						e.innerHTML = ads[id];
					}
				}
			} catch(e) {}
		}
	};
	window.CMCC_HY_DSP = cmcc;
	//以上精准营销使用

	/**
	 * 事件绑定
	 * @param {HTMLElement} element 绑定到的元素
	 * @param {String} type 事件类型
	 * @param {Function} handler 运行函数
	 */
	function addEventHandler(element, type, handler) {
		if(element.addEventListener) {
			element.addEventListener(type, handler, FALSE);
		} else if(element.attachEvent) {
			element.attachEvent('on' + type, handler);
		} else {
			element['on' + type] = handler;
		}
	}
	/**
	 * 获取事件对象
	 * @param {Event} event 事件对象
	 * @return {Event}
	 */
	function getEvent(event) {
		return event ? event : window.event;
	}

	/**
	 * 获取事件元素
	 * @param {Event} event 事件对象
	 * @return {HTMLElement}
	 */
	function getEventTarget(event) {
		return event.target ? event.target : event.srcElement;
	}


	/**
	 * 获取DOM节点属性
	 * @param {HTMLElement} node 要查找的节点
	 * @param {Function} attr 属性名
	 * @return {String}
	 */
	function getAttribute(node, attr) {
		return node.getAttribute ? node.getAttribute(attr) : '';
	}

	/**
	 * 生成UUID（27位简化版）
	 * @return {String}
	 */
	function createUUID() {
		return getIntegerBits(+new Date, 0, 11)
		+ getIntegerBits(rand(8191), 0, 2) + getIntegerBits(rand(8191), 2, 4)
		+ getIntegerBits(rand(8191), 0, 2) + getIntegerBits(rand(8191), 2, 4)
		+ getIntegerBits(rand(8191), 2, 4);
	}

	/**
	 * 16进制转换
	 * @param {Number} val 原数值
	 * @param {Number} start 转换后截取起始位置
	 * @param {Number} end 转换后截取结束位置
	 * @return {String}
	 */
	function getIntegerBits(val, start, end) {
		var base16 = val.toString(16).toUpperCase();
		var quadString = '';
		var i;
		for(i = start; i <= end; i++) {
			quadString += base16.charAt(i) || '0';
		}
		return quadString;
	}

	/**
	 * 生成随机数
	 * @param {Number} max 随机数最大值
	 * @return {Number}
	 */
	function rand(max) {
		return Math.floor(Math.random() * max);
	}

	/**
	 * 返回主域名
	 * @param {String} url 要匹配的URL
	 * @returns {String}
	 */
	function getDomain(url) {
		var hostName = url.match(/\:\/\/(.+?)\//);
		url = hostName ? hostName[1] : url;
		var domainName = url.match(/([\w-]+)?\.(biz|cc|cn|co|com|edu|gov|info|me|name|net|org|so|tv)(\.(cn|hk|uk|jp|tw))?$/);
		return domainName ? domainName[0] : url;
	}
	/**
	 * 返回搜索引擎
	 * @param {String} url 要匹配的URL
	 * @returns {String}
	 */
	function searchEngine(_url){
		var engine;
		if(!_url) return;
		if(_url.indexOf('baidu')!=-1){
			engine = 'baidu'
		}else if(_url.indexOf('soso')!=-1){
			engine = 'soso'
		}else if(_url.indexOf('google')!=-1){
			engine = 'google'
		}else if(_url.indexOf('so')!=-1){
			engine = '360'
		}else if(_url.indexOf('bing')!=-1){
			engine = 'bing'
		}
		return engine;
	}
	/**
	 * 返回搜索词
	 * @param {String} url 要匹配的URL
	 * @returns {String}
	 * 待完善
	 */
	function searchWord(_url){
		var word = '';
		if(!_url) return;
		return word;
	}
	/**
	 * 返回来源参数
	 * @param {String} url 要匹配的URL
	 * @returns {String}
	 */
	function GetRequest(url,type){
		var urlArray = url.split('?');
		if(type=='1'){
			var urlString = urlArray[0];
		}else if(type=='2'){
			var urlString = urlArray[1]||'';
		}
		return urlString;   
	}
	/**
	 * 返回来源页
	 * @returns {String}
	 */
	function getRefer() {
		var refer = getCookie('refer');
		if(window.performance && performance.navigation) {
			switch(performance.navigation.type) {
				case 1:
					refer = location.href;
					break;
				case 2:
					refer = refer || document.referrer;
					break;
				default:
					refer = document.referrer;
			}
		} else {
			refer = refer || document.referrer;
		}
		return refer;
	}

	/**
	 * 初始化Cookie
	 */
	function initCookie() {
		// 访客永久标识
		// puid 为访客永久标识
		var puid = ec.get(cookie.pre + 'kp'),
			firstEntry = ec.get(cookie.pre + 'kt');
		if(!puid || !firstEntry) {
			puid = createUUID();
			firstEntry = dateFormat();
			ec.set(cookie.pre + 'kp', puid);
			ec.set(cookie.pre + 'kt', firstEntry);
			pageInfo["999"]["105"] = 1;
		} else {
			pageInfo["999"]["105"] = 0;
		}
		// 计算上次会话间隔时间和检查会话ID
		var sid = getCookie('ki') && getCookie('ki30'),
			leaveDuring = getCookie('kl'),
			lastVisitTime = ec.get(cookie.pre + 'lvt'),
			loadDate = dateFormat();
		if(!lastVisitTime) {
			lastVisitTime = +new Date;
			ec.set(cookie.pre + 'lvt', lastVisitTime);
		}
		var referrerDomain = getDomain(referrer);
		if(!sid || referrerDomain != domain) {
			sid = createUUID();
			leaveDuring = +new Date - lastVisitTime;
			setCookie('kl', leaveDuring);
			setCookie('ki', sid);
			pageInfo["999"]["105"] = 1;	//新访客
		} else {
			pageInfo["999"]["105"] = 0;
		}
		setCookie('ki30', sid, cookie.t30);
		pageInfo["999"]["104"] = puid;			//访客永久标识
		pageInfoNow['51'] = firstEntry;			
		pageInfoNow['52'] = leaveDuring;
		pageInfoNow['53'] = sid;
		pageInfoNow['58'] = GetRequest(location.href,1);
		pageInfoNow['59'] = GetRequest(location.href,2).replace(/&/g,"|")||GetRequest(location.href,2);
		pageInfoNow['54'] = referrer;
		pageInfoNow['55'] = GetRequest(referrer,1);
		pageInfoNow['56'] = GetRequest(referrer,2);
		pageInfoNow['60'] = loadDate;
		pageInfoNow['63'] = searchEngine(referrer);
		pageInfoNow['64'] = searchWord(referrer);
		pageInfo["999"]["102"] = sid;
		
	}

	/**
	 * 获取Cookie值
	 * @param {String} name Cookie名
	 * @return {String|Number}
	 */
	function getCookie(name) {
		if(!cookie.ok) {
			return '';
		}
		var b = RegExp('(^| )' + cookie.pre + name + '=([^;]*)(;|$)').exec(document.cookie);
		return b ? decodeURI(b[2]) : '';
	}

	/**
	 * 设置Cookie值
	 * @param {String} name Cookie的名称
	 * @param {String|Number} value Cookie的值
	 * @param {Number|Date} [expires] Cookie的有效期
	 * @param {String} [path] Cookie的服务器路径
	 */
	function setCookie(name, value, expires, path) {
		if(!cookie.ok) {
			return;
		}
		if(expires) {
			if(expires instanceof Date) {

			} else {
				expires = new Date(+new Date + expires);
			}
		}
		document.cookie = cookie.pre + name + '=' + value + '; domain=' + cookie.domain + '; path=' + (path ? path : '/') + (expires ? '; expires=' + expires.toGMTString() : '');
	}
	
	/**
	 * 刷新SessionId
	 */
	/*function refreshSession() {
		var sid = getCookie('ki30');
		if(!sid) {
			ec.set(cookie.pre + 'lvt', +new Date - cookie.t30);
			initCookie();
			pageInfo["19"]["110"] = createUUID();
			pageInfo["19"]["114"] = (navigator.cookieEnabled ? 1 : 0);
			pageInfo["19"]["115"] = dateFormat();
			pageInfo["19"]["117"] = location.href;
			sendPackage('0', pageInfo);
			console.log(sendPackage);
		} else {
			setCookie('ki30', sid, cookie.t30);
		}
	}*/

	/**
	 * evercookie 0.4 (10/13/2010) -- extremely persistent cookies
	 * by samy kamkar : code@samy.pl : http://samy.pl
	 *
	 * @class Evercookie
	 */
	function Evercookie() {
		// private property
		var self = this;
		this._ec = {};

		this.get = function(name, dont_reset) {
			return self._evercookie(name, undefined, dont_reset);
		};

		this.set = function(name, value) {
			self._evercookie(name, value);
		};

		this._evercookie = function(name, value, dont_reset) {
			if(self._evercookie === undefined) {
				self = this;
			}

			self._ec.userData = self.evercookie_userdata(name, value);
			self._ec.cookieData = self.evercookie_cookie(name, value);
			self._ec.localData = self.evercookie_local_storage(name, value);
			self._ec.sessionData = self.evercookie_session_storage(name, value);
			self._ec.windowData = self.evercookie_window(name, value);

			// reading data
			if(value === undefined) {
				var tmpec = self._ec, candidates = [], bestnum = 0, candidate, item;
				self._ec = {};

				// figure out which is the best candidate
				for(item in tmpec) {
					if(tmpec[item] && tmpec[item] !== 'null' && tmpec[item] !== 'undefined') {
						candidates[tmpec[item]] = candidates[tmpec[item]] === undefined ? 1 : candidates[tmpec[item]] + 1;
					}
				}

				for(item in candidates) {
					if(candidates[item] > bestnum) {
						bestnum = candidates[item];
						candidate = item;
					}
				}

				// reset cookie everywhere
				if(candidate !== undefined && (dont_reset === undefined || dont_reset !== 1)) {
					self.set(name, candidate);
				}

				return candidate;
			}
		};

		this.evercookie_window = function(name, value) {
			try {
				if(value !== undefined) {
					var str = window.name;
					if(str.indexOf('&' + name + '=') > -1 || str.indexOf(name + '=') === 0) {
						// find start
						var idx = str.indexOf('&' + name + '='), end, newstr;
						if(idx === -1) {
							idx = str.indexOf(name + '=');
						}
						// find end
						end = str.indexOf('&', idx + 1);
						if(end !== -1) {
							newstr = str.substr(0, idx) + str.substr(end + (idx ? 0 : 1)) + '&' + name + '=' + value;
						} else {
							newstr = str.substr(0, idx) + '&' + name + '=' + value;
						}
						window.name = newstr;
					} else {
						window.name = str + '&' + name + '=' + value;
					}
				} else {
					return this.getFromStr(name, window.name);
				}
			} catch(e) {
			}
		};

		this.evercookie_userdata = function(name, value) {
			try {
				var elm = this.createElem('div', 'userdata_el', 1);
				elm.style.behavior = 'url(#default#userData)';

				if(value !== undefined) {
					elm.setAttribute(name, value);
					elm.save(name);
				} else {
					elm.load(name);
					return elm.getAttribute(name);
				}
			} catch(e) {
			}
		};

		this.evercookie_local_storage = function(name, value) {
			try {
				if(window.sessionStorage) {
					if(value !== undefined) {
						window.sessionStorage.setItem(name, value);
					} else {
						return window.sessionStorage.getItem(name);
					}
				}
			} catch(e) {
			}
		};

		this.evercookie_session_storage = function(name, value) {
			try {
				if(window.sessionStorage) {
					if(value !== undefined) {
						window.sessionStorage.setItem(name, value);
					} else {
						return window.sessionStorage.getItem(name);
					}
				}
			} catch(e) {
			}
		};

		this.createElem = function(type, name, append) {
			var el;
			if(name !== undefined && document.getElementById(name)) {
				el = document.getElementById(name);
			} else {
				el = document.createElement(type);
			}
			el.style.visibility = 'hidden';
			el.style.position = 'absolute';

			if(name) {
				el.setAttribute('id', name);
			}

			if(append) {
				document.body.appendChild(el);
			}
			return el;
		};

		this.evercookie_cookie = function(name, value) {
			if(value !== undefined) {
				// expire the cookie first
				document.cookie = name + '=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/; domain=' + cookie.domain;
				document.cookie = name + '=' + value + '; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/; domain=' + cookie.domain;
			} else {
				return this.getFromStr(name, document.cookie);
			}
		};

		// get value from param-like string (eg, 'x=y&name=VALUE')
		this.getFromStr = function(name, text) {
			if(typeof text !== 'string') {
				return;
			}
			var nameEQ = name + '=', ca = text.split(/[;&]/), i, c;
			for(i = 0; i < ca.length; i++) {
				c = ca[i];
				while(c.charAt(0) === ' ') {
					c = c.substring(1, c.length);
				}
				if(c.indexOf(nameEQ) === 0) {
					return c.substring(nameEQ.length, c.length);
				}
			}
		};
	}

	/**
	 * 创建发送数据数组的副本
	 * @return {Object}
	 */
	function getPageInfo() {
		var newPageInfo = {};
		for(var i in pageInfo) {
			newPageInfo[i] = pageInfo[i];
		}
		return newPageInfo;
	}

	/**
	 * 初始化页面信息
	 */
	function initPageInfo() {
		initCookie();
		var browser = getBrowser();
		pageInfo["999"]["103"] = appId;					//用户id
		pageInfo["999"]["112"] = (window.screen.width || 0) + 'x' + (window.screen.height || 0);
		pageInfo["999"]["113"] = window.screen.colorDepth || 0;
		pageInfo["999"]["114"] = getFlashVer();
		pageInfo["999"]["115"] = (navigator.javaEnabled() ? 1 : 0);
		pageInfo["999"]["116"] = getLanguage();
		pageInfo["999"]["117"] = (navigator.cookieEnabled ? 1 : 0);
		pageInfo["999"]["108"] = browser.os;
		pageInfo["999"]["109"] = browser.browser;
		pageInfo["999"]["111"] = browser.version;
		pageInfo["999"]["110"] = Client();
		pageInfoNow['57'] = location.href.replace(/&/g,"|");
		pageInfoNow['62'] = (referrer ? 1 : 0);
		pageInfo['998']['997'].push(pageInfoNow);
		ada_sid = 'ada_'+pageInfoNow['53'];
		sendPackage('0', pageInfo);
	}


	/**
	 * 获取浏览器语言
	 * @return {String}
	 */
	function getLanguage() {
		return navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || '';
	}
	function getBrowser() {
		var _browser = 'se|maxthon|qqbrowser|tencenttraveler|bidubrowser|lbbrowser|theworld|cometbrowser|greenbrowser|taobrowser|360se|uc|ie|ie 11.0|chrome|netscape|firefox|opera|safari|konqueror'.split('|'),
			ua = navigator.userAgent.toLowerCase(),
			up = navigator.platform.toLowerCase(),
			os, browser = '', type, regexp, version;
	
		if(up.indexOf('win') == 0) {
			if(/win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
				if(RegExp['$1'] == 'nt') {
					switch(RegExp['$2']) {
					case '5.0':
						os = '2000';
						break;
					case '5.1':
					case '5.2':
						os = 'xp';
						break;
					case '6.0':
						os = 'vista';
						break;
					case '6.1':
						os = '7';
						break;
					case '6.2':
						os = '8';
						break;
					case '6.3':
						os = '8.1';
						break;
					default:
						os = 'nt';
						break;
					}
				} else {
					os = RegExp['$1'];
				}
			} else {
				os = 'phone';
			}
			os = 'windows ' + os;
		} else if(up.indexOf('mac') >= 0) {
			os = 'mac';
		} else if(ua.indexOf('android') >= 0) {
			os = 'android';
		} else if(up.indexOf('linux') >= 0) {
			os = 'linux';
		} else {
			os = up;
		}
	
		for(type in _browser) {
			switch(_browser[type]) {
			case 'ie 11.0':
				regexp = /rv:11\.0/;
				break;
			case 'safari':
				regexp = /version\/([\w.]+)/;
				break;
			case 'netscape':
				regexp = /navigator\/([\w.]+)/;
				break;
			default:
				regexp = RegExp(_browser[type] + '(?:[ \\/]([\\w.]+))?');
			}
			if(regexp.test(ua)) {
				if(window.opera){
					browser = ' ' + window.opera.version();
				}else if(RegExp.$1){
					browser = ' ' + RegExp.$1;
					browser = _browser[type];
					version = RegExp.$1;
				}else if(type==13){
					browser = 'ie'; version = '11';
				}else{
					browser = _browser[type]; version = RegExp.$1;
				}
				break;
			}
		}
		return {
			ua: '', //useragent,
			os: os,
			browser: browser,
			version:version
		}
	}
	/**
	 * 获取浏览器内核
	 * @return {String}
	 */
	function Client(){
		var engine = { ie:0, webkit:0, gecko:0, opera:0, khtml:0 };
		var shell = { se360:0, se:0, maxthon:0, qq:0, tt:0, theworld:0, cometbrowser:0, greenbrowser:0, ie:0, chrome:0, netscape:0, firefox:0, opera:0, safari:0, konq:0 };
		var ua = navigator.userAgent.toLowerCase();
		for (var type in engine) {
			if (typeof type === 'string') {
				var regexp = 'gecko' === type ? /rv:([\w.]+)/ : RegExp(type + '[ \\/]([\\w.]+)');
				if (regexp.test(ua)){
					engine.version = window.opera ? window.opera.version() : RegExp.$1;//浏览器内核版本
					engine[type] = parseFloat(engine.version);
					engine.type = type;//浏览器内核类型
					break;
				}
			}
		}
		for (var type in shell) {
			if (typeof type === 'string') {
				var regexp = null;
				switch(type) {
					case "se360": regexp = /360se(?:[ \/]([\w.]+))?/; break;
					case "se": regexp = /se ([\w.]+)/; break;
					case "qq": regexp = /qqbrowser\/([\w.]+)/; break;
					case "tt": regexp = /tencenttraveler ([\w.]+)/; break;
					case "safari": regexp = /version\/([\w.]+)/; break;
					case "konq": regexp = /konqueror\/([\w.]+)/; break;
					case "netscape": regexp = /navigator\/([\w.]+)/; break;
					default: regexp = RegExp(type + '(?:[ \\/]([\\w.]+))?');
				}
				if (regexp.test(ua)) {
					shell.version = window.opera ? window.opera.version() : RegExp.$1 ? RegExp.$1 : 'unknown';//浏览器外壳版本
					shell[type] = parseFloat(shell.version);
					shell.type = type;//浏览器外壳类型
					break;
				}
			}
		}
		return engine.type;
	}
	/**
	 * 获取浏览器安装Flash版本
	 * @return {String}
	 */
	function getFlashVer() {
		var version = '',
			flash;
		if(navigator.plugins && navigator.mimeTypes.length) {
			flash = navigator.plugins['Shockwave Flash'];
			if(flash && flash.description) {
				version = flash.description.replace(/^.*\s+(\S+)\s+\S+$/, '$1');
			}
		} else if(window.ActiveXObject) {
			try {
				flash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
				if(flash && (version = flash.GetVariable('$version'))) {
					version = version.replace(/^.*\s+(\d+),(\d+).*$/, '$1.$2');
				}
			} catch(e) {
			}
		}
		return version;
	}

	/**
	 * 鼠标点击信息处理
	 * @param {Event} event 事件对象
	 */
	function getClkParam(event) {
	//	refreshSession();
		var el = getEventTarget(event),
			documentElement = document.documentElement,
			clickDate = {},
			tagName = el.tagName.toLowerCase(),
			parent = el,
			parentTagName = tagName,
			pageWidth = Math.max(documentElement.scrollWidth, document.body.scrollWidth),
			pageHeight = Math.max(documentElement.scrollHeight, document.body.scrollHeight),
			x = event.clientX + (window.pageXOffset || documentElement.scrollLeft),
			y = event.clientY + (window.pageYOffset || documentElement.scrollTop);
		if(setting.type == 1) {  //1定宽，2百分比
			if(setting.pos == 2) {  //1左，2中，3右
				x = x - pageWidth / 2;
			} else if(setting.pos == 3) {
				x = x - pageWidth;
			}
		} else {
			x = x * 1000 / pageWidth;
		}
		clickDate['2'] = parseInt(x);
		clickDate['3'] = parseInt(y);
		var eleName = '';
		if(getAttribute(el, 'id')) {
			eleName = '%23' + getAttribute(el, 'id');
		} else if(getAttribute(el, 'name')) {
			eleName = getAttribute(el, 'name');
		}
		clickDate['4'] = tagName;
		clickDate['5'] = eleName;
		clickDate['6'] = getEleValue(el).replace(/\&/g,'|');
		clickDate['1'] = dateFormat(new Date());
		pageInfoNow['66'].push(clickDate);
		allInPageInfo(pageInfo);
	}

	/**
	 * 获取DOM节点值
	 * @param {HTMLElement} node 要查找的节点
	 * @return {String}
	 */
	function getEleValue(node) {
		var tag = node.tagName.toLowerCase(),
			val = '';
		if(tag == 'a') {
			val = node.href;
		} else if(tag == 'input' || tag == 'select') {
			val = node.value;
		}
		return val;
	}

	/**
	 * 绑定页面点击事件
	 */
	function initPageClk() {
		addEventHandler(document, 'click', function(event) {
			event = getEvent(event);
			if(event && event.clientX) {// 用户点击
				getClkParam(event);
			}
		});
		if(window.top != this) {
			window.top.postMessage('iframeHeight:' + Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), '*');
		}
	}

	/**
	 * JS API初始化
	 */
	function initAPI() {
		var hyua = window._hyua;
		if(hyua && hyua.length) {
			var len = hyua.length,
				i, temp;
			for(i = 0; i < len; i ++) {
				temp = hyua[i];
				switch(temp[0]) {
				case '_setAccount':
					apiEnable = temp[1] === appId ? TRUE : FALSE;
					break;
				case '_setAutoPageview':
					temp = temp[1];
					(temp === TRUE || temp === FALSE) && (autoPageview = temp);
				}
			}
		}
	}

	/**
	 * JS API操作
	 */
	function runAPI() {
		var hyua = window._hyua;
		window._hyua = {
			push: function(option) {
				if('[object Array]' !== {}.toString.call(option)) {
					return;
				}
				var len = option.length;
				switch(option[0]) {
				case '_trackEvent':
					if(len < 3) {
						return;
					}
					var event = {};
					event["15"] = option[1];
					event["13"] = option[2];
					if(len > 3) {
						event["14"] = option[3];
					}
					if(len > 4 && option[4] != '' && !isNaN(option[4])) {
						event["12"] = parseInt(option[4]);
					}
					event["11"] = dateFormat();
					pageInfoNow['67'].push(event);
					allInPageInfo(pageInfo);
					break;
				default:
					return;
				}
			}
		};
		if(apiEnable && hyua && hyua.length) {
			var len = hyua.length,
				i;
			for(i = 0; i < len; i ++) {
				_hyua.push(hyua[i]);
			}
		}
	}

	/**
	 * 获取APP ID
	 * @return {String}
	 */
	function getAppId() {
		var url = document.scripts[document.scripts.length - 1].src + '=';
		var match = url.match(RegExp('\\?(.+?)[&=]', ''));
		return match ? match[1] : '';
	}

	/**
	 * 生成日期字符串
	 * @param {Date} [date] 时间对象
	 * @return {String}
	 */
	function dateFormat(date) {
		var fillZero = function(t) {
			return t < 10 ? '0' + t : t;
		};
		date = date || new Date();
		return date.getFullYear() + ''
			+ fillZero(date.getMonth() + 1)
			+ fillZero(date.getDate())
			+ fillZero(date.getHours())
			+ fillZero(date.getMinutes())
			+ fillZero(date.getSeconds());
	}

	/**
	 * 获取发送数据到的地址
	 * @return {String}
	 */
	function getSendUrl() {
		if(!sendUrl) {
			var secure = document.location.protocol == 'https:' ? 'https://' : 'http://';
			var puid = ec.get(cookie.pre + 'kp') || pageId;
			var i = parseInt(puid.substr(12, 4), 16) % setting.url.length;
			sendUrl = secure + setting.url[i] + (appId ? '?content='  : '?');
		}
		return sendUrl;
	}

	/**
	 * 向页面添加新的JS
	 * @param {String} url
	 */
	function addScript(url) {
		try {
			var script = document.createElement('script');
			script.src = url;
			document.getElementsByTagName('head')[0].appendChild(script);
		} catch(e){}
	}

	/**
	 * 发送数据
	 * @param {String} type 事件类型
	 * @param {Object} param 要发送的数据
	 */
	function sendPackage(type,param){
		if(!autoPageview) return;
		var t = JSON.stringify(param),
			time = dateFormat(),
			url = getSendUrl() +  t,
			log = 'ada_' + time;
		window.sessionStorage.setItem(ada_sid,t);
	}
	function allInPageInfo(param){
		var t = JSON.stringify(param),
			time = dateFormat(),
			url = getSendUrl() +  t,
			log = 'ada_' + time;
		window.sessionStorage.setItem(ada_sid,t);
	}
	/**
	 * 进入页面发送请求后的回调函数，判断是否加载Cookie生成页面
	 * @param {String} response 返回值
	 */
	ada_cb = function(response) {
		if(response == 'nocookie') {
			var iframe = document.createElement('iframe');
			iframe.src = addCookieUrl;
			iframe.style.display = 'none';
			document.getElementsByTagName('body')[0].appendChild(iframe);
		}
	};

	/**
	 * 获取广告
	 */
	function getAds() {
		if(!adEnable || cmcc.adNum == 0) {
			return;
		}
		var params = [],
			registed = cmcc.registed;
		for(var key in registed) {
			params.push(key + '=' + encodeURIComponent(registed[key].toString().replace(/,$/, '')));
		}
		adUrl += params.join('&');
		addScript(adUrl);
	}

	/**
	 * 绑定打开与退出页面事件
	 */
	(function() {
		// 绑定window error事件
		window.onerror = function() {
			return TRUE;
		};

		// 页面加载完毕执行
		function loaded() {
			if(!loaded.flag) {
				loaded.flag = TRUE;
				initAPI();
				initPageInfo();
				getAds();
				initPageClk();
				runAPI();
			}
		}

		(function() {
			var func;
			if('complete' === document.readyState) {
				setTimeout(loaded, 1);
			} else if(document.addEventListener) {
				func = function() {
					document.removeEventListener('DOMContentLoaded', func, FALSE);
					loaded();
				};
				document.addEventListener('DOMContentLoaded', func, FALSE);
				window.addEventListener('load', loaded, FALSE);
			} else if(document.attachEvent) {
				func = function() {
					if('complete' === document.readyState) {
						document.detachEvent('onreadystatechange', func);
						loaded();
					}
				};
				document.attachEvent('onreadystatechange', func);
				window.attachEvent('onload', loaded);
				var top = FALSE;
				try {
					top = window.frameElement == NULL && document.documentElement;
				} catch(e) {
				}
				if(top && top.doScroll) {
					(function checkLoading() {
						if(!loaded.flag) {
							try {
								top.doScroll('left');
							} catch(e) {
								return setTimeout( checkLoading, 50 );
							}
							loaded();
						}
					})();
				}
			}
		})();

		// 绑定离开页面事件
		//关闭页面重新刷新COOKIES的最后时间
		
		addEventHandler(window, 'beforeunload', function() {	
			var sid = getCookie('ki30'),
				leaveDate = dateFormat();	//离开时间
			if(sid) {
				setCookie('ki30', sid, cookie.t30);
			}
			ec.set(cookie.pre + 'lvt', +new Date);
			setCookie('refer', location.href, 3000);
			pageInfoNow['61'] = leaveDate;
			allInPageInfo(pageInfo)
			url = getSendUrl() + window.sessionStorage.getItem(ada_sid);
			addScript(url);
			setTimeout(function(){},1000);
		});
		addEventHandler(window, 'onbeforeunload', function() {	
			var sid = getCookie('ki30'),
				leaveDate = dateFormat();	//离开时间
			if(sid) {
				setCookie('ki30', sid, cookie.t30);
			}
			ec.set(cookie.pre + 'lvt', +new Date);
			setCookie('refer', location.href, 3000);
			pageInfoNow['61'] = leaveDate;
			allInPageInfo(pageInfo)
			var img = new Image();
			img.src = url;
			setTimeout(function(){},1000);
		});
	})();
})(window);