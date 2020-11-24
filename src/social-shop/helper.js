
var convert = (function() {
    var convertElement = function(element) {
        switch (element.tagName) {
            case "BR":
                return "";
            case "IMG": {
                    return element.getAttribute("alt") ? '{{' + element.getAttribute("alt") + '}}' : element.textContent
                }
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
    convertHTMLtoText: convert,
}
export default helper
