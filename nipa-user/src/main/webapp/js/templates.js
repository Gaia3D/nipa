(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['coordinate'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<ul class=\"coordinateGroup\">\r\n    <li>\r\n        <label for=\"\">DD</label>\r\n        <input type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.coordinateDD || (depth0 != null ? depth0.coordinateDD : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"coordinateDD","hash":{},"data":data}) : helper)))
    + "\" readonly>\r\n    </li>\r\n    <li>\r\n        <label for=\"\">DM</label>\r\n        <input type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.coordinateDM || (depth0 != null ? depth0.coordinateDM : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"coordinateDM","hash":{},"data":data}) : helper)))
    + "\" readonly>\r\n    </li>\r\n    <li>\r\n        <label for=\"\">DMS</label>\r\n        <input type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.coordinateDMS || (depth0 != null ? depth0.coordinateDMS : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"coordinateDMS","hash":{},"data":data}) : helper)))
    + "\" readonly>\r\n    </li>\r\n    <li>\r\n        <label for=\"\">MGRS</label>\r\n        <input type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.coordinateMGRS || (depth0 != null ? depth0.coordinateMGRS : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"coordinateMGRS","hash":{},"data":data}) : helper)))
    + "\" readonly>\r\n    </li>\r\n    <li>\r\n        <label for=\"\">UTM</label>\r\n        <input type=\"text\" value=\""
    + alias4(((helper = (helper = helpers.coordinateUTM || (depth0 != null ? depth0.coordinateUTM : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"coordinateUTM","hash":{},"data":data}) : helper)))
    + "\" readonly>\r\n    </li>\r\n    <li class=\"btns\">\r\n        <button type=\"button\" class=\"btnTextF move\" title=\"이동\">이동</button>\r\n        <button type=\"button\" class=\"btnText copy\" title=\"전체복사\">전체복사</button>\r\n        <button type=\"button\" class=\"btnText note\" title=\"맵노트\">지점등록</button>\r\n        <button type=\"button\" class=\"btnText delete\" title=\"삭제\">삭제</button>\r\n    </li>\r\n</ul>";
},"useData":true});
})();