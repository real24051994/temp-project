var convert = (function() {
    var convertElement = function(element) {
        switch (element.tagName) {
            case "BR":
                return "";
            case "SPBSHORTCODE": 
                return element.getAttribute("shortcode") ? '{{' + element.getAttribute("shortcode") + '}}' : element.textContent
            case "P":
                return (element.previousSibling ? "\n" : "") + [].map.call(element.childNodes, convertElement).join("");
            case "DIV":
                return (element.previousSibling ? "\n" : "") + [].map.call(element.childNodes, convertElement).join("");
            default:
                return element.textContent;
        }
    };
    return function(element) {
        return [].map.call(element.childNodes, convertElement).join("");
    };
})();
const helper = {
    extractHostname(url) {
        var hostname;
        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        } else {
            hostname = url.split('/')[0];
        }
        hostname = hostname.split(':')[0];
        hostname = hostname.split('?')[0];
        return hostname;
    },
    convertUtmToUrl(data) {
        let { utm_source = '', utm_medium = '', utm_campaign = '', utm_term = '', utm_content = '' } = data
        var params = {}
        if (utm_source.trim() == '') {
            return ''
        }

        params['utm_source'] = utm_source.trim()

        if (utm_medium) {
            params['utm_medium'] = utm_medium.trim()
        }
        if (utm_campaign) {
            params['utm_campaign'] = utm_campaign.trim()
        }
        if (utm_term) {
            params['utm_term'] = utm_term.trim()
        }
        if (utm_content) {
            params['utm_content'] = utm_content.trim()
        }
        return this.encodeQueryData(params)
    },
    encodeQueryData(data) {
        const ret = [];
        for (let d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');
    },
    convertHTMLtoText: convert,
}
export default helper